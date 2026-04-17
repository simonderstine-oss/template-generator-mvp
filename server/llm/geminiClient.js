const { extractJsonString } = require("./extractModelJson");

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-pro";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

async function generateWithGemini({ systemPrompt, userPrompt, timeoutMs = 20000 }) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(DEFAULT_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\n${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const err = new Error(`Gemini request failed (${response.status}): ${errorBody}`);
      err.httpStatus = response.status;
      if (response.status === 429) {
        err.quotaHint =
          "Gemini returned 429 RESOURCE_EXHAUSTED (quota). For free tier this is often daily/minute limits for the model, or free-tier limits showing as 0 until billing is linked on the Google Cloud / AI Studio project. Try GEMINI_MODEL=gemini-2.5-flash (higher free-tier throughput than Pro), wait for the quota window to reset, enable billing for paid limits, and review https://ai.google.dev/gemini-api/docs/rate-limits and https://ai.dev/rate-limit";
      }
      throw err;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return extractJsonString(text);
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  generateWithGemini
};

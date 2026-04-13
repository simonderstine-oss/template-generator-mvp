const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-pro";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

function extractJsonString(modelText) {
  const raw = String(modelText || "").trim();
  if (!raw) {
    throw new Error("Gemini returned empty response");
  }
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : raw;
}

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
      throw new Error(`Gemini request failed (${response.status}): ${errorBody}`);
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

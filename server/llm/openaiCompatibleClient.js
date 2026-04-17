const { extractJsonString } = require("./extractModelJson");

const BASE_URL = process.env.OPENAI_COMPATIBLE_BASE_URL || "";
const MODEL = process.env.OPENAI_COMPATIBLE_MODEL || "";
const API_KEY = process.env.OPENAI_COMPATIBLE_API_KEY || "";
const JSON_MODE_PREFERRED = process.env.OPENAI_COMPATIBLE_JSON_MODE !== "false";

async function generateWithOpenAICompatible({ systemPrompt, userPrompt, timeoutMs = 120000 }) {
  const base = BASE_URL.replace(/\/$/, "");
  if (!base) {
    throw new Error("OPENAI_COMPATIBLE_BASE_URL is not configured");
  }
  if (!MODEL) {
    throw new Error("OPENAI_COMPATIBLE_MODEL is not configured");
  }

  const url = `${base}/chat/completions`;
  const headers = { "Content-Type": "application/json" };
  if (API_KEY) {
    headers.Authorization = `Bearer ${API_KEY}`;
  }

  const buildBody = (useJsonMode) => {
    const body = {
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2
    };
    if (useJsonMode) {
      body.response_format = { type: "json_object" };
    }
    return body;
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const useJsonFirst = JSON_MODE_PREFERRED;
    let response = await fetch(url, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify(buildBody(useJsonFirst))
    });

    if (!response.ok && response.status === 400 && useJsonFirst) {
      response = await fetch(url, {
        method: "POST",
        headers,
        signal: controller.signal,
        body: JSON.stringify(buildBody(false))
      });
    }

    if (!response.ok) {
      const errorBody = await response.text();
      const err = new Error(`OpenAI-compatible request failed (${response.status}): ${errorBody}`);
      err.httpStatus = response.status;
      throw err;
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    return extractJsonString(text);
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  generateWithOpenAICompatible
};

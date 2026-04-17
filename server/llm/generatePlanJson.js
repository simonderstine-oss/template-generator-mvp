const { generateWithGemini } = require("./geminiClient");
const { generateWithOpenAICompatible } = require("./openaiCompatibleClient");

function resolveBackend() {
  const raw = (process.env.LLM_BACKEND || "gemini").trim().toLowerCase();
  if (raw === "openai_compatible" || raw === "openai") {
    return "openai_compatible";
  }
  return "gemini";
}

function resolveTimeoutMs(backend) {
  const envVal = process.env.LLM_TIMEOUT_MS;
  if (envVal !== undefined && envVal !== "") {
    const n = Number(envVal);
    if (!Number.isNaN(n) && n > 0) {
      return n;
    }
  }
  return backend === "openai_compatible" ? 120000 : 20000;
}

async function generatePlanJson({ systemPrompt, userPrompt, timeoutMs: timeoutMsOpt } = {}) {
  const backend = resolveBackend();
  const timeoutMs = timeoutMsOpt ?? resolveTimeoutMs(backend);
  if (backend === "openai_compatible") {
    return generateWithOpenAICompatible({ systemPrompt, userPrompt, timeoutMs });
  }
  return generateWithGemini({ systemPrompt, userPrompt, timeoutMs });
}

module.exports = {
  generatePlanJson,
  resolveBackend
};

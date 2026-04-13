const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { getFilesForSelection } = require("./server/lib/templateSelector");
const { loadTemplateChunks, renderPlanText } = require("./server/lib/templateLoader");
const { buildSystemPrompt, buildUserPrompt, PROMPT_VERSION } = require("./server/llm/promptBuilder");
const { generateWithGemini } = require("./server/llm/geminiClient");
const { validatePlanSchema } = require("./server/validation/planSchema");
const { validateAgainstCanonicalRules } = require("./server/validation/planValidation");
const { API_VARIANTS, DEFAULT_API_VARIANT, EVENT_COUNTS, EVENT_TYPES, INTEGRATION_TYPES } = require("./server/config/canonicalRules");

const PORT = Number(process.env.PORT || 8000);
const REPO_ROOT = __dirname;
const ENABLE_AI_PREVIEW = process.env.ENABLE_AI_PREVIEW !== "false";
const PLAN_API_TOKEN = process.env.PLAN_API_TOKEN || "";
const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX = 30;
const rateBucket = new Map();

function getContentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

function normalizeSelection(body) {
  const integrationType = INTEGRATION_TYPES.includes(body.integrationType) ? body.integrationType : "js";
  const eventType = EVENT_TYPES.includes(body.eventType) ? body.eventType : "sale";
  const eventCount = EVENT_COUNTS.includes(body.eventCount) ? body.eventCount : "1";
  const apiPlanVariant = API_VARIANTS.includes(body.apiPlanVariant) ? body.apiPlanVariant : DEFAULT_API_VARIANT;

  return {
    integrationType,
    eventType,
    eventCount,
    apiPlanVariant: integrationType === "api" ? apiPlanVariant : null
  };
}

async function parseJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function renderPlanFromStructuredSections(sections) {
  return sections.map((section) => `${section.title}\n${section.content}`).join("\n\n");
}

function authAndRateLimit(req, res) {
  if (PLAN_API_TOKEN) {
    const auth = req.headers.authorization || "";
    if (auth !== `Bearer ${PLAN_API_TOKEN}`) {
      writeJson(res, 401, { error: "Unauthorized" });
      return false;
    }
  }

  const ip = req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entries = (rateBucket.get(ip) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  entries.push(now);
  rateBucket.set(ip, entries);
  if (entries.length > RATE_LIMIT_MAX) {
    writeJson(res, 429, { error: "Rate limit exceeded" });
    return false;
  }
  return true;
}

async function handlePlanGenerate(req, res) {
  if (!authAndRateLimit(req, res)) return;

  const startedAt = Date.now();
  try {
    const body = await parseJsonBody(req);
    const selection = normalizeSelection(body);
    const sourceFiles = getFilesForSelection({
      integrationType: selection.integrationType,
      eventType: selection.eventType,
      eventCount: selection.eventCount,
      apiPlanVariant: selection.apiPlanVariant || DEFAULT_API_VARIANT
    });
    const canonicalChunks = await loadTemplateChunks(REPO_ROOT, sourceFiles);
    const deterministicText = renderPlanText(canonicalChunks);
    const useAi = ENABLE_AI_PREVIEW && Boolean(body.useAiPreview);

    if (!useAi) {
      writeJson(res, 200, {
        mode: "deterministic",
        promptVersion: PROMPT_VERSION,
        selection,
        sourceFiles,
        warnings: [],
        assumptions: [],
        missingInputs: [],
        sections: canonicalChunks.map((chunk) => ({
          sectionId: chunk.sectionId,
          title: chunk.title,
          content: chunk.content,
          confidence: "high"
        })),
        planText: deterministicText
      });
      return;
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt({
      naturalLanguageRequest: String(body.naturalLanguageRequest || "").trim(),
      selection,
      chunks: canonicalChunks
    });

    const firstRaw = await generateWithGemini({ systemPrompt, userPrompt });
    let parsed = JSON.parse(firstRaw);
    let schema = validatePlanSchema(parsed);
    let rules = validateAgainstCanonicalRules(parsed, canonicalChunks);
    let validFirstPass = schema.valid && rules.valid;

    if (!validFirstPass) {
      const repairPrompt = JSON.stringify({
        task: "Repair this JSON plan so it is valid for schema and canonical section order.",
        schemaErrors: schema.errors,
        ruleErrors: rules.errors,
        expectedSectionIds: canonicalChunks.map((chunk) => chunk.sectionId),
        invalidPlan: parsed
      });
      const repairedRaw = await generateWithGemini({
        systemPrompt: buildSystemPrompt(),
        userPrompt: repairPrompt
      });
      parsed = JSON.parse(repairedRaw);
      schema = validatePlanSchema(parsed);
      rules = validateAgainstCanonicalRules(parsed, canonicalChunks);
    }

    if (!schema.valid || !rules.valid) {
      writeJson(res, 422, {
        error: "AI response failed validation",
        schemaErrors: schema.errors,
        ruleErrors: rules.errors
      });
      return;
    }

    const durationMs = Date.now() - startedAt;
    console.log(JSON.stringify({
      event: "plan_generation",
      mode: "ai_preview",
      promptVersion: PROMPT_VERSION,
      durationMs,
      validFirstPass,
      sectionCount: parsed.sections.length
    }));

    writeJson(res, 200, {
      mode: "ai_preview",
      promptVersion: PROMPT_VERSION,
      selection,
      sourceFiles,
      warnings: parsed.warnings || [],
      assumptions: parsed.assumptions || [],
      missingInputs: parsed.missingInputs || [],
      sections: parsed.sections,
      planText: renderPlanFromStructuredSections(parsed.sections)
    });
  } catch (error) {
    writeJson(res, 500, { error: error.message || "Internal error" });
  }
}

async function serveStatic(req, res) {
  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const normalizedPath = path.normalize(decodeURIComponent(requestPath));
  const strippedPath = normalizedPath.replace(/^[/\\]+/, "");
  const filePath = path.resolve(REPO_ROOT, strippedPath);
  if (!filePath.startsWith(REPO_ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }
  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/plan/generate") {
    await handlePlanGenerate(req, res);
    return;
  }
  await serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

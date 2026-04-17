const SELECTION_ASSIST_PROMPT_VERSION = "v1";

function buildSelectionAssistSystemPrompt() {
  return [
    "You help configure an impact.com tech plan generator.",
    "The user sees a form (integration type, API variant, event type, event count) and optional natural-language instructions.",
    "You MUST return valid JSON only, with no markdown fences or surrounding prose.",
    "For integrationType, eventType, eventCount, and apiPlanVariant: use a string only when the user CLEARLY asks to change that dimension.",
    "Otherwise use null so the existing form selection is kept.",
    "If the user switches to API integration but does not name a specific API plan variant, set apiPlanVariant to null (the app will apply a default).",
    "If the user switches to JS integration, set apiPlanVariant to null.",
    "Allowed values: integrationType: js | api; eventType: sale | lead; eventCount: 1 | 2plus;",
    `apiPlanVariant (API only): standard | lead_parent_2 | sale_parent_2 | lead_sale_pla_2 | lead_parent_pla_2 | sale_parent_pla_2.`,
    "Fill assumptions, warnings, and missingInputs based on the user's request; use empty arrays when nothing applies."
  ].join(" ");
}

function buildSelectionAssistUserPrompt({ naturalLanguageRequest, selection }) {
  return JSON.stringify({
    task: "Interpret natural language and optionally override form selections.",
    currentFormSelection: selection,
    naturalLanguageRequest: naturalLanguageRequest || "",
    outputShape: {
      integrationType: "js | api | null",
      eventType: "sale | lead | null",
      eventCount: "1 | 2plus | null",
      apiPlanVariant: "standard | lead_parent_2 | ... | null",
      assumptions: ["string"],
      warnings: ["string"],
      missingInputs: ["string"]
    }
  });
}

module.exports = {
  SELECTION_ASSIST_PROMPT_VERSION,
  buildSelectionAssistSystemPrompt,
  buildSelectionAssistUserPrompt
};

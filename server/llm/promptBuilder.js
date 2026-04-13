const PROMPT_VERSION = "v1";

function buildSystemPrompt() {
  return [
    "You are an expert implementation planner for impact.com tech plans.",
    "You MUST return valid JSON only, with no markdown fences or extra prose.",
    "Never invent section IDs. Keep section order exactly as provided.",
    "If information is missing, include it in missingInputs instead of guessing.",
    "Only use capabilities and concepts supported by the provided templates."
  ].join(" ");
}

function buildUserPrompt({ naturalLanguageRequest, selection, chunks }) {
  const templateContext = chunks.map((chunk) => ({
    sectionId: chunk.sectionId,
    title: chunk.title,
    sourcePath: chunk.path,
    template: chunk.content
  }));

  return JSON.stringify({
    task: "Generate structured tech plan sections using provided template context and user intent.",
    outputSchema: {
      integrationType: "js|api",
      apiPlanVariant: "standard|lead_parent_2|sale_parent_2|lead_sale_pla_2|lead_parent_pla_2|sale_parent_pla_2|null",
      eventType: "sale|lead",
      eventCount: "1|2plus",
      assumptions: ["string"],
      missingInputs: ["string"],
      warnings: ["string"],
      sections: [
        {
          sectionId: "string",
          title: "string",
          content: "string",
          confidence: "high|medium|low"
        }
      ]
    },
    hardRules: [
      "sections length and order must match templateContext exactly",
      "each sections[i].sectionId must equal templateContext[i].sectionId",
      "rewrite and personalize template content based on user request while preserving implementation fidelity",
      "do not remove critical technical steps from the template"
    ],
    selection,
    naturalLanguageRequest,
    templateContext
  });
}

module.exports = {
  PROMPT_VERSION,
  buildSystemPrompt,
  buildUserPrompt
};

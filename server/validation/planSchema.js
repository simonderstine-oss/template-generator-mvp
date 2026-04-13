const { API_VARIANTS, INTEGRATION_TYPES, EVENT_COUNTS, EVENT_TYPES } = require("../config/canonicalRules");

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function validatePlanSchema(plan) {
  const errors = [];

  if (!plan || typeof plan !== "object") {
    return { valid: false, errors: ["Plan must be an object"] };
  }

  if (!INTEGRATION_TYPES.includes(plan.integrationType)) {
    errors.push("integrationType must be js or api");
  }
  if (!EVENT_TYPES.includes(plan.eventType)) {
    errors.push("eventType must be sale or lead");
  }
  if (!EVENT_COUNTS.includes(plan.eventCount)) {
    errors.push("eventCount must be 1 or 2plus");
  }
  if (plan.apiPlanVariant !== null && !API_VARIANTS.includes(String(plan.apiPlanVariant || ""))) {
    errors.push("apiPlanVariant must be null or a known API variant");
  }

  if (!isStringArray(plan.assumptions || [])) {
    errors.push("assumptions must be an array of strings");
  }
  if (!isStringArray(plan.missingInputs || [])) {
    errors.push("missingInputs must be an array of strings");
  }
  if (!isStringArray(plan.warnings || [])) {
    errors.push("warnings must be an array of strings");
  }

  if (!Array.isArray(plan.sections) || plan.sections.length === 0) {
    errors.push("sections must be a non-empty array");
  } else {
    plan.sections.forEach((section, index) => {
      if (!section || typeof section !== "object") {
        errors.push(`sections[${index}] must be an object`);
        return;
      }
      if (typeof section.sectionId !== "string" || !section.sectionId) {
        errors.push(`sections[${index}].sectionId is required`);
      }
      if (typeof section.title !== "string" || !section.title) {
        errors.push(`sections[${index}].title is required`);
      }
      if (typeof section.content !== "string" || !section.content) {
        errors.push(`sections[${index}].content is required`);
      }
      if (!["high", "medium", "low"].includes(section.confidence)) {
        errors.push(`sections[${index}].confidence must be high|medium|low`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validatePlanSchema
};

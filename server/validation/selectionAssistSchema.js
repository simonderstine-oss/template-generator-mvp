const { API_VARIANTS, EVENT_COUNTS, EVENT_TYPES, INTEGRATION_TYPES } = require("../config/canonicalRules");

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function validateSelectionAssistResponse(obj) {
  const errors = [];
  if (!obj || typeof obj !== "object") {
    return { valid: false, errors: ["Response must be an object"], cleaned: null };
  }

  const cleaned = {
    integrationType: null,
    eventType: null,
    eventCount: null,
    apiPlanVariant: null,
    assumptions: [],
    warnings: [],
    missingInputs: []
  };

  if (obj.integrationType != null) {
    if (INTEGRATION_TYPES.includes(obj.integrationType)) {
      cleaned.integrationType = obj.integrationType;
    } else {
      errors.push("integrationType must be js, api, or null");
    }
  }

  if (obj.eventType != null) {
    if (EVENT_TYPES.includes(obj.eventType)) {
      cleaned.eventType = obj.eventType;
    } else {
      errors.push("eventType must be sale, lead, or null");
    }
  }

  if (obj.eventCount != null) {
    if (EVENT_COUNTS.includes(obj.eventCount)) {
      cleaned.eventCount = obj.eventCount;
    } else {
      errors.push("eventCount must be 1, 2plus, or null");
    }
  }

  if (obj.apiPlanVariant != null) {
    if (API_VARIANTS.includes(String(obj.apiPlanVariant))) {
      cleaned.apiPlanVariant = obj.apiPlanVariant;
    } else {
      errors.push("apiPlanVariant must be a known variant or null");
    }
  }

  if (isStringArray(obj.assumptions)) cleaned.assumptions = obj.assumptions;
  else if (obj.assumptions != null) errors.push("assumptions must be an array of strings");

  if (isStringArray(obj.warnings)) cleaned.warnings = obj.warnings;
  else if (obj.warnings != null) errors.push("warnings must be an array of strings");

  if (isStringArray(obj.missingInputs)) cleaned.missingInputs = obj.missingInputs;
  else if (obj.missingInputs != null) errors.push("missingInputs must be an array of strings");

  return {
    valid: errors.length === 0,
    errors,
    cleaned: errors.length === 0 ? cleaned : null
  };
}

module.exports = {
  validateSelectionAssistResponse
};

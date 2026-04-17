const { API_VARIANTS, DEFAULT_API_VARIANT, EVENT_COUNTS, EVENT_TYPES, INTEGRATION_TYPES } = require("../config/canonicalRules");

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

module.exports = {
  normalizeSelection
};

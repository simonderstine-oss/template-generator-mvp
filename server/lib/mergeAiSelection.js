const { API_VARIANTS, DEFAULT_API_VARIANT } = require("../config/canonicalRules");
const { normalizeSelection } = require("./normalizeSelection");

/**
 * Applies nullable AI overrides on top of the form-derived selection.
 */
function mergeAiSelectionOverrides(baseSelection, ai) {
  let integrationType = baseSelection.integrationType;
  let eventType = baseSelection.eventType;
  let eventCount = baseSelection.eventCount;

  if (ai.integrationType != null) integrationType = ai.integrationType;
  if (ai.eventType != null) eventType = ai.eventType;
  if (ai.eventCount != null) eventCount = ai.eventCount;

  let variantForBody = DEFAULT_API_VARIANT;
  if (integrationType === "api") {
    if (ai.apiPlanVariant != null && API_VARIANTS.includes(ai.apiPlanVariant)) {
      variantForBody = ai.apiPlanVariant;
    } else if (baseSelection.integrationType === "api" && baseSelection.apiPlanVariant) {
      variantForBody = baseSelection.apiPlanVariant;
    } else {
      variantForBody = DEFAULT_API_VARIANT;
    }
  }

  return normalizeSelection({
    integrationType,
    eventType,
    eventCount,
    apiPlanVariant: variantForBody
  });
}

module.exports = {
  mergeAiSelectionOverrides
};

const DEFAULT_API_VARIANT = "standard";

const API_VARIANTS = Object.freeze([
  "standard",
  "lead_parent_2",
  "sale_parent_2",
  "lead_sale_pla_2",
  "lead_parent_pla_2",
  "sale_parent_pla_2"
]);

const INTEGRATION_TYPES = Object.freeze(["js", "api"]);
const EVENT_TYPES = Object.freeze(["sale", "lead"]);
const EVENT_COUNTS = Object.freeze(["1", "2plus"]);

function sectionIdFromPath(filePath) {
  const normalized = String(filePath || "").replace(/\\/g, "/");
  const filename = normalized.split("/").pop() || "unknown";
  const withoutExt = filename.replace(/\.txt$/i, "");
  const noOrderPrefix = withoutExt.replace(/^\d+_/, "");
  return noOrderPrefix
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

module.exports = {
  DEFAULT_API_VARIANT,
  API_VARIANTS,
  INTEGRATION_TYPES,
  EVENT_TYPES,
  EVENT_COUNTS,
  sectionIdFromPath
};

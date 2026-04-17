function extractJsonString(modelText) {
  const raw = String(modelText || "").trim();
  if (!raw) {
    throw new Error("Model returned empty response");
  }
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : raw;
}

module.exports = {
  extractJsonString
};

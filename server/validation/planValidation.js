function validateAgainstCanonicalRules(plan, canonicalChunks) {
  const errors = [];
  const expectedSectionIds = canonicalChunks.map((chunk) => chunk.sectionId);
  const actualSectionIds = Array.isArray(plan.sections) ? plan.sections.map((section) => section.sectionId) : [];

  if (expectedSectionIds.length !== actualSectionIds.length) {
    errors.push(`sections count mismatch (expected ${expectedSectionIds.length}, got ${actualSectionIds.length})`);
  }

  const length = Math.min(expectedSectionIds.length, actualSectionIds.length);
  for (let index = 0; index < length; index += 1) {
    if (expectedSectionIds[index] !== actualSectionIds[index]) {
      errors.push(`sections[${index}] must be ${expectedSectionIds[index]} but got ${actualSectionIds[index]}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateAgainstCanonicalRules
};

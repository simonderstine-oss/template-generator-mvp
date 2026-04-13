const fs = require("node:fs/promises");
const path = require("node:path");
const { sectionIdFromPath } = require("../config/canonicalRules");

async function loadTemplateChunks(repoRoot, relativePaths) {
  const chunks = [];
  for (const relativePath of relativePaths) {
    const absolutePath = path.join(repoRoot, relativePath);
    const content = await fs.readFile(absolutePath, "utf8");
    chunks.push({
      path: relativePath,
      sectionId: sectionIdFromPath(relativePath),
      title: path.basename(relativePath, ".txt").replace(/^\d+_/, ""),
      content
    });
  }
  return chunks;
}

function renderPlanText(chunks) {
  return chunks.map((chunk) => chunk.content.trim()).join("\n\n");
}

module.exports = {
  loadTemplateChunks,
  renderPlanText
};

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const projectsDir = path.join(process.cwd(), "content", "projects");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateSections(sections, fileName, errors) {
  if (sections === undefined) return;
  if (!Array.isArray(sections)) {
    errors.push(`${fileName}: sections must be an array`);
    return;
  }

  for (const [index, section] of sections.entries()) {
    if (!section || typeof section !== "object") {
      errors.push(`${fileName}: sections[${index}] must be an object`);
      continue;
    }
    if (!isNonEmptyString(section.title)) {
      errors.push(`${fileName}: sections[${index}].title is required`);
    }
    if (!isNonEmptyString(section.body)) {
      errors.push(`${fileName}: sections[${index}].body is required`);
    }
  }
}

async function run() {
  const files = await fs.readdir(projectsDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md") && !file.startsWith("_"));
  const errors = [];

  for (const fileName of markdownFiles) {
    const source = await fs.readFile(path.join(projectsDir, fileName), "utf-8");
    const { data } = matter(source);

    const requiredFields = ["slug", "title", "summary", "role", "timeframe", "status", "order"];
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || String(data[field]).trim() === "") {
        errors.push(`${fileName}: ${field} is required`);
      }
    }

    if (!["draft", "published"].includes(String(data.status))) {
      errors.push(`${fileName}: status must be draft or published`);
    }

    if (!Number.isFinite(Number(data.order))) {
      errors.push(`${fileName}: order must be numeric`);
    }

    validateSections(data.sections, fileName, errors);
  }

  if (errors.length > 0) {
    console.error("Content validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Content validation passed for ${markdownFiles.length} project file(s).`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

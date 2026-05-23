import fs from "node:fs/promises";
import path from "node:path";

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseArg(name) {
  const pair = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return pair ? pair.slice(name.length + 3).trim() : "";
}

const title = parseArg("title");
const status = parseArg("status") || "draft";
const summary = parseArg("summary") || "Add a one-line summary.";
const role = parseArg("role") || "Product Designer";
const timeframe = parseArg("timeframe") || "Month YYYY - Month YYYY";

if (!title) {
  console.error(
    "Missing --title. Example: npm run new:project -- --title=\"Project Name\" --status=draft",
  );
  process.exit(1);
}

if (!["draft", "published"].includes(status)) {
  console.error("--status must be draft or published");
  process.exit(1);
}

const slug = slugify(title);
const projectsDir = path.join(process.cwd(), "content", "projects");
const filePath = path.join(projectsDir, `${slug}.md`);

const template = `---
slug: ${slug}
title: ${title}
summary: ${summary}
role: ${role}
timeframe: ${timeframe}
status: ${status}
order: 99
tags:
  - Product Design
---

## Context

Add context.

## Problem

Describe the core problem.

## Process

Explain the process and decisions.

## Outcome

Summarize outcomes and next steps.
`;

try {
  await fs.access(filePath);
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
} catch {
  // File does not exist.
}

await fs.mkdir(projectsDir, { recursive: true });
await fs.writeFile(filePath, template, "utf-8");

console.log(`Created ${path.relative(process.cwd(), filePath)}`);

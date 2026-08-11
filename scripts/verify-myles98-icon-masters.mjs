import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ICON_GRIDS,
  expectedMasterPath,
  validateManifest,
  validateMasterSource,
} from "./lib/myles98-icon-contract.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(repositoryRoot, "docs/design-assets/myles98-icons/manifest.json");
const validGroups = new Set(["system", "personal", "projects"]);

function parseGroup(args) {
  if (args.length === 0) return null;
  if (args.length === 2 && args[0] === "--group" && validGroups.has(args[1])) return args[1];
  process.stderr.write("Usage: npm run icons:verify -- [--group system|personal|projects]\n");
  process.exit(1);
}

function main() {
  const group = parseGroup(process.argv.slice(2));
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    process.stderr.write(`MANIFEST ${path.relative(repositoryRoot, manifestPath)}: ${error.message}\n`);
    process.exit(1);
  }

  const manifestErrors = validateManifest(manifest);
  if (manifestErrors.length > 0) {
    for (const error of manifestErrors) process.stderr.write(`MANIFEST: ${error}\n`);
    process.exit(1);
  }

  const icons = group ? manifest.icons.filter((icon) => icon.group === group) : manifest.icons;
  const errors = [];
  for (const icon of icons) {
    for (const grid of ICON_GRIDS) {
      const relativePath = expectedMasterPath("docs/design-assets/myles98-icons", icon.id, grid);
      const absolutePath = path.join(repositoryRoot, relativePath);
      if (!fs.existsSync(absolutePath)) {
        errors.push(`MISSING ${relativePath}`);
        continue;
      }
      const source = fs.readFileSync(absolutePath, "utf8");
      for (const error of validateMasterSource(source, { concept: icon.id, grid })) {
        errors.push(`INVALID ${relativePath}: ${error}`);
      }
    }
  }
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`${error}\n`);
    process.exit(1);
  }
  process.stdout.write(`Verified ${icons.length * ICON_GRIDS.length} Myles 98 icon masters${group ? ` for ${group}` : ""}.\n`);
}

main();

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

/**
 * @param {{ id: string }[]} icons
 * @param {{ root?: string, fsApi?: { existsSync: (path: string) => boolean, readFileSync: (path: string, encoding: "utf8") => string } }} [options]
 */
export function verifyMasterFiles(icons, { root = repositoryRoot, fsApi = fs } = {}) {
  const errors = [];
  for (const icon of icons) {
    for (const grid of ICON_GRIDS) {
      const relativePath = expectedMasterPath("docs/design-assets/myles98-icons", icon.id, grid);
      const absolutePath = path.join(root, relativePath);
      if (!fsApi.existsSync(absolutePath)) {
        errors.push(`MISSING ${relativePath}`);
        continue;
      }
      let source;
      try {
        source = fsApi.readFileSync(absolutePath, "utf8");
      } catch {
        errors.push(`INVALID ${relativePath}: unable to read master`);
        continue;
      }
      for (const error of validateMasterSource(source, { concept: icon.id, grid })) {
        errors.push(`INVALID ${relativePath}: ${error}`);
      }
    }
  }
  return errors;
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
  const errors = verifyMasterFiles(icons);
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`${error}\n`);
    process.exit(1);
  }
  process.stdout.write(`Verified ${icons.length * ICON_GRIDS.length} Myles 98 icon masters${group ? ` for ${group}` : ""}.\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

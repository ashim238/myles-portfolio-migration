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
const assetRoot = "docs/design-assets/myles98-icons";
const outputRelativePath = `${assetRoot}/contact-sheet.html`;
const BLIND_REVIEW_SEED = 0x4d3938;
const ZOOM_SCALE = 6;
const surfaces = Object.freeze([
  { id: "teal", name: "Teal", color: "#008080" },
  { id: "chrome", name: "System gray", color: "#C0C0C0" },
  { id: "white", name: "White", color: "#FFFFFF" },
]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatConcept(id) {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

/**
 * Stable anonymous review order. Task 6 can import this function to map a
 * submitted review ID to the corresponding manifest record without exposing
 * that mapping in the blind sheet's visible content.
 */
export function createBlindReviewEntries(masters) {
  const shuffled = [...masters].sort((left, right) => {
    if (left.concept < right.concept) return -1;
    if (left.concept > right.concept) return 1;
    return left.grid - right.grid;
  });
  const random = seededRandom(BLIND_REVIEW_SEED);
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.map((master, index) => ({
    ...master,
    reviewId: `M98-${String(index + 1).padStart(3, "0")}`,
  }));
}

function readAndVerifyMasterSnapshots(manifest, root, fsApi) {
  const masters = [];
  const errors = [];
  for (const icon of manifest.icons ?? []) {
    for (const grid of ICON_GRIDS) {
      const relativePath = expectedMasterPath(assetRoot, icon.id, grid);
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
      masters.push({ concept: icon.id, grid, key: `${icon.id}-${grid}`, source });
    }
  }
  return { errors, masters };
}

function renderRenders(master) {
  return `
    <div class="icon-renders">
      <div class="icon-render icon-render--native" data-render="native" data-scale="1" style="--render-size:${master.grid}px"><span class="icon-art" aria-hidden="true">${master.source}</span></div>
      <div class="icon-render icon-render--magnified" data-render="magnified" data-scale="${ZOOM_SCALE}" style="--render-size:${master.grid * ZOOM_SCALE}px"><canvas width="${master.grid * ZOOM_SCALE}" height="${master.grid * ZOOM_SCALE}" aria-hidden="true"></canvas></div>
    </div>`;
}

function renderLabeledCard(master) {
  return `
            <article class="icon-card" data-master="${escapeHtml(master.key)}">
              <header class="icon-card__label"><h3>${escapeHtml(formatConcept(master.concept))}</h3><p>${master.grid}px master</p></header>${renderRenders(master)}
            </article>`;
}

function renderBlindCard(master) {
  return `
            <article class="icon-card icon-card--blind" data-review-id="${master.reviewId}">
              <div class="icon-card__blind-label"><span>${master.reviewId}</span> <span>${master.grid}px</span></div>${renderRenders(master)}
            </article>`;
}

function renderLabeledSurface(surface, masters) {
  return `
      <section class="surface" id="surface-${surface.id}" data-surface-color="${surface.color}" style="--surface:${surface.color}">
        <header class="surface__heading"><h2>${surface.name}</h2><p>${surface.color}</p></header>
        <div class="icon-grid">${masters.map(renderLabeledCard).join("\n")}
        </div>
      </section>`;
}

function renderBlindSurface(surface, masters) {
  return `
      <section class="surface surface--blind" data-review-surface="${surface.id}" data-surface-color="${surface.color}" style="--surface:${surface.color}">
        <div class="icon-grid">${masters.map(renderBlindCard).join("\n")}
        </div>
      </section>`;
}

function renderHtml(masters) {
  const blindMasters = createBlindReviewEntries(masters);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Myles 98 icon contact sheet</title>
  <script>document.documentElement.dataset.reviewMode = new URLSearchParams(window.location.search).get("mode") === "blind" ? "unlabeled" : "labeled";</script>
  <style>
    :root { color-scheme: light; font-family: "MS Sans Serif", Geneva, sans-serif; background:#202020; color:#111111; }
    * { box-sizing:border-box; }
    body { margin:0; padding:28px; }
    .sheet { max-width:1384px; margin:0 auto; }
    .sheet__intro { margin:0 0 24px; padding:18px 20px; background:#C0C0C0; border:2px outset #FFFFFF; }
    .sheet__intro h1 { margin:0; font-size:24px; }
    .sheet__intro p { margin:7px 0 0; font-size:14px; line-height:1.35; }
    .surface { margin:0 0 28px; padding:16px; background:var(--surface); border:2px outset #FFFFFF; }
    .surface__heading { display:flex; align-items:baseline; justify-content:space-between; gap:16px; margin:0 0 14px; color:#111111; }
    .surface__heading h2, .surface__heading p { margin:0; }
    .surface__heading h2 { font-size:18px; }
    .surface__heading p { font-family:monospace; font-size:13px; }
    .icon-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; align-items:start; }
    .icon-card { min-width:0; padding:10px; background:#C0C0C0; border:2px outset #FFFFFF; }
    .icon-card__label, .icon-card__blind-label { display:flex; align-items:baseline; justify-content:space-between; gap:8px; min-height:28px; margin:0 0 10px; }
    .icon-card__label h3, .icon-card__label p, .icon-card__blind-label span { margin:0; font-size:12px; line-height:1.2; }
    .icon-card__label h3, .icon-card__blind-label span:first-child { font-weight:700; }
    .icon-card__label p, .icon-card__blind-label span:last-child { font-family:monospace; white-space:nowrap; }
    .icon-renders { display:grid; grid-template-columns:minmax(32px, 1fr) minmax(0, auto); align-items:center; gap:12px; min-height:calc(var(--render-size) + 4px); }
    .icon-render { display:grid; place-items:center; overflow:hidden; line-height:0; background:var(--surface); }
    .icon-render--native { justify-self:center; width:var(--render-size); height:var(--render-size); }
    .icon-render--magnified { justify-self:end; width:var(--render-size); height:var(--render-size); image-rendering: crisp-edges; image-rendering: pixelated; }
    .icon-art, .icon-art > svg, .icon-render canvas { display:block; width:100%; height:100%; }
    html[data-review-mode="labeled"] main[data-review-mode="unlabeled"], html[data-review-mode="unlabeled"] main[data-review-mode="labeled"], html[data-review-mode="unlabeled"] .sheet__intro { display:none; }
    .surface--blind { margin-bottom:28px; }
    @media (max-width:720px) { body { padding:12px; } .surface { padding:10px; } .icon-grid { grid-template-columns:1fr; } }
  </style>
</head>
<body>
  <div class="sheet">
    <header class="sheet__intro"><h1>Myles 98 icon contact sheet</h1><p>Verified native masters and 6× nearest-neighbor review renders. Append <code>?mode=blind</code> to this file URL for anonymized review.</p></header>
    <main data-review-mode="labeled">
${surfaces.map((surface) => renderLabeledSurface(surface, masters)).join("\n")}
    </main>
    <main data-review-mode="unlabeled">
${surfaces.map((surface) => renderBlindSurface(surface, blindMasters)).join("\n")}
    </main>
  </div>
  <script>
    const scale = ${ZOOM_SCALE};
    const rasterize = async (well) => {
      const source = well.previousElementSibling.querySelector("svg");
      const grid = Number(source.getAttribute("data-m98-grid"));
      const target = well.querySelector("canvas");
      const nativeCanvas = document.createElement("canvas");
      nativeCanvas.width = grid;
      nativeCanvas.height = grid;
      const nativeContext = nativeCanvas.getContext("2d", { alpha: true });
      const targetContext = target.getContext("2d", { alpha: true });
      nativeContext.imageSmoothingEnabled = false;
      targetContext.imageSmoothingEnabled = false;
      const blob = new Blob([new XMLSerializer().serializeToString(source)], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      try {
        const image = new Image();
        image.src = url;
        await image.decode();
        nativeContext.drawImage(image, 0, 0, grid, grid);
        targetContext.drawImage(nativeCanvas, 0, 0, grid, grid, 0, 0, grid * scale, grid * scale);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    window.myles98ContactSheetReady = Promise.all([...document.querySelectorAll(".icon-render--magnified")].map(rasterize))
      .then(() => { document.documentElement.dataset.myles98Rasterized = "true"; });
  </script>
</body>
</html>
`;
}

/**
 * Validates the manifest and all 48 masters before writing the deterministic
 * contact sheet. The injectable root keeps the validation boundary testable.
 */
export function buildIconContactSheet({ root = repositoryRoot, fsApi = fs } = {}) {
  const manifestPath = path.join(root, `${assetRoot}/manifest.json`);
  let manifest;
  try {
    manifest = JSON.parse(fsApi.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    throw new Error(`MANIFEST ${assetRoot}/manifest.json: ${error.message}`);
  }

  const snapshot = readAndVerifyMasterSnapshots(manifest, root, fsApi);
  const errors = [...validateManifest(manifest).map((error) => `MANIFEST: ${error}`), ...snapshot.errors];
  if (errors.length > 0) throw new Error(errors.join("\n"));

  const masters = snapshot.masters;
  const outputPath = path.join(root, outputRelativePath);
  fsApi.mkdirSync(path.dirname(outputPath), { recursive: true });
  fsApi.writeFileSync(outputPath, renderHtml(masters), "utf8");
  return { outputPath, masterCount: masters.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { outputPath, masterCount } = buildIconContactSheet();
  process.stdout.write(`Built ${path.relative(repositoryRoot, outputPath)} from ${masterCount} verified Myles 98 icon masters.\n`);
}

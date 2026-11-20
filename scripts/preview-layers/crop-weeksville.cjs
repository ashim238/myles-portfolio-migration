// Derive the atlas artwork directly from the native 1290 × 2796 captures.
const path = require("node:path");
const sharp = require("sharp");

const projects = path.resolve(__dirname, "../../public/projects");
const originals = path.join(projects, "fresh-greens/daylight-key");
const artwork = path.join(projects, "preview-art");
const source = "01-weeksville-daylight-preview";
const crops = [
  [source, "atlas-fold", 360, 648, 684, 681],
  [source, "atlas-street-map", 60, 642, 990, 651],
  [source, "atlas-map-key", 42, 1420, 714, 154],
  [source, "atlas-arrival", 48, 1700, 1164, 580],
  [source, "atlas-condition", 57, 2304, 480, 216],
  [source, "atlas-go", 57, 2523, 1176, 163],
];

async function cropArtwork() {
  for (const [source, target, left, top, width, height] of crops) {
    await sharp(path.join(originals, source + ".png"))
      .extract({ left, top, width, height })
      .webp({ lossless: true })
      .toFile(path.join(artwork, target + ".webp"));
  }
}

cropArtwork().catch(error => { console.error(error); process.exitCode = 1; });

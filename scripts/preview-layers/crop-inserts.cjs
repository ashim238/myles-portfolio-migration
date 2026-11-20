// Mount original newsletter pages, navigation controls and the listing map on their own planes.
const sharp = require("sharp");
const path = require("node:path");
const projects = path.resolve(__dirname, "../../public/projects");
const crops = [
  ["understandingfafsa/modular-guides.png", "student-aid-index", 200, 738, 887, 1210],
  ["understandingfafsa/modular-guides.png", "enrollment-list", 1318, 738, 885, 1210],
  ["navi/flow-view-2.png", "prospect-listing-map", 1075, 1413, 912, 510],
];
async function build() {
  for (const [source, name, left, top, width, height] of crops) {
    await sharp(path.join(projects, source)).extract({ left, top, width, height })
      .resize({ width: 720, withoutEnlargement: true }).webp({ quality: 94 })
      .toFile(path.join(projects, "preview-art", name + ".webp"));
  }
  // Lift the two inserts out of their white source page. Keep the original headline and buttons.
  const page = path.join(projects, "understandingfafsa/modular-guides.png");
  const paper = await sharp({ create: { width: 2400, height: 1320, channels: 3, background: "#fff" } }).png().toBuffer();
  const mount = await sharp(page).composite([{ input: paper, left: 0, top: 710 }]).png().toBuffer();
  await sharp(mount).resize(650).webp({ quality: 93 }).toFile(path.join(projects, "preview-art/guide-page.webp"));
}
build().catch(error => { console.error(error); process.exitCode = 1; });

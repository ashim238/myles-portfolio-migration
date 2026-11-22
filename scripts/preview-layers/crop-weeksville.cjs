// Derive the two display plates and UI details from the native Weeksville capture.
const crops = [
  ["atlas-fold", 360, 648, 684, 681],
  ["atlas-street-map", 60, 642, 990, 651],
  ["atlas-map-key", 42, 1420, 714, 154],
  ["atlas-arrival", 48, 1700, 1164, 580],
  ["atlas-condition", 57, 2304, 480, 216],
  ["atlas-go", 57, 2523, 1176, 163],
];

async function cropArtwork() {
  const path = await import("node:path");
  const { default: sharp } = await import("sharp");
  const projects = path.resolve(__dirname, "../../public/projects");
  const capture = path.join(projects, "fresh-greens/daylight-key/01-weeksville-daylight-preview.png");
  const artwork = path.join(projects, "preview-art");
  const source = path.join(__dirname, "atlas-source");

  // Both oversized symbols obscure the end of the route in the screenshot.
  // The small registered patch shows the same streets in a second native frame.
  // Keep the finish at its captured coordinate; offset the road symbol on paper.
  const road = await sharp(path.join(source, "enroute-hazard-road.svg"), { density: 192 })
    .resize(149, 120).png().toBuffer();
  const finish = await sharp(path.join(projects, "fresh-greens/pocket-map/destination-home.svg"), { density: 192 })
    .resize(216, 216).png().toBuffer();
  const leader = Buffer.from(
    '<svg width="120" height="32" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M 2 4 L 75 4 L 116 26" fill="none" stroke="#fffdf1" stroke-width="9"/>' +
    '<path d="M 2 4 L 75 4 L 116 26" fill="none" stroke="#625a46" stroke-width="3"/>' +
    '</svg>'
  );
  const map = await sharp(capture).composite([
    { input: path.join(source, "weeksville-map-under-pins.png"), left: 773, top: 663 },
    { input: leader, left: 791, top: 883 },
    { input: road, left: 657, top: 779 },
    { input: finish, left: 801, top: 703 },
  ]).png().toBuffer();

  for (const [target, left, top, width, height] of crops) {
    const plate = target === "atlas-fold" || target === "atlas-street-map";
    await sharp(plate ? map : capture).extract({ left, top, width, height })
      .webp({ lossless: true }).toFile(path.join(artwork, target + ".webp"));
  }
}

cropArtwork().catch(error => { console.error(error); process.exitCode = 1; });

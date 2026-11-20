// One orthographic camera per project. The browser moves the same pieces out and back.
const fs = require("node:fs");
const path = require("node:path");
const G = require("../../.agents/skills/teardown/assets/geometry.js");
const P = require("../../.agents/skills/teardown/assets/projection.js");

const art = "/projects/preview-art/";
const tick = "/projects/tiktok/system/";
const round = n => Number(n.toFixed(3));
const part = (label, rect, landing, image, options = {}) => ({ label, rect, landing, image, ...options });

// rect = position on the assembled page. landing = optical center on the 640 × 360 spread.
// Separate content in reading order, with a second axis for inset controls or loose inserts.
const models = {
  "fresh-greens": {
    paper: "#e0e9d2", edge: "#66826f", elevation: 54,
    parts: [
      part("Street map", [0, 0, 269, 177], [167, 231], art+"atlas-street-map.webp", { radius: 4 }),
      part("Map key", [10, 147, 147, 31.7], [187, 101], art+"atlas-map-key.webp", { radius: 6 }),
      part("Route summary", [0, 178, 232, 115.6], [396, 83], art+"atlas-arrival.webp", { radius: 2 }),
      part("Road conditions", [0, 293.6, 104, 46.8], [418, 179], art+"atlas-condition.webp"),
      part("Go", [0, 340.4, 252, 34.9], [458, 248], art+"atlas-go.webp", { radius: 2 }),
    ],
  },
  understandingfafsa: {
    paper: "#f5e5d6", edge: "#a07c68", elevation: 53,
    parts: [
      part("Fixed footer", [0, 315, 180, 78], [272, 277], art+"newsletter-footer-strip.webp"),
      part("Guides module", [0, 133, 180, 182], [442, 174], art+"guide-page.webp"),
      part("Enrollment guide", [99, 188.4, 66.4, 90.8], [525, 171], art+"enrollment-list.webp", { radius: 2 }),
      part("Student Aid Index guide", [15, 188.4, 66.5, 90.8], [420, 188], art+"student-aid-index.webp", { radius: 2 }),
      part("Story block", [0, 66, 180, 67], [214, 174], art+"newsletter-story-strip.webp"),
      part("Fixed masthead", [0, 0, 180, 66], [156, 84], art+"modular-header.webp"),
    ],
  },
  navi: {
    paper: "#ebe4d3", edge: "#8b8976", elevation: 58,
    parts: [
      part("Neighborhood map", [0, 178, 144, 81], [263, 273], art+"prospect-listing-map.webp", { inset: 2 }),
      part("Park photo", [0, 0, 207, 116], [150, 175], art+"prospect-tunnel.webp", { inset: 3 }),
      part("Park canopy photo", [209, 0, 58, 57], [295, 65], art+"prospect-trees.webp", { inset: 2 }),
      part("Pond photo", [209, 59, 58, 57], [361, 107], art+"prospect-pond.webp", { inset: 2 }),
      part("Activity listing", [0, 118, 194, 35.6], [413, 179], art+"navi-activity-title.webp"),
      part("Reservation", [172, 118, 95, 64], [505, 246], art+"navi-dates.webp", { radius: 4 }),
    ],
  },
  tiktok: {
    paper: "#e7caba", edge: "#796a63", elevation: 64,
    parts: [
      part("e-Boy/e-Girl template", [0, 0, 138, 245], [129, 213], art+"eboy.webp"),
      part("Fit Check sketch", [0, 0, 126, 218], [209, 186], art+"fit-check-drawing.webp", { inset: 2 }),
      part("Dopamine Dressing template", [0, 0, 138, 245], [288, 164], art+"dopamine.webp"),
      part("Light Academia print", [0, 0, 138, 245], [432, 158], null, {
        fill: "#ffceb4", imprints: [
          { file: tick+"academia-barcode.svg", x: 0, y: 33.5, width: 14.4, height: 25.2 },
          { file: tick+"academia-text-detail.svg", x: 83.1, y: 32.4, width: 39.6, height: 12.8 },
        ],
      }),
      part("Catalog slot", [15, 46, 92.4, 104.7], [516, 199], null, { fill: "#fffefa" }),
    ],
  },
};

function hull(points) {
  const ordered = [...points].sort((a,b) => a[0]-b[0] || a[1]-b[1]);
  function side(sequence) {
    const result = [];
    for (const p of sequence) {
      while (result.length >= 2) {
        const a = result.at(-2), b = result.at(-1);
        if ((b[0]-a[0])*(p[1]-a[1]) - (b[1]-a[1])*(p[0]-a[0]) > .0001) break;
        result.pop();
      }
      result.push(p);
    }
    return result.slice(0,-1);
  }
  return [...side(ordered), ...side(ordered.reverse())];
}
function bounds(points) {
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  return [(Math.min(...xs)+Math.max(...xs))/2, (Math.min(...ys)+Math.max(...ys))/2];
}

function build(model) {
  const { project } = P.createCamera({ azimuth: -106, elevation: model.elevation, roll: -3 });
  const pieces = model.parts.map(({ label, rect, landing, radius = .8, ...face }, index) => {
    const [x,y,width,height] = rect;
    const mesh = G.part(label,label,[0,0,0]);
    G.extrude(mesh, G.roundedRectangle(width,height,radius), { depth: 1.6 });
    const z = index * 1.7;
    const origin = [x + width/2,-y - height/2,z];
    const vertices = mesh.vertices.map(v => project(G.add(v,origin)));
    return { label, landing, vertices, top: [x,-y,z+1.6], width, height, radius, face };
  });
  const [cx,cy] = bounds(pieces.flatMap(p => p.vertices));
  const center = ([x,y]) => [x-cx+320, y-cy+180];
  const u = project([1,0,0]), v = project([0,-1,0]);
  const layers = pieces.map(({label,landing,vertices,top,width,height,radius,face}) => {
    const points = vertices.map(center);
    const [x,y] = bounds(points);
    return {label, offset: [round(landing[0]-x),round(landing[1]-y)], width, height, radius,
      ...face, matrix: [u[0],u[1],v[0],v[1],...center(project(top))].map(round).join(" "),
      contour: hull(points).map(point => point.map(round).join(",")).join(" ")};
  });
  const all = pieces.flatMap(piece => piece.vertices);
  const span = axis => Math.max(...all.map(p => p[axis])) - Math.min(...all.map(p => p[axis]));
  const homeScale = round(Math.min(1.22, 544 / span(0), 305 / span(1)));
  return { paper: model.paper, edge: model.edge, homeScale, layers };
}
const sheets = Object.fromEntries(Object.entries(models).map(([id,model]) => [id,build(model)]));
fs.writeFileSync(path.resolve(__dirname,"../../src/lib/myles-97/teardown-sheets.json"),JSON.stringify(sheets,null,2)+"\n");

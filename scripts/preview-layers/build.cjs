// One orthographic camera per project. The browser moves the same pieces out and back.
const fs = require("node:fs");
const path = require("node:path");
const skill = process.env.TEARDOWN_SKILL_DIR ?? path.resolve(__dirname, "../../.agents/skills/teardown");
const G = require(path.join(skill, "assets/geometry.js"));
const P = require(path.join(skill, "assets/projection.js"));

const art = "/projects/preview-art/";
const tick = "/projects/tiktok/system/";
const round = n => Number(n.toFixed(3));
const part = (label, revealGroup, rect, landing, image, options = {}) => ({ label, revealGroup, rect, landing, image, ...options });

// rect = position on the assembled page. landing = optical center on the 640 × 360 spread.
// Separate content in reading order, with a second axis for inset controls or loose inserts.
const models = {
  "fresh-greens": {
    paper: "#e1ead7", edge: "#627968", elevation: 65,
    parts: [
      part("Street map", 0, [0, 0, 310, 204], [179, 155], art+"atlas-street-map.webp", { radius: 6 }),
      part("Map key", 0, [10, 165, 160, 34.5], [165, 277], art+"atlas-map-key.webp", { radius: 8 }),
      part("Route summary", 1, [0, 204, 259, 129], [471, 105], art+"atlas-arrival.webp", { radius: 4 }),
      part("Road conditions", 2, [8, 333, 139, 62], [433, 215], art+"atlas-condition.webp", { radius: 4 }),
      part("Go", 3, [0, 395, 252, 35], [477, 281], art+"atlas-go.webp", { radius: 10 }),
    ],
  },
  understandingfafsa: {
    paper: "#f7ecdd", edge: "#917660", elevation: 70,
    parts: [
      part("Fixed footer", 0, [0, 339, 226, 87], [176, 285], art+"newsletter-footer-strip.webp"),
      part("Story block", 1, [0, 82, 226, 86], [167, 171], art+"newsletter-story-strip.webp"),
      part("Fixed masthead", 0, [0, 0, 226, 82], [158, 65], art+"modular-header.webp"),
      part("Guides module", 2, [0, 168, 202, 204], [419, 144], art+"guide-page.webp"),
      part("Enrollment guide", 3, [111, 230, 75, 103], [545, 223], art+"enrollment-list.webp", { radius: 1 }),
      part("Student Aid Index guide", 3, [17, 230, 75, 103], [452, 251], art+"student-aid-index.webp", { radius: 1 }),
    ],
  },
  navi: {
    paper: "#ece9d8", edge: "#777965", elevation: 66,
    parts: [
      part("Neighborhood map", 2, [0, 207, 172, 97], [423, 226], art+"prospect-listing-map.webp", { inset: 2 }),
      part("Park photo", 0, [0, 0, 280, 157], [163, 142], art+"prospect-tunnel.webp", { inset: 4 }),
      part("Park canopy photo", 1, [282, 0, 78, 77], [394, 72], art+"prospect-trees.webp", { inset: 3 }),
      part("Pond photo", 1, [282, 79, 78, 77], [497, 76], art+"prospect-pond.webp", { inset: 3 }),
      part("Activity listing", 0, [0, 160, 254, 46.6], [175, 262], art+"navi-activity-title.webp"),
      part("Reservation", 3, [247, 162, 112, 76], [534, 277], art+"navi-dates.webp", { radius: 4 }),
    ],
  },
  tiktok: {
    paper: "#f1dbca", edge: "#76675d", elevation: 69,
    parts: [
      part("e-Boy/e-Girl template", 1, [0, 0, 138, 245], [105, 147], art+"eboy.webp"),
      part("Fit Check sketch", 1, [0, 0, 126, 218], [178, 218], art+"fit-check-drawing.webp", { inset: 2 }),
      part("Dopamine Dressing template", 1, [0, 0, 138, 245], [276, 153], art+"dopamine.webp"),
      part("Light Academia print", 0, [0, 0, 138, 245], [427, 172], null, {
        fill: "#ffceb4", imprints: [
          { file: tick+"academia-barcode.svg", x: 0, y: 33.5, width: 14.4, height: 25.2 },
        ],
      }),
      part("Editorial title", 2, [65, 23, 76, 24.6], [531, 74], null, {
        fill: "#ffceb4", imprints: [{ file: tick+"academia-text-detail.svg", x: 0, y: 0, width: 76, height: 24.6 }],
      }),
      part("Catalog slot", 2, [15, 46, 92.4, 104.7], [523, 214], null, { fill: "#fffefa" }),
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
  const { project } = P.createCamera({ azimuth: -101, elevation: model.elevation, roll: -1 });
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

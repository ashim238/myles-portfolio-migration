import { JSDOM } from "jsdom";
import path from "node:path";

export const ICON_GRIDS = Object.freeze([16, 24, 32]);
export const ICON_CONCEPTS = Object.freeze([
  "start",
  "selected-work",
  "about-myles",
  "resume",
  "email",
  "reminders",
  "trini-roti",
  "loose-parts",
  "display-properties",
  "open-apps",
  "reset-desktop",
  "generic-app",
  "fresh-greens",
  "understandingfafsa",
  "navi",
  "tiktok-catalog",
]);

const GROUPS = Object.freeze({
  system: new Set([
    "start",
    "selected-work",
    "email",
    "display-properties",
    "open-apps",
    "reset-desktop",
    "generic-app",
  ]),
  personal: new Set(["about-myles", "resume", "reminders", "trini-roti", "loose-parts"]),
  projects: new Set(["fresh-greens", "understandingfafsa", "navi", "tiktok-catalog"]),
});

const APPROVED_ICON_SEMANTICS = Object.freeze({
  start: ["pixel adaptation of Myles's existing portrait mark", ["portrait", "head", "person"], ["folder", "generic user", "app window"]],
  "selected-work": ["open portfolio folder containing a contact sheet", ["portfolio folder", "project folder", "work folder"], ["document", "envelope", "generic app window"]],
  "about-myles": ["ID card with portrait and information lines", ["ID card", "profile card", "portrait card"], ["resume", "checklist", "folder"]],
  resume: ["professional profile sheet with paperclip and structured lines", ["resume", "document", "profile sheet"], ["checklist", "newsletter", "envelope"]],
  email: ["sealed envelope with one subordinate stamp", ["envelope", "mail", "sealed message"], ["newsletter", "document", "folder"]],
  reminders: ["personal spiral checklist pad", ["checklist", "notepad", "reminders"], ["resume", "newsletter", "recipe card"]],
  "trini-roti": ["single personal memo sheet with folded corner and handwritten lines", ["note", "memo", "note sheet"], ["checklist", "resume", "newsletter"]],
  "loose-parts": ["three generic colored construction blocks arranged in a compact pyramid", ["building blocks", "construction blocks", "toy blocks"], ["LEGO", "food", "table"]],
  "display-properties": ["beige CRT with color-test window, controls, and object-specific casing depth", ["monitor", "CRT", "display"], ["overlapping windows", "reset icon", "television"]],
  "open-apps": ["two layered application windows with separate content panes", ["overlapping windows", "open apps", "application windows"], ["monitor", "single app window", "folder"]],
  "reset-desktop": ["CRT desktop with a clear, subordinate reset arrow", ["reset monitor", "reset desktop", "monitor with reset arrow"], ["display properties", "open apps", "reload browser"]],
  "generic-app": ["neutral program window with restrained chrome depth", ["application window", "program window", "generic app"], ["overlapping windows", "monitor", "folder"]],
  "fresh-greens": ["solid road-map tile with one route and destination", ["road map", "route map", "navigation map"], ["groceries", "leaf logo", "city guide"]],
  understandingfafsa: ["modular newsletter emerging from an envelope with three content regions", ["newsletter", "newsletter envelope", "information page"], ["sealed email", "resume", "folder"]],
  navi: ["location marker above a neighborhood storefront", ["location marker", "map pin", "neighborhood destination"], ["book", "guidebook", "leaf"]],
  "tiktok-catalog": ["standalone retail shopping bag", ["shopping bag", "retail bag", "product bag"], ["purse", "catalog page", "TikTok logo", "music note", "social media app", "book", "dashboard"]],
});

function freezeMetadata(metadata) {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(metadata).map(([id, value]) => {
        const [intendedObject, acceptedReadings, rejectedReadings] = APPROVED_ICON_SEMANTICS[id];
        return [
          id,
          Object.freeze({
            group: value.group,
            intendedObject,
            tiers: Object.freeze(value.tiers),
            acceptedReadings: Object.freeze(acceptedReadings),
            rejectedReadings: Object.freeze(rejectedReadings),
          }),
        ];
      }),
    ),
  );
}

export const APPROVED_ICON_METADATA = freezeMetadata({
  start: { group: "system", tiers: { "16": "Head-and-glasses silhouette", "24": "Locs and glasses within the portrait mark", "32": "Pixel adaptation of Myles's existing portrait mark" } },
  "selected-work": { group: "system", tiers: { "16": "Portfolio folder", "24": "One visible image thumbnail", "32": "Open portfolio folder containing a contact sheet" } },
  "about-myles": { group: "personal", tiers: { "16": "Portrait card", "24": "ID-card frame and one information line", "32": "ID card with portrait and information lines" } },
  resume: { group: "personal", tiers: { "16": "Profile sheet with blue header", "24": "Blue paperclip and two bullets", "32": "Professional profile sheet with paperclip and structured lines" } },
  email: { group: "system", tiers: { "16": "Sealed envelope", "24": "Sealed envelope with one yellow stamp", "32": "Dimensional sealed envelope with one subordinate stamp" } },
  reminders: { group: "personal", tiers: { "16": "Spiral checklist pad", "24": "Two checks and a bound paper edge", "32": "Personal checklist pad with checks and paper depth" } },
  "trini-roti": { group: "personal", tiers: { "16": "Single memo sheet", "24": "Folded corner and handwritten lines", "32": "Personal memo sheet with folded corner, handwritten lines, and paper depth" } },
  "loose-parts": { group: "personal", tiers: { "16": "Three stacked construction blocks", "24": "Three colored cubes with face shading", "32": "Three colored building blocks in a compact pyramid" } },
  "display-properties": { group: "system", tiers: { "16": "CRT monitor", "24": "Color-test tiles", "32": "Beige CRT with color-test window, controls, and object-specific casing depth" } },
  "open-apps": { group: "system", tiers: { "16": "Two overlapping windows", "24": "Distinct titlebars", "32": "Two layered application windows with separate content panes" } },
  "reset-desktop": { group: "system", tiers: { "16": "Desktop screen with two reset arrows", "24": "Compact red reset arrow", "32": "CRT desktop with a clear, subordinate reset arrow" } },
  "generic-app": { group: "system", tiers: { "16": "Single application window", "24": "Blue titlebar and inner pane", "32": "Neutral program window with restrained chrome depth" } },
  "fresh-greens": { group: "projects", tiers: { "16": "Road-map tile with one route", "24": "One route with start and destination", "32": "Road-map tile with one non-monotonic road, start point, and orange destination" } },
  understandingfafsa: { group: "projects", tiers: { "16": "Newsletter page", "24": "Blue masthead within open envelope", "32": "Modular newsletter emerging from an envelope with three content regions" } },
  navi: { group: "projects", tiers: { "16": "Location marker", "24": "Location marker above a storefront", "32": "Location marker above a neighborhood storefront with one depth cue" } },
  "tiktok-catalog": { group: "projects", tiers: { "16": "Standalone retail shopping bag", "24": "Shopping bag with a top opening and one side plane", "32": "Dimensional shopping bag with gusset, lower plane, and restrained contact depth" } },
});

const ALLOWED_SHAPES = new Set(["path", "rect", "polygon"]);
const ROOT_ATTRIBUTES = new Set(["xmlns", "viewBox", "shape-rendering", "data-m98-concept", "data-m98-grid"]);
const SHAPE_ATTRIBUTES = Object.freeze({
  path: new Set(["fill", "d", "shape-rendering"]),
  rect: new Set(["fill", "x", "y", "width", "height", "shape-rendering"]),
  polygon: new Set(["fill", "points", "shape-rendering"]),
});
const BANNED_ATTRIBUTE_MESSAGES = new Map([
  ["transform", "transforms are not allowed"],
  ["style", "style attributes are not allowed"],
  ["stroke", "strokes are not allowed; use filled contour bands"],
  ["stroke-width", "strokes are not allowed; use filled contour bands"],
  ["stroke-linecap", "rounded linecaps are not allowed"],
  ["stroke-linejoin", "rounded join is not allowed"],
  ["filter", "filters are not allowed"],
  ["mask", "masks are not allowed"],
  ["clip-path", "clip paths are not allowed"],
  ["opacity", "opacity is not allowed; transparency must be binary"],
  ["fill-opacity", "fill opacity is not allowed; transparency must be binary"],
  ["vector-effect", "vector effects are not allowed"],
  ["mix-blend-mode", "blend modes are not allowed"],
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function checkStringList(value, field, errors) {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    errors.push(`${field} must be a non-empty array of strings`);
  }
}

function stringListsMatch(actual, approved) {
  return Array.isArray(actual)
    && actual.length === approved.length
    && actual.every((value, index) => value === approved[index]);
}

export function validateManifest(manifest) {
  const errors = [];
  if (!isPlainObject(manifest) || !Array.isArray(manifest.icons)) {
    return ["manifest must be an object with an icons array"];
  }

  const byId = new Map();
  manifest.icons.forEach((icon, index) => {
    const label = `icons[${index}]`;
    if (!isPlainObject(icon)) {
      errors.push(`${label} must be an object`);
      return;
    }
    if (typeof icon.id !== "string" || icon.id.trim() === "") {
      errors.push(`${label}.id must be a non-empty string`);
      return;
    }
    if (byId.has(icon.id)) {
      errors.push(`duplicate icon id "${icon.id}"`);
    }
    byId.set(icon.id, icon);
    const approved = APPROVED_ICON_METADATA[icon.id];
    if (!Object.hasOwn(GROUPS, icon.group)) {
      errors.push(`${label} has unknown group "${icon.group}"`);
    } else if (!GROUPS[icon.group].has(icon.id) || approved?.group !== icon.group) {
      errors.push(`${label} assigns "${icon.id}" to group "${icon.group}", which is not its approved group`);
    }
    if (typeof icon.intendedObject !== "string" || icon.intendedObject.trim() === "") {
      errors.push(`${label}.intendedObject must be a non-empty string`);
    } else if (approved && icon.intendedObject !== approved.intendedObject) {
      errors.push(`${label}.intendedObject must exactly match approved object`);
    }
    if (!isPlainObject(icon.tiers)) {
      errors.push(`${label}.tiers must be an object`);
    } else {
      for (const grid of ICON_GRIDS) {
        if (typeof icon.tiers[String(grid)] !== "string" || icon.tiers[String(grid)].trim() === "") {
          errors.push(`${label}.tiers.${grid} must be a non-empty string`);
        } else if (approved && icon.tiers[String(grid)] !== approved.tiers[String(grid)]) {
          errors.push(`${label}.tiers.${grid} must exactly match approved cue`);
        }
      }
    }
    checkStringList(icon.acceptedReadings, `${label}.acceptedReadings`, errors);
    checkStringList(icon.rejectedReadings, `${label}.rejectedReadings`, errors);
    if (approved && !stringListsMatch(icon.acceptedReadings, approved.acceptedReadings)) {
      errors.push(`${label}.acceptedReadings must exactly match approved readings`);
    }
    if (approved && !stringListsMatch(icon.rejectedReadings, approved.rejectedReadings)) {
      errors.push(`${label}.rejectedReadings must exactly match approved readings`);
    }
  });

  for (const concept of ICON_CONCEPTS) {
    if (!byId.has(concept)) {
      errors.push(`manifest is missing icon "${concept}"`);
    }
  }
  for (const id of byId.keys()) {
    if (!ICON_CONCEPTS.includes(id)) {
      errors.push(`manifest has unknown icon "${id}"`);
    }
  }
  return errors;
}

function addGeometryNumber(value, context, grid, errors) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    errors.push(`${context} has an invalid coordinate "${value}"`);
    return;
  }
  if (!Number.isInteger(number)) {
    errors.push(`${context} has fractional coordinate "${value}"`);
  }
  if (number < 1 || number > grid - 1) {
    errors.push(`${context} coordinate "${value}" must be between 1 and ${grid - 1}`);
  }
}

function tokenizePath(d, errors) {
  const tokens = [];
  let position = 0;
  const numberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/;
  while (position < d.length) {
    const remaining = d.slice(position);
    const whitespace = remaining.match(/^[\s,]+/);
    if (whitespace) {
      position += whitespace[0].length;
      continue;
    }
    const character = d[position];
    if (/[A-Za-z]/.test(character)) {
      tokens.push({ type: "command", value: character });
      position += 1;
      continue;
    }
    const number = remaining.match(numberPattern);
    if (number) {
      tokens.push({ type: "number", value: number[0] });
      position += number[0].length;
      continue;
    }
    errors.push(`path contains invalid token "${character}"`);
    position += 1;
  }
  return tokens;
}

function validatePathData(d, grid, errors) {
  if (typeof d !== "string" || d.trim() === "") {
    errors.push("path must have non-empty d data");
    return false;
  }
  const tokens = tokenizePath(d, errors);
  let index = 0;
  let currentPoint = false;
  let subpathHasSegment = false;
  let subpathClosed = false;
  let hasDrawableSegment = false;
  while (index < tokens.length) {
    const commandToken = tokens[index];
    if (commandToken.type !== "command") {
      errors.push("path must begin with an absolute M command");
      return false;
    }
    const command = commandToken.value;
    index += 1;
    if (!"MLHVZ".includes(command)) {
      const kind = /[CcSsQqTtAa]/.test(command) ? "curve command" : "command";
      errors.push(`path uses unsupported ${kind} "${command}"`);
      while (index < tokens.length && tokens[index].type !== "command") index += 1;
      continue;
    }
    if (command === "Z") {
      if (!currentPoint) {
        errors.push("path Z requires a current point");
      } else if (!subpathHasSegment || subpathClosed) {
        errors.push("path Z requires a drawable segment in its subpath");
      }
      subpathClosed = true;
      continue;
    }
    if (!currentPoint && command !== "M") {
      errors.push("path must begin with an absolute M command");
    }
    const arity = command === "M" || command === "L" ? 2 : 1;
    let count = 0;
    while (index < tokens.length && tokens[index].type === "number") {
      addGeometryNumber(tokens[index].value, "path", grid, errors);
      index += 1;
      count += 1;
    }
    if (count === 0 || count % arity !== 0) {
      errors.push(`path command "${command}" must have complete ${arity === 2 ? "x y pairs" : "coordinates"}`);
    }
    if (command === "M") {
      if (currentPoint && !subpathClosed) errors.push("path has an incomplete subpath without Z");
      if (count >= 2) {
        currentPoint = true;
        subpathHasSegment = count > 2;
        subpathClosed = false;
        if (count > 2) hasDrawableSegment = true;
      }
      continue;
    }
    if (!currentPoint) {
      errors.push(`path ${command} requires a current point from an absolute M command`);
      continue;
    }
    if (count >= arity && count % arity === 0) {
      subpathHasSegment = true;
      subpathClosed = false;
      hasDrawableSegment = true;
    }
  }
  if (currentPoint && !subpathClosed) errors.push("path has an incomplete subpath without Z");
  if (!hasDrawableSegment) errors.push("path must contain a drawable segment");
  return hasDrawableSegment;
}

function validateRect(element, grid, errors) {
  const dimensions = ["x", "y", "width", "height"];
  for (const name of dimensions) {
    const value = element.getAttribute(name);
    if (value === null) {
      errors.push(`rect must declare ${name}`);
    } else {
      addGeometryNumber(value, `rect ${name}`, grid, errors);
    }
  }
  const x = Number(element.getAttribute("x"));
  const y = Number(element.getAttribute("y"));
  const width = Number(element.getAttribute("width"));
  const height = Number(element.getAttribute("height"));
  if ([x, y, width, height].every(Number.isFinite) && (x + width > grid - 1 || y + height > grid - 1)) {
    errors.push(`rect bounds must remain between 1 and ${grid - 1}`);
  }
}

function validatePolygon(element, grid, errors) {
  const points = element.getAttribute("points");
  if (points === null || points.trim() === "") {
    errors.push("polygon must declare non-empty points");
    return;
  }
  const values = tokenizePath(points, errors);
  if (values.some((token) => token.type !== "number")) {
    errors.push("polygon points may contain only numeric coordinate pairs");
    return;
  }
  if (values.length < 6 || values.length % 2 !== 0) {
    errors.push("polygon points must contain at least three complete coordinate pairs");
    return;
  }
  for (const token of values) addGeometryNumber(token.value, "polygon", grid, errors);
}

function validateFill(element, errors) {
  const fill = element.getAttribute("fill");
  if (fill === null || !/^#[0-9a-fA-F]{6}$/.test(fill)) {
    errors.push(`${element.localName} must use an opaque six-digit hex fill`);
    return null;
  }
  return fill.toLowerCase();
}

function validateElementAttributes(element, isRoot, errors) {
  const allowed = isRoot ? ROOT_ATTRIBUTES : SHAPE_ATTRIBUTES[element.localName];
  for (const attribute of element.attributes) {
    if (allowed?.has(attribute.name)) {
      if (!isRoot && attribute.name === "shape-rendering" && attribute.value !== "crispEdges") {
        errors.push(`${element.localName} shape-rendering must be "crispEdges" when declared`);
      }
      continue;
    }
    errors.push(`${element.localName} ${BANNED_ATTRIBUTE_MESSAGES.get(attribute.name) ?? `attribute "${attribute.name}" is not allowed`}`);
  }
}

export function validateMasterSource(source, { concept, grid }) {
  const errors = [];
  if (!ICON_CONCEPTS.includes(concept)) errors.push(`unknown icon concept "${concept}"`);
  if (!ICON_GRIDS.includes(grid)) errors.push(`unsupported icon grid "${grid}"`);
  let document;
  try {
    document = new JSDOM(source, { contentType: "image/svg+xml" }).window.document;
  } catch {
    return ["source is not well-formed SVG"];
  }
  const svg = document.documentElement;
  if (svg?.localName !== "svg" || svg.namespaceURI !== "http://www.w3.org/2000/svg") {
    errors.push("source must have an SVG root element");
    return errors;
  }
  if (svg.getAttribute("viewBox") !== `0 0 ${grid} ${grid}`) {
    errors.push(`svg must use exact viewBox "0 0 ${grid} ${grid}"`);
  }
  if (svg.getAttribute("shape-rendering") !== "crispEdges") {
    errors.push('svg must declare shape-rendering="crispEdges"');
  }
  if (svg.getAttribute("data-m98-concept") !== concept) {
    errors.push(`svg data-m98-concept must be "${concept}"`);
  }
  if (svg.getAttribute("data-m98-grid") !== String(grid)) {
    errors.push(`svg data-m98-grid must be "${grid}"`);
  }

  const colors = new Set();
  let drawablePrimitiveCount = 0;
  for (const element of document.querySelectorAll("*")) {
    if (element !== svg && !ALLOWED_SHAPES.has(element.localName)) {
      errors.push(`banned SVG element <${element.localName}>`);
    }
    validateElementAttributes(element, element === svg, errors);
    if (!ALLOWED_SHAPES.has(element.localName)) continue;
    const color = validateFill(element, errors);
    if (color) colors.add(color);
    if (element.localName === "path" && validatePathData(element.getAttribute("d"), grid, errors)) drawablePrimitiveCount += 1;
    if (element.localName === "rect") {
      validateRect(element, grid, errors);
      drawablePrimitiveCount += 1;
    }
    if (element.localName === "polygon") {
      validatePolygon(element, grid, errors);
      drawablePrimitiveCount += 1;
    }
  }
  if (drawablePrimitiveCount === 0) errors.push("svg must contain at least one drawable primitive");
  if (colors.size > 24) errors.push(`icon uses ${colors.size} unique colors; maximum is 24`);
  return errors;
}

export function expectedMasterPath(root, concept, grid) {
  return path.posix.join(root, "masters", concept, `${concept}-${grid}.svg`);
}

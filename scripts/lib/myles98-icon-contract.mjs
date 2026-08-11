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

const ALLOWED_SHAPES = new Set(["path", "rect", "polygon"]);
const BANNED_ATTRIBUTES = new Map([
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
    if (!Object.hasOwn(GROUPS, icon.group)) {
      errors.push(`${label} has unknown group "${icon.group}"`);
    } else if (!GROUPS[icon.group].has(icon.id)) {
      errors.push(`${label} assigns "${icon.id}" to group "${icon.group}", which is not its approved group`);
    }
    if (typeof icon.intendedObject !== "string" || icon.intendedObject.trim() === "") {
      errors.push(`${label}.intendedObject must be a non-empty string`);
    }
    if (!isPlainObject(icon.tiers)) {
      errors.push(`${label}.tiers must be an object`);
    } else {
      for (const grid of ICON_GRIDS) {
        if (typeof icon.tiers[String(grid)] !== "string" || icon.tiers[String(grid)].trim() === "") {
          errors.push(`${label}.tiers.${grid} must be a non-empty string`);
        }
      }
    }
    checkStringList(icon.acceptedReadings, `${label}.acceptedReadings`, errors);
    checkStringList(icon.rejectedReadings, `${label}.rejectedReadings`, errors);
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
    return;
  }
  const tokens = tokenizePath(d, errors);
  let index = 0;
  while (index < tokens.length) {
    const commandToken = tokens[index];
    if (commandToken.type !== "command") {
      errors.push("path coordinates must begin with an absolute command");
      return;
    }
    const command = commandToken.value;
    index += 1;
    if (!"MLHVZ".includes(command)) {
      const kind = /[CcSsQqTtAa]/.test(command) ? "curve command" : "command";
      errors.push(`path uses unsupported ${kind} "${command}"`);
      while (index < tokens.length && tokens[index].type !== "command") index += 1;
      continue;
    }
    if (command === "Z") continue;
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
  }
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
  for (const element of document.querySelectorAll("*")) {
    if (element !== svg && !ALLOWED_SHAPES.has(element.localName)) {
      errors.push(`banned SVG element <${element.localName}>`);
    }
    for (const attribute of element.attributes) {
      const message = BANNED_ATTRIBUTES.get(attribute.name);
      if (message) errors.push(`${element.localName} ${message}`);
    }
    if (!ALLOWED_SHAPES.has(element.localName)) continue;
    const color = validateFill(element, errors);
    if (color) colors.add(color);
    if (element.localName === "path") validatePathData(element.getAttribute("d"), grid, errors);
    if (element.localName === "rect") validateRect(element, grid, errors);
    if (element.localName === "polygon") validatePolygon(element, grid, errors);
  }
  if (colors.size > 24) errors.push(`icon uses ${colors.size} unique colors; maximum is 24`);
  return errors;
}

export function expectedMasterPath(root, concept, grid) {
  return path.posix.join(root, "masters", concept, `${concept}-${grid}.svg`);
}

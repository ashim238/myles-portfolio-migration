#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const MAX_PDF_BYTES = 1024 * 1024;

const STALE_CLAIMS = [
  "78%",
  "preferred neighborhood-led",
  "generic top-ten",
  "open rates went from",
  "compared with prior sends",
  "prior sends around 30%",
  "400+ agencies",
  "2018 – 2022",
];
const ORDER_SENTINELS = [
  "Myles Ashitey",
  "Professional Summary",
  "Independent Work",
  "Fresh Greens",
  "UnderstandingFAFSA",
  "Navi",
  "Work Experience",
  "Aug 2023 – Aug 2024",
  "Universal Music Group",
  "May – Aug 2022",
  "May – Aug 2021",
  "Education",
  "Skills",
];
const EXPECTED_COUNTS = new Map([
  ["Professional Summary", 1],
  ["Independent Work", 1],
  ["Fresh Greens", 1],
  ["Light Academia shipped in the launch library", 1],
  ["UnderstandingFAFSA", 1],
  ["With one collaborator, compiled and evaluated 120+ newsletter examples across four criteria", 1],
  ["Navi", 1],
  ["The team audited six travel platforms", 1],
  ["research-informed archetypes", 1],
  ["Work Experience", 1],
  ["Creative Strategy Assistant", 1],
  ["custom-merch rollout for charlieonnafriday", 1],
  ["Creative Strategist Intern", 2],
  ["MFA, Design & Technology", 1],
  ["BA, Media Studies", 1],
  ["Aug 2018 – Dec 2022", 1],
  ["Education", 1],
  ["Skills", 1],
]);
const EXPECTED_H3_HEADINGS = new Map([
  ["Fresh Greens", 1],
  ["UnderstandingFAFSA", 1],
  ["Navi", 1],
  ["Creative Strategy Assistant", 1],
  ["Creative Strategist Intern", 2],
  ["MFA, Design & Technology", 1],
  ["BA, Media Studies", 1],
]);
const EXPECTED_H1_HEADINGS = new Map([["Myles Ashitey", 1]]);
const EXPECTED_H2_HEADINGS = new Map([
  ["Professional Summary", 1],
  ["Independent Work", 1],
  ["Work Experience", 1],
  ["Education", 1],
  ["Skills", 1],
]);
const EXPECTED_LINKS = [
  { text: "mylesashitey@gmail.com", uri: "mailto:mylesashitey@gmail.com" },
  { text: "LinkedIn", uri: "https://linkedin.com/in/myles-ashitey" },
  { text: "mylesdesignsthings.com", uri: "https://www.mylesdesignsthings.com" },
  { text: "Fresh Greens", uri: "https://www.mylesdesignsthings.com/work/fresh-greens" },
  {
    text: "UnderstandingFAFSA",
    uri: "https://www.mylesdesignsthings.com/work/understandingfafsa",
  },
  { text: "Navi", uri: "https://www.mylesdesignsthings.com/work/navi" },
];
const PDF_14_STRUCTURE_ROLES = new Set([
  "/Document", "/Part", "/Art", "/Sect", "/Div", "/BlockQuote", "/Caption",
  "/TOC", "/TOCI", "/Index", "/NonStruct", "/Private", "/P", "/H",
  "/H1", "/H2", "/H3", "/H4", "/H5", "/H6", "/L", "/LI", "/Lbl",
  "/LBody", "/Table", "/TR", "/TH", "/TD", "/Span", "/Quote", "/Note",
  "/Reference", "/BibEntry", "/Code", "/Link", "/Figure", "/Formula", "/Form",
]);
const PDF_17_ADDITIONAL_STRUCTURE_ROLES = new Set([
  "/Ruby", "/RB", "/RT", "/RP", "/Warichu", "/WT", "/WP",
]);
const PDF_20_ADDITIONAL_STRUCTURE_ROLES = new Set([
  "/DocumentFragment", "/Aside", "/Title", "/FENote", "/Sub", "/Em", "/Strong",
]);

function run(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8" });
  } catch (error) {
    const detail = error?.stderr?.toString().trim() || error?.message || String(error);
    throw new Error(`${command} failed: ${detail}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalize(value) {
  return value.replace(/\s+/g, " ").trim();
}

function occurrences(haystack, needle) {
  let count = 0;
  let offset = 0;
  while ((offset = haystack.indexOf(needle, offset)) !== -1) {
    count += 1;
    offset += needle.length;
  }
  return count;
}

export function verifyHeadingAssociations(
  headingTexts,
  expected = EXPECTED_H3_HEADINGS,
  role = "H3",
) {
  const counts = new Map();
  for (const text of headingTexts) {
    const heading = normalize(text).replace(/\s+/g, "");
    counts.set(heading, (counts.get(heading) || 0) + 1);
  }
  for (const [heading, expectedCount] of expected) {
    const actualCount = counts.get(heading.replace(/\s+/g, "")) || 0;
    assert(
      actualCount === expectedCount,
      `Expected “${heading}” to be attached to ${expectedCount} ${role} tag(s), found ${actualCount}.`,
    );
  }
}

export function verifyLinkAssociations(associations, expected = EXPECTED_LINKS) {
  const normalizeUri = (uri) => {
    if (!/^https?:\/\//i.test(uri)) return uri;
    return uri.endsWith("/") ? uri.slice(0, -1) : uri;
  };

  for (const expectedLink of expected) {
    const expectedText = normalize(expectedLink.text).replace(/\s+/g, "");
    const expectedUri = normalizeUri(expectedLink.uri);
    const match = associations.find((association) => {
      const actualText = normalize(association.text || "").replace(/\s+/g, "");
      return (
        actualText === expectedText &&
        association.hasObjectReference &&
        association.uris.some((uri) => normalizeUri(uri) === expectedUri)
      );
    });
    assert(
      match,
      `Expected “${expectedLink.text}” and ${expectedLink.uri} to be associated within one Link tag.`,
    );
  }
}

export function verifyRoleSemantics(pdfVersion, roles, roleMap) {
  const [major = 0, minor = 0] = pdfVersion.split(".").map(Number);
  const standardRoles = new Set(PDF_14_STRUCTURE_ROLES);
  if (major > 1 || minor >= 7) {
    for (const role of PDF_17_ADDITIONAL_STRUCTURE_ROLES) standardRoles.add(role);
  }
  if (major >= 2) {
    for (const role of PDF_20_ADDITIONAL_STRUCTURE_ROLES) standardRoles.add(role);
  }

  for (const role of new Set(roles)) {
    if (standardRoles.has(role)) continue;
    const visited = new Set([role]);
    let mappedRole = roleMap[role];
    while (mappedRole && !standardRoles.has(mappedRole) && !visited.has(mappedRole)) {
      visited.add(mappedRole);
      const nextRole = roleMap[mappedRole];
      if (!nextRole) break;
      mappedRole = nextRole;
    }
    assert(
      mappedRole && standardRoles.has(mappedRole),
      `Structure role ${role} is not standard for PDF ${pdfVersion} and is not RoleMapped to a standard role${mappedRole ? ` (resolved to ${mappedRole})` : ""}.`,
    );
  }
}

export function verifyPhonePrivacy(texts, links) {
  const phonePattern = /(?:\+?1[\s().-]*)?\(?[2-9]\d{2}\)?[\s.-]*\d{3}[\s.-]*\d{4}/;
  for (const text of texts) {
    assert(!phonePattern.test(text), "Phone number found in extracted PDF text.");
  }
  assert(
    !links.some((link) => link.toLowerCase().startsWith("tel:")),
    "Phone number found in PDF link annotations.",
  );
}

export function verifyFileSize(pdf, maxBytes = MAX_PDF_BYTES) {
  const bytes = statSync(pdf).size;
  assert(
    bytes <= maxBytes,
    `Resume PDF is ${bytes} bytes, exceeding the 1 MiB (${maxBytes}-byte) limit.`,
  );
  return bytes;
}

function verifyReadingOrder(label, text) {
  const normalized = normalize(text);
  let lastIndex = -1;
  for (const sentinel of ORDER_SENTINELS) {
    const index = normalized.indexOf(sentinel, lastIndex + 1);
    assert(index !== -1, `${label} text is missing “${sentinel}”.`);
    assert(index > lastIndex, `${label} reading order is wrong at “${sentinel}”.`);
    lastIndex = index;
  }
  return normalized;
}

function parsePdfInfo(info) {
  const field = (name) => info.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.trim();
  const size = field("Page size")?.match(/([0-9.]+)\s+x\s+([0-9.]+)\s+pts/);
  return {
    pages: Number(field("Pages")),
    tagged: field("Tagged"),
    encrypted: field("Encrypted"),
    suspects: field("Suspects"),
    width: Number(size?.[1]),
    height: Number(size?.[2]),
  };
}

function verifyFonts(fonts) {
  const rows = fonts
    .split("\n")
    .slice(2)
    .map((row) => row.trim())
    .filter(Boolean);
  assert(rows.length > 0, "pdffonts found no fonts.");
  for (const row of rows) {
    const flags = row.match(/\s+(yes|no)\s+(yes|no)\s+(yes|no)\s+\d+\s+\d+$/);
    assert(flags, `Could not parse pdffonts row: ${row}`);
    assert(flags[1] === "yes", `Font is not embedded: ${row}`);
    assert(flags[2] === "yes", `Font is not subset: ${row}`);
    assert(flags[3] === "yes", `Font has no Unicode map: ${row}`);
  }
}

export function inspectStructure(pdf) {
  const python = String.raw`
import json, sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1])
root = reader.trailer["/Root"]
roles = []
h1_texts = []
h2_texts = []
h3_texts = []
link_associations = []
mcid_text = {}

def resolve(value):
    return value.get_object() if hasattr(value, "get_object") else value

page_refs = {}
for page_index, page in enumerate(reader.pages):
    reference = getattr(page, "indirect_reference", None)
    if reference is not None:
        page_refs[(reference.idnum, reference.generation)] = page_index

def page_index_for(reference):
    if reference is None:
        return None
    if hasattr(reference, "idnum"):
        return page_refs.get((reference.idnum, reference.generation))
    return None

for page_index, page in enumerate(reader.pages):
    stack = []
    fragments = {}

    def before(operator, operands, _cm, _tm):
        if operator == b"BDC":
            properties = resolve(operands[1]) if len(operands) > 1 else {}
            mcid = properties.get("/MCID") if isinstance(properties, dict) else None
            stack.append(int(mcid) if mcid is not None else None)
        elif operator == b"BMC":
            stack.append(None)
        elif operator == b"EMC" and stack:
            stack.pop()

    def text_visitor(text, _cm, _tm, _font, _size):
        for mcid in reversed(stack):
            if mcid is not None:
                fragments.setdefault(mcid, []).append(text)
                break

    page.extract_text(visitor_operand_before=before, visitor_text=text_visitor)
    mcid_text[page_index] = {
        mcid: "".join(parts) for mcid, parts in fragments.items()
    }

def text_for(value, inherited_page=None):
    value = resolve(value)
    if isinstance(value, list):
        return "".join(text_for(item, inherited_page) for item in value)
    if isinstance(value, (int, float)) and inherited_page is not None:
        return mcid_text.get(inherited_page, {}).get(int(value), "")
    if isinstance(value, dict):
        page_index = page_index_for(value.get("/Pg"))
        if page_index is None:
            page_index = inherited_page
        mcid = value.get("/MCID")
        if mcid is not None and page_index is not None:
            return mcid_text.get(page_index, {}).get(int(mcid), "")
        return text_for(value.get("/K", []), page_index)
    return ""

def object_reference_uris(value):
    value = resolve(value)
    if isinstance(value, list):
        uris = []
        for item in value:
            uris.extend(object_reference_uris(item))
        return uris
    if not isinstance(value, dict) or value.get("/Type") != "/OBJR":
        return []
    annotation = resolve(value.get("/Obj", {}))
    if annotation.get("/Subtype") != "/Link":
        return []
    action = resolve(annotation.get("/A", {}))
    uri = action.get("/URI")
    return [str(uri)] if uri else []

def walk(value):
    value = resolve(value)
    if isinstance(value, list):
        for item in value:
            walk(item)
    elif isinstance(value, dict):
        role = value.get("/S")
        if role:
            role = str(role)
            roles.append(role)
            attached_text = " ".join(text_for(value).split())
            if role == "/H1":
                h1_texts.append(attached_text)
            elif role == "/H2":
                h2_texts.append(attached_text)
            elif role == "/H3":
                h3_texts.append(attached_text)
            elif role == "/Link":
                uris = object_reference_uris(value.get("/K", []))
                link_associations.append({
                    "text": attached_text,
                    "uris": uris,
                    "hasObjectReference": bool(uris),
                })
        if "/K" in value:
            walk(value["/K"])

tree = root.get("/StructTreeRoot")
if tree:
    tree = resolve(tree)
    walk(tree)

links = []
for page in reader.pages:
    for annotation in page.get("/Annots", []):
        annotation = resolve(annotation)
        if annotation.get("/Subtype") == "/Link":
            action = resolve(annotation.get("/A", {}))
            uri = action.get("/URI")
            if uri:
                links.append(str(uri))

mark = resolve(root.get("/MarkInfo", {}))
role_map = {}
if tree:
    role_map = {
        str(key): str(resolve(value))
        for key, value in resolve(tree.get("/RoleMap", {})).items()
    }
print(json.dumps({
    "pdfVersion": reader.pdf_header.replace("%PDF-", ""),
    "lang": str(root.get("/Lang", "")),
    "marked": bool(mark.get("/Marked", False)),
    "hasStructTreeRoot": "/StructTreeRoot" in root,
    "hasOutlines": "/Outlines" in root,
    "roles": roles,
    "roleMap": role_map,
    "h1Texts": h1_texts,
    "h2Texts": h2_texts,
    "h3Texts": h3_texts,
    "linkAssociations": link_associations,
    "links": links,
}))
`;
  return JSON.parse(run("python3", ["-c", python, pdf]));
}

async function verify(pdfArgument) {
  if (!pdfArgument) {
    throw new Error("Usage: verify-resume-pdf.mjs <candidate.pdf>");
  }
  const pdf = resolve(pdfArgument);
  const pdfBytes = verifyFileSize(pdf);
  const temporary = await mkdtemp(resolve(tmpdir(), "resume-pdf-verify-"));
  const logicalPath = resolve(temporary, "logical.txt");
  const layoutPath = resolve(temporary, "layout.txt");

  try {
    const infoText = run("pdfinfo", [pdf]);
    const info = parsePdfInfo(infoText);
    assert(info.pages === 1, `Expected one page, found ${info.pages}.`);
    assert(info.tagged === "yes", "pdfinfo must report Tagged: yes.");
    assert(info.encrypted === "no", "Encrypted PDFs are not accepted.");
    assert(info.suspects === "no", "pdfinfo must report Suspects: no.");
    assert(Math.abs(info.width - 595.28) <= 1, `Expected A4 width, found ${info.width}pt.`);
    assert(Math.abs(info.height - 841.89) <= 1, `Expected A4 height, found ${info.height}pt.`);

    verifyFonts(run("pdffonts", [pdf]));
    run("pdftotext", [pdf, logicalPath]);
    run("pdftotext", ["-layout", pdf, layoutPath]);
    const logical = verifyReadingOrder("Logical", await readFile(logicalPath, "utf8"));
    const layout = verifyReadingOrder("Layout", await readFile(layoutPath, "utf8"));

    for (const [expected, count] of EXPECTED_COUNTS) {
      assert(
        occurrences(logical, expected) === count,
        `Expected “${expected}” ${count} time(s) in extracted text.`,
      );
    }
    for (const required of [
      "New York, NY",
      "mylesashitey@gmail.com",
      "LinkedIn",
      "mylesdesignsthings.com",
      "custom-merch rollout for charlieonnafriday",
      "with Mailchimp Privacy Protection excluded",
    ]) {
      assert(logical.includes(required), `Extracted text is missing “${required}”.`);
    }
    for (const stale of STALE_CLAIMS) {
      assert(!logical.toLowerCase().includes(stale.toLowerCase()), `Retired claim found: ${stale}`);
      assert(!layout.toLowerCase().includes(stale.toLowerCase()), `Retired claim found: ${stale}`);
    }
    assert(!logical.includes("�") && !layout.includes("�"), "Replacement-character glyph found.");

    const structure = inspectStructure(pdf);
    verifyPhonePrivacy([logical, layout], structure.links);
    assert(structure.lang === "en", `Expected document language en, found ${structure.lang || "none"}.`);
    assert(structure.marked, "MarkInfo /Marked must be true.");
    assert(structure.hasStructTreeRoot, "StructTreeRoot is missing.");
    assert(structure.hasOutlines, "Outlines are missing.");
    for (const role of ["/Document", "/H1", "/H2", "/H3", "/P", "/L", "/LI", "/Link"]) {
      assert(structure.roles.includes(role), `Structure tree is missing ${role}.`);
    }
    assert(occurrences(structure.roles.join(" "), "/H1") === 1, "Expected exactly one H1 tag.");
    assert(occurrences(structure.roles.join(" "), "/H2") === 5, "Expected exactly five H2 tags.");
    assert(occurrences(structure.roles.join(" "), "/H3") === 8, "Expected exactly eight H3 tags.");
    verifyRoleSemantics(structure.pdfVersion, structure.roles, structure.roleMap);
    verifyHeadingAssociations(structure.h1Texts, EXPECTED_H1_HEADINGS, "H1");
    verifyHeadingAssociations(structure.h2Texts, EXPECTED_H2_HEADINGS, "H2");
    verifyHeadingAssociations(structure.h3Texts, EXPECTED_H3_HEADINGS, "H3");
    verifyLinkAssociations(structure.linkAssociations);
    assert(
      structure.links.includes("mailto:mylesashitey@gmail.com"),
      "Missing mailto:mylesashitey@gmail.com link annotation.",
    );
    assert(
      structure.links.some((link) => link.startsWith("https://linkedin.com/in/myles-ashitey")),
      "Missing https://linkedin.com/in/myles-ashitey link annotation.",
    );
    assert(
      structure.links.some((link) => link.startsWith("https://www.mylesdesignsthings.com")),
      "Missing https://www.mylesdesignsthings.com link annotation.",
    );

    console.log(
      `Verified ${basename(pdf)} (${pdfBytes} bytes): one-page A4, tagged, ordered, linked, and font-complete.`,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await verify(process.argv[2]);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

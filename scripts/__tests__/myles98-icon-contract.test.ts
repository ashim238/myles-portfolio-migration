import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  APPROVED_ICON_METADATA,
  ICON_CONCEPTS,
  ICON_GRIDS,
  expectedMasterPath,
  validateManifest,
  validateMasterSource,
} from "../lib/myles98-icon-contract.mjs";
import { verifyMasterFiles } from "../verify-myles98-icon-masters.mjs";

const validSvg = (artwork: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges" data-m98-concept="start" data-m98-grid="16">
  ${artwork}
</svg>`;

const REFINED_TARGET_METADATA = {
  "selected-work": {
    intendedObject: "open project dossier folder containing two project cards",
    tiers: {
      "16": "Project dossier folder",
      "24": "Two visible project cards",
      "32": "Open project dossier folder containing two project cards",
    },
    acceptedReadings: ["portfolio folder", "project folder", "work folder"],
    rejectedReadings: ["document", "envelope", "generic app window", "photo landscape", "photo folder"],
  },
  reminders: {
    intendedObject: "personal checklist pad with checkbox/checkmark pairs",
    tiers: {
      "16": "Checklist pad with two checkbox/checkmark pairs",
      "24": "Checklist pad with three checkbox/checkmark pairs and a bound paper edge",
      "32": "Personal checklist pad with three checks and paper depth",
    },
    acceptedReadings: ["checklist", "notepad", "reminders"],
    rejectedReadings: ["calendar", "spiral-bound calendar", "resume", "newsletter", "recipe card"],
  },
  "display-properties": {
    intendedObject: "beige CRT display-settings monitor with in-screen controls and casing depth",
    tiers: {
      "16": "CRT monitor with a settings cue",
      "24": "CRT monitor with in-screen slider controls",
      "32": "Beige CRT with in-screen controls and object-specific casing depth",
    },
    acceptedReadings: ["monitor", "CRT", "display"],
    rejectedReadings: ["overlapping windows", "reset icon", "television"],
  },
  "reset-desktop": {
    intendedObject: "one connected open restart C-loop with a compact directional wedge and intentional gap",
    tiers: {
      "16": "Open restart C-loop with a compact directional wedge",
      "24": "Open restart C-loop with a compact directional wedge and intentional gap",
      "32": "Stepped open restart C-loop with a compact directional wedge and intentional gap",
    },
    acceptedReadings: ["restart arrow", "reset arrow", "reset desktop", "restart loop", "reset symbol"],
    rejectedReadings: ["fuel pump", "instant camera", "display properties", "open apps", "reload browser", "monitor alert", "monitor with alert", "alert flag", "opposing transfer arrows", "transfer control", "monitor cable", "pointer", "monitor with restart arrow", "monitor with restart loop", "reset monitor", "red telephone handset", "telephone handset", "alarm clock", "chain link", "paperclip", "pencil"],
  },
  "fresh-greens": {
    intendedObject: "rugged upright handheld GPS receiver with a separate top antenna, recessed routed map display, rounded cross D-pad, tactile function buttons, and dimensional casing",
    tiers: {
      "16": "Compact rugged GPS receiver with separate antenna, map display, rounded cross D-pad, and function buttons",
      "24": "Rugged handheld GPS receiver with separate antenna, recessed routed map, rounded cross D-pad, and function buttons",
      "32": "Dimensional rugged GPS receiver with separate antenna, recessed map, water and park cues, rounded cross D-pad, and function buttons",
    },
    acceptedReadings: ["GPS navigator", "navigation device", "route planner"],
    rejectedReadings: ["desktop monitor", "computer", "television", "generic app window", "magic wand", "wand", "notebook band", "folded page", "landscape image", "landscape photograph", "groceries", "leaf logo", "city guide", "music note", "musical note", "folded map", "circuit"],
  },
  understandingfafsa: {
    intendedObject: "dimensional packet of folded printed newsletters with a visible stacked paper edge, lower print gutter, and editorial print anatomy",
    tiers: {
      "16": "Stacked printed newsletter packet with a masthead, lower fold, and visible paper edge",
      "24": "Dimensional newsletter packet with a rear sheet, printed masthead, headline, photo, copy columns, lower fold, and paper edge",
      "32": "Dimensional newsletter packet with a thick rear sheet, printed masthead, headline, photo, copy columns, lower fold, and exposed paper edges",
    },
    acceptedReadings: ["newsletter packet", "printed newsletter", "folded newsletter", "newsprint", "printed newsprint", "newspaper"],
    rejectedReadings: ["web page layout", "webpage", "framed web surface", "dashboard", "browser chrome", "browser window", "web application", "app window", "flat screen", "dashboard tile", "open envelope", "letter", "sealed email", "folded map", "mountain", "resume", "folder"],
  },
  "loose-parts": {
    intendedObject: "literal non-branded compact 2+1 stack of three painted wooden construction cubes with square faces and visible top/right planes",
    tiers: {
      "16": "Red, yellow, and blue 2+1 construction-cube stack with visible top/right planes",
      "24": "Red, yellow, and blue 2+1 wooden construction-cube stack with square faces and a restrained upper-cube recess",
      "32": "Red, yellow, and blue 2+1 wooden construction-cube stack with square faces, visible top/right planes, and a restrained upper-cube recess",
    },
    acceptedReadings: ["building blocks", "construction blocks", "toy blocks"],
    rejectedReadings: ["boots", "pair of boots", "people", "group of people", "branded studs", "LEGO", "food", "table", "furniture", "steps", "bar chart", "books", "stack of books", "book stack", "cardboard boxes", "box stack", "logs", "bottle", "clothing"],
  },
  "tiktok-catalog": {
    intendedObject: "upright handled shopping bag with a framed opening and a single side depth plane at 24/32",
    tiers: {
      "16": "U-handled upright shopping bag",
      "24": "U-handled upright shopping bag with framed opening and one side depth plane",
      "32": "Dimensional U-handled upright shopping bag with framed opening and one side depth plane",
    },
    acceptedReadings: ["shopping bag", "retail bag", "product bag"],
    rejectedReadings: ["wastebasket", "basket", "shopping basket", "small tote", "purse", "catalog page", "floppy disk", "save icon", "diskette", "TikTok logo", "music note", "social media app", "book", "dashboard"],
  },
} as const;

function manifestWithRefinedTargetMetadata() {
  const manifest = JSON.parse(
    readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
  );
  for (const [id, approved] of Object.entries(REFINED_TARGET_METADATA)) {
    const icon = manifest.icons.find((candidate: { id: string }) => candidate.id === id);
    Object.assign(icon, {
      intendedObject: approved.intendedObject,
      tiers: { ...approved.tiers },
      acceptedReadings: [...approved.acceptedReadings],
      rejectedReadings: [...approved.rejectedReadings],
    });
  }
  return manifest;
}

describe("Myles 98 icon master contract", () => {
  it("locks the complete family and three native grids", () => {
    expect(ICON_GRIDS).toEqual([16, 24, 32]);
    expect(ICON_CONCEPTS).toEqual([
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
  });

  it("rejects modern vector treatments and non-integer geometry", () => {
    const invalid = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M1.5 1 C2 3 4 5 6 7" stroke="black" stroke-linejoin="round" />
    </svg>`;
    expect(validateMasterSource(invalid, { concept: "start", grid: 16 })).toEqual(
      expect.arrayContaining([
        expect.stringContaining("shape-rendering"),
        expect.stringContaining("fractional"),
        expect.stringContaining("curve command"),
        expect.stringContaining("rounded join"),
      ]),
    );
  });

  it("accepts a bounded crisp pixel master", () => {
    const valid = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges" data-m98-concept="start" data-m98-grid="16">
      <path fill="#111111" d="M2 2H13V13H2Z" />
      <path fill="#f5f3ea" d="M3 3H12V12H3Z" />
    </svg>`;
    expect(validateMasterSource(valid, { concept: "start", grid: 16 })).toEqual([]);
  });

  it("fails closed when a manifest group is unknown", () => {
    const manifest = {
      icons: [
        {
          id: "start",
          group: "unknown",
          intendedObject: "portrait",
          tiers: { "16": "portrait", "24": "portrait with glasses", "32": "portrait" },
          acceptedReadings: ["portrait"],
          rejectedReadings: ["folder"],
        },
      ],
    };

    expect(validateManifest(manifest)).toEqual(
      expect.arrayContaining([expect.stringContaining('unknown group "unknown"')]),
    );
  });

  it("parses path geometry without treating the viewBox or fill hex digits as coordinates", () => {
    const valid = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges" data-m98-concept="start" data-m98-grid="16">
      <path fill="#c0c0c0" d="M1 1H15V15H1Z" />
    </svg>`;

    expect(validateMasterSource(valid, { concept: "start", grid: 16 })).toEqual([]);
  });

  it("uses deterministic source paths", () => {
    expect(expectedMasterPath("docs/design-assets/myles98-icons", "navi", 24)).toBe(
      "docs/design-assets/myles98-icons/masters/navi/navi-24.svg",
    );
  });

  it.each([
    ["rect", '<rect fill="#111111" x="2" y="2" width="3" height="3" />'],
    ["polygon", '<polygon fill="#111111" points="2,2 13,2 2,13" />'],
    ["path with explicit crisp rendering", '<path fill="#111111" shape-rendering="crispEdges" d="M2 2H13V13H2Z" />'],
  ])("accepts a bounded %s primitive", (_name, artwork) => {
    expect(validateMasterSource(validSvg(artwork), { concept: "start", grid: 16 })).toEqual([]);
  });

  it.each([
    ["rounded rectangle", '<rect fill="#111111" x="2" y="2" width="3" height="3" rx="1" />', 'attribute "rx"'],
    ["rounded rectangle y radius", '<rect fill="#111111" x="2" y="2" width="3" height="3" ry="1" />', 'attribute "ry"'],
    ["descendant rendering override", '<path fill="#111111" shape-rendering="geometricPrecision" d="M2 2H13V13H2Z" />', "shape-rendering"],
  ])("rejects %s", (_name, artwork, expectedError) => {
    expect(validateMasterSource(validSvg(artwork), { concept: "start", grid: 16 })).toEqual(
      expect.arrayContaining([expect.stringContaining(expectedError)]),
    );
  });

  it("rejects empty artwork and malformed path state", () => {
    expect(validateMasterSource(validSvg(""), { concept: "start", grid: 16 })).toEqual(
      expect.arrayContaining([expect.stringContaining("drawable primitive")]),
    );
    expect(validateMasterSource(validSvg('<path fill="#111111" d="H2V13Z" />'), { concept: "start", grid: 16 })).toEqual(
      expect.arrayContaining([expect.stringContaining("begin with an absolute M")]),
    );
    expect(validateMasterSource(validSvg('<path fill="#111111" d="M2 2Z" />'), { concept: "start", grid: 16 })).toEqual(
      expect.arrayContaining([expect.stringContaining("drawable segment")]),
    );
    expect(validateMasterSource(validSvg('<path fill="#111111" d="M2 2H13" />'), { concept: "start", grid: 16 })).toEqual(
      expect.arrayContaining([expect.stringContaining("incomplete subpath")]),
    );
  });

  it("rejects a mutation of approved group and tier metadata", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const freshGreens = manifest.icons.find((icon: { id: string }) => icon.id === "fresh-greens");
    freshGreens.group = "personal";
    freshGreens.tiers["24"] = "arbitrary prose";

    expect(validateManifest(manifest)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("approved group"),
        expect.stringContaining("must exactly match approved cue"),
      ]),
    );
  });

  it("fails closed when approved object and recognition readings drift", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const freshGreens = manifest.icons.find((icon: { id: string }) => icon.id === "fresh-greens");
    freshGreens.intendedObject = "proprietary folded-map logo";
    freshGreens.acceptedReadings = ["leaf logo"];
    freshGreens.rejectedReadings = ["road map"];

    expect(validateManifest(manifest)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("intendedObject must exactly match approved object"),
        expect.stringContaining("acceptedReadings must exactly match approved readings"),
        expect.stringContaining("rejectedReadings must exactly match approved readings"),
      ]),
    );
  });

  it.each(["blind-review-1.json", "blind-review-2.json"])(
    "marks %s as historical evidence that does not apply to the final candidate",
    (filename) => {
      const review = JSON.parse(
        readFileSync(`docs/design-assets/myles98-icons/reviews/${filename}`, "utf8"),
      );

      expect(review.uninformed).toBe(true);
      expect(review.reviewStatus).toBe("historical-pre-simplification");
      expect(review.appliesToCurrentCandidate).toBe(false);
      expect(review.reviewedSnapshot).toBeNull();
      expect(review.provenanceLimitation).toContain("does not evidence the final 48-master set");
    },
  );

  it("accepts a generic personal-note metaphor under the stable trini-roti program id", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const note = manifest.icons.find((icon: { id: string }) => icon.id === "trini-roti");
    note.intendedObject = "single personal memo sheet with folded corner and handwritten lines";
    note.tiers = {
      "16": "Single memo sheet",
      "24": "Folded corner and handwritten lines",
      "32": "Personal memo sheet with folded corner, handwritten lines, and paper depth",
    };
    note.acceptedReadings = ["note", "memo", "note sheet"];
    note.rejectedReadings = ["checklist", "resume", "newsletter"];

    expect(validateManifest(manifest)).toEqual([]);
  });

  it("locks Loose Parts to painted wooden construction blocks rather than books, boxes, boots, people, a stair, or a chart", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const looseParts = manifest.icons.find((icon: { id: string }) => icon.id === "loose-parts");

    expect(looseParts.intendedObject).toBe(
      "literal non-branded compact 2+1 stack of three painted wooden construction cubes with square faces and visible top/right planes",
    );
    expect(looseParts.acceptedReadings).toEqual([
      "building blocks",
      "construction blocks",
      "toy blocks",
    ]);
    expect(looseParts.rejectedReadings).toEqual(["boots", "pair of boots", "people", "group of people", "branded studs", "LEGO", "food", "table", "furniture", "steps", "bar chart", "books", "stack of books", "book stack", "cardboard boxes", "box stack", "logs", "bottle", "clothing"]);
  });

  it("locks the approved tier cue spelling and case into metadata and the manifest", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const approvedTiers = {
      start: { "16": "Head-and-glasses silhouette", "24": "Locs and glasses within the portrait mark", "32": "Pixel adaptation of Myles's existing portrait mark" },
      "selected-work": REFINED_TARGET_METADATA["selected-work"].tiers,
      "about-myles": { "16": "Portrait card", "24": "ID-card frame and one information line", "32": "ID card with portrait and information lines" },
      resume: { "16": "Profile sheet with blue header", "24": "Subordinate blue paperclip and two bullets", "32": "Professional profile sheet with compact paperclip and structured lines" },
      email: { "16": "Sealed envelope", "24": "Sealed envelope with symmetric closed side folds", "32": "Dimensional sealed envelope with symmetric side folds and lower depth band" },
      reminders: REFINED_TARGET_METADATA.reminders.tiers,
      "trini-roti": { "16": "Single memo sheet", "24": "Folded corner and handwritten lines", "32": "Personal memo sheet with folded corner, handwritten lines, and paper depth" },
      "loose-parts": REFINED_TARGET_METADATA["loose-parts"].tiers,
      "display-properties": REFINED_TARGET_METADATA["display-properties"].tiers,
      "open-apps": { "16": "Two overlapping windows", "24": "Distinct titlebars", "32": "Two layered application windows with separate content panes" },
      "reset-desktop": REFINED_TARGET_METADATA["reset-desktop"].tiers,
      "generic-app": { "16": "Single application window", "24": "Blue titlebar and inner pane", "32": "Neutral program window with restrained chrome depth" },
      "fresh-greens": REFINED_TARGET_METADATA["fresh-greens"].tiers,
      understandingfafsa: REFINED_TARGET_METADATA.understandingfafsa.tiers,
      navi: { "16": "Pointed location marker", "24": "Two-plane location marker above a roofed storefront with scalloped awning", "32": "Pointed two-plane marker with orange cue above storefront facade, awning, window, and door" },
      "tiktok-catalog": REFINED_TARGET_METADATA["tiktok-catalog"].tiers,
    };

    expect(Object.fromEntries(Object.entries(APPROVED_ICON_METADATA).map(([id, metadata]) => [id, metadata.tiers]))).toEqual(approvedTiers);
    expect(Object.fromEntries(manifest.icons.map((icon: { id: string; tiers: Record<string, string> }) => [icon.id, icon.tiers]))).toEqual(approvedTiers);
  });

  it("binds every post-review target noun, tier cue, and recognition disposition to the current candidate", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const current = Object.fromEntries(
      Object.keys(REFINED_TARGET_METADATA).map((id) => {
        const icon = manifest.icons.find((candidate: { id: string }) => candidate.id === id);
        return [id, {
          intendedObject: icon.intendedObject,
          tiers: icon.tiers,
          acceptedReadings: icon.acceptedReadings,
          rejectedReadings: icon.rejectedReadings,
        }];
      }),
    );

    expect(current).toEqual(REFINED_TARGET_METADATA);
  });

  it("fails closed when each post-review object, tier, or reading contract is mutated", () => {
    type MutationCase = {
      id: string;
      label: string;
      mutate: (icon: Record<string, unknown>) => void;
      expectedError: string;
    };
    const cases: MutationCase[] = Object.entries(REFINED_TARGET_METADATA).flatMap(([id, approved]) => [
      {
        id,
        label: "intended object",
        mutate: (icon) => { icon.intendedObject = `${approved.intendedObject} drift`; },
        expectedError: "intendedObject must exactly match approved object",
      },
      ...Object.entries(approved.tiers).map(([grid, cue]) => ({
        id,
        label: `${grid}px tier`,
        mutate: (icon: Record<string, unknown>) => { (icon.tiers as Record<string, string>)[grid] = `${cue} drift`; },
        expectedError: `.tiers.${grid} must exactly match approved cue`,
      })),
      {
        id,
        label: "accepted readings",
        mutate: (icon) => { icon.acceptedReadings = [...approved.acceptedReadings, "drift"]; },
        expectedError: "acceptedReadings must exactly match approved readings",
      },
      {
        id,
        label: "rejected readings",
        mutate: (icon) => { icon.rejectedReadings = [...approved.rejectedReadings, "drift"]; },
        expectedError: "rejectedReadings must exactly match approved readings",
      },
    ]);

    for (const { id, label, mutate, expectedError } of cases) {
      const manifest = manifestWithRefinedTargetMetadata();
      expect(validateManifest(manifest), `${id} ${label} baseline`).toEqual([]);

      const icon = manifest.icons.find((candidate: { id: string }) => candidate.id === id);
      mutate(icon);

      expect(validateManifest(manifest), `${id} ${label} mutation`).toEqual(
        expect.arrayContaining([expect.stringContaining(expectedError)]),
      );
    }
  });

  it("keeps branded TikTok and generic social-app symbols out of the catalog icon", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const catalog = manifest.icons.find((icon: { id: string }) => icon.id === "tiktok-catalog");

    expect(catalog.rejectedReadings).toEqual(
      expect.arrayContaining(["TikTok logo", "music note", "social media app"]),
    );
  });

  it("locks Navi to a marker above a separate neighborhood storefront", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const navi = manifest.icons.find((icon: { id: string }) => icon.id === "navi");

    expect(navi.intendedObject).toBe("location marker above a neighborhood storefront");
    expect(navi.tiers["24"]).toBe("Two-plane location marker above a roofed storefront with scalloped awning");
    expect(navi.tiers["32"]).toBe("Pointed two-plane marker with orange cue above storefront facade, awning, window, and door");
  });

  it("locks TikTok to a handled shopping bag rather than a bin, basket, or branded app mark", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const catalog = manifest.icons.find((icon: { id: string }) => icon.id === "tiktok-catalog");

    expect(catalog.intendedObject).toBe("upright handled shopping bag with a framed opening and a single side depth plane at 24/32");
    expect(catalog.acceptedReadings).toEqual(["shopping bag", "retail bag", "product bag"]);
    expect(catalog.rejectedReadings).toEqual(
      expect.arrayContaining(["wastebasket", "basket", "small tote", "purse", "catalog page", "floppy disk", "save icon", "diskette", "TikTok logo", "music note", "social media app"]),
    );
  });

  it("locks Myles's likeness cues and assigns them realistic tier burdens", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const portraitLikeness = {
      skin: "dark skin",
      hair: "long locs with tapered sides",
      eyewear: "glasses",
      facialHair: "continuous moustache and separate chin hair",
      prohibited: ["full-beard mass"],
    };
    const likenessTiers = {
      start: {
        "16": "Primary portrait noun with dark skin and the essential head, glasses, and long-locs/tapered-sides silhouette; omit facial-hair microdetail before weakening the noun",
        "24": "Resolve long locs with tapered sides, glasses, a continuous moustache, and separate chin hair while preserving the portrait silhouette",
        "32": "Complete pixel portrait with dark skin and every approved likeness cue; no full-beard mass",
      },
      "about-myles": {
        "16": "Primary ID-card noun with a dark portrait and essential long-locs/tapered-sides silhouette; omit small likeness details before weakening the card",
        "24": "Resolve glasses, a continuous moustache, and separate chin hair within the card while preserving dark skin and the long-locs/tapered-sides silhouette",
        "32": "Complete ID card plus dark skin and every approved likeness cue; no full-beard mass",
      },
    };

    for (const id of ["start", "about-myles"] as const) {
      const icon = manifest.icons.find((candidate: { id: string }) => candidate.id === id);
      expect(icon.portraitLikeness).toEqual(portraitLikeness);
      expect(icon.likenessTiers).toEqual(likenessTiers[id]);
    }
  });

  it("accepts a new segment after a closed path subpath", () => {
    const valid = validSvg('<path fill="#111111" d="M2 2H13V13H2ZV3H4Z" />');

    expect(validateMasterSource(valid, { concept: "start", grid: 16 })).toEqual([]);
  });

  it("normalizes per-master read failures and continues collection", () => {
    const errors = verifyMasterFiles(
      [{ id: "start" }],
      {
        root: "/project",
        fsApi: {
          existsSync: () => true,
          readFileSync: () => {
            throw new Error("permission denied with environment-specific details");
          },
        },
      },
    );

    expect(errors).toEqual([
      "INVALID docs/design-assets/myles98-icons/masters/start/start-16.svg: unable to read master",
      "INVALID docs/design-assets/myles98-icons/masters/start/start-24.svg: unable to read master",
      "INVALID docs/design-assets/myles98-icons/masters/start/start-32.svg: unable to read master",
    ]);
  });
});

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

  it("locks Loose Parts to a brand-neutral three-block construction noun", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const looseParts = manifest.icons.find((icon: { id: string }) => icon.id === "loose-parts");

    expect(looseParts.intendedObject).toBe(
      "three generic colored construction blocks arranged in a compact pyramid",
    );
    expect(looseParts.acceptedReadings).toEqual([
      "building blocks",
      "construction blocks",
      "toy blocks",
    ]);
    expect(looseParts.rejectedReadings).toEqual(["LEGO", "food", "table"]);
  });

  it("locks the approved tier cue spelling and case into metadata and the manifest", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const approvedTiers = {
      start: { "16": "Head-and-glasses silhouette", "24": "Locs and glasses within the portrait mark", "32": "Pixel adaptation of Myles's existing portrait mark" },
      "selected-work": { "16": "Portfolio folder", "24": "One visible image thumbnail", "32": "Open portfolio folder containing a contact sheet" },
      "about-myles": { "16": "Portrait card", "24": "ID-card frame and one information line", "32": "ID card with portrait and information lines" },
      resume: { "16": "Profile sheet with blue header", "24": "Blue paperclip and two bullets", "32": "Professional profile sheet with paperclip and structured lines" },
      email: { "16": "Sealed envelope", "24": "Sealed envelope with one yellow stamp", "32": "Dimensional sealed envelope with one subordinate stamp" },
      reminders: { "16": "Spiral checklist pad", "24": "Two checks and a bound paper edge", "32": "Personal checklist pad with checks and paper depth" },
      "trini-roti": { "16": "Single memo sheet", "24": "Folded corner and handwritten lines", "32": "Personal memo sheet with folded corner, handwritten lines, and paper depth" },
      "loose-parts": { "16": "Three stacked construction blocks", "24": "Three colored cubes with face shading", "32": "Three colored building blocks in a compact pyramid" },
      "display-properties": { "16": "CRT monitor", "24": "Color-test tiles", "32": "Beige CRT with color-test window, controls, and object-specific casing depth" },
      "open-apps": { "16": "Two overlapping windows", "24": "Distinct titlebars", "32": "Two layered application windows with separate content panes" },
      "reset-desktop": { "16": "Desktop screen with two reset arrows", "24": "Compact red reset arrow", "32": "CRT desktop with a clear, subordinate reset arrow" },
      "generic-app": { "16": "Single application window", "24": "Blue titlebar and inner pane", "32": "Neutral program window with restrained chrome depth" },
      "fresh-greens": { "16": "Road-map tile with one route", "24": "One route with start and destination", "32": "Road-map tile with one non-monotonic road, start point, and orange destination" },
      understandingfafsa: { "16": "Newsletter page", "24": "Blue masthead within open envelope", "32": "Modular newsletter emerging from an envelope with three content regions" },
      navi: { "16": "Location marker", "24": "Location marker above a storefront", "32": "Location marker above a neighborhood storefront with one depth cue" },
      "tiktok-catalog": { "16": "Standalone retail shopping bag", "24": "Shopping bag with a top opening and one side plane", "32": "Dimensional shopping bag with gusset, lower plane, and restrained contact depth" },
    };

    expect(Object.fromEntries(Object.entries(APPROVED_ICON_METADATA).map(([id, metadata]) => [id, metadata.tiers]))).toEqual(approvedTiers);
    expect(Object.fromEntries(manifest.icons.map((icon: { id: string; tiers: Record<string, string> }) => [icon.id, icon.tiers]))).toEqual(approvedTiers);
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
    expect(navi.tiers["24"]).toBe("Location marker above a storefront");
    expect(navi.tiers["32"]).toBe("Location marker above a neighborhood storefront with one depth cue");
  });

  it("locks TikTok to one standalone retail shopping bag", () => {
    const manifest = JSON.parse(
      readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"),
    );
    const catalog = manifest.icons.find((icon: { id: string }) => icon.id === "tiktok-catalog");

    expect(catalog.intendedObject).toBe("standalone retail shopping bag");
    expect(catalog.acceptedReadings).toEqual(["shopping bag", "retail bag", "product bag"]);
    expect(catalog.rejectedReadings).toEqual(
      expect.arrayContaining(["purse", "catalog page", "TikTok logo", "music note", "social media app"]),
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
      facialHair: "moustache and separated chin hair",
      prohibited: ["full-beard mass"],
    };
    const likenessTiers = {
      start: {
        "16": "Primary portrait noun with dark skin and the essential head, glasses, and long-locs/tapered-sides silhouette; omit facial-hair microdetail before weakening the noun",
        "24": "Resolve long locs with tapered sides, glasses, moustache, and separated chin hair while preserving the portrait silhouette",
        "32": "Complete pixel portrait with dark skin and every approved likeness cue; no full-beard mass",
      },
      "about-myles": {
        "16": "Primary ID-card noun with a dark portrait and essential long-locs/tapered-sides silhouette; omit small likeness details before weakening the card",
        "24": "Resolve glasses, moustache, and separated chin hair within the card while preserving dark skin and the long-locs/tapered-sides silhouette",
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

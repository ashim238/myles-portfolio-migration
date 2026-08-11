import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
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

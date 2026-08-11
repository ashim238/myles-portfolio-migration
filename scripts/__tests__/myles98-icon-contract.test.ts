import { describe, expect, it } from "vitest";
import {
  ICON_CONCEPTS,
  ICON_GRIDS,
  expectedMasterPath,
  validateManifest,
  validateMasterSource,
} from "../lib/myles98-icon-contract.mjs";

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
});

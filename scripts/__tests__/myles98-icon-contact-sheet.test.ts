import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import * as fileSystem from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ICON_GRIDS } from "../lib/myles98-icon-contract.mjs";
import {
  buildIconContactSheet,
  createBlindReviewFamilies,
  createBlindReviewFamilyMapping,
} from "../build-myles98-icon-contact-sheet.mjs";

const outputPath = "docs/design-assets/myles98-icons/contact-sheet.html";
const surfaceColors = {
  teal: "#008080",
  chrome: "#C0C0C0",
  white: "#FFFFFF",
};

function generateContactSheetInTemporaryRoot() {
  const root = mkdtempSync(join(tmpdir(), "myles98-contact-sheet-output-"));
  cpSync("docs/design-assets/myles98-icons", join(root, "docs/design-assets/myles98-icons"), { recursive: true });
  buildIconContactSheet({ root });
  return {
    html: readFileSync(join(root, outputPath), "utf8"),
    root,
  };
}

function parse(html: string) {
  return new DOMParser().parseFromString(html, "text/html");
}

describe("Myles 98 icon contact sheet", () => {
  it("generates every verified master unchanged at native and nearest-neighbor magnification on three exact surfaces", () => {
    const { html, root } = generateContactSheetInTemporaryRoot();
    const document = parse(html);
    const manifest = JSON.parse(readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"));
    const labeled = document.querySelector<HTMLElement>('[data-review-mode="labeled"]');

    expect(labeled).not.toBeNull();
    expect(document.querySelectorAll("[data-master]")).toHaveLength(48 * 3);

    for (const [surface, color] of Object.entries(surfaceColors)) {
      const section = document.querySelector<HTMLElement>(`#surface-${surface}`);
      expect(section).not.toBeNull();
      expect(section?.dataset.surfaceColor).toBe(color);
      expect(section?.querySelectorAll("[data-master]")).toHaveLength(48);
    }

    for (const icon of manifest.icons) {
      for (const grid of ICON_GRIDS) {
        const rawSvg = readFileSync(
          `docs/design-assets/myles98-icons/masters/${icon.id}/${icon.id}-${grid}.svg`,
          "utf8",
        );
        const master = `${icon.id}-${grid}`;
        const cards = [...document.querySelectorAll<HTMLElement>(`[data-master="${master}"]`)];

        expect(cards).toHaveLength(3);
        expect(html.split(rawSvg)).toHaveLength(1 + 3 * 2);
        for (const card of cards) {
          expect(card.querySelectorAll('[data-render="native"][data-scale="1"]')).toHaveLength(1);
          expect(card.querySelectorAll('[data-render="magnified"][data-scale="6"]')).toHaveLength(1);
        }
      }
    }

    expect(html).toContain("image-rendering: pixelated");
    expect(html).toContain("image-rendering: crisp-edges");
    rmSync(root, { recursive: true, force: true });
  });

  it("keeps blind review families deterministic and visibly groups all three tiers without semantic leakage", () => {
    const firstOutput = generateContactSheetInTemporaryRoot();
    const secondOutput = generateContactSheetInTemporaryRoot();
    const { html: firstHtml } = firstOutput;
    const { html: secondHtml } = secondOutput;
    const first = parse(firstHtml);
    const second = parse(secondHtml);
    const blind = first.querySelector<HTMLElement>('[data-review-mode="unlabeled"]');
    const manifest = JSON.parse(readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"));

    expect(secondHtml).toBe(firstHtml);
    expect(blind).not.toBeNull();
    expect(blind?.querySelectorAll("[data-master]")).toHaveLength(0);
    expect(blind?.querySelectorAll("[alt], [aria-label], title")).toHaveLength(0);

    const firstFamilies = [...first.querySelectorAll<HTMLElement>('[data-review-mode="unlabeled"] [data-review-family-id]')];
    const secondFamilies = [...second.querySelectorAll<HTMLElement>('[data-review-mode="unlabeled"] [data-review-family-id]')];
    const firstIds = firstFamilies.map((family) => family.dataset.reviewFamilyId);
    const secondIds = secondFamilies.map((family) => family.dataset.reviewFamilyId);

    expect(firstFamilies).toHaveLength(16 * 3);
    expect(firstIds).toEqual(secondIds);
    expect(new Set(firstIds)).toHaveLength(16);
    expect(firstIds).toEqual(expect.arrayContaining(["M98-F001", "M98-F016"]));
    expect(firstFamilies.slice(0, 16).map((family) => family.dataset.reviewFamilyId)).toEqual(
      firstFamilies.slice(16, 32).map((family) => family.dataset.reviewFamilyId),
    );
    for (const family of firstFamilies) {
      expect([...family.querySelectorAll<HTMLElement>("[data-review-grid]")].map((card) => card.dataset.reviewGrid))
        .toEqual(["16", "24", "32"]);
    }

    const blindText = blind?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    expect(blindText).toMatch(/^(?:M98-F\d{3}(?: \d{2}px){3} ?)+$/);
    expect(blind?.innerHTML).not.toMatch(/(?:masters\/|\.svg|docs\/)/i);
    for (const icon of manifest.icons) {
      expect(blindText.toLowerCase()).not.toContain(icon.id);
      expect(blindText.toLowerCase()).not.toContain(icon.group);
      expect(blindText.toLowerCase()).not.toContain(icon.intendedObject.toLowerCase());
    }
    rmSync(firstOutput.root, { recursive: true, force: true });
    rmSync(secondOutput.root, { recursive: true, force: true });
  });

  it("canonicalizes anonymous families before the seeded shuffle with complete tier mapping", () => {
    const entries = [
      { concept: "selected-work", grid: 32 },
      { concept: "start", grid: 24 },
      { concept: "start", grid: 16 },
      { concept: "start", grid: 32 },
      { concept: "selected-work", grid: 16 },
      { concept: "selected-work", grid: 24 },
    ];
    const identify = (items: typeof entries) => createBlindReviewFamilies(items)
      .map(({ familyId, concept, masters }) => `${familyId}:${concept}:${masters.map((master) => master.grid).join(",")}`);

    expect(identify(entries)).toEqual(identify([...entries].reverse()));
    const families = createBlindReviewFamilies(entries);
    expect(families).toHaveLength(2);
    expect(new Set(families.map((family) => family.concept))).toEqual(new Set(["start", "selected-work"]));
    expect(families.map((family) => family.masters.map((master) => master.grid))).toEqual([[16, 24, 32], [16, 24, 32]]);
    expect(createBlindReviewFamilyMapping(entries)).toEqual(createBlindReviewFamilyMapping([...entries].reverse()));

    const manifest = JSON.parse(readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"));
    const completeFamilies = createBlindReviewFamilies(
      manifest.icons.flatMap((icon: { id: string }) => ICON_GRIDS.map((grid) => ({ concept: icon.id, grid }))),
    );
    expect(completeFamilies).toHaveLength(16);
    expect(new Set(completeFamilies.map((family) => family.concept))).toEqual(new Set(manifest.icons.map((icon: { id: string }) => icon.id)));
    expect(completeFamilies.every((family) => family.masters.map((master) => master.grid).join(",") === "16,24,32")).toBe(true);
  });

  it("uses the single verified source snapshot for validation and embedding", () => {
    const root = mkdtempSync(join(tmpdir(), "myles98-contact-sheet-snapshot-"));
    const startPath = join(root, "docs/design-assets/myles98-icons/masters/start/start-16.svg");

    try {
      cpSync("docs/design-assets/myles98-icons", join(root, "docs/design-assets/myles98-icons"), { recursive: true });
      const verifiedStart = readFileSync(startPath, "utf8");
      let startReadCount = 0;
      const fsApi = {
        ...fileSystem,
        readFileSync(filePath: string, encoding: "utf8") {
          if (filePath === startPath) {
            startReadCount += 1;
            if (startReadCount > 1) return '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
          }
          return fileSystem.readFileSync(filePath, encoding);
        },
      } as unknown as typeof fileSystem;

      buildIconContactSheet({ root, fsApi });
      const html = readFileSync(join(root, outputPath), "utf8");

      expect(startReadCount).toBe(1);
      expect(html).toContain(verifiedStart);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("compares untouched artifact bytes with two temporary regenerations", () => {
    const committedBytes = readFileSync(outputPath, "utf8");
    const first = generateContactSheetInTemporaryRoot();
    const second = generateContactSheetInTemporaryRoot();

    expect(readFileSync(outputPath, "utf8")).toBe(committedBytes);
    expect(first.html).toBe(committedBytes);
    expect(second.html).toBe(committedBytes);
    expect(second.html).toBe(first.html);

    rmSync(first.root, { recursive: true, force: true });
    rmSync(second.root, { recursive: true, force: true });
  });

  it("stops before writing when any master fails validation", () => {
    const root = mkdtempSync(join(tmpdir(), "myles98-contact-sheet-"));
    const output = join(root, outputPath);

    try {
      cpSync("docs/design-assets/myles98-icons", join(root, "docs/design-assets/myles98-icons"), { recursive: true });
      rmSync(output, { force: true });
      writeFileSync(
        join(root, "docs/design-assets/myles98-icons/masters/start/start-16.svg"),
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"></svg>',
      );

      expect(() => buildIconContactSheet({ root })).toThrow(
        "INVALID docs/design-assets/myles98-icons/masters/start/start-16.svg",
      );
      expect(existsSync(output)).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

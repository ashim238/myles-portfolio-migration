import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ICON_GRIDS } from "../lib/myles98-icon-contract.mjs";
import { buildIconContactSheet } from "../build-myles98-icon-contact-sheet.mjs";

const outputPath = "docs/design-assets/myles98-icons/contact-sheet.html";
const generatorPath = "scripts/build-myles98-icon-contact-sheet.mjs";
const surfaceColors = {
  teal: "#008080",
  chrome: "#C0C0C0",
  white: "#FFFFFF",
};

function generateContactSheet() {
  execFileSync(process.execPath, [generatorPath], { stdio: "pipe" });
  return readFileSync(outputPath, "utf8");
}

function parse(html: string) {
  return new DOMParser().parseFromString(html, "text/html");
}

describe("Myles 98 icon contact sheet", () => {
  it("generates every verified master unchanged at native and nearest-neighbor magnification on three exact surfaces", () => {
    const html = generateContactSheet();
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
        expect(html.split(rawSvg)).toHaveLength(1 + 3 * 2 * 2);
        for (const card of cards) {
          expect(card.querySelectorAll('[data-render="native"][data-scale="1"]')).toHaveLength(1);
          expect(card.querySelectorAll('[data-render="magnified"][data-scale="6"]')).toHaveLength(1);
        }
      }
    }

    expect(html).toContain("image-rendering: pixelated");
    expect(html).toContain("image-rendering: crisp-edges");
  });

  it("keeps blind review IDs and shuffled order deterministic without visible semantic leakage", () => {
    const firstHtml = generateContactSheet();
    const secondHtml = generateContactSheet();
    const first = parse(firstHtml);
    const second = parse(secondHtml);
    const blind = first.querySelector<HTMLElement>('[data-review-mode="unlabeled"]');
    const manifest = JSON.parse(readFileSync("docs/design-assets/myles98-icons/manifest.json", "utf8"));

    expect(secondHtml).toBe(firstHtml);
    expect(blind).not.toBeNull();
    expect(blind?.querySelectorAll("[data-master]")).toHaveLength(0);
    expect(blind?.querySelectorAll("[alt], [aria-label], title")).toHaveLength(0);

    const firstCards = [...first.querySelectorAll<HTMLElement>('[data-review-mode="unlabeled"] [data-review-id]')];
    const secondCards = [...second.querySelectorAll<HTMLElement>('[data-review-mode="unlabeled"] [data-review-id]')];
    const firstIds = firstCards.map((card) => card.dataset.reviewId);
    const secondIds = secondCards.map((card) => card.dataset.reviewId);

    expect(firstCards).toHaveLength(48 * 3);
    expect(firstIds).toEqual(secondIds);
    expect(new Set(firstIds)).toHaveLength(48);
    expect(firstIds).toEqual(expect.arrayContaining(["M98-001", "M98-048"]));
    expect(firstCards.slice(0, 48).map((card) => card.dataset.reviewId)).toEqual(
      firstCards.slice(48, 96).map((card) => card.dataset.reviewId),
    );

    const blindText = blind?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    expect(blindText).toMatch(/^(?:M98-\d{3}(?: \d{2}px)? ?)+$/);
    expect(blind?.innerHTML).not.toMatch(/(?:masters\/|\.svg|docs\/)/i);
    for (const icon of manifest.icons) {
      expect(blindText.toLowerCase()).not.toContain(icon.id);
      expect(blindText.toLowerCase()).not.toContain(icon.group);
      expect(blindText.toLowerCase()).not.toContain(icon.intendedObject.toLowerCase());
    }
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

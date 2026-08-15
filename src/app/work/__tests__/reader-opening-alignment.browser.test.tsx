import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { ProjectOpeningFacts } from "@/components/project-opening-facts";

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/late-polish.css",
  "src/app/styles/myles-97.css",
  "src/app/styles/myles-97-secondary.css",
  "src/app/styles/reader-mode.css",
  "src/app/styles/reader-evidence.css",
  "src/app/styles/myles-97-pocket.css",
  "src/app/styles/myles-98-polish.css",
  "src/app/styles/myles-98-paper-contrast.css",
  "src/app/styles/accessibility-preferences.css",
  "src/app/styles/portfolio-surfaces.css",
]
  .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
  .join("\n");

const editorialOpenings = [
  { slug: "fresh-greens", pageClass: "fg-page", title: "Fresh Greens" },
  {
    slug: "understandingfafsa",
    pageClass: "uf-page",
    title: "UnderstandingFAFSA",
  },
  { slug: "navi", pageClass: "nv-page", title: "Navi" },
] as const;

const viewports = [
  { width: 768, height: 900 },
  { width: 1280, height: 900 },
] as const;

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

afterEach(() => {
  cleanup();
});

afterAll(async () => {
  await browser?.close();
}, 60_000);

function openingMarkup(pageClass: string, title: string) {
  const { container, unmount } = render(
    <main className={`page-shell project-page reader-mode ${pageClass}`}>
      <section className="hero project-hero">
        <p>Product design · 2025–2026</p>
        <h1 className="project-hero-title">{title}</h1>
        <p className="project-hero-lede">
          A concise description of the product and the people it supports.
        </p>
      </section>
      <ProjectOpeningFacts
        role="Product Designer"
        scope="Research, product strategy, and interface design."
        outcome="A working product prototype."
        proof={{ label: "Open the product proof", href: "#proof" }}
      />
    </main>,
  );
  const markup = container.innerHTML;
  unmount();
  return markup;
}

function tiktokOpeningMarkup() {
  const { container, unmount } = render(
    <main className="page-shell project-page reader-mode tt-page">
      <header className="tt-cover tt-cover--preview">
        <div className="tt-cover-inner">
          <p className="tt-eyebrow">Creative Strategist Intern · 2021</p>
          <h1 className="project-hero-title tt-title">
            TikTok Dynamic Showcase Ads
          </h1>
          <p className="project-hero-lede tt-lede">
            Three fashion catalog templates built from one fixed product grid.
          </p>
        </div>
      </header>
      <ProjectOpeningFacts
        role="Creative Strategist Intern"
        scope="Three catalog directions inside a fixed product grid."
        outcome="A template selected for the launch library."
        proof={{ label: "Inspect the template system", href: "#proof" }}
      />
    </main>,
  );
  const markup = container.innerHTML;
  unmount();
  return markup;
}

describe("Reader opening alignment", () => {
  it.each(editorialOpenings.flatMap((opening) =>
    viewports.map((viewport) => ({ ...opening, viewport })),
  ))(
    "keeps $slug hero, facts, and proof on one left-aligned column at $viewport.width px",
    async ({ pageClass, title, viewport }) => {
      const page = await browser.newPage({ viewport });
      await page.setContent(`<!doctype html>
        <html data-theme="light">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              *, *::before, *::after { box-sizing: border-box; }
              html, body { margin: 0; }
              ${styles}
            </style>
          </head>
          <body>${openingMarkup(pageClass, title)}</body>
        </html>`);

      const geometry = await page.evaluate(() => {
        const hero = document.querySelector<HTMLElement>(".project-hero");
        const facts = document.querySelector<HTMLElement>(
          ".project-opening-facts",
        );
        const title = document.querySelector<HTMLElement>(
          ".project-hero-title",
        );
        const proof = document.querySelector<HTMLElement>(
          ".project-opening-facts-action",
        );

        if (!hero || !facts || !title || !proof) {
          throw new Error("Missing Reader opening geometry");
        }

        const heroBox = hero.getBoundingClientRect();
        const factsBox = facts.getBoundingClientRect();
        const proofBox = proof.getBoundingClientRect();

        return {
          heroLeft: heroBox.left,
          heroRight: heroBox.right,
          factsLeft: factsBox.left,
          factsRight: factsBox.right,
          proofLeft: proofBox.left,
          proofRight: proofBox.right,
          titleAlign: getComputedStyle(title).textAlign,
        };
      });

      expect.soft(Math.abs(geometry.heroLeft - geometry.factsLeft)).toBeLessThanOrEqual(1);
      expect.soft(Math.abs(geometry.heroRight - geometry.factsRight)).toBeLessThanOrEqual(1);
      expect.soft(geometry.proofLeft).toBeGreaterThanOrEqual(geometry.factsLeft);
      expect.soft(geometry.proofRight).toBeLessThanOrEqual(geometry.factsRight);
      expect.soft(geometry.titleAlign).toBe("left");

      await page.close();
    },
  );

  it.each([
    { width: 390, height: 844 },
    ...viewports,
  ])(
    "keeps TikTok's art-directed text and facts on the shared opening column at $width px",
    async (viewport) => {
      const page = await browser.newPage({ viewport });
      await page.setContent(`<!doctype html>
        <html data-theme="light">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              *, *::before, *::after { box-sizing: border-box; }
              html, body { margin: 0; }
              ${styles}
            </style>
          </head>
          <body>${tiktokOpeningMarkup()}</body>
        </html>`);

      const geometry = await page.evaluate(() => {
        const heroText = document.querySelector<HTMLElement>(".tt-cover-inner");
        const facts = document.querySelector<HTMLElement>(
          ".project-opening-facts",
        );

        if (!heroText || !facts) {
          throw new Error("Missing TikTok opening geometry");
        }

        const heroBox = heroText.getBoundingClientRect();
        const factsBox = facts.getBoundingClientRect();
        return {
          heroLeft: heroBox.left,
          heroRight: heroBox.right,
          factsLeft: factsBox.left,
          factsRight: factsBox.right,
        };
      });

      expect.soft(Math.abs(geometry.heroLeft - geometry.factsLeft)).toBeLessThanOrEqual(1);
      expect.soft(Math.abs(geometry.heroRight - geometry.factsRight)).toBeLessThanOrEqual(1);

      await page.close();
    },
  );

  it("keeps each mobile FAFSA fact label close to its value", async () => {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await page.setContent(`<!doctype html>
      <html data-theme="light">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            *, *::before, *::after { box-sizing: border-box; }
            html, body { margin: 0; }
            ${styles}
          </style>
        </head>
        <body>${openingMarkup("uf-page", "UnderstandingFAFSA")}</body>
      </html>`);

    const gaps = await page.locator(".project-opening-facts-row").evaluateAll(
      (rows) =>
        rows.map((row) => {
          const label = row.querySelector("dt");
          const value = row.querySelector("dd");
          if (!label || !value) throw new Error("Missing project fact content");
          const labelBox = label.getBoundingClientRect();
          const valueBox = value.getBoundingClientRect();
          return valueBox.top - labelBox.bottom;
        }),
    );

    gaps.forEach((gap) => expect(gap).toBeLessThanOrEqual(8));
    await page.close();
  });
});

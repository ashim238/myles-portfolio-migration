import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium, type Browser, type Locator } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { HeatmapExplorer } from "@/components/navi";
import { RouteComparisonEvidence } from "@/components/fresh-greens/route-decision-evidence";
import { FigmaMailchimpPair, NewsletterComposer } from "@/components/understandingfafsa";
import { ProjectToc } from "@/components/project-toc";

const imports = [...readFileSync(resolve("src/app/globals.css"), "utf8").matchAll(/@import "\.\/(styles\/[^\"]+)"/g)];
const styles = [...imports.map(match => readFileSync(resolve("src/app", match[1]), "utf8")),
  readFileSync(resolve("src/app/styles/portfolio-surfaces.css"), "utf8")].join("\n");
const markup = renderToStaticMarkup(<>
  <main className="reader-mode fg-page">
    <ProjectToc sections={[{ id: "chapter", title: "Design", stage: "Build" }]} />
    <RouteComparisonEvidence />
  </main>
  <section className="reader-mode nv-page"><HeatmapExplorer /></section>
  <section className="reader-mode uf-page"><NewsletterComposer /><FigmaMailchimpPair /></section>
</>);
let browser: Browser;
beforeAll(async () => { browser = await chromium.launch(); });
afterAll(async () => { await browser?.close(); });

async function contrast(target: Locator, property: "color" | "stroke" = "color", background?: string) {
  return target.evaluate((el, options) => {
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, 1, 1);
    const ancestors: Element[] = [];
    for (let e: Element | null = el; e; e = e.parentElement) ancestors.unshift(e);
    for (const e of ancestors) {
      ctx.fillStyle = getComputedStyle(e).backgroundColor; ctx.fillRect(0, 0, 1, 1);
    }
    if (options.background) {
      ctx.fillStyle = getComputedStyle(document.querySelector(options.background)!).fill;
      ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = getComputedStyle(el).fill;
      ctx.fillRect(0, 0, 1, 1);
    }
    const bg = ctx.getImageData(0, 0, 1, 1).data;
    ctx.fillStyle = getComputedStyle(el)[options.property]; ctx.fillRect(0, 0, 1, 1);
    const fg = ctx.getImageData(0, 0, 1, 1).data;
    const lum = (rgb: Uint8ClampedArray) => Array.from(rgb).slice(0, 3).map(v => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
    return (Math.max(lum(bg), lum(fg)) + 0.05) / (Math.min(lum(bg), lum(fg)) + 0.05);
  }, { property, background });
}

for (const theme of ["light", "dark"]) for (const width of [375, 1440]) {
  describe(`Case-study visibility: ${theme}, ${width}px`, () => {
    it("keeps paper-backed labels, disabled arrows, and interactive map boundaries legible", async () => {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
      try {
        await page.setContent(`<html data-theme="${theme}"><head><style>${styles}</style></head><body>${markup}</body></html>`);
        for (const selector of [".uf-composer-preview-head .uf-composer-heading", ".uf-composer-weight", ".uf-figma-figure figcaption strong"]) {
          const elements = page.locator(selector);
          for (let i = 0; i < await elements.count(); i++) expect(await contrast(elements.nth(i)), selector).toBeGreaterThanOrEqual(4.5);
        }
        if (width === 375) expect(await contrast(page.locator(".project-toc-toggle .project-toc-num"))).toBeGreaterThanOrEqual(4.5);
        const arrow = page.locator(".fg-route-proof-controls button:disabled");
        expect(await arrow.evaluate(e => getComputedStyle(e).opacity)).toBe("1");
        expect(await contrast(arrow)).toBeGreaterThanOrEqual(3);
        const region = page.locator('.nv-heatmap-region[role="button"]').first();
        expect(await contrast(region, "stroke", ".nv-heatmap-silhouette")).toBeGreaterThanOrEqual(3);
        await region.hover();
        expect(await contrast(region, "stroke", ".nv-heatmap-silhouette")).toBeGreaterThanOrEqual(3);
        await region.evaluate(e => e.classList.add("nv-heatmap-region--active"));
        await page.mouse.move(0, 0);
        expect(await contrast(region, "stroke", ".nv-heatmap-silhouette")).toBeGreaterThanOrEqual(3);
        await page.keyboard.press("Tab");
        await region.focus();
        expect(await region.evaluate(e => getComputedStyle(e).strokeWidth)).toBe("2px");
        expect(await contrast(region, "stroke", ".nv-heatmap-silhouette")).toBeGreaterThanOrEqual(3);
      } finally { await page.close(); }
    });
  });
}

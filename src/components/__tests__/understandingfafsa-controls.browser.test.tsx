import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NewsletterComposer } from "@/components/understandingfafsa";

const styles = [
  "base", "portfolio-surfaces", "late-polish", "myles-97", "reader-mode",
  "myles-98-paper-contrast", "reader-controls", "accessibility-preferences",
].map(name => readFileSync(resolve(`src/app/styles/${name}.css`), "utf8")).join("\n");
let browser: Browser;

beforeAll(async () => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })));
  browser = await chromium.launch();
});
afterEach(() => cleanup());
afterAll(async () => { await browser?.close(); vi.unstubAllGlobals(); });

function contrast(a: number[], b: number[]) {
  const luminance = (rgb: number[]) => rgb.slice(0, 3).map(v => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const theme of ["light", "dark"]) {
  for (const width of [375, 1440]) {
    describe(`FAFSA composer controls: ${theme}, ${width}px`, () => {
      it("keeps icons readable at rest, on hover, and with keyboard focus", async () => {
        const view = render(<NewsletterComposer />);
        const markup = view.container.innerHTML;
        view.unmount();
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
        try {
          await page.setContent(`<html data-theme="${theme}"><head><style>${styles}</style></head>
            <body><main class="reader-mode uf-page">${markup}</main></body></html>`);
          const controls = page.locator(".uf-composer-item-controls").last();
          const enabled = controls.locator("button:not(:disabled)").first();
          const remove = controls.locator(".uf-composer-mini--remove");
          for (const state of ["rest", "hover", "remove-hover", "focus"] as const) {
            const target = state === "remove-hover" ? remove : enabled;
            if (state.includes("hover")) await target.hover();
            if (state === "focus") { await page.mouse.move(0, 0); await target.focus(); }
            const pixels = await target.evaluate(el => {
              const ctx = document.createElement("canvas").getContext("2d")!;
              const ancestors: Element[] = [];
              for (let node: Element | null = el; node; node = node.parentElement) ancestors.unshift(node);
              ctx.fillStyle = "white"; ctx.fillRect(0, 0, 1, 1);
              for (const node of ancestors) {
                ctx.fillStyle = getComputedStyle(node).backgroundColor; ctx.fillRect(0, 0, 1, 1);
              }
              const background = Array.from(ctx.getImageData(0, 0, 1, 1).data);
              ctx.fillStyle = getComputedStyle(el.querySelector("path")!).stroke; ctx.fillRect(0, 0, 1, 1);
              return { background, ink: Array.from(ctx.getImageData(0, 0, 1, 1).data),
                outline: getComputedStyle(el).outlineStyle,
                iconWidth: el.querySelector("svg")!.getBoundingClientRect().width,
                targetHeight: el.getBoundingClientRect().height };
            });
            expect(contrast(pixels.ink, pixels.background), state).toBeGreaterThanOrEqual(3);
            expect(pixels.iconWidth).toBe(16);
            expect(pixels.targetHeight).toBeGreaterThanOrEqual(width < 640 ? 44 : 24);
            if (state === "focus") expect(pixels.outline).not.toBe("none");
          }
          const disabled = controls.locator("button:disabled");
          await expect(disabled.count()).resolves.toBe(1);
          expect(await disabled.evaluate(el => getComputedStyle(el).opacity)).toBe("1");
          expect(await disabled.evaluate(el => getComputedStyle(el).color)).not.toBe(
            await enabled.evaluate(el => getComputedStyle(el).color),
          );
        } finally { await page.close(); }
      });
    });
  }
}

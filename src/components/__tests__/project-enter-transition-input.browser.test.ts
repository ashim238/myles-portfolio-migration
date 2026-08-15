import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const baseStyles = readFileSync(
  resolve(__dirname, "../../app/styles/base.css"),
  "utf8",
);

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
}, 60_000);

afterAll(async () => {
  await browser?.close();
});

describe("project transition input containment", () => {
  it("keeps pointer input on the full-screen overlay while Escape reaches the window", async () => {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    await page.setContent(`<!doctype html>
      <html>
        <head>
          <style>
            html, body { margin: 0; }
            #underlay { position: fixed; inset: 0; }
            ${baseStyles}
          </style>
        </head>
        <body>
          <div id="route-surface">
            <a id="skip" href="#underlay">Skip to route action</a>
            <button id="underlay" type="button">Underlying route action</button>
          </div>
          <div class="project-enter-overlay" aria-hidden="true">
            <div class="project-enter-backdrop"></div>
          </div>
        </body>
      </html>`);

    await page.evaluate(() => {
      const counts = { overlay: 0, underlay: 0, skip: 0, escape: 0 };
      Object.assign(window, { projectTransitionInputCounts: counts });
      document.querySelector(".project-enter-overlay")?.addEventListener("click", () => {
        counts.overlay += 1;
      });
      document.querySelector("#underlay")?.addEventListener("click", () => {
        counts.underlay += 1;
      });
      document.querySelector("#skip")?.addEventListener("click", () => {
        counts.skip += 1;
      });
      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") counts.escape += 1;
      });
    });

    await page.mouse.click(400, 300);
    await page.keyboard.press("Escape");
    await page.locator("#underlay").focus();
    await page.evaluate(() => {
      const surface = document.querySelector<HTMLElement>("#route-surface");
      if (!surface) return;
      surface.inert = true;
      surface.setAttribute("aria-hidden", "true");
    });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    const result = await page.evaluate(
      () =>
        ({
          counts: (window as typeof window & {
          projectTransitionInputCounts: {
            overlay: number;
            underlay: number;
            skip: number;
            escape: number;
          };
          }).projectTransitionInputCounts,
          activeId: document.activeElement?.id ?? "",
        }),
    );
    expect(result.counts).toEqual({ overlay: 1, underlay: 0, skip: 0, escape: 1 });
    expect(result.activeId).not.toBe("underlay");
    expect(result.activeId).not.toBe("skip");

    await page.close();
  }, 60_000);
});

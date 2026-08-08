import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const leadMedia = readFileSync(
  resolve(process.cwd(), "src/components/lead-media.tsx"),
  "utf8",
);
const naviDemo = readFileSync(
  resolve(process.cwd(), "src/components/navi-demo-embed.tsx"),
  "utf8",
);
const surfaces = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);
const tiktokStyles = readFileSync(
  resolve(
    process.cwd(),
    "src/app/work/tiktok/tiktok-four-beat.module.css",
  ),
  "utf8",
);

describe("Reader evidence responsive transformations", () => {
  it("reserves image geometry and gives the browser a responsive source hint", () => {
    expect(leadMedia).toContain("width={width}");
    expect(leadMedia).toContain("height={height}");
    expect(leadMedia).toContain(
      'sizes="(max-width: 760px) 100vw, min(90vw, 900px)"',
    );
  });

  it("turns the Navi analytical paths into a vertical mobile reading order", () => {
    expect(surfaces).toMatch(
      /@media \(max-width: 700px\)[\s\S]*?\.nv-research-journey,[\s\S]*?\.nv-research-booking\s*\{[\s\S]*?gap:\s*1rem;[\s\S]*?padding-top:\s*0;/,
    );
    expect(surfaces).toMatch(
      /@media \(max-width: 700px\)[\s\S]*?\.nv-research-route\s*\{[\s\S]*?margin:\s*1\.6rem 0 1rem 1rem;[\s\S]*?transform:\s*translateX\(-50%\) scaleY\(1\);/,
    );
    expect(surfaces).toMatch(
      /@media \(max-width: 1040px\) and \(min-width: 701px\)[\s\S]*?\.nv-research-route--booking\s*\{[\s\S]*?display:\s*none;/,
    );
  });

  it("uses a lazy desktop demo and a static mobile fallback", () => {
    expect(naviDemo).toContain('window.matchMedia("(min-width: 900px)")');
    expect(naviDemo).toContain('loading="lazy"');
    expect(naviDemo).toContain("{useIframe && !errored ? (");
    expect(naviDemo).toContain("fallbackImage");
    expect(naviDemo).toContain('width={2275}');
    expect(naviDemo).toContain('height={1517}');
  });

  it("stacks the TikTok selection proof instead of squeezing three columns", () => {
    expect(tiktokStyles).toMatch(
      /@media \(max-width: 639px\)[\s\S]*?\.directionGrid\s*\{[\s\S]*?grid-template-columns:\s*1fr;/,
    );
    expect(tiktokStyles).toMatch(
      /@media \(max-width: 639px\)[\s\S]*?\.directionProof > figcaption\s*\{[\s\S]*?flex-direction:\s*column;/,
    );
  });
});

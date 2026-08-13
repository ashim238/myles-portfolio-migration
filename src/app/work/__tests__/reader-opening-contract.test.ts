import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type RouteOpening = {
  route: string;
  proofName: string;
  proofLabel: string;
  proofHref: string;
  opening: string;
  openingClose: string;
  dominantMedia: string;
};

const routes: RouteOpening[] = [
  {
    route: "fresh-greens",
    proofName: "freshGreensProof",
    proofLabel: "Try the safety-flow reconstruction",
    proofHref: "#fg-pulled-over",
    opening: '<section className="hero project-hero fg-hero"',
    openingClose: "</section>",
    dominantMedia: "<LeadMedia",
  },
  {
    route: "navi",
    proofName: "naviProof",
    proofLabel: "Try the booking flow",
    proofHref: "/work/navi/demo",
    opening: '<section className="hero project-hero nv-hero"',
    openingClose: "</section>",
    dominantMedia: "<LeadMedia",
  },
  {
    route: "understandingfafsa",
    proofName: "understandingFafsaProof",
    proofLabel: "Build a sample send",
    proofHref: "#uf-locked",
    opening: '<section className="hero project-hero uf-hero"',
    openingClose: "</section>",
    dominantMedia: "<LeadMedia",
  },
  {
    route: "tiktok",
    proofName: "tiktokProof",
    proofLabel: "Inspect the template system",
    proofHref: "#tt-system",
    opening: "data-project-enter-cover",
    openingClose: "</header>",
    dominantMedia: "<RecruiterCut",
  },
];

function sourceFor(route: string): string {
  return readFileSync(
    resolve(process.cwd(), `src/app/work/${route}/page.tsx`),
    "utf8",
  );
}

describe("Reader opening route contract", () => {
  it.each(routes)(
    "places $route facts after the opening and before dominant media without replacing RecruiterCut",
    ({ route, opening, openingClose, dominantMedia }) => {
      const source = sourceFor(route);
      const openingStart = source.indexOf(opening);
      const openingEnd = source.indexOf(openingClose, openingStart) + openingClose.length;
      const facts = source.indexOf("<ProjectOpeningFacts");
      const media = source.indexOf(dominantMedia, facts);
      const recruiterCut = source.indexOf("<RecruiterCut", facts);

      expect(openingStart).toBeGreaterThanOrEqual(0);
      expect(openingEnd).toBeGreaterThan(openingStart);
      expect(facts).toBeGreaterThan(openingEnd);
      expect(media).toBeGreaterThan(facts);
      expect(recruiterCut).toBeGreaterThan(facts);
    },
  );

  it.each(routes)(
    "keeps $route proof values canonical in the opening facts",
    ({ route, proofName, proofLabel, proofHref }) => {
      const source = sourceFor(route);

      expect(source).toContain(`const ${proofName} = {`);
      expect(source).toContain(`proof={${proofName}}`);
      expect(source).toMatch(
        new RegExp(
          `const ${proofName} = \\{[\\s\\S]*label: "${proofLabel}",[\\s\\S]*href: "${proofHref}",`,
        ),
      );
    },
  );

  it("removes the redundant in-body breadcrumb at every Reader viewport", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/app/styles/reader-mode.css"),
      "utf8",
    );
    const mobileBoundary = styles.indexOf("@media (max-width: 767px)");
    const allViewportStyles = styles.slice(0, mobileBoundary);

    expect(mobileBoundary).toBeGreaterThan(0);
    expect(allViewportStyles).toMatch(
      /\.reader-mode\.reader-mode \.project-topbar\s*\{\s*display:\s*none;/,
    );
    expect(styles.match(/\.reader-mode\.reader-mode \.project-topbar\s*\{\s*display:\s*none;/g)).toHaveLength(1);
  });

  it("keeps TikTok's art-directed opening compact enough for the locked first folds", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
      "utf8",
    );

    expect(styles).toMatch(
      /\.reader-mode\.reader-mode\.tt-page \.tt-cover--preview\s*\{[\s\S]*?min-height:\s*26rem;[\s\S]*?margin-top:\s*1rem;[\s\S]*?margin-bottom:\s*1rem;/,
    );
    expect(styles).toMatch(
      /@media \(min-width: 1200px\)\s*\{[\s\S]*?\.reader-mode\.reader-mode\.tt-page \.tt-cover--preview\s*\{[\s\S]*?min-height:\s*30rem;/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 767px\)\s*\{[\s\S]*?\.reader-mode\.reader-mode\.tt-page \.tt-cover--preview\s*\{[\s\S]*?min-height:\s*25rem;[\s\S]*?margin-top:\s*0\.5rem;[\s\S]*?margin-bottom:\s*0\.5rem;/,
    );
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode\.tt-page \.project-opening-facts-list\s*\{[\s\S]*?gap:\s*0\.4rem;/,
    );
  });

  it("keeps Navi's full opening summary clear of the mobile chapter control", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
      "utf8",
    );

    expect(styles).toMatch(
      /@media \(max-width: 767px\)\s*\{\s*\.reader-mode\.reader-mode\.nv-page \.project-opening-facts\s*\{[\s\S]*?margin-block:\s*1rem;[\s\S]*?padding-block:\s*0\.75rem;[\s\S]*?\}\s*\.reader-mode\.reader-mode\.nv-page \.project-opening-facts-list\s*\{[\s\S]*?gap:\s*0\.5rem;/,
    );
  });

  it("keeps Navi's hero and opening facts on one font-independent axis", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
      "utf8",
    );

    expect(styles).toMatch(
      /\.reader-mode\.reader-mode\.nv-page :is\(\s*\.project-hero,\s*\.project-opening-facts\s*\)\s*\{[^}]*width:\s*min\(100% - 32px, 48rem\);[^}]*margin-inline:\s*auto;/,
    );
  });

  it("keeps the rendered evidence matrix accountable for every locked Reader fold", () => {
    const reviewScript = readFileSync(
      resolve(process.cwd(), "scripts/capture-reader-evidence-review.mjs"),
      "utf8",
    );

    expect(reviewScript).toContain(
      "tabletPocket: { width: 1024, height: 768 }",
    );
    expect(reviewScript).toContain(
      "tabletWorkstation: { width: 1025, height: 768 }",
    );
    expect(reviewScript).toContain(
      "coarseTablet: { width: 1024, height: 768, hasTouch: true }",
    );
    expect(reviewScript).toContain("READER_EVIDENCE_REVIEW_VIEWPORTS");
    expect(reviewScript).toContain("must select at least one viewport");
    expect(reviewScript).toContain("must not contain duplicate viewports");
    expect(reviewScript).toContain("contains unknown theme value(s)");
    expect(reviewScript).toContain("must not contain duplicate themes");
    expect(reviewScript).toContain("openingFacts");
    expect(reviewScript).toMatch(
      /openingFactsBlock[\s\S]*?getBoundingClientRect\(\)/,
    );
    expect(reviewScript).toContain("route.metrics.openingFactsBlock");
    expect(reviewScript).toContain("firstFoldLimit");
    expect(reviewScript).toContain("openingFailures");
    expect(reviewScript).toContain("actual clearance");
    expect(reviewScript).toContain("required ${MIN_OPENING_FOLD_GAP}px");
    expect(reviewScript).toContain(
      'const requiredOpeningFacts = ["Role", "Scope", "Outcome", "Proof"];',
    );
    expect(reviewScript).toContain("textContrastFailures");
    expect(reviewScript).toContain("effectiveOpacity");
    expect(reviewScript).toMatch(
      /rawForeground\[3\][\s\S]*effectiveOpacity/,
    );
    expect(reviewScript).toContain("element instanceof SVGTextElement");
    expect(reviewScript).toContain("style.fill");
    expect(reviewScript).toContain('element.getAttribute("class")');
    expect(reviewScript).toContain("undersizedTargets");
    expect(reviewScript).toContain("associatedLabel");
    expect(reviewScript).toContain("effectiveTargetBox");
    expect(reviewScript).toContain("focusIndicatorFailures");
    expect(reviewScript).toContain("data-reader-focus-audit");
    expect(reviewScript).toContain("transition: none !important");
    expect(reviewScript).toContain("element.focus({ preventScroll: true })");
    expect(reviewScript).toContain("outlineColor");
    expect(reviewScript).toContain("focusIndicatorClipped");
    expect(reviewScript).toContain("Text contrast");
    expect(reviewScript).toContain("44px coarse-pointer target");
    expect(reviewScript).toContain("3:1 focus indicator");
  });

  it("audits every public Navi proof surface directly instead of stopping at the Reader iframe", () => {
    const reviewScript = readFileSync(
      resolve(process.cwd(), "scripts/capture-reader-evidence-review.mjs"),
      "utf8",
    );

    const directSurfaces = [
      "/work/navi/demo",
      "/work/navi/demo/search",
      "/work/navi/demo/host",
      "/work/navi/demo/host/paul-stein",
      "/work/navi/demo/impact",
      "/work/navi/system",
      "/work/navi/demo/neighborhood/park-slope",
      "/work/navi/demo/experience/prospect-park-carriage",
    ];

    for (const path of directSurfaces) {
      expect(reviewScript).toContain(`path: "${path}"`);
    }
    expect(reviewScript).toContain("openingFactsRequired: false");
    expect(reviewScript).toContain('viewportNames: ["desktop", "coarseTablet", "pocket"]');
    expect(reviewScript).toContain("route.openingFactsRequired === false");
    expect(reviewScript).toContain("route.viewportNames.includes(viewportName)");
  });
});

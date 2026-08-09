import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);
const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);
const polishStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);
const freshGreensComponents = readFileSync(
  resolve(process.cwd(), "src/components/fresh-greens.tsx"),
  "utf8",
);

function declarationBlock(selector: string, source = styles) {
  const stack: { header: string; openBrace: number }[] = [];
  let lastBoundary = 0;

  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === "{") {
      const header = source
        .slice(lastBoundary, index)
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .trim();
      stack.push({ header, openBrace: index });
      lastBoundary = index + 1;
    } else if (source[index] === "}") {
      const frame = stack.pop();
      if (
        frame?.header
          .split(",")
          .map((part) => part.trim())
          .includes(selector)
      ) {
        return source.slice(frame.openBrace + 1, index);
      }
      lastBoundary = index + 1;
    }
  }

  return "";
}

function declarationBlocks(selector: string, source = styles) {
  const blocks: string[] = [];
  const stack: { header: string; openBrace: number }[] = [];
  let lastBoundary = 0;

  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === "{") {
      const header = source
        .slice(lastBoundary, index)
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .trim();
      stack.push({ header, openBrace: index });
      lastBoundary = index + 1;
    } else if (source[index] === "}") {
      const frame = stack.pop();
      if (frame?.header === selector) {
        blocks.push(source.slice(frame.openBrace + 1, index));
      }
      lastBoundary = index + 1;
    }
  }

  return blocks;
}

describe("portfolio artifact accessibility styles", () => {
  it("keeps case-study sections and headings visible before motion runs", () => {
    const sectionReveal = declarationBlock(
      ".project-page .project-section",
      polishStyles,
    );
    const headingReveal = declarationBlock(
      ".project-section > h2",
      polishStyles,
    );
    const chapterReveal = declarationBlock(".project-chapter", polishStyles);
    const chapterTitleReveal = declarationBlock(
      ".project-chapter-title",
      polishStyles,
    );
    const evidenceHeadingReveal = declarationBlock(
      ".project-evidence-heading",
      polishStyles,
    );
    const motifReveal = declarationBlock(".project-chapter-motif", polishStyles);
    const motifLine = declarationBlock(".project-chapter-motif-line", baseStyles);
    const motifAccent = declarationBlock(
      ".project-chapter-motif-line::after",
      baseStyles,
    );

    expect(sectionReveal).not.toContain("opacity: 0");
    expect(sectionReveal).not.toMatch(/transform:\s*translate/);
    expect(headingReveal).not.toContain("opacity: 0");
    expect(headingReveal).not.toContain("clip-path: inset(0 100%");
    for (const block of [
      chapterReveal,
      chapterTitleReveal,
      evidenceHeadingReveal,
      motifReveal,
    ]) {
      expect(block).not.toContain("opacity: 0");
      expect(block).not.toContain("clip-path: inset(0 100%");
    }
    expect(motifLine).toContain("background: var(--line)");
    expect(motifAccent).toContain("background: var(--chapter-motif-accent)");
    expect(polishStyles).toMatch(
      /@media print[\s\S]*?\.project-page \.project-section,[\s\S]*?\.project-section > h2[\s\S]*?opacity: 1 !important;[\s\S]*?transform: none !important;/,
    );
  });

  it("keeps the TikTok reveal without adding a decorative wash to the FAFSA preview", () => {
    const tiktokFinal = declarationBlock(".tt-preview-final");
    const fafsaPreview = declarationBlock(".uf-switcher-preview");

    expect(tiktokFinal).not.toContain("opacity: 0");
    expect(tiktokFinal).not.toContain("clip-path: inset(0 100%");
    expect(fafsaPreview).not.toContain("opacity: 0");
    expect(fafsaPreview).not.toContain("clip-path: inset(0 100%");
    expect(styles).toMatch(
      /\.tt-preview-final::after[\s\S]*?background:[\s\S]*?animation:/,
    );
    expect(styles).toMatch(
      /@supports \(animation-timeline: view\(\)\)[\s\S]*?\.tt-preview-final::after[\s\S]*?animation-timeline: view\(\)/,
    );
    expect(styles).toMatch(
      /@supports not \(animation-timeline: view\(\)\)[\s\S]*?\.tt-preview-final::after[\s\S]*?display: none/,
    );
    expect(styles).not.toContain(".uf-switcher-preview::after");
    expect(styles).not.toContain("@keyframes uf-template-sweep");
  });

  it("applies the dedicated mobile TikTok cover coordinates", () => {
    expect(baseStyles).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.tt-cover--preview \.tt-cblob\s*\{[\s\S]*?left: var\(--tt-preview-mobile-x\) !important;[\s\S]*?top: var\(--tt-preview-mobile-y\) !important;/,
    );
  });

  it("preserves the tall FAFSA preview bottom-fade mask", () => {
    const tallPreview = declarationBlock(".uf-switcher-preview--scroll");

    expect(tallPreview).toContain("-webkit-mask-image: linear-gradient(");
    expect(tallPreview).toContain("mask-image: linear-gradient(");
    expect(tallPreview).toContain("calc(100% - 36px)");
  });

  it("keeps the mobile TOC title inside a resilient ellipsis boundary", () => {
    const activeTitle = declarationBlock(
      ".project-toc-active-title",
      baseStyles,
    );

    expect(activeTitle).toContain("min-width: 0");
    expect(activeTitle).toContain("overflow: hidden");
    expect(activeTitle).toContain("text-overflow: ellipsis");
    expect(activeTitle).toContain("white-space: nowrap");
  });

  it("scopes the TikTok cyan and magenta channel split to its case study", () => {
    expect(declarationBlock(".tt-page", baseStyles)).toContain(
      "--toc-accent: var(--tt-cyan)",
    );
    expect(
      declarationBlock(
        ".tt-page .project-toc-item:nth-child(odd)",
        polishStyles,
      ),
    ).toContain("--seg-color: var(--tt-cyan)");
    expect(
      declarationBlock(
        ".tt-page .project-toc-item:nth-child(even)",
        polishStyles,
      ),
    ).toContain("--seg-color: var(--tt-magenta)");
    expect(
      declarationBlock(".tt-page .project-toc-rail::after", polishStyles),
    ).toContain("background: var(--seg-color, var(--toc-fill))");
    expect(
      declarationBlock(
        ".tt-page .project-toc-link--active .project-toc-dot",
        polishStyles,
      ),
    ).toContain("background: var(--seg-color, var(--toc-fill))");
    const mobileProgress = declarationBlock(
      ".tt-page .project-toc-progress",
      polishStyles,
    );
    expect(mobileProgress).toContain("var(--tt-cyan)");
    expect(mobileProgress).toContain("var(--tt-magenta)");
    for (const segment of [
      "var(--tt-cyan) 0% 25%",
      "var(--tt-magenta) 25% 50%",
      "var(--tt-cyan) 50% 75%",
      "var(--tt-magenta) 75% 100%",
    ]) {
      expect(mobileProgress).toContain(segment);
    }
  });

  it("scopes Navi route rails and waypoint dots to its accent", () => {
    expect(
      declarationBlock(".nv-page .project-toc-rail::after", polishStyles),
    ).toContain("background: var(--nv-accent)");
    expect(
      declarationBlock(".nv-page .project-toc-dot", polishStyles),
    ).toContain("border: 1px solid var(--nv-accent)");
    expect(
      declarationBlock(
        ".nv-page .project-toc-link--active .project-toc-dot",
        polishStyles,
      ),
    ).toContain("background: var(--nv-accent)");
    expect(
      declarationBlock(".nv-page .project-toc-progress", polishStyles),
    ).toContain("background: var(--nv-accent)");
  });

  it("scopes the FAFSA modular palette to segments, dots, and mobile progress", () => {
    const expectedSegments = [
      "var(--uf-accent-warm)",
      "var(--uf-accent-highlight)",
      "var(--uf-accent-cool-text)",
      "var(--uf-accent-warm)",
      "var(--uf-accent-highlight)",
    ];

    expectedSegments.forEach((segment, index) => {
      expect(
        declarationBlock(
          `.uf-page .project-toc-item:nth-child(${index + 1})`,
          polishStyles,
        ),
      ).toContain(`--seg-color: ${segment}`);
    });
    expect(
      declarationBlock(
        ".uf-page .project-toc-item:nth-child(6)",
        polishStyles,
      ),
    ).toBe("");
    expect(
      declarationBlock(
        ".uf-page .project-toc-item:nth-child(7)",
        polishStyles,
      ),
    ).toBe("");
    expect(
      declarationBlock(".uf-page .project-toc-rail::after", polishStyles),
    ).toContain("background: var(--seg-color, var(--toc-fill))");
    expect(
      declarationBlock(
        ".uf-page .project-toc-link--active .project-toc-dot",
        polishStyles,
      ),
    ).toContain("background: var(--seg-color, var(--toc-fill))");
    const mobileProgress = declarationBlock(
      ".uf-page .project-toc-progress",
      polishStyles,
    );
    for (const segment of expectedSegments) {
      expect(mobileProgress).toContain(segment);
    }
    expect(mobileProgress).toContain("0% 20%");
    expect(mobileProgress).toContain("80% 100%");
  });

  it("uses readable text colors instead of raw decorative accents", () => {
    expect(declarationBlock(".specimen-status")).toContain("color: #e06f6f");
    expect(
      declarationBlock(':root[data-theme="light"] .specimen-status'),
    ).toContain("color: #962f2f");
    expect(declarationBlock(".nv-trust-label")).toContain("color: #ff9b68");
    expect(
      declarationBlock(':root[data-theme="light"] .nv-trust-label'),
    ).toContain("color: #b04410");
    expect(declarationBlock(".nv-page .nv-specimen-label")).toContain("color: #281208");
    expect(declarationBlock(".uf-chip--active")).toContain("color: #ff956e");
    expect(
      declarationBlock(':root[data-theme="light"] .uf-chip--active'),
    ).toContain("color: #b84410");
  });

  it("separates the FAFSA decorative orange from contrast-safe text and fill tokens", () => {
    expect(declarationBlock(".uf-page")).toContain(
      "--uf-accent-warm-text: #ff956e",
    );
    expect(declarationBlock(".uf-page")).toContain(
      "--uf-accent-warm-fill: #b84410",
    );
    expect(
      declarationBlock(':root[data-theme="light"] .uf-page'),
    ).toContain("--uf-accent-warm-text: #b84410");
    expect(declarationBlock(".uf-composer-weight--over")).toContain(
      "color: var(--uf-accent-warm-text)",
    );
    expect(declarationBlock(".uf-composer-shelf-add")).toContain(
      "background: var(--uf-accent-warm-fill)",
    );
  });

  it("gives the interactive artifact controls a 44px mobile target", () => {
    expect(declarationBlock(".tt-template-choice")).toContain("min-height: 44px");
    expect(declarationBlock(".tt-template-regions button")).toContain(
      "min-height: 44px",
    );
    expect(styles).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.uf-chip,[\s\S]*?\.uf-segment,[\s\S]*?\.uf-composer-btn,[\s\S]*?\.uf-lock-palette-swatch\s*\{\s*min-height: 44px;/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.uf-lock-palette-swatch\s*\{\s*min-width: 44px;/,
    );
    expect(styles).not.toMatch(/\.uf-composer-mini::before/);
    expect(styles).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.uf-composer-mini\s*\{[\s\S]*?width: 2\.75rem;[\s\S]*?height: 2\.75rem;/,
    );
  });

  it("aligns the FAFSA composer chrome without shrinking its actions", () => {
    expect(declarationBlock(".uf-composer-toolbar")).toContain(
      "align-items: center",
    );
    expect(declarationBlock(".uf-composer-preview-head")).toContain(
      "align-items: center",
    );
    expect(
      declarationBlock(".uf-composer-preview-head .uf-composer-heading"),
    ).toContain("margin-bottom: 0");
    expect(declarationBlock(".uf-composer-shelf-btn")).toContain(
      "grid-template-columns: 3.25rem minmax(0, 1fr) auto",
    );
    expect(declarationBlock(".uf-composer-btn")).toContain("min-height: 44px");
  });

  it("gives coarse pointers 44px controls independent of viewport width", () => {
    expect(styles).toMatch(
      /@media \(pointer: coarse\), \(any-pointer: coarse\)[\s\S]*?\.color-swatch,[\s\S]*?\.fg-synth-tab,[\s\S]*?\.fg-pulled-tab,[\s\S]*?\.project-toc-link\s*\{[\s\S]*?min-height: 44px;/,
    );
    expect(styles).toMatch(
      /@media \(pointer: coarse\), \(any-pointer: coarse\)[\s\S]*?\.color-swatch\s*\{[\s\S]*?min-width: 44px;/,
    );
  });

  it("keeps pullquotes centered and contrast-critical labels fully opaque", () => {
    const pullquote = declarationBlock(".fg-pullquote");
    const pullquoteCaption = declarationBlock(".fg-pullquote figcaption");
    const paletteRole = declarationBlock(".fg-palette-role");
    const tocNumber = declarationBlock(".project-page .project-toc-num");

    expect(pullquote).toContain("margin: 3rem auto");
    expect(pullquote).toContain("padding-left: 0");
    expect(pullquote).toContain("border: 0");
    expect(pullquote).toContain("text-align: center");
    expect(pullquoteCaption).toContain("text-transform: none");
    expect(paletteRole).toContain("opacity: 1");
    expect(tocNumber).toContain("opacity: 1");
  });

  it("names and focuses both Fresh Greens architecture scroll regions", () => {
    const scrollRegions = freshGreensComponents.match(
      /className="fg-arch-scroll"[\s\S]{0,180}?role="region"[\s\S]{0,100}?tabIndex=\{0\}[\s\S]{0,180}?aria-label=/g,
    );

    expect(scrollRegions).toHaveLength(2);
  });

  it("art-directs Navi research artifacts across mobile and reduced-motion states", () => {
    const route = declarationBlock(".nv-research-route");
    const artifacts = declarationBlock(".nv-research-artifacts");
    const researchBoard = declarationBlock(".nv-research-board");
    const archetypeSheet = declarationBlock(
      ".nv-research-archetypes > li",
    );
    const costReview = declarationBlock(
      '.nv-research-booking > li[data-decision-point="cost-review"]',
    );
    const pendingArtifactReveal = declarationBlock(
      ".nv-page[data-nv-anim-ready] .nv-research-artifacts.nv-reveal:not(.nv-reveal--visible)",
    );
    const mobileStyles = declarationBlocks("@media (max-width: 700px)").join(
      "\n",
    );
    const reducedMotionStyles = declarationBlocks(
      "@media (prefers-reduced-motion: reduce)",
    ).join("\n");

    expect(route).toContain("transform-origin: left center");
    expect(route).toContain("transform: scaleX(1)");
    expect(declarationBlock(".nv-research-journey", mobileStyles)).toContain(
      "grid-template-columns: 1fr",
    );
    expect(declarationBlock(".nv-research-booking", mobileStyles)).toContain(
      "grid-template-columns: 1fr",
    );
    expect(
      declarationBlock(".nv-research-route", reducedMotionStyles),
    ).toContain("animation: none");
    expect(pendingArtifactReveal).toContain("opacity: 1");
    expect(pendingArtifactReveal).toContain("transform: none");
    expect(artifacts).not.toMatch(/overflow-x:\s*(auto|scroll)/);
    expect(researchBoard).toContain("gap: clamp(2rem, 4vw, 3.25rem)");
    expect(styles).toContain(
      "grid-template-columns: repeat(5, minmax(8.5rem, 1fr))",
    );
    expect(styles).toContain("@media (max-width: 1040px) and (min-width: 701px)");
    expect(researchBoard).toContain(
      "border: 1px solid var(--nv-research-board-line)",
    );
    expect(researchBoard).toContain(
      "background: var(--nv-research-board-surface)",
    );
    expect(researchBoard).toContain("color: var(--nv-research-board-ink)");
    expect(researchBoard).toContain("border-radius: var(--rounded-md)");
    expect(archetypeSheet).not.toContain("box-shadow");
    expect(costReview).not.toContain("box-shadow");
    expect(styles).toMatch(
      /@media \(hover: hover\) and \(prefers-reduced-motion: no-preference\)[\s\S]*?\.nv-research-archetypes > li:hover\s*\{[\s\S]*?transform:\s*rotate\(0\) translateY\(-0\.18rem\)/,
    );
    expect(declarationBlock(".nv-research-board", mobileStyles)).toContain(
      "padding:",
    );
  });
});

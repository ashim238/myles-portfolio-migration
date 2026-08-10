import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  CompositionStrip,
  HeuristicInsightCards,
  SurveyStatRings,
} from "@/components/navi";
import { NAVI_HEURISTIC_INSIGHTS } from "@/lib/navi-heuristic-data";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

describe("Navi artifact layout", () => {
  it("uses native list semantics for heuristic evidence", () => {
    const { container } = render(<HeuristicInsightCards />);
    const list = container.querySelector("ul.nv-heuristic");

    expect(list).not.toBeNull();
    expect(list?.children).toHaveLength(NAVI_HEURISTIC_INSIGHTS.length);
    for (const item of list?.children ?? []) {
      expect(item.tagName).toBe("LI");
    }
    expect(styles).toMatch(
      /\.nv-heuristic\s*\{[^}]*margin: 2rem 0 0;[^}]*padding: 0;[^}]*list-style: none;/,
    );
  });

  it("centers each survey value against its ring independently of the caption", () => {
    const { container } = render(<SurveyStatRings />);

    for (const ring of container.querySelectorAll(".nv-ring")) {
      const plot = ring.querySelector(".nv-ring-plot");
      expect(plot).not.toBeNull();
      expect(plot?.querySelector(".nv-ring-svg")).not.toBeNull();
      expect(plot?.querySelector(".nv-ring-center")).not.toBeNull();
    }

    expect(styles).toMatch(
      /\.nv-ring-plot\s*\{[^}]*display: grid;[^}]*place-items: center;/,
    );
    expect(styles).not.toMatch(
      /\.nv-ring-center\s*\{[^}]*position: absolute;/,
    );
    expect(styles).not.toMatch(/\.nv-ring-center\s*\{[^}]*padding-bottom:/);
  });

  it("keeps composition-card feedback flat and restrained", () => {
    expect(styles).not.toMatch(
      /\.nv-composition-cards\s*\{[^}]*perspective:/,
    );
    expect(styles).toMatch(
      /\.nv-composition-card:hover\s*\{[^}]*transform: translateY\(-2px\);[^}]*border-color: var\(--nv-accent-line\);[^}]*background:/,
    );
    expect(styles).not.toMatch(
      /\.nv-composition-card:hover\s*\{[^}]*box-shadow:/,
    );
  });

  it("owns readable heuristic-card colors independently of the surrounding theme", () => {
    expect(styles).toMatch(
      /\.nv-heuristic\s*\{[^}]*--nv-heuristic-surface:\s*#161416;[^}]*--nv-heuristic-ink:\s*#f4f4f4;[^}]*--nv-heuristic-muted:\s*#c4c4c4;[^}]*--nv-heuristic-line:\s*#6b6870;/,
    );
    expect(styles).toMatch(
      /\.nv-heuristic-card\s*\{[^}]*border:\s*1px solid var\(--nv-heuristic-line\);[^}]*background:\s*var\(--nv-heuristic-surface\);[^}]*color:\s*var\(--nv-heuristic-ink\);/,
    );
    expect(styles).toMatch(
      /\.nv-heuristic-card h3\s*\{[^}]*color:\s*var\(--nv-heuristic-ink\);/,
    );
    expect(styles).toMatch(
      /\.nv-heuristic-card p\s*\{[^}]*color:\s*var\(--nv-heuristic-muted\);/,
    );
  });

  it("keeps the Navi specimen grounded in inspectable neighborhood context", () => {
    const { container } = render(<CompositionStrip />);

    expect(container).toHaveTextContent("Plan with the neighborhood in view");
    expect(container).toHaveTextContent(
      "Dim sum counters and tea shops, with context beyond star ratings.",
    );
    expect(container).not.toHaveTextContent("curated by residents");
    expect(container).not.toHaveTextContent("gives back");
  });

  it("uses direct evaluator language in the Airbnb findings", () => {
    expect(NAVI_HEURISTIC_INSIGHTS[0].body).toBe(
      "Nearly every listing we reviewed carried the badge, but we couldn't see consistent criteria. That made it less useful as a quick decision signal.",
    );
  });

  it("keeps the mobile research route in a dedicated gutter beside the cards", () => {
    const mobile = styles.slice(styles.indexOf("@media (max-width: 700px)"));

    expect(mobile).toMatch(
      /\.nv-research-artifact\s*\{[^}]*--nv-mobile-rail-x:\s*1rem;[^}]*--nv-mobile-rail-gutter:\s*2\.75rem;/,
    );
    expect(mobile).toMatch(
      /\.nv-research-journey,\s*\.nv-research-booking\s*\{[^}]*padding-left:\s*var\(--nv-mobile-rail-gutter\);/,
    );
    expect(mobile).toMatch(
      /\.nv-research-journey > li,\s*\.nv-research-booking > li\s*\{[^}]*padding:\s*1rem;/,
    );
    expect(mobile).toMatch(
      /\.nv-research-journey > li::before,\s*\.nv-research-booking > li::before\s*\{[^}]*left:\s*calc\(var\(--nv-mobile-rail-x\) - var\(--nv-mobile-rail-gutter\)\);/,
    );
  });

  it("keeps paper-backed Navi artifacts independent of the surrounding theme", () => {
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode\.nv-page\s*\{[^}]*--nv-ink:\s*#4a414d;[^}]*--nv-accent-text:\s*#9f3f0d;[^}]*--nv-ui-bg:\s*#ffffff;/,
    );
    expect(styles).toMatch(
      /:root\[data-theme="dark"\] \.reader-mode\.reader-mode\.nv-page :is\([\s\S]*?\.nv-composition-strip,[\s\S]*?\.nv-composition-card[\s\S]*?\)\s*\{[^}]*--nv-ui-bg:\s*#ffffff;/,
    );
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode\.nv-page \.nv-system-cta-link\s*\{[^}]*background:\s*#c4541a;[^}]*color:\s*#ffffff;/,
    );
  });
});

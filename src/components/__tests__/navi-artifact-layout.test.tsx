import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SurveyStatRings } from "@/components/navi";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

describe("Navi artifact layout", () => {
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
});

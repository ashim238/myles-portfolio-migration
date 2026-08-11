import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const designDocument = readFileSync(resolve(process.cwd(), "DESIGN.md"), "utf8");
const designSidecar = JSON.parse(
  readFileSync(resolve(process.cwd(), ".impeccable/design.json"), "utf8"),
) as {
  extensions: {
    radiusMeta?: Record<
      string,
      { value: string; scope: string; prohibitedMisuse: string }
    >;
  };
  narrative: {
    rules: Array<{ name: string; body: string; section: string }>;
  };
};

const exceptionNames = [
  "The Three-Layer Ownership Rule",
  "The Project Color Rule",
  "The Hardware Radius Rule",
  "The Semantic Pill Rule",
  "The Myles 98 System Chrome Depth Rule",
];

function markdownRuleBody(name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = designDocument.match(
    new RegExp(`\\*\\*${escapedName}\\.\\*\\*\\s+([^\\n]+)`),
  );

  return match?.[1] ?? "";
}

function normalizeRuleBody(body: string) {
  return body.replace(/[`*_]/g, "").replace(/\s+/g, " ").trim();
}

describe("design-system exception register", () => {
  it("keeps normalized human and sidecar exception bodies in parity", () => {
    const sidecarRules = new Map(
      designSidecar.narrative.rules.map((rule) => [rule.name, rule]),
    );

    for (const name of exceptionNames) {
      expect(normalizeRuleBody(markdownRuleBody(name))).toBe(
        normalizeRuleBody(sidecarRules.get(name)?.body ?? ""),
      );
    }

    expect(sidecarRules.get("The Three-Layer Ownership Rule")?.section).toBe(
      "overview",
    );
    expect(sidecarRules.get("The Project Color Rule")?.section).toBe("colors");
    expect(sidecarRules.get("The Hardware Radius Rule")?.section).toBe(
      "elevation",
    );
    expect(sidecarRules.get("The Semantic Pill Rule")?.section).toBe(
      "components",
    );
  });

  it("assigns shell, Reader, and project evidence to distinct ownership layers", () => {
    const ownership = normalizeRuleBody(
      markdownRuleBody("The Three-Layer Ownership Rule"),
    );

    expect(ownership).toContain("The shell owns system chrome");
    expect(ownership).toContain(
      "Reader owns paper, ink, measure, and editorial chrome",
    );
    expect(ownership).toContain(
      "Project and evidence namespaces own project identity and evidence styling",
    );
    expect(ownership).toContain(
      "Projects must not repaint the shell or Reader",
    );
    expect(ownership).toContain(
      "shared layers must not normalize project evidence",
    );
  });

  it("limits broad radius contexts while keeping Myles 98 chrome restrained", () => {
    const hardwareRadius = normalizeRuleBody(
      markdownRuleBody("The Hardware Radius Rule"),
    );

    for (const context of [
      "device hardware",
      "screenshots",
      "maps",
      "faithful reconstructions",
    ]) {
      expect(hardwareRadius).toContain(context);
    }
    expect(hardwareRadius).toContain(
      "Myles 98 and Pocket 98 chrome must stay square or low-radius",
    );
    expect(hardwareRadius).toContain(
      "device-bezel: 34px and device-screen: 27px metadata remains limited to phone outer bezels and screen apertures",
    );
  });

  it("reserves pills for semantics rather than generic rounded decoration", () => {
    const semanticPill = normalizeRuleBody(
      markdownRuleBody("The Semantic Pill Rule"),
    );

    for (const semantic of [
      "status",
      "filter",
      "chip or category",
      "pagination",
      "segmented-choice",
      "round device-control",
    ]) {
      expect(semanticPill).toContain(semantic);
    }
    expect(semanticPill).toContain(
      "navi-pill: 999px metadata remains limited to Navi route, trust, filter, and status controls",
    );
    expect(semanticPill).toContain(
      "must not be used for generic containers, CTAs, cards, or every label",
    );
  });

  it("scopes hardware radii and the Navi pill instead of promoting them globally", () => {
    expect(designSidecar.extensions.radiusMeta).toEqual({
      "device-bezel": {
        value: "34px",
        scope: "Phone hardware outer bezels only.",
        prohibitedMisuse: "Must not be used on general cards, panels, windows, or controls.",
      },
      "device-screen": {
        value: "27px",
        scope: "Phone hardware screen apertures only.",
        prohibitedMisuse: "Must not be used on general cards, panels, windows, or controls.",
      },
      "navi-pill": {
        value: "999px",
        scope: "Navi route, trust, filter, and status controls whose capsule shape carries meaning.",
        prohibitedMisuse: "Must not be used on generic buttons, tags, labels, or decorative containers.",
      },
    });

    expect(designDocument).toContain("`device-bezel: 34px`");
    expect(designDocument).toContain("`device-screen: 27px`");
    expect(designDocument).toContain("`navi-pill: 999px`");
  });

  it("limits Myles 98 depth to system chrome and neutral hard-edge construction", () => {
    const systemChromeDepth = normalizeRuleBody(
      markdownRuleBody("The Myles 98 System Chrome Depth Rule"),
    );

    expect(systemChromeDepth).toContain(
      "exception is limited to discrete 1px top-left highlights, right/bottom shadow bands, recessed wells, and hard cast shadows",
    );
    expect(systemChromeDepth).toContain(
      "It must not enter Reader, case-study navigation, project evidence, generic cards, or editorial surfaces",
    );
    expect(systemChromeDepth).toContain(
      "Depth must use the named neutral edge tokens --m97-bevel-highlight, --m97-bevel-light, --m97-bevel-shadow, and --m97-bevel-dark",
    );

    for (const allowedSurface of [
      "Myles 98/Pocket 98 system, hardware, and program chrome",
      "discrete 1px top-left highlights",
      "right/bottom shadow bands",
      "recessed wells",
      "hard cast shadows",
      "layered windows, menus, and authored paper objects",
    ]) {
      expect(systemChromeDepth).toContain(allowedSurface);
    }

    for (const excludedSurface of [
      "Reader",
      "case-study navigation",
      "project evidence",
      "generic cards",
      "editorial surfaces",
    ]) {
      expect(systemChromeDepth).toContain(excludedSurface);
    }

    for (const constructionConstraint of [
      "portfolio remains flat by default outside the discovery shell",
      "--m97-bevel-highlight",
      "--m97-bevel-light",
      "--m97-bevel-shadow",
      "--m97-bevel-dark",
      "square or low-radius geometry",
      "flatten this depth in forced colors",
      "never use blur, soft filters, or gradient-based elevation",
    ]) {
      expect(systemChromeDepth).toContain(constructionConstraint);
    }

    const sidecarRule = designSidecar.narrative.rules.find(
      (rule) => rule.name === "The Myles 98 System Chrome Depth Rule",
    );
    expect(sidecarRule?.section).toBe("elevation");
  });
});

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
];

describe("design-system exception register", () => {
  it("keeps all four named exceptions in the human and machine-readable contracts", () => {
    const sidecarRules = new Map(
      designSidecar.narrative.rules.map((rule) => [rule.name, rule]),
    );

    for (const name of exceptionNames) {
      expect(designDocument).toContain(`**${name}.**`);
      expect(sidecarRules.get(name)?.body).toMatch(/must not|must never/i);
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
});

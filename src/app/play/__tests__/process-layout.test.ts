import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/play/play.module.css"),
  "utf8",
);

function ruleBody(selector: string, source = styles) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return source.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

describe("Play process arrow spacing", () => {
  it("centers desktop arrows in the horizontal gap between process labels", () => {
    const processRule = ruleBody(".process");
    const arrowRule = ruleBody(".process li:not(:last-child)::after");

    expect(processRule).toContain("gap: 0.5rem 1.6rem");
    expect(arrowRule).toContain("left: calc(100% + 0.8rem)");
    expect(arrowRule).toContain("transform: translateX(-50%)");
  });

  it("centers mobile arrows in the vertical gap between process labels", () => {
    const mobile = styles.slice(styles.indexOf("@media (max-width: 699px)"));
    const processRule = ruleBody(".process", mobile);
    const arrowRule = ruleBody(
      ".process li:not(:last-child)::after",
      mobile,
    );

    expect(processRule).toContain("gap: 1.4rem");
    expect(arrowRule).toContain("top: calc(100% + 0.7rem)");
    expect(arrowRule).toContain("transform: translateY(-50%)");
  });
});

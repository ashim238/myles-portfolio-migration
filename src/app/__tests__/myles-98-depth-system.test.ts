import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97.css"),
  "utf8",
);

type RuleContract = {
  declarations: Map<string, string>;
  selector: string;
};

const rules: RuleContract[] = [];
const styleElement = document.createElement("style");
styleElement.textContent = stylesheet;
document.head.append(styleElement);
expect(styleElement.sheet, "Myles 98 stylesheet did not parse").not.toBeNull();

function normalizeSelector(selector: string) {
  return selector.replace(/\s+/g, " ").replace(/\s*,\s*/g, ",").trim();
}

function collectRules(ruleList: CSSRuleList) {
  for (const cssRule of ruleList) {
    if (cssRule instanceof CSSStyleRule) {
      const declarations = new Map<string, string>();

      for (let index = 0; index < cssRule.style.length; index += 1) {
        const property = cssRule.style.item(index);
        declarations.set(
          property,
          cssRule.style.getPropertyValue(property).replace(/\s+/g, " ").trim(),
        );
      }

      rules.push({
        declarations,
        selector: normalizeSelector(cssRule.selectorText),
      });
      continue;
    }

    if ("cssRules" in cssRule) {
      collectRules((cssRule as CSSGroupingRule).cssRules);
    }
  }
}

collectRules(styleElement.sheet?.cssRules ?? ([] as unknown as CSSRuleList));

function rule(selector: string): RuleContract {
  const match = rules.find((candidate) => candidate.selector === selector);
  expect(match, `Missing CSS rule for ${selector}`).toBeDefined();
  return match as RuleContract;
}

function expectBevel(
  selector: string,
  direction: "raised" | "recessed",
) {
  const contract = rule(selector);
  expect(contract.declarations.get("border-color")).toBe(
    direction === "raised"
      ? "var(--m97-bevel-highlight) var(--m97-bevel-dark) var(--m97-bevel-dark) var(--m97-bevel-highlight)"
      : "var(--m97-bevel-dark) var(--m97-bevel-highlight) var(--m97-bevel-highlight) var(--m97-bevel-dark)",
  );
  expect(contract.declarations.get("box-shadow")).toContain(
    `var(--m97-bevel-${direction})`,
  );
}

describe("Myles 98 workstation depth system", () => {
  it("defines one discrete top-left bevel grammar and applies it to chrome", () => {
    const tokens = rule(":root").declarations;

    expect(tokens.get("--m97-bevel-highlight")).toBe("#fff");
    expect(tokens.get("--m97-bevel-light")).toBe("#dfdfdf");
    expect(tokens.get("--m97-bevel-shadow")).toBe("#808080");
    expect(tokens.get("--m97-bevel-dark")).toBe("#0a0a0a");
    expect(tokens.get("--m97-bevel-raised")).toContain(
      "var(--m97-bevel-light)",
    );
    expect(tokens.get("--m97-bevel-raised")).toContain(
      "var(--m97-bevel-shadow)",
    );
    expect(tokens.get("--m97-bevel-recessed")).toContain(
      "var(--m97-bevel-shadow)",
    );
    expect(tokens.get("--m97-bevel-recessed")).toContain(
      "var(--m97-bevel-light)",
    );

    expectBevel(".myles97-window", "raised");
    expectBevel(".myles97-window-control", "raised");
    expectBevel(".myles97-primary-button", "raised");
    expectBevel(
      ".myles97-display-preview button,.myles97-reset-confirmation button",
      "raised",
    );
    expectBevel(".myles97-start-button,.myles97-task-button", "raised");
    expectBevel(".myles97-start-menu", "raised");

    expectBevel(".myles97-window-content", "recessed");
    expectBevel(".myles97-window-status", "recessed");
    expectBevel(".myles97-clock", "recessed");
  });

  it("recesses pressed and open controls without changing their geometry", () => {
    const pressedSelectors = [
      ".myles97-primary-button:active",
      ".myles97-hit-target:active .myles97-window-control",
      '.myles97-start-button:active,.myles97-start-button[aria-expanded="true"]',
      '.myles97-task-button:active,.myles97-task-button[data-focused="true"]',
    ];

    for (const selector of pressedSelectors) {
      const declarations = rule(selector).declarations;
      expect(declarations.get("border-color"), selector).toBe(
        "var(--m97-bevel-dark) var(--m97-bevel-highlight) var(--m97-bevel-highlight) var(--m97-bevel-dark)",
      );
      expect(declarations.get("box-shadow"), selector).toBe(
        "var(--m97-bevel-recessed)",
      );
      expect([...declarations.keys()], selector).not.toEqual(
        expect.arrayContaining([
          "block-size",
          "height",
          "inset",
          "margin",
          "padding",
          "transform",
          "translate",
          "width",
        ]),
      );
    }

    expect(rule(".myles97-primary-button").declarations.get("min-height")).toBe(
      "44px",
    );
    expect(
      rule(".myles97-start-button,.myles97-task-button").declarations.get(
        "min-height",
      ),
    ).toBe("44px");
    expect(rule(".myles97-hit-target").declarations.get("width")).toBe("44px");
    expect(rule(".myles97-hit-target").declarations.get("height")).toBe("44px");
  });

  it("keeps cast shadows on layered windows only and flattens depth in forced colors", () => {
    expect(stylesheet).not.toContain("drop-shadow(");
    expect(rule(".myles97-window").declarations.get("box-shadow")).toContain(
      "4px 4px 0 rgb(17 17 17 / 28%)",
    );
    expect(rule(".myles97-start-menu").declarations.get("box-shadow")).toContain(
      "5px 5px 0 rgb(17 17 17 / 30%)",
    );
    expect(rule(".myles97-primary-button").declarations.get("box-shadow")).toBe(
      "var(--m97-bevel-raised)",
    );
    expect(
      rule(".myles97-start-button,.myles97-task-button").declarations.get(
        "box-shadow",
      ),
    ).toBe("var(--m97-bevel-raised)");

    expect(stylesheet).toMatch(
      /@media\s*\(forced-colors:\s*active\)[\s\S]*?\.myles97-start-button,[\s\S]*?\.myles97-task-button,[\s\S]*?\.myles97-clock,[\s\S]*?box-shadow:\s*none/,
    );
  });
});

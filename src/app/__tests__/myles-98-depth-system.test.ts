import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97.css"),
  "utf8",
);

type RuleContract = {
  authored: string;
  declarations: Map<string, string>;
  media: string | null;
  order: number;
  selector: string;
};

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeSelector(selector: string) {
  return normalizeWhitespace(selector).replace(/\s*,\s*/g, ",");
}

function declarationsFor(style: CSSStyleDeclaration) {
  const declarations = new Map<string, string>();

  for (let index = 0; index < style.length; index += 1) {
    const property = style.item(index);
    declarations.set(
      property,
      normalizeWhitespace(style.getPropertyValue(property)),
    );
  }

  return declarations;
}

function parseRules(source: string) {
  const rules: RuleContract[] = [];
  const styleElement = document.createElement("style");
  styleElement.textContent = source;
  document.head.append(styleElement);
  const sheet = styleElement.sheet;

  function collectRules(ruleList: CSSRuleList, media: string | null = null) {
    for (const cssRule of ruleList) {
      if (cssRule instanceof CSSStyleRule) {
        rules.push({
          authored: normalizeWhitespace(cssRule.style.cssText),
          declarations: declarationsFor(cssRule.style),
          media,
          order: rules.length,
          selector: normalizeSelector(cssRule.selectorText),
        });
        continue;
      }

      if (cssRule instanceof CSSMediaRule) {
        collectRules(cssRule.cssRules, normalizeWhitespace(cssRule.conditionText));
        continue;
      }

      if ("cssRules" in cssRule) {
        collectRules((cssRule as CSSGroupingRule).cssRules, media);
      }
    }
  }

  if (sheet) collectRules(sheet.cssRules);
  styleElement.remove();

  return { rules, sheet };
}

const parsed = parseRules(stylesheet);
const rules = parsed.rules;

function rule(selector: string, media: string | null = null): RuleContract {
  const normalized = normalizeSelector(selector);
  const matches = rules.filter(
    (candidate) =>
      candidate.selector === normalized && candidate.media === media,
  );
  expect(
    matches,
    `Expected exactly one ${media ? `${media} ` : ""}rule for ${selector}`,
  ).toHaveLength(1);
  return matches[0];
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

function resolveM97Variables(source: string) {
  const tokens = rule(":root").declarations;

  function resolveValue(value: string, seen: string[] = []): string {
    return value.replace(/var\((--m97-[\w-]+)\)/g, (reference, name: string) => {
      if (seen.includes(name) || !tokens.has(name)) return reference;
      return resolveValue(tokens.get(name) ?? reference, [...seen, name]);
    });
  }

  return source.replace(
    /var\((--m97-[\w-]+)\)/g,
    (reference, name: string) => resolveValue(tokens.get(name) ?? reference, [name]),
  );
}

const cascadeStyle = document.createElement("style");
cascadeStyle.textContent = resolveM97Variables(stylesheet).replace(
  /:active/g,
  '[data-test-active="true"]',
);
document.head.append(cascadeStyle);

const geometryProperties = [
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderBlockStartWidth",
  "borderBlockEndWidth",
  "borderInlineStartWidth",
  "borderInlineEndWidth",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "paddingBlockStart",
  "paddingBlockEnd",
  "paddingInlineStart",
  "paddingInlineEnd",
  "minWidth",
  "minHeight",
  "width",
  "height",
  "inlineSize",
  "blockSize",
] as const;

type ComputedSnapshot = Record<(typeof geometryProperties)[number], string> & {
  borderBottomColor: string;
  borderLeftColor: string;
  borderRightColor: string;
  borderTopColor: string;
  boxShadow: string;
};

function computedSnapshot(markup: string, subjectSelector: string) {
  const host = document.createElement("div");
  host.innerHTML = markup;
  document.body.append(host);
  const subject = host.querySelector<HTMLElement>(subjectSelector);
  expect(subject, `Missing fixture subject ${subjectSelector}`).not.toBeNull();
  const computed = getComputedStyle(subject as HTMLElement);
  const snapshot = Object.fromEntries(
    geometryProperties.map((property) => [property, computed[property]]),
  ) as ComputedSnapshot;
  snapshot.borderTopColor = computed.borderTopColor;
  snapshot.borderRightColor = computed.borderRightColor;
  snapshot.borderBottomColor = computed.borderBottomColor;
  snapshot.borderLeftColor = computed.borderLeftColor;
  snapshot.boxShadow = normalizeWhitespace(computed.boxShadow);
  host.remove();
  return snapshot;
}

const protectedStateProperties = [
  "border",
  "border-width",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-block-width",
  "border-block-start-width",
  "border-block-end-width",
  "border-inline-width",
  "border-inline-start-width",
  "border-inline-end-width",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "padding-block",
  "padding-block-start",
  "padding-block-end",
  "padding-inline",
  "padding-inline-start",
  "padding-inline-end",
  "min-width",
  "min-height",
  "width",
  "height",
  "inline-size",
  "block-size",
  "transform",
  "translate",
] as const;

const pressedRules = [
  ".myles97-primary-button:active",
  ".myles97-hit-target:active .myles97-window-control",
  ".myles97-display-preview button:active,.myles97-reset-confirmation button:active",
  '.myles97-start-button:active,.myles97-start-button[aria-expanded="true"]',
  '.myles97-task-button:active,.myles97-task-button[data-focused="true"]',
] as const;

const stateFixtures = [
  {
    base: '<button class="myles97-primary-button">Open</button>',
    name: "primary pressed",
    selector: ".myles97-primary-button",
    state:
      '<button class="myles97-primary-button" data-test-active="true">Open</button>',
  },
  {
    base:
      '<button class="myles97-hit-target"><span class="myles97-window-control">x</span></button>',
    name: "titlebar control pressed",
    selector: ".myles97-window-control",
    state:
      '<button class="myles97-hit-target" data-test-active="true"><span class="myles97-window-control">x</span></button>',
    targetSelector: ".myles97-hit-target",
  },
  {
    base:
      '<div class="myles97-display-preview"><button type="button">Apply</button></div>',
    name: "Display button pressed",
    selector: "button",
    state:
      '<div class="myles97-display-preview"><button type="button" data-test-active="true">Apply</button></div>',
  },
  {
    base:
      '<div class="myles97-reset-confirmation"><button type="button">Reset</button></div>',
    name: "reset button pressed",
    selector: "button",
    state:
      '<div class="myles97-reset-confirmation"><button type="button" data-test-active="true">Reset</button></div>',
  },
  {
    base:
      '<button class="myles97-start-button" aria-expanded="false">Start</button>',
    name: "Start pressed",
    selector: ".myles97-start-button",
    state:
      '<button class="myles97-start-button" aria-expanded="false" data-test-active="true">Start</button>',
  },
  {
    base:
      '<button class="myles97-start-button" aria-expanded="false">Start</button>',
    name: "Start open",
    selector: ".myles97-start-button",
    state:
      '<button class="myles97-start-button" aria-expanded="true">Start</button>',
  },
  {
    base:
      '<button class="myles97-task-button" data-focused="false">Window</button>',
    name: "task pressed",
    selector: ".myles97-task-button",
    state:
      '<button class="myles97-task-button" data-focused="false" data-test-active="true">Window</button>',
  },
  {
    base:
      '<button class="myles97-task-button" data-focused="false">Window</button>',
    name: "task focused",
    selector: ".myles97-task-button",
    state:
      '<button class="myles97-task-button" data-focused="true">Window</button>',
  },
] as const;

function specificity(selector: string) {
  return [
    (selector.match(/#[\w-]+/g) ?? []).length,
    (selector.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) ?? []).length,
    (selector.match(/(^|[\s>+~])(?:[a-z][\w-]*|\*)/gi) ?? []).filter(
      (match) => !match.trim().startsWith("*"),
    ).length,
  ];
}

describe("Myles 98 workstation depth system", () => {
  it("parses one discrete top-left bevel grammar and applies it to chrome", () => {
    expect(parsed.sheet, "Myles 98 stylesheet did not parse").not.toBeNull();
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

  it("uses the effective cascade to recess every state without geometry shifts", () => {
    for (const selector of pressedRules) {
      const declarations = rule(selector).declarations;
      expect(declarations.get("border-color"), selector).toBe(
        "var(--m97-bevel-dark) var(--m97-bevel-highlight) var(--m97-bevel-highlight) var(--m97-bevel-dark)",
      );
      expect(declarations.get("box-shadow"), selector).toBe(
        "var(--m97-bevel-recessed)",
      );
      expect([...declarations.keys()], selector).not.toEqual(
        expect.arrayContaining([...protectedStateProperties]),
      );
    }

    for (const fixture of stateFixtures) {
      const base = computedSnapshot(fixture.base, fixture.selector);
      const state = computedSnapshot(fixture.state, fixture.selector);

      expect(
        Object.fromEntries(geometryProperties.map((property) => [property, state[property]])),
        `${fixture.name} geometry`,
      ).toEqual(
        Object.fromEntries(geometryProperties.map((property) => [property, base[property]])),
      );
      expect(state.boxShadow, `${fixture.name} recessed shadow`).toBe(
        "inset 1px 1px 0 #0a0a0a,inset 2px 2px 0 #808080,inset -2px -2px 0 #dfdfdf,inset -1px -1px 0 #fff",
      );
      expect(
        [
          state.borderTopColor,
          state.borderRightColor,
          state.borderBottomColor,
          state.borderLeftColor,
        ],
        `${fixture.name} inverted edges`,
      ).toEqual([
        "rgb(10, 10, 10)",
        "rgb(255, 255, 255)",
        "rgb(255, 255, 255)",
        "rgb(10, 10, 10)",
      ]);

      if ("targetSelector" in fixture) {
        expect(
          computedSnapshot(fixture.state, fixture.targetSelector),
          `${fixture.name} 28px desktop target`,
        ).toMatchObject({ height: "28px", width: "28px" });
      }
    }
  });

  it("parses exact forced-colors flattening, selection, and focus rules", () => {
    const media = "(forced-colors: active)";
    const flattenSelector = normalizeSelector(`
      .myles97-shell,
      .myles97-desktop,
      .myles97-window,
      .myles97-window-content,
      .myles97-window-status,
      .myles97-window-control,
      .myles97-titlebar,
      .myles97-window[data-focused="true"] .myles97-titlebar,
      .myles97-taskbar,
      .myles97-start-button,
      .myles97-task-button,
      .myles97-clock,
      .myles97-start-menu,
      .myles97-program-card,
      .myles97-primary-button,
      .myles97-display-preview button,
      .myles97-reset-confirmation button,
      .myles97-roti-note,
      .myles97-reminders-widget,
      .myles97-boot,
      .myles97-boot-mark,
      .myles97-boot-progress,
      .myles97-paint-canvas,
      .myles97-paint-colors,
      .myles97-paint-tool,
      .myles97-paint-swatch,
      .project-enter-frame--program,
      .project-enter-program,
      .project-enter-program-titlebar,
      .project-enter-program-cover,
      .project-enter-program-control
    `);
    const selectedSelector = normalizeSelector(`
      .myles97-window[data-focused="true"] .myles97-titlebar,
      .myles97-task-button[data-focused="true"],
      .myles97-start-button[aria-expanded="true"],
      .myles97-start-menu-brand,
      .myles97-reminders-widget-title,
      .myles97-start-menu-items :is(button, a):hover,
      .myles97-start-menu-items :is(button, a):focus-visible,
      .myles97-case-study-link:hover,
      .project-enter-program-titlebar
    `);
    const focusSelector = normalizeSelector(`
      .myles97-window :is(button, a, input, select, textarea):focus-visible,
      .myles97-shell :is(button, a, input, select, textarea):focus-visible,
      .myles97-window[data-focused="true"] .myles97-titlebar .myles97-hit-target:focus-visible,
      .myles97-task-button[data-focused="true"]:focus-visible,
      .myles97-start-menu-items :is(button, a):focus-visible
    `);
    const baseFocusSelector = normalizeSelector(`
      .myles97-window :is(button, a, input, select, textarea):focus-visible,
      .myles97-shell :is(button, a, input, select, textarea):focus-visible
    `);
    const activeFocusSelector = normalizeSelector(`
      .myles97-window[data-focused="true"] .myles97-titlebar .myles97-hit-target:focus-visible,
      .myles97-start-menu-items :is(button, a):focus-visible
    `);

    const flatten = rule(flattenSelector, media);
    const focus = rule(focusSelector, media);
    const selected = rule(selectedSelector, media);
    const baseFocus = rule(baseFocusSelector);
    const activeFocus = rule(activeFocusSelector);

    expect(flatten.authored).toBe(
      "border-color: canvastext; background: canvas; color: canvastext; box-shadow: none;",
    );
    expect(selected.authored).toBe(
      "background: highlight; color: highlighttext;",
    );
    expect(focus.authored).toBe("outline-color: highlight;");
    expect(baseFocus.authored).toBe(
      "outline: 3px solid var(--m97-focus-dark); outline-offset: 2px;",
    );
    expect(activeFocus.authored).toBe("outline-color: var(--m97-focus-light);");
    expect(selected.order).toBeGreaterThan(flatten.order);
    expect(focus.order).toBeGreaterThan(selected.order);
    expect(specificity('.myles97-start-button[aria-expanded="true"]')).toEqual([
      0, 2, 0,
    ]);
    expect(specificity(".myles97-start-button")).toEqual([0, 1, 0]);
  });

  it("keeps cast shadows on layered surfaces and avoids generic filters", () => {
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
  });
});

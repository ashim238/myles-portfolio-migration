# Navi Living Design System — Implementation Plan (Plan 1 of 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Navi design system as real, token-driven React components with a browsable gallery and a live props playground at `/work/navi/system`.

**Architecture:** A scoped Navi mini-site under `src/app/work/navi/(minisite)/`, themed via CSS custom properties on a `.nv-ui` root class (distinct from the case study's existing `.nv-page`). Components are plain `"use client"` React functions styled with classNames whose rules live in `globals.css` — matching the existing codebase pattern (e.g. `ColorPalette`). Every component reads semantic tokens (`var(--nv-action)`, never raw hex). The brand orange is contrast-corrected: bright `#F3722C` stays a decorative primitive; interactive surfaces use `--nv-action #C4541A` (4.54:1 on white).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 (already present), `next/font/google` (Jost + Lato). Testing: **Vitest + React Testing Library + jsdom** (added by this plan). Visual/contrast spot-checks via the `preview_*` workflow where unit tests structurally can't reach.

**Companion spec:** `docs/superpowers/specs/2026-06-19-navi-live-system-minisite-design.md`. Plan 2 (the playable demo) builds on the components produced here.

**Source of truth:** Figma `nYimRBXiOSyDbTfAJ4gk8G`. Component nodes: Button `74:307`, Tabs `627:7867`, Rating `1951:1783`, Label `53:57`, Avatar `1024:11114`, Tooltip + MapPin `1717:36`, Carousel `812:10050`, Modal/Cards `1348:60`. During execution, validate exact tokens/spacing per node via Figma MCP `get_design_context`.

---

## Component API summary (locked names — used across all tasks)

These class names and prop names are the contract. Later tasks depend on them; do not rename.

| Component | Root class | Key props |
|---|---|---|
| `Button` | `.nv-btn` (`--primary`/`--transparent`/`--outline`, `--sm`/`--md`/`--lg`) | `variant`, `size`, `leadingIcon`, `trailingIcon`, `disabled`, `children` |
| `IconButton` | `.nv-icon-btn` (same variants/sizes) | `variant`, `size`, `icon`, `label` (required, a11y), `disabled` |
| `Tag` | `.nv-tag` (`--neutral`/`--popular`/`--local`) | `tone`, `children` |
| `Label` | `.nv-label` | `htmlFor`, `required`, `optional`, `help`, `children` |
| `ImpactSignal` | `.nv-impact` | `children` (phrase), `as` (`'span'`\|`'div'`) |
| `Rating` | `.nv-rating` | `value` (number), `reviews` (number, optional) |
| `Avatar` | `.nv-avatar` (`--sm`/`--md`/`--lg`) | `size`, `name`, `src` (optional) |
| `Tabs` | `.nv-tabs` | `items` (`{id,label}[]`), `value`, `onChange` |
| `Accordion` | `.nv-accordion` | `items` (`{id,title,content}[]`) |
| `Tooltip` | `.nv-tooltip` | `content`, `children` (trigger) |
| `SearchInput` | `.nv-search` | `value`, `onChange`, `placeholder`, `label` |
| `CarouselArrow` | `.nv-carousel-arrow` (`--prev`/`--next`) | `direction`, `disabled`, `label`, `onClick` |
| `PaginationDots` | `.nv-dots` | `count`, `active`, `onSelect` |
| `MapPin` | `.nv-pin` (`--place`/`--location`) | `kind`, `value`, `selected`, `filled` |
| `Card` | `.nv-card` | `children`, `padded` |

---

## Phase A — Project setup

### Task 1: Add and configure Vitest + React Testing Library

**Files:**
- Modify: `package.json` (devDependencies + scripts)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/components/navi/ui/__tests__/smoke.test.tsx`

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest@^2 @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 4: Add scripts to `package.json`**

In the `"scripts"` block add:

```json
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 5: Write a smoke test**

`src/components/navi/ui/__tests__/smoke.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("test harness", () => {
  it("renders DOM and matchers work", () => {
    render(<button type="button">hello</button>);
    expect(screen.getByRole("button", { name: "hello" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it**

Run: `npm test`
Expected: PASS (1 test). Confirms jsdom + RTL + jest-dom + alias wiring.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts src/components/navi/ui/__tests__/smoke.test.tsx
git commit -m "test: add Vitest + React Testing Library harness"
```

---

### Task 2: Load Navi fonts (Jost + Lato)

**Files:**
- Create: `src/lib/navi/fonts.ts`

- [ ] **Step 1: Create the font module**

`src/lib/navi/fonts.ts`:

```ts
import { Jost, Lato } from "next/font/google";

// Jost = display; Lato = UI/body. Exposed as CSS variables, consumed under .nv-ui.
export const naviDisplay = Jost({
  variable: "--nv-font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const naviBody = Lato({
  variable: "--nv-font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors (fonts referenced once the layout in Task 4 uses them).

- [ ] **Step 3: Commit**

```bash
git add src/lib/navi/fonts.ts
git commit -m "feat(navi): add Jost + Lato font modules"
```

---

### Task 3: Token source + `.nv-ui` CSS variables

**Files:**
- Create: `src/lib/navi/tokens.ts`
- Create: `src/components/navi/ui/__tests__/tokens.test.ts`
- Modify: `src/app/globals.css` (append `.nv-ui` token block at end of file)

- [ ] **Step 1: Write the failing test**

`src/components/navi/ui/__tests__/tokens.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  NAVI_PRIMITIVES,
  NAVI_SEMANTIC,
  NAVI_SPACING,
  NAVI_TYPE,
  contrastRatio,
} from "@/lib/navi/tokens";

describe("navi tokens", () => {
  it("exposes brand primitives", () => {
    expect(NAVI_PRIMITIVES.darwin).toBe("#F3722C");
    expect(NAVI_PRIMITIVES.gumball).toBe("#3A86FF");
    expect(NAVI_PRIMITIVES.robinson).toBe("#4A414D");
  });

  it("action color passes WCAG AA on white (>= 4.5)", () => {
    expect(contrastRatio(NAVI_SEMANTIC.action, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });

  it("body text passes WCAG AA on surface (>= 4.5)", () => {
    expect(contrastRatio(NAVI_SEMANTIC.textDefault, NAVI_SEMANTIC.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("focus ring meets the 3:1 non-text minimum on white", () => {
    expect(contrastRatio(NAVI_SEMANTIC.focus, "#FFFFFF")).toBeGreaterThanOrEqual(3);
  });

  it("spacing scale is 4px-based", () => {
    expect(NAVI_SPACING.find((s) => s.token === "md")?.px).toBe(16);
  });

  it("type ramp names display + body families", () => {
    expect(NAVI_TYPE.display.family).toContain("Jost");
    expect(NAVI_TYPE.body.family).toContain("Lato");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- tokens`
Expected: FAIL ("Cannot find module '@/lib/navi/tokens'").

- [ ] **Step 3: Implement the token module**

`src/lib/navi/tokens.ts`:

```ts
/**
 * Navi design tokens — single source of truth.
 * Two-tier: brand primitives -> semantic aliases. Components reference
 * semantic tokens (emitted as CSS vars under .nv-ui in globals.css).
 * Validate exact values against Figma nYimRBXiOSyDbTfAJ4gk8G during execution.
 */

export const NAVI_PRIMITIVES = {
  darwin: "#F3722C", // brand orange — decorative/large fills only
  gumball: "#3A86FF", // brand blue
  robinson: "#4A414D", // brand neutral (dark)
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const NAVI_SEMANTIC = {
  // interactive: darkened orange that clears AA (white-on-action = 4.54)
  action: "#C4541A",
  actionStrong: "#9E3F0B", // selected/pressed pin + emphasis
  surface: "#FFFFFF",
  surfaceMuted: "#F5F5F5",
  textDefault: "#2B2B2B",
  textMuted: "#5A5560",
  border: "#E2E0E3",
  focus: "#C4541A", // >= 3:1 on white
  error: "#C2371F", // replaces off-palette red asterisk
  info: "#3A86FF", // replaces off-palette purple help icon (use brand blue)
} as const;

export const NAVI_SPACING = [
  { token: "3xs", px: 2 },
  { token: "2xs", px: 4 },
  { token: "xs", px: 8 },
  { token: "sm", px: 12 },
  { token: "md", px: 16 },
  { token: "lg", px: 24 },
  { token: "xl", px: 32 },
  { token: "2xl", px: 64 },
  { token: "3xl", px: 128 },
] as const;

export const NAVI_RADII = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  pill: "999px",
} as const;

export const NAVI_TYPE = {
  display: { family: "Jost, system-ui, sans-serif", weight: 700, size: "2rem", line: 1.1 },
  title: { family: "Jost, system-ui, sans-serif", weight: 500, size: "1.25rem", line: 1.3 },
  body: { family: "Lato, system-ui, sans-serif", weight: 400, size: "1rem", line: 1.55 },
  caption: { family: "Lato, system-ui, sans-serif", weight: 400, size: "0.85rem", line: 1.4 },
} as const;

/** WCAG 2.1 relative-luminance contrast ratio between two hex colors. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string): number => {
    const h = hex.replace("#", "");
    const ch = [0, 2, 4].map((i) => {
      const c = parseInt(h.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- tokens`
Expected: PASS (6 tests).

- [ ] **Step 5: Append the `.nv-ui` CSS variable block to `globals.css`**

Append at the very end of `src/app/globals.css`:

```css
/* ── Navi mini-site scope (.nv-ui) ───────────────────────────────
   Distinct from the case study's .nv-page. Light Navi product chrome.
   Values mirror src/lib/navi/tokens.ts. */
.nv-ui {
  --nv-darwin: #f3722c;
  --nv-gumball: #3a86ff;
  --nv-robinson: #4a414d;

  --nv-action: #c4541a;
  --nv-action-strong: #9e3f0b;
  --nv-surface: #ffffff;
  --nv-surface-muted: #f5f5f5;
  --nv-text: #2b2b2b;
  --nv-text-muted: #5a5560;
  --nv-border: #e2e0e3;
  --nv-focus: #c4541a;
  --nv-error: #c2371f;
  --nv-info: #3a86ff;

  --nv-r-sm: 6px;
  --nv-r-md: 10px;
  --nv-r-lg: 16px;
  --nv-r-pill: 999px;

  --nv-sp-2xs: 4px;
  --nv-sp-xs: 8px;
  --nv-sp-sm: 12px;
  --nv-sp-md: 16px;
  --nv-sp-lg: 24px;
  --nv-sp-xl: 32px;

  font-family: var(--nv-font-body), system-ui, sans-serif;
  color: var(--nv-text);
  background: var(--nv-surface);
}

.nv-ui :focus-visible {
  outline: 2px solid var(--nv-focus);
  outline-offset: 2px;
}

.nv-ui h1,
.nv-ui h2,
.nv-ui h3 {
  font-family: var(--nv-font-display), system-ui, sans-serif;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/navi/tokens.ts src/components/navi/ui/__tests__/tokens.test.ts src/app/globals.css
git commit -m "feat(navi): token source + .nv-ui CSS variables with AA-corrected action color"
```

---

### Task 4: Scoped mini-site layout + chrome shell

**Files:**
- Create: `src/app/work/navi/(minisite)/layout.tsx`
- Create: `src/components/navi/chrome/NaviHeader.tsx`
- Create: `src/components/navi/chrome/NaviFooter.tsx`
- Create: `src/components/navi/chrome/__tests__/NaviHeader.test.tsx`
- Modify: `src/app/globals.css` (append chrome styles)

- [ ] **Step 1: Write the failing test**

`src/components/navi/chrome/__tests__/NaviHeader.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NaviHeader } from "@/components/navi/chrome/NaviHeader";

describe("NaviHeader", () => {
  it("renders a banner with the Navi wordmark and primary nav", () => {
    render(<NaviHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Navi")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
  });

  it("links to the system and demo surfaces", () => {
    render(<NaviHeader />);
    expect(screen.getByRole("link", { name: /system/i })).toHaveAttribute(
      "href",
      "/work/navi/system",
    );
    expect(screen.getByRole("link", { name: /explore/i })).toHaveAttribute(
      "href",
      "/work/navi/demo",
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- NaviHeader`
Expected: FAIL ("Cannot find module '@/components/navi/chrome/NaviHeader'").

- [ ] **Step 3: Implement `NaviHeader`**

`src/components/navi/chrome/NaviHeader.tsx`:

```tsx
import Link from "next/link";

export function NaviHeader() {
  return (
    <header className="nv-header" role="banner">
      <Link href="/work/navi/demo" className="nv-wordmark" aria-label="Navi home">
        Navi
      </Link>
      <nav className="nv-nav" aria-label="Primary">
        <Link href="/work/navi/demo">Explore</Link>
        <Link href="/work/navi/system">System</Link>
        <Link href="/work/navi" className="nv-nav-host">
          Host an event
        </Link>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Implement `NaviFooter`**

`src/components/navi/chrome/NaviFooter.tsx`:

```tsx
export function NaviFooter() {
  const cols: { heading: string; links: string[] }[] = [
    { heading: "Explore Navi", links: ["Host an event", "Trust and safety", "Partner resources"] },
    { heading: "About", links: ["What’s Navi?", "Careers", "Newsroom", "Privacy policy"] },
  ];
  return (
    <footer className="nv-footer" role="contentinfo">
      <div className="nv-footer-brand">
        <span className="nv-wordmark">Navi</span>
        <a href="mailto:contact@navi.com">contact@navi.com</a>
      </div>
      {cols.map((c) => (
        <nav key={c.heading} className="nv-footer-col" aria-label={c.heading}>
          <p className="nv-footer-heading">{c.heading}</p>
          <ul>
            {c.links.map((l) => (
              <li key={l}>
                <a href="#">{l}</a>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </footer>
  );
}
```

- [ ] **Step 5: Implement the scoped layout**

`src/app/work/navi/(minisite)/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { naviDisplay, naviBody } from "@/lib/navi/fonts";
import { NaviHeader } from "@/components/navi/chrome/NaviHeader";
import { NaviFooter } from "@/components/navi/chrome/NaviFooter";

export default function NaviMinisiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`nv-ui ${naviDisplay.variable} ${naviBody.variable}`}>
      <NaviHeader />
      <main id="main-content">{children}</main>
      <NaviFooter />
    </div>
  );
}
```

- [ ] **Step 6: Append chrome styles to `globals.css`**

```css
.nv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--nv-sp-lg);
  padding: var(--nv-sp-md) var(--nv-sp-xl);
  border-bottom: 1px solid var(--nv-border);
}
.nv-wordmark {
  font-family: var(--nv-font-display), sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--nv-action);
  text-decoration: none;
}
.nv-nav {
  display: flex;
  gap: var(--nv-sp-lg);
  align-items: center;
}
.nv-nav a {
  color: var(--nv-text);
  text-decoration: none;
}
.nv-nav a:hover {
  color: var(--nv-action);
}
.nv-nav-host {
  padding: var(--nv-sp-xs) var(--nv-sp-md);
  border: 1px solid var(--nv-action);
  border-radius: var(--nv-r-pill);
  color: var(--nv-action) !important;
}
.nv-footer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nv-sp-xl);
  padding: var(--nv-sp-xl);
  border-top: 1px solid var(--nv-border);
  background: var(--nv-surface-muted);
}
.nv-footer-heading {
  font-weight: 700;
  margin-bottom: var(--nv-sp-xs);
}
.nv-footer-col ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--nv-sp-2xs);
}
.nv-footer-col a,
.nv-footer-brand a {
  color: var(--nv-text-muted);
  text-decoration: none;
}
@media (max-width: 640px) {
  .nv-header {
    padding: var(--nv-sp-sm) var(--nv-sp-md);
  }
}
```

- [ ] **Step 7: Run tests**

Run: `npm test -- NaviHeader`
Expected: PASS (2 tests).

- [ ] **Step 8: Commit**

```bash
git add src/app/work/navi/ src/components/navi/chrome/ src/app/globals.css
git commit -m "feat(navi): scoped mini-site layout + header/footer chrome"
```

---

## Phase B — Component library

**Component task rhythm (applies to every Task in this phase):**
1. Write the failing test (full code given per task).
2. Run `npm test -- <name>` → expect FAIL (module not found).
3. Implement the component (full code given per task).
4. Append the component's CSS to `globals.css` (full code given per task).
5. Run `npm test -- <name>` → expect PASS.
6. Commit with the message given per task.

All component files live in `src/components/navi/ui/`; tests in `src/components/navi/ui/__tests__/`. CSS is appended to `src/app/globals.css`.

### Task 5: Button

**Files:**
- Create: `src/components/navi/ui/Button.tsx`
- Test: `src/components/navi/ui/__tests__/Button.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/navi/ui/Button";

describe("Button", () => {
  it("renders an accessible button with its label", () => {
    render(<Button>Reserve now</Button>);
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });

  it("applies variant and size modifier classes (default primary/md)", () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveClass("nv-btn", "nv-btn--primary", "nv-btn--md");
  });

  it("honors explicit variant + size", () => {
    render(
      <Button variant="outline" size="lg">
        Go
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("nv-btn--outline", "nv-btn--lg");
  });

  it("renders leading/trailing icons as decorative", () => {
    render(
      <Button leadingIcon={<svg data-testid="lead" />} trailingIcon={<svg data-testid="trail" />}>
        Go
      </Button>,
    );
    expect(screen.getByTestId("lead").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("trail").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onClick and respects disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Button` → "Cannot find module".

- [ ] **Step 3: Implement**

`src/components/navi/ui/Button.tsx`:

```tsx
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "transparent" | "outline";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`nv-btn nv-btn--${variant} nv-btn--${size} ${className}`.trim()}
      {...rest}
    >
      {leadingIcon && (
        <span className="nv-btn-icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className="nv-btn-label">{children}</span>
      {trailingIcon && (
        <span className="nv-btn-icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 4: CSS** — append to `globals.css`:

```css
.nv-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--nv-sp-xs);
  border: 1px solid transparent;
  border-radius: var(--nv-r-md);
  font-family: var(--nv-font-body), sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.nv-btn--sm { padding: 6px 12px; font-size: 0.85rem; }
.nv-btn--md { padding: 10px 18px; font-size: 0.95rem; }
.nv-btn--lg { padding: 14px 24px; font-size: 1.05rem; }
.nv-btn-icon { display: inline-flex; width: 1em; height: 1em; }
.nv-btn--primary { background: var(--nv-action); color: #fff; }
.nv-btn--primary:hover { background: var(--nv-action-strong); }
.nv-btn--transparent { background: transparent; color: var(--nv-action); }
.nv-btn--transparent:hover { background: color-mix(in srgb, var(--nv-action) 10%, transparent); }
.nv-btn--outline { background: transparent; color: var(--nv-action); border-color: var(--nv-action); }
.nv-btn--outline:hover { background: color-mix(in srgb, var(--nv-action) 8%, transparent); }
.nv-btn:disabled { background: #d7d5d8; color: #8b8790; border-color: transparent; cursor: not-allowed; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- Button` → 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/ui/Button.tsx src/components/navi/ui/__tests__/Button.test.tsx src/app/globals.css
git commit -m "feat(navi): Button component (variants, sizes, icons, disabled)"
```

---

### Task 6: IconButton

**Files:**
- Create: `src/components/navi/ui/IconButton.tsx`
- Test: `src/components/navi/ui/__tests__/IconButton.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IconButton } from "@/components/navi/ui/IconButton";

describe("IconButton", () => {
  it("uses the required label as its accessible name", () => {
    render(<IconButton label="Save to wishlist" icon={<svg />} />);
    expect(screen.getByRole("button", { name: "Save to wishlist" })).toBeInTheDocument();
  });

  it("marks the icon decorative and applies variant class", () => {
    render(<IconButton label="Like" icon={<svg data-testid="i" />} variant="outline" />);
    const btn = screen.getByRole("button", { name: "Like" });
    expect(btn).toHaveClass("nv-icon-btn", "nv-icon-btn--outline");
    expect(screen.getByTestId("i").parentElement).toHaveAttribute("aria-hidden", "true");
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- IconButton`.

- [ ] **Step 3: Implement**

`src/components/navi/ui/IconButton.tsx`:

```tsx
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "transparent" | "outline";
type Size = "sm" | "md" | "lg";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  icon: ReactNode;
  variant?: Variant;
  size?: Size;
};

export function IconButton({
  label,
  icon,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`nv-icon-btn nv-icon-btn--${variant} nv-icon-btn--${size} ${className}`.trim()}
      {...rest}
    >
      <span className="nv-btn-icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--nv-r-pill);
  cursor: pointer;
  background: var(--nv-surface);
  color: var(--nv-text);
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.nv-icon-btn--sm { width: 32px; height: 32px; }
.nv-icon-btn--md { width: 40px; height: 40px; }
.nv-icon-btn--lg { width: 48px; height: 48px; }
.nv-icon-btn--outline { border-color: var(--nv-action); color: var(--nv-action); }
.nv-icon-btn--transparent { background: transparent; }
.nv-icon-btn:hover { color: var(--nv-action); border-color: var(--nv-action); }
.nv-icon-btn:disabled { color: #b7b4ba; border-color: transparent; cursor: not-allowed; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- IconButton`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/ui/IconButton.tsx src/components/navi/ui/__tests__/IconButton.test.tsx src/app/globals.css
git commit -m "feat(navi): IconButton with required a11y label"
```

---

### Task 7: Tag

**Files:**
- Create: `src/components/navi/ui/Tag.tsx`
- Test: `src/components/navi/ui/__tests__/Tag.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tag } from "@/components/navi/ui/Tag";

describe("Tag", () => {
  it("renders its text and default neutral tone", () => {
    render(<Tag>Popular</Tag>);
    const tag = screen.getByText("Popular");
    expect(tag).toHaveClass("nv-tag", "nv-tag--neutral");
  });

  it("applies the local tone (category, distinct from rating green)", () => {
    render(<Tag tone="local">Locally-owned</Tag>);
    expect(screen.getByText("Locally-owned")).toHaveClass("nv-tag--local");
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Tag`.

- [ ] **Step 3: Implement**

`src/components/navi/ui/Tag.tsx`:

```tsx
import type { ReactNode } from "react";

type Tone = "neutral" | "popular" | "local";

export function Tag({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`nv-tag nv-tag--${tone}`}>{children}</span>;
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--nv-r-pill);
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--nv-surface-muted);
  color: var(--nv-text);
}
.nv-tag--popular { background: color-mix(in srgb, var(--nv-action) 14%, white); color: var(--nv-action-strong); }
.nv-tag--local { background: #e6f0e8; color: #2f5d3c; } /* category green — distinct from rating */
```

- [ ] **Step 5: Run → PASS.** `npm test -- Tag`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/ui/Tag.tsx src/components/navi/ui/__tests__/Tag.test.tsx src/app/globals.css
git commit -m "feat(navi): Tag (category chip) with distinct tones"
```

---

### Task 8: ImpactSignal

**Files:**
- Create: `src/components/navi/ui/ImpactSignal.tsx`
- Test: `src/components/navi/ui/__tests__/ImpactSignal.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImpactSignal } from "@/components/navi/ui/ImpactSignal";

describe("ImpactSignal", () => {
  it("renders the impact phrase with a labelled, decorative icon", () => {
    render(<ImpactSignal>Funds Prospect Park tree care</ImpactSignal>);
    const el = screen.getByText("Funds Prospect Park tree care");
    expect(el.closest(".nv-impact")).toBeInTheDocument();
    // group is labelled for assistive tech so it reads as an impact note
    expect(screen.getByRole("note")).toHaveAccessibleName(/impact/i);
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- ImpactSignal`.

- [ ] **Step 3: Implement**

`src/components/navi/ui/ImpactSignal.tsx`:

```tsx
import type { ReactNode } from "react";

export function ImpactSignal({
  children,
  as: As = "span",
}: {
  children: ReactNode;
  as?: "span" | "div";
}) {
  return (
    <As className="nv-impact" role="note" aria-label="Regenerative impact">
      <span className="nv-impact-icon" aria-hidden="true">
        {/* leaf glyph */}
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          <path d="M13 2C7 2 3 5 3 11c0 1 0 2 .5 3C5 11 8 9 12 8c-3 2-5 4-6 7 5 0 8-4 8-10 0-1 0-2-1-3z" />
        </svg>
      </span>
      <span className="nv-impact-text">{children}</span>
    </As>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-impact {
  display: inline-flex;
  align-items: center;
  gap: var(--nv-sp-2xs);
  font-size: 0.82rem;
  color: #2f5d3c;
}
.nv-impact-icon { display: inline-flex; color: #3a7d4f; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- ImpactSignal`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/ui/ImpactSignal.tsx src/components/navi/ui/__tests__/ImpactSignal.test.tsx src/app/globals.css
git commit -m "feat(navi): ImpactSignal — card-level regenerative signal"
```

---

### Task 9: Rating (single-color brand badge + numeral)

**Files:**
- Create: `src/components/navi/ui/Rating.tsx`
- Test: `src/components/navi/ui/__tests__/Rating.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Rating } from "@/components/navi/ui/Rating";

describe("Rating", () => {
  it("renders the numeral and an accessible label", () => {
    render(<Rating value={4.9} reviews={213} />);
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByLabelText("Rated 4.9 out of 5, 213 reviews")).toBeInTheDocument();
  });

  it("omits reviews phrasing when not provided", () => {
    render(<Rating value={5} />);
    expect(screen.getByLabelText("Rated 5 out of 5")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Rating`.

- [ ] **Step 3: Implement**

`src/components/navi/ui/Rating.tsx`:

```tsx
export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  const label =
    reviews != null
      ? `Rated ${value} out of 5, ${reviews} reviews`
      : `Rated ${value} out of 5`;
  return (
    <span className="nv-rating" aria-label={label}>
      <span className="nv-rating-badge" aria-hidden="true">
        {value}
      </span>
      {reviews != null && <span className="nv-rating-reviews" aria-hidden="true">{reviews} reviews</span>}
    </span>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-rating { display: inline-flex; align-items: center; gap: var(--nv-sp-xs); }
.nv-rating-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--nv-r-sm);
  background: var(--nv-action);
  color: #fff;
  font-weight: 700;
  font-size: 0.82rem;
}
.nv-rating-reviews { color: var(--nv-text-muted); font-size: 0.82rem; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- Rating`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/ui/Rating.tsx src/components/navi/ui/__tests__/Rating.test.tsx src/app/globals.css
git commit -m "feat(navi): Rating as single-color brand badge + numeral (colorblind-safe)"
```

---

### Task 10: Avatar

**Files:**
- Create: `src/components/navi/ui/Avatar.tsx`
- Test: `src/components/navi/ui/__tests__/Avatar.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar } from "@/components/navi/ui/Avatar";

describe("Avatar", () => {
  it("renders initials from the name when no image is given", () => {
    render(<Avatar name="Janice Doeherty" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByLabelText("Janice Doeherty")).toHaveClass("nv-avatar--md");
  });

  it("renders an image with alt when src is provided", () => {
    render(<Avatar name="Janice Doeherty" src="/janice.jpg" size="lg" />);
    const img = screen.getByRole("img", { name: "Janice Doeherty" });
    expect(img).toHaveAttribute("src", "/janice.jpg");
    expect(img.closest(".nv-avatar")).toHaveClass("nv-avatar--lg");
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Avatar`.

- [ ] **Step 3: Implement**

`src/components/navi/ui/Avatar.tsx`:

```tsx
type Size = "sm" | "md" | "lg";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: Size;
}) {
  if (src) {
    return (
      <span className={`nv-avatar nv-avatar--${size}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} />
      </span>
    );
  }
  return (
    <span className={`nv-avatar nv-avatar--${size}`} role="img" aria-label={name}>
      <span aria-hidden="true">{initials(name)}</span>
    </span>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--nv-r-pill);
  background: var(--nv-surface-muted);
  color: var(--nv-text);
  font-weight: 700;
  overflow: hidden;
}
.nv-avatar img { width: 100%; height: 100%; object-fit: cover; }
.nv-avatar--sm { width: 28px; height: 28px; font-size: 0.7rem; }
.nv-avatar--md { width: 40px; height: 40px; font-size: 0.85rem; }
.nv-avatar--lg { width: 56px; height: 56px; font-size: 1rem; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- Avatar`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/ui/Avatar.tsx src/components/navi/ui/__tests__/Avatar.test.tsx src/app/globals.css
git commit -m "feat(navi): Avatar (initials + image, sizes)"
```

---

### Task 11: Tabs

**Files:**
- Create: `src/components/navi/ui/Tabs.tsx`
- Test: `src/components/navi/ui/__tests__/Tabs.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Tabs } from "@/components/navi/ui/Tabs";

const items = [
  { id: "learn", label: "Learn" },
  { id: "plan", label: "Plan" },
  { id: "go", label: "Go" },
];

describe("Tabs", () => {
  it("renders a tablist with the active tab selected", () => {
    render(<Tabs items={items} value="learn" onChange={() => {}} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Learn" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Plan" })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onChange with the tab id when clicked", async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="learn" onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Go" }));
    expect(onChange).toHaveBeenCalledWith("go");
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Tabs`.

- [ ] **Step 3: Implement** — `src/components/navi/ui/Tabs.tsx`:

```tsx
"use client";

type Item = { id: string; label: string };

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: Item[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="nv-tabs" role="tablist">
      {items.map((it) => {
        const selected = it.id === value;
        return (
          <button
            key={it.id}
            role="tab"
            type="button"
            aria-selected={selected}
            className={`nv-tab${selected ? " nv-tab--selected" : ""}`}
            onClick={() => onChange(it.id)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-tabs { display: inline-flex; gap: var(--nv-sp-lg); border-bottom: 1px solid var(--nv-border); }
.nv-tab {
  background: none;
  border: none;
  padding: var(--nv-sp-xs) 0;
  font-weight: 700;
  color: var(--nv-text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.nv-tab:hover { color: var(--nv-action); }
.nv-tab--selected { color: var(--nv-text); border-bottom-color: var(--nv-action); }
```

- [ ] **Step 5: Run → PASS.** `npm test -- Tabs`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/ui/Tabs.tsx src/components/navi/ui/__tests__/Tabs.test.tsx src/app/globals.css
git commit -m "feat(navi): Tabs (ARIA tablist, selected via underline not color-only)"
```

---

### Task 12: Accordion

**Files:**
- Create: `src/components/navi/ui/Accordion.tsx`
- Test: `src/components/navi/ui/__tests__/Accordion.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Accordion } from "@/components/navi/ui/Accordion";

const items = [
  { id: "bring", title: "What to bring", content: "Comfortable shoes." },
  { id: "impact", title: "Impact initiative", content: "Funds park tree care." },
];

describe("Accordion", () => {
  it("renders collapsed rows with aria-expanded false", () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole("button", { name: "What to bring" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands a row on click and reveals its content", async () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole("button", { name: "Impact initiative" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Funds park tree care.")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Accordion`.

- [ ] **Step 3: Implement** — `src/components/navi/ui/Accordion.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Item = { id: string; title: string; content: ReactNode };

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="nv-accordion">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id} className="nv-accordion-row">
            <button
              type="button"
              className="nv-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`nv-acc-${it.id}`}
              onClick={() => setOpen(isOpen ? null : it.id)}
            >
              <span>{it.title}</span>
              <span className="nv-accordion-chevron" aria-hidden="true">
                {isOpen ? "▴" : "▾"}
              </span>
            </button>
            <div id={`nv-acc-${it.id}`} role="region" hidden={!isOpen} className="nv-accordion-panel">
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-accordion-row { border-bottom: 1px solid var(--nv-border); }
.nv-accordion-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  padding: var(--nv-sp-md) 0;
  font-weight: 700;
  color: var(--nv-text);
  cursor: pointer;
}
.nv-accordion-panel { padding-bottom: var(--nv-sp-md); color: var(--nv-text-muted); }
```

- [ ] **Step 5: Run → PASS.** `npm test -- Accordion`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/ui/Accordion.tsx src/components/navi/ui/__tests__/Accordion.test.tsx src/app/globals.css
git commit -m "feat(navi): Accordion (aria-expanded, region panels)"
```

---

### Task 13: Tooltip

**Files:**
- Create: `src/components/navi/ui/Tooltip.tsx`
- Test: `src/components/navi/ui/__tests__/Tooltip.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Tooltip } from "@/components/navi/ui/Tooltip";

describe("Tooltip", () => {
  it("associates the trigger with the tip via aria-describedby", () => {
    render(
      <Tooltip content="Why this pick">
        <button type="button">info</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "info" });
    const tipId = trigger.getAttribute("aria-describedby");
    expect(tipId).toBeTruthy();
    expect(document.getElementById(tipId as string)).toHaveTextContent("Why this pick");
  });

  it("reveals the tip on focus", async () => {
    render(
      <Tooltip content="Why this pick">
        <button type="button">info</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.getByText("Why this pick")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Tooltip`.

- [ ] **Step 3: Implement** — `src/components/navi/ui/Tooltip.tsx`:

```tsx
"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span
      className="nv-tooltip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={id}>{children}</span>
      <span role="tooltip" id={id} className="nv-tooltip-bubble" hidden={!open}>
        {content}
      </span>
    </span>
  );
}
```

Note: the trigger `children` must be a focusable element (e.g. a `<button>`); `aria-describedby` is placed on a wrapper span, and the bubble carries `role="tooltip"`.

- [ ] **Step 4: CSS** — append:

```css
.nv-tooltip { position: relative; display: inline-flex; }
.nv-tooltip-bubble {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--nv-robinson);
  color: #fff;
  padding: var(--nv-sp-xs) var(--nv-sp-sm);
  border-radius: var(--nv-r-sm);
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 10;
}
```

- [ ] **Step 5: Run → PASS.** `npm test -- Tooltip`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/ui/Tooltip.tsx src/components/navi/ui/__tests__/Tooltip.test.tsx src/app/globals.css
git commit -m "feat(navi): Tooltip (hover/focus, aria-describedby)"
```

---

### Task 14: SearchInput + Label

**Files:**
- Create: `src/components/navi/ui/Label.tsx`
- Create: `src/components/navi/ui/SearchInput.tsx`
- Test: `src/components/navi/ui/__tests__/SearchInput.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test** (covers Label + SearchInput together)

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Label } from "@/components/navi/ui/Label";
import { SearchInput } from "@/components/navi/ui/SearchInput";

describe("Label", () => {
  it("marks required fields with an accessible required indicator", () => {
    render(<Label htmlFor="x" required>Email</Label>);
    expect(screen.getByText("Email").closest("label")).toHaveAttribute("for", "x");
    expect(screen.getByLabelText("required")).toBeInTheDocument();
  });

  it("shows an optional hint when optional", () => {
    render(<Label htmlFor="y" optional>Phone</Label>);
    expect(screen.getByText(/optional/i)).toBeInTheDocument();
  });
});

describe("SearchInput", () => {
  it("renders a labelled searchbox and reports typed value", async () => {
    const onChange = vi.fn();
    render(<SearchInput label="Search experiences" value="" onChange={onChange} />);
    const box = screen.getByRole("searchbox", { name: "Search experiences" });
    await userEvent.type(box, "park");
    expect(onChange).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- SearchInput`.

- [ ] **Step 3: Implement `Label`** — `src/components/navi/ui/Label.tsx`:

```tsx
import type { ReactNode } from "react";

export function Label({
  htmlFor,
  required,
  optional,
  help,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label className="nv-label" htmlFor={htmlFor}>
      <span>{children}</span>
      {required && (
        <span className="nv-label-required" aria-label="required">
          *
        </span>
      )}
      {optional && <span className="nv-label-optional"> (optional)</span>}
      {help && (
        <span className="nv-label-help" role="img" aria-label={help}>
          ?
        </span>
      )}
    </label>
  );
}
```

- [ ] **Step 4: Implement `SearchInput`** — `src/components/navi/ui/SearchInput.tsx`:

```tsx
"use client";

import { useId } from "react";

export function SearchInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="nv-search">
      <label htmlFor={id} className="nv-sr-only">
        {label}
      </label>
      <span className="nv-search-icon" aria-hidden="true">
        ⌕
      </span>
      <input
        id={id}
        type="search"
        className="nv-search-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
```

- [ ] **Step 5: CSS** — append (includes `.nv-sr-only` used by SearchInput):

```css
.nv-sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0);
  white-space: nowrap; border: 0;
}
.nv-label { display: inline-flex; align-items: baseline; gap: 2px; font-weight: 700; }
.nv-label-required { color: var(--nv-error); }
.nv-label-optional { color: var(--nv-text-muted); font-weight: 400; }
.nv-label-help {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; border-radius: var(--nv-r-pill);
  background: var(--nv-info); color: #fff; font-size: 0.7rem; margin-left: 4px;
}
.nv-search {
  display: inline-flex; align-items: center; gap: var(--nv-sp-xs);
  border: 1px solid var(--nv-border); border-radius: var(--nv-r-pill);
  padding: var(--nv-sp-xs) var(--nv-sp-md); background: var(--nv-surface);
}
.nv-search-input { border: none; outline: none; background: none; min-width: 16rem; font: inherit; }
```

- [ ] **Step 6: Run → PASS.** `npm test -- SearchInput`.

- [ ] **Step 7: Commit**

```bash
git add src/components/navi/ui/Label.tsx src/components/navi/ui/SearchInput.tsx src/components/navi/ui/__tests__/SearchInput.test.tsx src/app/globals.css
git commit -m "feat(navi): Label (semantic error/info) + SearchInput (searchbox role)"
```

---

### Task 15: CarouselArrow + PaginationDots

**Files:**
- Create: `src/components/navi/ui/CarouselArrow.tsx`
- Create: `src/components/navi/ui/PaginationDots.tsx`
- Test: `src/components/navi/ui/__tests__/Carousel.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CarouselArrow } from "@/components/navi/ui/CarouselArrow";
import { PaginationDots } from "@/components/navi/ui/PaginationDots";

describe("CarouselArrow", () => {
  it("uses a directional accessible label and fires onClick", async () => {
    const onClick = vi.fn();
    render(<CarouselArrow direction="next" label="Next photo" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("PaginationDots", () => {
  it("renders count dots and marks the active one", () => {
    render(<PaginationDots count={4} active={2} onSelect={() => {}} />);
    const dots = screen.getAllByRole("tab");
    expect(dots).toHaveLength(4);
    expect(dots[2]).toHaveAttribute("aria-selected", "true");
  });

  it("selects a dot on click", async () => {
    const onSelect = vi.fn();
    render(<PaginationDots count={3} active={0} onSelect={onSelect} />);
    await userEvent.click(screen.getAllByRole("tab")[1]);
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Carousel`.

- [ ] **Step 3: Implement `CarouselArrow`** — `src/components/navi/ui/CarouselArrow.tsx`:

```tsx
"use client";

export function CarouselArrow({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`nv-carousel-arrow nv-carousel-arrow--${direction}`}
    >
      <span aria-hidden="true">{direction === "next" ? "›" : "‹"}</span>
    </button>
  );
}
```

- [ ] **Step 4: Implement `PaginationDots`** — `src/components/navi/ui/PaginationDots.tsx`:

```tsx
"use client";

export function PaginationDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="nv-dots" role="tablist" aria-label="Slides">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          role="tab"
          type="button"
          aria-selected={i === active}
          aria-label={`Slide ${i + 1}`}
          className={`nv-dot${i === active ? " nv-dot--active" : ""}`}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: CSS** — append:

```css
.nv-carousel-arrow {
  width: 40px; height: 40px; border-radius: var(--nv-r-pill);
  border: 1px solid var(--nv-border); background: var(--nv-surface);
  color: var(--nv-text); font-size: 1.2rem; cursor: pointer;
}
.nv-carousel-arrow:hover { border-color: var(--nv-action); color: var(--nv-action); }
.nv-carousel-arrow:disabled { color: #c1bec4; cursor: not-allowed; }
.nv-dots { display: inline-flex; gap: var(--nv-sp-xs); }
.nv-dot {
  width: 10px; height: 10px; border-radius: var(--nv-r-pill);
  border: 1px solid var(--nv-border); background: transparent; cursor: pointer; padding: 0;
}
.nv-dot--active { background: var(--nv-action); border-color: var(--nv-action); }
```

- [ ] **Step 6: Run → PASS.** `npm test -- Carousel`.

- [ ] **Step 7: Commit**

```bash
git add src/components/navi/ui/CarouselArrow.tsx src/components/navi/ui/PaginationDots.tsx src/components/navi/ui/__tests__/Carousel.test.tsx src/app/globals.css
git commit -m "feat(navi): CarouselArrow + PaginationDots (shape + corrected-orange active state)"
```

---

### Task 16: MapPin + Card

**Files:**
- Create: `src/components/navi/ui/MapPin.tsx`
- Create: `src/components/navi/ui/Card.tsx`
- Test: `src/components/navi/ui/__tests__/MapPin.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MapPin } from "@/components/navi/ui/MapPin";
import { Card } from "@/components/navi/ui/Card";

describe("MapPin", () => {
  it("renders a place pin with its value and selected modifier", () => {
    render(<MapPin kind="place" value="$48" selected />);
    expect(screen.getByText("$48")).toBeInTheDocument();
    expect(screen.getByText("$48").closest(".nv-pin")).toHaveClass(
      "nv-pin--place",
      "nv-pin--selected",
    );
  });

  it("renders a location pin without a value", () => {
    render(<MapPin kind="location" />);
    expect(document.querySelector(".nv-pin--location")).toBeInTheDocument();
  });
});

describe("Card", () => {
  it("renders children inside a padded surface", () => {
    render(<Card padded>body</Card>);
    const card = screen.getByText("body");
    expect(card).toHaveClass("nv-card", "nv-card--padded");
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- MapPin`.

- [ ] **Step 3: Implement `MapPin`** — `src/components/navi/ui/MapPin.tsx`:

```tsx
type Kind = "place" | "location";

export function MapPin({
  kind = "place",
  value,
  selected,
  filled = true,
}: {
  kind?: Kind;
  value?: string;
  selected?: boolean;
  filled?: boolean;
}) {
  return (
    <span
      className={`nv-pin nv-pin--${kind}${selected ? " nv-pin--selected" : ""}${
        filled ? "" : " nv-pin--hollow"
      }`}
    >
      {value && <span className="nv-pin-value">{value}</span>}
    </span>
  );
}
```

- [ ] **Step 4: Implement `Card`** — `src/components/navi/ui/Card.tsx`:

```tsx
import type { ReactNode } from "react";

export function Card({ children, padded }: { children: ReactNode; padded?: boolean }) {
  return <div className={`nv-card${padded ? " nv-card--padded" : ""}`}>{children}</div>;
}
```

- [ ] **Step 5: CSS** — append (place pin uses action-strong + dark text for legibility over map imagery):

```css
.nv-card { background: var(--nv-surface); border: 1px solid var(--nv-border); border-radius: var(--nv-r-md); }
.nv-card--padded { padding: var(--nv-sp-md); }
.nv-pin {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 36px; height: 28px; padding: 0 8px;
  border-radius: var(--nv-r-pill);
  font-size: 0.78rem; font-weight: 700;
  border: 1.5px solid #fff; /* white halo keeps the pin legible over the map */
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.nv-pin--place { background: var(--nv-action); color: #fff; }
.nv-pin--place.nv-pin--selected { background: var(--nv-action-strong); }
.nv-pin--location { background: #2f7d4f; color: #fff; min-width: 16px; }
.nv-pin--hollow { background: #fff; color: var(--nv-action); }
```

- [ ] **Step 6: Run → PASS.** `npm test -- MapPin`.

- [ ] **Step 7: Commit**

```bash
git add src/components/navi/ui/MapPin.tsx src/components/navi/ui/Card.tsx src/components/navi/ui/__tests__/MapPin.test.tsx src/app/globals.css
git commit -m "feat(navi): MapPin (legible-over-map system) + Card surface"
```

---

### Task 17: Barrel export

**Files:**
- Create: `src/components/navi/ui/index.ts`
- Test: `src/components/navi/ui/__tests__/index.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from "vitest";
import * as ui from "@/components/navi/ui";

describe("ui barrel", () => {
  it("exports every component", () => {
    for (const name of [
      "Button", "IconButton", "Tag", "Label", "ImpactSignal", "Rating",
      "Avatar", "Tabs", "Accordion", "Tooltip", "SearchInput",
      "CarouselArrow", "PaginationDots", "MapPin", "Card",
    ]) {
      expect(ui).toHaveProperty(name);
    }
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- ui/__tests__/index`.

- [ ] **Step 3: Implement** — `src/components/navi/ui/index.ts`:

```ts
export { Button } from "./Button";
export { IconButton } from "./IconButton";
export { Tag } from "./Tag";
export { Label } from "./Label";
export { ImpactSignal } from "./ImpactSignal";
export { Rating } from "./Rating";
export { Avatar } from "./Avatar";
export { Tabs } from "./Tabs";
export { Accordion } from "./Accordion";
export { Tooltip } from "./Tooltip";
export { SearchInput } from "./SearchInput";
export { CarouselArrow } from "./CarouselArrow";
export { PaginationDots } from "./PaginationDots";
export { MapPin } from "./MapPin";
export { Card } from "./Card";
```

- [ ] **Step 4: Run → PASS.** `npm test -- ui/__tests__/index`.

- [ ] **Step 5: Commit**

```bash
git add src/components/navi/ui/index.ts src/components/navi/ui/__tests__/index.test.ts
git commit -m "feat(navi): ui barrel export"
```

---

## Phase C — The `/work/navi/system` page

### Task 18: Specimen wrapper

**Files:**
- Create: `src/components/navi/system/Specimen.tsx`
- Test: `src/components/navi/system/__tests__/Specimen.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Specimen } from "@/components/navi/system/Specimen";

describe("Specimen", () => {
  it("renders a titled, optionally-noted region around its children", () => {
    render(
      <Specimen title="Button" note="Contrast-corrected to --nv-action.">
        <button type="button">x</button>
      </Specimen>,
    );
    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByText("Contrast-corrected to --nv-action.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "x" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Specimen`.

- [ ] **Step 3: Implement** — `src/components/navi/system/Specimen.tsx`:

```tsx
import type { ReactNode } from "react";

export function Specimen({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="nv-specimen">
      <h3 className="nv-specimen-title">{title}</h3>
      {note && <p className="nv-specimen-note">{note}</p>}
      <div className="nv-specimen-stage">{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-specimen { padding: var(--nv-sp-xl) 0; border-bottom: 1px solid var(--nv-border); }
.nv-specimen-title { font-size: 1.25rem; margin-bottom: var(--nv-sp-2xs); }
.nv-specimen-note { color: var(--nv-text-muted); margin-bottom: var(--nv-sp-md); max-width: 60ch; }
.nv-specimen-stage { display: flex; flex-wrap: wrap; gap: var(--nv-sp-md); align-items: center; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- Specimen`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/system/Specimen.tsx src/components/navi/system/__tests__/Specimen.test.tsx src/app/globals.css
git commit -m "feat(navi): Specimen wrapper for the system gallery"
```

---

### Task 19: PropPlayground (live controls + props readout)

**Files:**
- Create: `src/components/navi/system/PropPlayground.tsx`
- Test: `src/components/navi/system/__tests__/PropPlayground.test.tsx`
- Modify: `src/app/globals.css`

The playground is generic: it takes a list of control definitions, holds their state, renders the live component via a render-prop, and shows a JSX readout.

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { PropPlayground } from "@/components/navi/system/PropPlayground";
import { Button } from "@/components/navi/ui/Button";

describe("PropPlayground", () => {
  const controls = [
    { name: "variant", options: ["primary", "outline"] },
    { name: "size", options: ["sm", "md", "lg"] },
  ];

  it("renders the live component and a props readout", () => {
    render(
      <PropPlayground
        component="Button"
        controls={controls}
        initial={{ variant: "primary", size: "md" }}
        render={(p) => <Button variant={p.variant as "primary"} size={p.size as "md"}>Go</Button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("nv-btn--primary");
    expect(screen.getByTestId("nv-playground-code")).toHaveTextContent('variant="primary"');
  });

  it("updates the live component when a control changes", async () => {
    render(
      <PropPlayground
        component="Button"
        controls={controls}
        initial={{ variant: "primary", size: "md" }}
        render={(p) => <Button variant={p.variant as "primary"} size={p.size as "md"}>Go</Button>}
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "outline" }));
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("nv-btn--outline");
    expect(screen.getByTestId("nv-playground-code")).toHaveTextContent('variant="outline"');
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- PropPlayground`.

- [ ] **Step 3: Implement** — `src/components/navi/system/PropPlayground.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Control = { name: string; options: string[] };
type Values = Record<string, string>;

export function PropPlayground({
  component,
  controls,
  initial,
  render,
}: {
  component: string;
  controls: Control[];
  initial: Values;
  render: (values: Values) => ReactNode;
}) {
  const [values, setValues] = useState<Values>(initial);
  const code = `<${component} ${Object.entries(values)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ")} />`;

  return (
    <div className="nv-playground">
      <div className="nv-playground-stage">{render(values)}</div>
      <div className="nv-playground-controls">
        {controls.map((c) => (
          <fieldset key={c.name} className="nv-playground-control" role="radiogroup" aria-label={c.name}>
            <legend>{c.name}</legend>
            {c.options.map((opt) => (
              <label key={opt} className="nv-playground-opt">
                <input
                  type="radio"
                  name={c.name}
                  checked={values[c.name] === opt}
                  onChange={() => setValues((v) => ({ ...v, [c.name]: opt }))}
                />
                {opt}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <pre className="nv-playground-code" data-testid="nv-playground-code">
        {code}
      </pre>
    </div>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-playground { display: grid; gap: var(--nv-sp-md); border: 1px solid var(--nv-border); border-radius: var(--nv-r-lg); padding: var(--nv-sp-lg); }
.nv-playground-stage { display: flex; justify-content: center; padding: var(--nv-sp-lg); background: var(--nv-surface-muted); border-radius: var(--nv-r-md); }
.nv-playground-controls { display: flex; flex-wrap: wrap; gap: var(--nv-sp-lg); }
.nv-playground-control { border: none; padding: 0; display: flex; gap: var(--nv-sp-sm); align-items: center; }
.nv-playground-control legend { font-weight: 700; margin-right: var(--nv-sp-xs); }
.nv-playground-opt { display: inline-flex; gap: 4px; align-items: center; }
.nv-playground-code { background: var(--nv-robinson); color: #fff; padding: var(--nv-sp-sm); border-radius: var(--nv-r-sm); font-size: 0.82rem; overflow-x: auto; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- PropPlayground`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/system/PropPlayground.tsx src/components/navi/system/__tests__/PropPlayground.test.tsx src/app/globals.css
git commit -m "feat(navi): PropPlayground (live controls + JSX readout)"
```

---

### Task 20: System page assembly

**Files:**
- Create: `src/app/work/navi/(minisite)/system/page.tsx`
- Test: `src/components/navi/system/__tests__/system-page.test.tsx`

The page composes Specimens (gallery) + at least one PropPlayground (Button), with documented correction notes (contrast, rating-to-mono, off-palette → semantic tokens).

- [ ] **Step 1: Failing test** (test the page's default export as a component)

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SystemPage from "@/app/work/navi/(minisite)/system/page";

describe("System page", () => {
  it("renders the gallery heading and a documented correction note", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { name: /design system/i })).toBeInTheDocument();
    expect(screen.getByText(/accessible derivation/i)).toBeInTheDocument();
  });

  it("renders specimens for the core components", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Rating" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Impact signal" })).toBeInTheDocument();
  });

  it("renders the interactive Button playground", () => {
    render(<SystemPage />);
    expect(screen.getByTestId("nv-playground-code")).toHaveTextContent("<Button");
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- system-page`.

- [ ] **Step 3: Implement** — `src/app/work/navi/(minisite)/system/page.tsx`:

```tsx
"use client";

import { Specimen } from "@/components/navi/system/Specimen";
import { PropPlayground } from "@/components/navi/system/PropPlayground";
import {
  Button,
  IconButton,
  Tag,
  Rating,
  ImpactSignal,
  Avatar,
  MapPin,
} from "@/components/navi/ui";

export default function SystemPage() {
  return (
    <div className="nv-system">
      <header className="nv-system-head">
        <h1>Navi design system</h1>
        <p>
          The Navi component library, rebuilt as live React. The source system used bright orange
          (#F3722C) for emphasis; it failed WCAG AA on every button, so this build documents the
          accessible derivation (#C4541A, 4.54:1) and applies it system-wide.
        </p>
      </header>

      <Specimen title="Button" note="Interactive surfaces use --nv-action (contrast-corrected).">
        <Button variant="primary">Primary</Button>
        <Button variant="transparent">Transparent</Button>
        <Button variant="outline">Outline</Button>
        <Button disabled>Disabled</Button>
      </Specimen>

      <Specimen title="Live playground" note="Flip props and watch the component + JSX update.">
        <PropPlayground
          component="Button"
          controls={[
            { name: "variant", options: ["primary", "transparent", "outline"] },
            { name: "size", options: ["sm", "md", "lg"] },
          ]}
          initial={{ variant: "primary", size: "md" }}
          render={(p) => (
            <Button variant={p.variant as "primary"} size={p.size as "md"}>
              Reserve now
            </Button>
          )}
        />
      </Specimen>

      <Specimen title="Rating" note="Replaced the source traffic-light scale with a single brand badge + numeral — colorblind-safe and AA-compliant.">
        <Rating value={4.9} reviews={213} />
        <Rating value={5} />
      </Specimen>

      <Specimen title="Impact signal" note="New component (not in the source Figma): surfaces an experience's regenerative impact in the card scan.">
        <ImpactSignal>Funds Prospect Park tree care</ImpactSignal>
      </Specimen>

      <Specimen title="Tag" note="Category chips. Green here is distinct from the rating badge to fix the source's green overload.">
        <Tag tone="neutral">Cooking</Tag>
        <Tag tone="popular">Popular</Tag>
        <Tag tone="local">Locally-owned</Tag>
      </Specimen>

      <Specimen title="Avatar">
        <Avatar name="Janice Doeherty" size="sm" />
        <Avatar name="Janice Doeherty" size="md" />
        <Avatar name="Janice Doeherty" size="lg" />
      </Specimen>

      <Specimen title="Map pin" note="One pin system: orange place pins (darken when selected, white halo for legibility over imagery) + green current-location pin.">
        <MapPin kind="place" value="$48" />
        <MapPin kind="place" value="$48" selected />
        <MapPin kind="location" />
      </Specimen>

      <Specimen title="Icon button">
        <IconButton label="Save to wishlist" icon={<span>♥</span>} variant="outline" />
      </Specimen>
    </div>
  );
}
```

Note: include further Specimens (Tabs, Accordion, Tooltip, SearchInput, Carousel controls) following the same pattern; the three asserted in the test (Button, Rating, Impact signal) plus the playground are the minimum for the test to pass.

- [ ] **Step 4: Append page CSS** to `globals.css`:

```css
.nv-system { max-width: 60rem; margin: 0 auto; padding: var(--nv-sp-xl) var(--nv-sp-lg); }
.nv-system-head h1 { font-size: 2rem; }
.nv-system-head p { color: var(--nv-text-muted); max-width: 65ch; margin-top: var(--nv-sp-sm); }
```

- [ ] **Step 5: Run → PASS.** `npm test -- system-page`.

- [ ] **Step 6: Run the full suite + typecheck**

Run: `npm test && npx tsc --noEmit`
Expected: all tests pass, no type errors.

- [ ] **Step 7: Preview verification** (what unit tests can't see)

```
- preview_start, navigate to /work/navi/system
- preview_screenshot — confirm Navi chrome (light + orange), components render
- preview_resize to 375px — confirm header collapses, layout holds
- preview_console_logs — no errors/hydration warnings
- Tab through the playground — confirm focus rings use --nv-action and are visible
```

- [ ] **Step 8: Commit**

```bash
git add src/app/work/navi/ src/components/navi/system/__tests__/system-page.test.tsx src/app/globals.css
git commit -m "feat(navi): /work/navi/system gallery + live playground with documented corrections"
```

---

## Self-Review

**Spec coverage (Plan 1 scope = §4 routes [system], §5 tokens, §6 + §6.1 components):**
- §5 token foundation + two-tier model + AA-corrected action → Task 3 ✓
- §6 component set (Button, IconButton, Tag, Label, Rating, Avatar, Tabs, Accordion, Tooltip, SearchInput, Carousel controls, MapPin, Card, ImpactSignal) → Tasks 5–17 ✓
- §6.1 corrections: action-orange cascade (all component CSS uses `--nv-action`) ✓; Rating → mono badge (Task 9) ✓; Label off-palette → `--nv-error`/`--nv-info` (Task 14) ✓; Tag/Rating green disambiguation (Task 7 vs 9) ✓; MapPin legibility (Task 16) ✓
- §3 ImpactSignal (regenerative) → Task 8 ✓; surfaced in system page → Task 20 ✓
- System page gallery + live playground (§6) → Tasks 18–20 ✓
- Scoped `.nv-ui` chrome, fonts, layout (§4) → Tasks 2, 4 ✓
- **Deferred to Plan 2 (correctly out of scope here):** demo views, composite cards (ResultCard/ExperienceCard/BookingCard), the real interactive map, Gallery/lightbox, demo data, responsive TabBar nav. Not gaps.

**Placeholder scan:** No "TBD/TODO". Token alias values are concrete and marked "validate against Figma during execution" (a verification instruction, not a placeholder). The Task 20 note to add more Specimens lists the exact components and the pattern — optional additions beyond the tested minimum.

**Type/name consistency:** Class names and props match the API summary table. `--nv-action`, `--nv-action-strong`, `--nv-error`, `--nv-info` used consistently between `tokens.ts` and the `.nv-ui` CSS block. Barrel (Task 17) exports exactly the 15 components built.

---

## Execution Handoff

(See the prompt after this plan for execution options.)


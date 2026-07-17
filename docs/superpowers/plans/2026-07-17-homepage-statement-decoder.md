# Homepage Statement Decoder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's static professional tagline and separate `Also` decoder with one finite, layout-stable statement that moves from product-design positioning into three first-person personality lines.

**Architecture:** Add a focused client component that server-renders the professional statement, then runs one finite hold, scramble, and decode sequence after hydration. Integrate it in the current tagline position, reserve layout with a hidden sizing copy, and remove the old `HeroInterestTyper` component and styles only after the replacement is covered.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library

## Global Constraints

- The professional statement is present in the server-rendered first frame.
- Transitions never clear the line to an empty string.
- The sequence runs once and stops on the Absolute Batman statement.
- The current credentials line and work action remain fixed beneath it.
- Reduced-motion users receive the static professional statement with no timed text changes.
- The changing visual string is hidden from assistive technology and is not a live region.
- One static screen-reader string contains the professional statement followed by the three personality statements.
- No em dashes, semicolons, ellipses, hype language, rhetorical question-and-answer constructions, or aphoristic closers.
- All behavior changes begin with a failing regression test.
- Do not add an animation dependency.

---

## File structure

- Create `src/components/hero-statement-decoder.tsx`: owns the approved phrase sequence, reduced-motion subscription, and finite state machine.
- Create `src/components/__tests__/hero-statement-decoder.test.tsx`: covers the initial frame, finite sequence, non-empty frames, cleanup, accessibility, and reduced motion.
- Modify `src/app/page.tsx`: replaces the static tagline plus old decoder with the new component.
- Modify `src/app/__tests__/home-first-impression.test.tsx`: locks the single-statement homepage hierarchy and removal of the visible `Also` line.
- Create `src/app/__tests__/home-statement-layout.test.ts`: locks the sizing layer, primary typography, and reduced-motion CSS.
- Modify `src/app/styles/base.css`: replaces the old tagline and typer rules with one grid-stacked decoder treatment.
- Delete `src/components/hero-interest-typer.tsx`: removes the superseded component after integration.

### Task 1: Build the finite statement decoder

**Files:**
- Create: `src/components/hero-statement-decoder.tsx`
- Create: `src/components/__tests__/hero-statement-decoder.test.tsx`

**Interfaces:**
- Produces: `HeroStatementDecoder(): JSX.Element`
- Produces: one semantic paragraph with `data-testid="hero-statement-decoder"`
- Produces: `.hero-statement-decoder-sizer`, `.hero-statement-decoder-visible`, and `.hero-statement-decoder-cursor` styling hooks
- Consumes: `window.matchMedia("(prefers-reduced-motion: reduce)")`

- [ ] **Step 1: Write the failing component tests**

Create `src/components/__tests__/hero-statement-decoder.test.tsx`:

```tsx
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroStatementDecoder } from "@/components/hero-statement-decoder";

const PROFESSIONAL =
  "I design digital products and stay close through the build.";
const FINAL = "I count down to each Absolute Batman drop.";

function stubReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" && matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("HeroStatementDecoder", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the professional statement before the timer advances", () => {
    stubReducedMotion(false);
    const { container } = render(<HeroStatementDecoder />);

    expect(
      container.querySelector(".hero-statement-decoder-visible"),
    ).toHaveTextContent(PROFESSIONAL);
    expect(
      container.querySelector(".hero-statement-decoder-sizer"),
    ).toHaveTextContent(PROFESSIONAL);
  });

  it("holds the professional statement before decoding", () => {
    stubReducedMotion(false);
    const { container } = render(<HeroStatementDecoder />);
    const visible = container.querySelector(
      ".hero-statement-decoder-visible",
    );

    act(() => vi.advanceTimersByTime(1000));

    expect(visible).toHaveTextContent(PROFESSIONAL);
  });

  it("never blanks the line and stops on the Absolute Batman statement", () => {
    stubReducedMotion(false);
    const { container } = render(<HeroStatementDecoder />);
    const visible = container.querySelector(
      ".hero-statement-decoder-visible",
    );

    for (let tick = 0; tick < 600; tick += 1) {
      act(() => vi.advanceTimersByTime(38));
      expect(visible?.textContent?.replace("|", "").length).toBeGreaterThan(0);
      if (visible?.textContent?.includes(FINAL)) break;
    }

    act(() => vi.advanceTimersByTime(2000));
    expect(visible).toHaveTextContent(FINAL);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("keeps animated frames out of the accessibility tree", () => {
    stubReducedMotion(false);
    const { container } = render(<HeroStatementDecoder />);

    expect(
      container.querySelector(".hero-statement-decoder-visible"),
    ).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".sr-only")).toHaveTextContent(
      `${PROFESSIONAL} I sweat the empty states and the error copy. ` +
        "I make my own roti from scratch. " +
        FINAL,
    );
    expect(container.querySelector(".sr-only")?.textContent).not.toMatch(
      /[—;…]/,
    );
    expect(
      container.querySelector('[aria-live]:not([aria-live="off"])'),
    ).toBeNull();
  });

  it("keeps the professional statement static for reduced motion", () => {
    stubReducedMotion(true);
    const { container } = render(<HeroStatementDecoder />);

    act(() => vi.advanceTimersByTime(30000));

    expect(
      container.querySelector(".hero-statement-decoder-visible"),
    ).toHaveTextContent(PROFESSIONAL);
    expect(
      container.querySelector(".hero-statement-decoder-cursor"),
    ).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```bash
npx vitest run src/components/__tests__/hero-statement-decoder.test.tsx
```

Expected: FAIL because `@/components/hero-statement-decoder` does not exist.

- [ ] **Step 3: Implement the minimal finite decoder**

Create `src/components/hero-statement-decoder.tsx`:

```tsx
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const STATEMENTS = [
  "I design digital products and stay close through the build.",
  "I sweat the empty states and the error copy.",
  "I make my own roti from scratch.",
  "I count down to each Absolute Batman drop.",
] as const;

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*/<>+=~";
const FRAME_MS = 38;
const INITIAL_HOLD_TICKS = 30;
const HOLD_TICKS = 24;
const SCRAMBLE_TICKS = 4;

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function decodeFrame(phrase: string, resolved: number) {
  return [...phrase]
    .map((character, index) =>
      index < resolved || character === " " ? character : randomGlyph(),
    )
    .join("");
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroStatementDecoder() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const [display, setDisplay] = useState<string>(STATEMENTS[0]);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    let statementIndex = 0;
    let resolved = 0;
    let holdTicks = INITIAL_HOLD_TICKS;
    let scrambleTicks = 0;
    let mode: "hold" | "scramble" | "decode" = "hold";

    const interval = window.setInterval(() => {
      const statement = STATEMENTS[statementIndex];

      if (mode === "hold") {
        holdTicks -= 1;
        if (holdTicks > 0) return;

        if (statementIndex === STATEMENTS.length - 1) {
          setComplete(true);
          window.clearInterval(interval);
          return;
        }

        mode = "scramble";
        scrambleTicks = SCRAMBLE_TICKS;
        setDisplay(decodeFrame(statement, 0));
        return;
      }

      if (mode === "scramble") {
        scrambleTicks -= 1;
        if (scrambleTicks > 0) {
          setDisplay(decodeFrame(statement, 0));
          return;
        }

        statementIndex += 1;
        resolved = 0;
        mode = "decode";
        setDisplay(decodeFrame(STATEMENTS[statementIndex], resolved));
        return;
      }

      const nextStatement = STATEMENTS[statementIndex];
      resolved += 1;
      setDisplay(decodeFrame(nextStatement, resolved));

      if (resolved >= nextStatement.length) {
        setDisplay(nextStatement);
        mode = "hold";
        holdTicks = HOLD_TICKS;
      }
    }, FRAME_MS);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const visibleDisplay = reducedMotion ? STATEMENTS[0] : display;
  const visibleComplete = reducedMotion || complete;

  return (
    <p
      className="hero-statement-decoder"
      data-testid="hero-statement-decoder"
      aria-live="off"
    >
      <span className="hero-statement-decoder-sizer" aria-hidden="true">
        {STATEMENTS[0]}
      </span>
      <span className="hero-statement-decoder-visible" aria-hidden="true">
        {visibleDisplay}
        {!visibleComplete ? (
          <span className="hero-statement-decoder-cursor">|</span>
        ) : null}
      </span>
      <span className="sr-only">{STATEMENTS.join(" ")}</span>
    </p>
  );
}
```

- [ ] **Step 4: Run the component test to verify it passes**

Run:

```bash
npx vitest run src/components/__tests__/hero-statement-decoder.test.tsx
```

Expected: 1 file and 5 tests pass with no pending timers.

- [ ] **Step 5: Commit the decoder unit**

```bash
git add src/components/hero-statement-decoder.tsx src/components/__tests__/hero-statement-decoder.test.tsx
git commit -m "feat: add finite homepage statement decoder"
```

### Task 2: Integrate the single hero statement and stable layout

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/__tests__/home-first-impression.test.tsx`
- Create: `src/app/__tests__/home-statement-layout.test.ts`
- Modify: `src/app/styles/base.css`
- Delete: `src/components/hero-interest-typer.tsx`

**Interfaces:**
- Consumes: `HeroStatementDecoder(): JSX.Element` from Task 1
- Produces: one homepage statement between `.hero-name` and `.hero-credentials`
- Removes: `HeroInterestTyper` and all `.hero-typer*` styling hooks

- [ ] **Step 1: Update the homepage behavior test so it fails against the old hierarchy**

In `src/app/__tests__/home-first-impression.test.tsx`, replace the old decoder mock with:

```tsx
vi.mock("@/components/hero-statement-decoder", () => ({
  HeroStatementDecoder: () => (
    <p data-testid="finite-statement-decoder">
      I design digital products and stay close through the build.
    </p>
  ),
}));
```

Update the first test assertions to:

```tsx
const statement = screen.getByTestId("finite-statement-decoder");
expect(statement).toHaveTextContent(
  "I design digital products and stay close through the build.",
);
expect(screen.queryByText(/^Also:/)).toBeNull();
expect(
  screen.getByText(
    "Previously TikTok and UMG. My latest project is Fresh Greens.",
  ),
).toBeInTheDocument();
expect(
  screen.getByRole("link", { name: "View selected work" }),
).toHaveAttribute("href", "/#work");
```

- [ ] **Step 2: Add the failing CSS contract test**

Create `src/app/__tests__/home-statement-layout.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

function block(selector: string) {
  const start = css.indexOf(`${selector} {`);
  expect(start, `${selector} rule`).toBeGreaterThanOrEqual(0);
  const open = css.indexOf("{", start);
  let depth = 0;

  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(open + 1, index);
  }

  throw new Error(`Unclosed rule for ${selector}`);
}

describe("homepage statement decoder layout", () => {
  it("reserves one stable grid area with the primary hero typography", () => {
    const decoder = block(".hero-statement-decoder");
    const sizer = block(".hero-statement-decoder-sizer");

    expect(decoder).toMatch(/display:\s*grid/);
    expect(decoder).toMatch(/font-size:\s*clamp\(1\.18rem, 2\.5vw, 1\.55rem\)/);
    expect(decoder).not.toMatch(/font-family:\s*var\(--font-mono\)/);
    expect(sizer).toMatch(/grid-area:\s*1\s*\/\s*1/);
    expect(sizer).toMatch(/visibility:\s*hidden/);
  });

  it("removes the superseded typer selectors", () => {
    expect(css).not.toMatch(/\.hero-typer(?:-|\s|\{)/);
  });
});
```

- [ ] **Step 3: Run the focused tests to verify they fail**

Run:

```bash
npx vitest run src/app/__tests__/home-first-impression.test.tsx src/app/__tests__/home-statement-layout.test.ts
```

Expected: FAIL because the page still imports `HeroInterestTyper` and the new CSS hooks do not exist.

- [ ] **Step 4: Replace the homepage markup**

In `src/app/page.tsx`:

```tsx
import { HeroStatementDecoder } from "@/components/hero-statement-decoder";
```

Replace the static `.hero-tagline` paragraph and `<HeroInterestTyper />` with one component directly before `.hero-credentials`:

```tsx
<HeroStatementDecoder />
<p className="hero-credentials">
  Previously TikTok and UMG. My latest project is Fresh Greens.
</p>
```

Delete `src/components/hero-interest-typer.tsx` after no imports remain.

- [ ] **Step 5: Replace the old tagline and typer CSS**

In `src/app/styles/base.css`, replace `.hero-tagline`, `.hero-typer`, `.hero-typer-prefix`, and `.hero-typer-cursor` with:

```css
.hero-statement-decoder {
  display: grid;
  margin-top: 1.2rem;
  max-width: 38ch;
  font-size: clamp(1.18rem, 2.5vw, 1.55rem);
  font-weight: 500;
  line-height: 1.38;
  text-wrap: pretty;
}

.hero-statement-decoder-sizer,
.hero-statement-decoder-visible {
  grid-area: 1 / 1;
}

.hero-statement-decoder-sizer {
  visibility: hidden;
}

.hero-statement-decoder-visible {
  min-width: 0;
}

.hero-statement-decoder-cursor {
  margin-left: 1px;
  color: var(--muted);
  animation: hero-cursor-blink 760ms step-end infinite;
}
```

In the reduced-motion selector list, replace `.hero-tagline` and `.hero-typer-cursor` with `.hero-statement-decoder-cursor`. Do not add entrance opacity to the decoder.

- [ ] **Step 6: Run focused tests and the content scan**

Run:

```bash
npx vitest run src/components/__tests__/hero-statement-decoder.test.tsx src/app/__tests__/home-first-impression.test.tsx src/app/__tests__/home-statement-layout.test.ts
```

Expected: 3 files and all tests pass.

Run:

```bash
rg -n 'Also:|[—…]' src/app/page.tsx src/components/hero-statement-decoder.tsx
```

Expected: no output.

- [ ] **Step 7: Commit the homepage integration**

```bash
git add src/app/page.tsx src/app/styles/base.css src/app/__tests__/home-first-impression.test.tsx src/app/__tests__/home-statement-layout.test.ts src/components/hero-interest-typer.tsx
git commit -m "feat: move personality decoder into homepage statement"
```

### Task 3: Verify the homepage decoder in isolation

**Files:**
- Verify only. No expected source edits.

**Interfaces:**
- Consumes: completed Tasks 1 and 2
- Produces: automated and visual evidence for the homepage statement

- [ ] **Step 1: Run the focused and full automated gates sequentially**

```bash
npx vitest run src/components/__tests__/hero-statement-decoder.test.tsx src/app/__tests__/home-first-impression.test.tsx src/app/__tests__/home-statement-layout.test.ts
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run validate:content
git diff --check
```

Expected: every command exits 0. Run these commands sequentially because Vitest and ESLint can touch shared temporary files.

- [ ] **Step 2: Capture fresh browser evidence**

At `http://localhost:3100/`, capture:

- `1440 × 900` on the initial professional statement.
- `1440 × 900` after the sequence stops on Absolute Batman.
- `390 × 844` on the initial professional statement.
- `390 × 844` after the sequence stops on Absolute Batman.
- One desktop and one mobile reduced-motion capture.

Confirm the credentials and `View selected work` action do not move between the initial and final frames. Confirm both themes retain readable contrast and the decoder never appears blank.

- [ ] **Step 3: Record any additional Impeccable personality opportunities as recommendations**

Inspect the homepage, About, and one complete case-study path. Record only moments that reward close attention or explain the work. Do not implement them in this task. Reject ambient loops, extra copy blocks, novelty cursor behavior, and personality that competes with project evidence.

- [ ] **Step 4: Commit only if verification required a corrective edit**

If a corrective edit was necessary, rerun the focused tests, stage only the touched files, and commit:

```bash
git commit -m "fix: stabilize homepage statement decoder"
```

If no corrective edit was necessary, leave the verified worktree clean and do not create an empty commit.

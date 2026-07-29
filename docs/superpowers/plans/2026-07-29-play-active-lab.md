# Play Active Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe Play as a running lab, give every experiment a consistent semantic note set, document the Sukuna material process, and make Loom responsive, theme-aware, event-driven, and accessible without a nested mobile scroll trap.

**Architecture:** `PlayEntry` becomes the typed source of truth for lab metadata. The server-rendered Play page maps that metadata to native description lists and an optional ordered process list. A client-only `LoomEmbed` owns the same-origin iframe handshake. A small child bridge reports document height and receives theme messages, while the existing p5 script keeps deterministic generation and switches from a continuous loop to explicit redraws.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Vitest, Testing Library, Node VM, HTML, CSS, p5.js 1.11.1.

## Global Constraints

- Work from `/Users/mylesashitey/.codex/worktrees/86e3/myles-portfolio-migration`.
- Use this exact Play lede: `I use this page as a running lab for interaction studies, material tests, and small builds. I'll keep adding work as I test it.`
- Label the list `In the lab`.
- Render `Question`, `Medium`, `State`, `What changed`, `Next if real`, and `Updated` as one quiet semantic definition list per experiment, not six cards.
- Type `state` as exactly `"live" | "testing" | "complete" | "archived"`.
- Keep `next` optional even though both current entries provide it.
- Keep the finished Sukuna photographs and `SpecimenCard`. Do not add a 3D viewer until a source model is supplied and inspected.
- Preserve Loom's deterministic rule that the same answer produces the same five threads.
- Keep a direct, protected new-tab link to `/play/loom/index.html`.
- Validate all `postMessage` traffic by origin, source window, message type, and payload shape.
- Do not modify `src/app/styles/base.css`, `src/app/styles/late-polish.css`, or `src/app/styles/portfolio-surfaces.css`. New Play and Loom parent styles belong in the two CSS Modules named below.
- Do not modify shared case-study chapter files or tests. The separate shared-interface task owns global ToC breakpoints, reduced-motion fixes, cursor polish, and shared CSS.
- Candidate-facing copy must follow `/Users/mylesashitey/career-ops/MYLES-WRITING-STYLE.md`: no em dashes, semicolons, ellipses, hype language, or unsupported claims.

## Message Contract

Use these exact same-origin messages:

```ts
type LoomTheme = "light" | "dark";

type ParentToLoomMessage = {
  type: "loom:theme";
  theme: LoomTheme;
};

type LoomToParentMessage = {
  type: "loom:resize";
  height: number;
};
```

The parent sends with `window.location.origin`. The child posts back to its own `window.location.origin`. The parent accepts resize messages only when `event.origin === window.location.origin` and `event.source === iframe.contentWindow`.

## Shared-Task Boundary

This plan has no production-file prerequisite from the shared task. The separate shared plan owns the global ToC breakpoint, Navi reduced motion, shared CSS, and final cross-page browser review. It should run its integration checks after this plan lands. If a Play defect requires one of those shared files, report it to that task rather than adding the file to a commit here.

---

### Task 1: Model every Play item as a typed lab experiment

**Files:**
- Modify: `src/lib/content.ts:227-287`
- Test: `src/lib/__tests__/play-content.test.ts:1-46`

**Interfaces:**
- Produces: `export type PlayState = "live" | "testing" | "complete" | "archived"`.
- Extends: `PlayEntry` with required `question`, `medium`, `state`, `whatChanged`, and `updated` fields.
- Extends: `PlayEntry` with optional `next?: string` and `process?: readonly string[]`.
- Preserves: existing `hook`, `exploration`, tags, context, year, media, and specimen fields.

- [ ] **Step 1: Replace the Loom source-string assertions with failing data and type contracts**

Keep the photo-metadata privacy test. Replace lines 24-46 of `play-content.test.ts` with runtime facts and type-level guards:

```ts
import { describe, expect, expectTypeOf, it } from "vitest";
import {
  playEntries,
  type PlayEntry,
  type PlayState,
} from "@/lib/content";

it("uses the closed Play state union and keeps next optional", () => {
  expectTypeOf<PlayState>().toEqualTypeOf<
    "live" | "testing" | "complete" | "archived"
  >();
  expectTypeOf<PlayEntry["state"]>().toEqualTypeOf<PlayState>();
  expectTypeOf<PlayEntry["next"]>().toEqualTypeOf<string | undefined>();
});

it("publishes the approved working notes for Sukuna and Loom", () => {
  const sukuna = playEntries.find((entry) => entry.slug === "sukunas-finger");
  const loom = playEntries.find((entry) => entry.slug === "loom");

  expect(sukuna).toMatchObject({
    question: "How much surface detail could survive a PLA print and hand-painted finish?",
    medium: "Digital sculpt, PLA, acrylic paint, matte varnish",
    state: "complete",
    whatChanged:
      "A digital model became a printable form, then paint carried the skin, wounds, and color variation.",
    next: "Add the original 3D model once the source file is ready for the web.",
    updated: "July 2026",
  });
  expect(sukuna?.process?.join(" → ")).toBe(
    "Digital sculpt → fabrication constraints → printed object → painted surface",
  );
  expect(sukuna?.embedPath).toBeUndefined();

  expect(loom).toMatchObject({
    question: "Can the same short answer always produce the same woven pattern?",
    medium: "p5.js, text hashing, generative drawing",
    state: "testing",
    whatChanged:
      "A static study became a text input where the same answer produces the same five threads.",
    next: "Test whether a shared weave stays readable as more people add responses.",
    updated: "July 2026",
  });
});
```

Do not retain any test that uses `toContain` or a regular expression against `sketch.js` to infer runtime behavior. Task 5 replaces those checks with execution of the real script.

- [ ] **Step 2: Run the content test and confirm the intended RED state**

Run:

```bash
npm test -- src/lib/__tests__/play-content.test.ts
```

Expected: FAIL at TypeScript transform or runtime because `PlayState` and the six lab fields do not exist.

- [ ] **Step 3: Add the typed model and exact approved values**

Add the model immediately before `PlayEntry`:

```ts
export type PlayState = "live" | "testing" | "complete" | "archived";

export type PlayEntry = {
  slug: string;
  title: string;
  hook: string;
  exploration?: string;
  question: string;
  medium: string;
  state: PlayState;
  whatChanged: string;
  next?: string;
  updated: string;
  process?: readonly string[];
  // Keep the existing media and provenance fields below.
};
```

Populate the two records with the exact strings in Step 1. For Sukuna, use:

```ts
process: [
  "Digital sculpt",
  "fabrication constraints",
  "printed object",
  "painted surface",
],
```

Do not add `embedPath`, a model URL, or viewer metadata to Sukuna.

- [ ] **Step 4: Run the focused test and commit the data contract**

Run:

```bash
npm test -- src/lib/__tests__/play-content.test.ts
npx eslint src/lib/content.ts src/lib/__tests__/play-content.test.ts
git diff --check
```

Expected: PASS. The exact metadata values and the optional `next` type are locked.

Commit:

```bash
git add src/lib/content.ts src/lib/__tests__/play-content.test.ts
git commit -m "feat: model Play entries as active experiments"
```

### Task 2: Render the active-lab framing, semantic notes, and Sukuna process

**Files:**
- Modify: `src/app/play/page.tsx:1-130`
- Create: `src/app/play/play.module.css`
- Test: `src/app/play/__tests__/play-page-semantics.test.tsx:1-48`
- Test fixture update: `src/app/play/__tests__/media-priority.test.tsx:25-57`

**Interfaces:**
- Consumes: every `PlayEntry` field added in Task 1.
- Produces: one native `<dl>` per experiment with terms in the approved six-field order.
- Produces: a title-cased state label while keeping the stored union lowercase.
- Produces: an optional ordered process list labelled `${entry.title} process`.
- Preserves: existing images, specimen treatment, embed placement, tags, context, year, and media-priority behavior.

- [ ] **Step 1: Rewrite the page semantics test to establish the RED contract**

Update the mocked entry so it supplies all required lab fields and a process:

```tsx
{
  slug: "test-entry",
  title: "Test entry",
  hook: "A compact experiment.",
  question: "What survives the change in medium?",
  medium: "PLA, acrylic paint",
  state: "testing",
  whatChanged: "The surface moved from a digital model to a painted object.",
  next: "Compare a second finish.",
  updated: "July 2026",
  process: ["Digital sculpt", "fabrication constraints", "printed object", "painted surface"],
  tags: ["Prototype"],
  year: "2026",
  context: "Studio",
}
```

Replace the current single assertion with:

```tsx
it("presents each experiment as a semantic set of quiet working notes", () => {
  const { container } = render(<PlayPage />);

  expect(
    screen.getByText(
      "I use this page as a running lab for interaction studies, material tests, and small builds. I'll keep adding work as I test it.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText("In the lab")).toBeInTheDocument();

  const entry = screen.getByRole("heading", { name: "Test entry" }).closest("li");
  const notes = entry?.querySelector("dl");
  expect(notes).not.toBeNull();
  expect(Array.from(notes!.querySelectorAll("dt"), (node) => node.textContent)).toEqual([
    "Question",
    "Medium",
    "State",
    "What changed",
    "Next if real",
    "Updated",
  ]);
  expect(notes).toHaveTextContent("Testing");
  expect(notes).toHaveTextContent("Compare a second finish.");

  const process = within(entry as HTMLElement).getByRole("list", {
    name: "Test entry process",
  });
  expect(within(process).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
    "Digital sculpt",
    "fabrication constraints",
    "printed object",
    "painted surface",
  ]);
  expect(container.querySelector("footer.play-entry-footer")).toBeNull();
});
```

Import `screen` and `within` from Testing Library. Add this second mocked entry without `next`:

```tsx
{
  slug: "test-without-next",
  title: "Test without next",
  hook: "A paused material test.",
  question: "What remains useful after the first pass?",
  medium: "Paper and ink",
  state: "archived",
  whatChanged: "The first pass established the useful proportions.",
  updated: "July 2026",
  tags: ["Study"],
  year: "2026",
  context: "Studio",
}
```

Assert that its `<dt>` sequence is `Question`, `Medium`, `State`, `What changed`, and `Updated`, with no empty `Next if real` row.

- [ ] **Step 2: Run the semantics and media-priority tests and confirm RED**

Run:

```bash
npm test -- src/app/play/__tests__/play-page-semantics.test.tsx src/app/play/__tests__/media-priority.test.tsx
```

Expected: FAIL because the page still uses recreational framing, labels the list `Experiments`, has no `<dl>`, and does not render a process list.

- [ ] **Step 3: Render the exact active-lab framing and note list**

Update route metadata to:

```ts
description: "A running lab for interaction studies, material tests, and small builds.",
```

Replace the visible hero lede with the exact approved sentence and rename the section label to `In the lab`.

Use a closed map for displayed state labels:

```ts
import type { PlayState } from "@/lib/content";

const PLAY_STATE_LABELS: Record<PlayState, string> = {
  live: "Live",
  testing: "Testing",
  complete: "Complete",
  archived: "Archived",
};
```

Inside each `<li>`, render:

```tsx
<dl className={styles.experimentNotes}>
  <div><dt>Question</dt><dd>{entry.question}</dd></div>
  <div><dt>Medium</dt><dd>{entry.medium}</dd></div>
  <div><dt>State</dt><dd>{PLAY_STATE_LABELS[entry.state]}</dd></div>
  <div><dt>What changed</dt><dd>{entry.whatChanged}</dd></div>
  {entry.next ? <div><dt>Next if real</dt><dd>{entry.next}</dd></div> : null}
  <div><dt>Updated</dt><dd>{entry.updated}</dd></div>
</dl>
```

Keep the existing tags and context as secondary provenance outside the definition list. Do not relabel them as any of the six working-note fields.

- [ ] **Step 4: Render the Sukuna process as ordered steps**

Place the process list after the definition list and before the specimen media:

```tsx
{entry.process ? (
  <ol
    className={styles.process}
    aria-label={`${entry.title} process`}
  >
    {entry.process.map((step) => (
      <li key={step}>{step}</li>
    ))}
  </ol>
) : null}
```

Do not render an empty process container for Loom.

- [ ] **Step 5: Add quiet page-local styling**

Create `play.module.css`. The note list should be rows separated by rules, not six cards:

```css
.experimentNotes {
  margin: 1.25rem 0;
  border-top: 1px solid var(--line);
}

.experimentNotes > div {
  display: grid;
  grid-template-columns: minmax(7rem, 0.34fr) minmax(0, 1fr);
  gap: 0.75rem;
  padding: 0.72rem 0;
  border-bottom: 1px solid var(--line);
}

.experimentNotes dt {
  color: var(--muted);
  font-size: 0.75rem;
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
}

.experimentNotes dd {
  margin: 0;
  line-height: var(--lead-copy);
}

.process {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.6rem;
  margin: 0.25rem 0 1.25rem;
  padding: 0;
  list-style: none;
}

.process li {
  position: relative;
}

.process li:not(:last-child)::after {
  content: "→";
  position: absolute;
  left: calc(100% + 0.55rem);
  color: var(--muted);
}

@media (max-width: 699px) {
  .experimentNotes > div {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .process {
    display: grid;
    gap: 1.4rem;
  }

  .process li:not(:last-child)::after {
    content: "↓";
    top: calc(100% + 0.1rem);
    left: 0;
  }
}
```

- [ ] **Step 6: Update the media-priority fixtures, verify, and commit**

Add valid lab fields to the two mocked entries in `media-priority.test.tsx`. Do not change its priority assertions.

Run:

```bash
npm test -- src/app/play/__tests__/play-page-semantics.test.tsx src/app/play/__tests__/media-priority.test.tsx src/lib/__tests__/play-content.test.ts
npx eslint src/app/play/page.tsx src/app/play/__tests__/play-page-semantics.test.tsx src/app/play/__tests__/media-priority.test.tsx
git diff --check
```

Expected: PASS. The first specimen remains priority, the second does not, and the semantics test sees the exact six-field order.

Commit:

```bash
git add src/app/play/page.tsx src/app/play/play.module.css src/app/play/__tests__/play-page-semantics.test.tsx src/app/play/__tests__/media-priority.test.tsx
git commit -m "feat: present Play as an active lab"
```

### Task 3: Replace the raw iframe with the same-origin Loom embed

**Files:**
- Create: `src/components/loom-embed.tsx`
- Create: `src/components/loom-embed.module.css`
- Create: `src/components/__tests__/loom-embed.test.tsx`
- Modify: `src/app/play/page.tsx:61-78`

**Interfaces:**
- Produces: `export function LoomEmbed({ src, title }: LoomEmbedProps)`, where `LoomEmbedProps` is `{ src: string; title: string }`.
- Sends: `{ type: "loom:theme", theme: "light" | "dark" }`.
- Receives: `{ type: "loom:resize", height: number }`.
- Uses: the existing `theme-change` event emitted by `ThemeToggle`, plus `storage` and system-theme changes.
- Preserves: `loading="lazy"` and a visible new-tab fallback link.

- [ ] **Step 1: Add the failing parent-handshake component tests**

Create `loom-embed.test.tsx` with cleanup for `localStorage` and `document.documentElement.dataset.theme`. Cover initial load, theme changes, resizing, invalid messages, and the fallback:

```tsx
it("sends the active theme on load and whenever the portfolio theme changes", () => {
  localStorage.setItem("theme", "light");
  render(<LoomEmbed src="/play/loom/index.html" title="Loom" />);
  const frame = screen.getByTitle("Loom interactive preview") as HTMLIFrameElement;
  const postMessage = vi.spyOn(frame.contentWindow!, "postMessage");

  fireEvent.load(frame);
  expect(postMessage).toHaveBeenLastCalledWith(
    { type: "loom:theme", theme: "light" },
    window.location.origin,
  );

  localStorage.setItem("theme", "dark");
  fireEvent(window, new Event("theme-change"));
  expect(postMessage).toHaveBeenLastCalledWith(
    { type: "loom:theme", theme: "dark" },
    window.location.origin,
  );
});

it("auto-sizes only for a valid message from its own same-origin frame", () => {
  render(<LoomEmbed src="/play/loom/index.html" title="Loom" />);
  const frame = screen.getByTitle("Loom interactive preview") as HTMLIFrameElement;

  fireEvent(
    window,
    new MessageEvent("message", {
      data: { type: "loom:resize", height: 811.2 },
      origin: window.location.origin,
      source: frame.contentWindow,
    }),
  );
  expect(frame).toHaveStyle({ height: "812px" });

  fireEvent(
    window,
    new MessageEvent("message", {
      data: { type: "loom:resize", height: 999 },
      origin: "https://invalid.example",
      source: frame.contentWindow,
    }),
  );
  expect(frame).toHaveStyle({ height: "812px" });
});

it("keeps a direct protected path when the embed is unavailable", () => {
  render(<LoomEmbed src="/play/loom/index.html" title="Loom" />);
  expect(
    screen.getByRole("link", { name: "Open Loom in a new tab" }),
  ).toHaveAttribute("href", "/play/loom/index.html");
  expect(screen.getByRole("link", { name: "Open Loom in a new tab" })).toHaveAttribute(
    "rel",
    "noopener noreferrer",
  );
});
```

Also assert that a same-origin message from any window other than `frame.contentWindow`, a non-finite height, and an unrelated message type leave the current height unchanged.

- [ ] **Step 2: Run the new component test and confirm RED**

Run:

```bash
npm test -- src/components/__tests__/loom-embed.test.tsx
```

Expected: FAIL because `LoomEmbed` and its message handling do not exist.

- [ ] **Step 3: Implement the parent component**

Use `"use client"`, an iframe ref, and a numeric height state that starts at 320. Clamp valid child heights to at least 320 pixels, round up fractional values, and do not impose a maximum that would recreate internal scrolling. Starting at the minimum lets the child grow to its measured content height instead of making the child document inherit an unnecessarily tall initial viewport.

Resolve the active theme in this order:

1. A valid `localStorage.theme`.
2. A valid `document.documentElement.dataset.theme`.
3. `matchMedia("(prefers-color-scheme: light)")`.

Register these listeners in an effect:

- `message` for validated resize messages.
- `theme-change` for the in-page toggle.
- `storage` for cross-tab preference changes.
- the light-scheme media query's `change` event for system fallback.

Use the exact render shape:

```tsx
<div className={styles.group}>
  <div className={styles.frameWrap}>
    <iframe
      ref={frameRef}
      className={styles.frame}
      src={src}
      title={`${title} interactive preview`}
      loading="lazy"
      scrolling="no"
      style={{ height: `${frameHeight}px` }}
      onLoad={sendTheme}
    />
  </div>
  <p className={styles.fallback}>
    <a href={src} target="_blank" rel="noopener noreferrer">
      Open {title} in a new tab
      <span aria-hidden="true"> ↗</span>
    </a>
  </p>
</div>
```

The resize handler must return early unless all of these are true:

```ts
event.origin === window.location.origin
event.source === frameRef.current?.contentWindow
event.data?.type === "loom:resize"
Number.isFinite(event.data.height)
event.data.height > 0
```

- [ ] **Step 4: Add component-local iframe styling**

Create `loom-embed.module.css` with no fixed mobile cap:

```css
.frameWrap {
  margin-top: 0.45rem;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 0.65rem;
  background: var(--surface);
}

.frame {
  display: block;
  width: 100%;
  border: 0;
}

.fallback {
  margin: 0.55rem 0 0;
  font-size: 0.85rem;
}
```

Match the existing muted link and visible focus treatment inside this module. Do not reuse the global `.play-embed` class because its fixed mobile height is the scroll-trap behavior being retired.

- [ ] **Step 5: Replace only the Loom iframe branch**

In `page.tsx`, import `LoomEmbed` and replace the raw iframe group with:

```tsx
{entry.embedPath ? (
  <LoomEmbed src={entry.embedPath} title={entry.title} />
) : null}
```

Do not alter specimen or image branches.

- [ ] **Step 6: Verify and commit the parent embed**

Run:

```bash
npm test -- src/components/__tests__/loom-embed.test.tsx src/app/play/__tests__/play-page-semantics.test.tsx src/app/play/__tests__/media-priority.test.tsx
npx eslint src/components/loom-embed.tsx src/components/__tests__/loom-embed.test.tsx src/app/play/page.tsx
git diff --check
```

Expected: PASS. The iframe height changes only for the owned same-origin frame, and the direct link remains available.

Commit:

```bash
git add src/components/loom-embed.tsx src/components/loom-embed.module.css src/components/__tests__/loom-embed.test.tsx src/app/play/page.tsx
git commit -m "feat: add responsive Loom embed handshake"
```

### Task 4: Add the child resize and theme bridge

**Files:**
- Create: `public/play/loom/embed-bridge.js`
- Modify: `public/play/loom/index.html:1-35`
- Modify: `public/play/loom/style.css:1-107`
- Create: `src/app/play/__tests__/loom-embed-bridge.test.ts`

**Interfaces:**
- Receives from parent: `{ type: "loom:theme", theme: "light" | "dark" }`.
- Sends to parent: `{ type: "loom:resize", height: number }`.
- Applies: `document.documentElement.dataset.theme`.
- Observes: `document.documentElement` with `ResizeObserver`.
- Falls back: to the system color scheme before any valid parent message.

- [ ] **Step 1: Add a failing test that executes the real bridge script**

Create `loom-embed-bridge.test.ts`. Load `embed-bridge.js` with `readFileSync` and execute it with `runInNewContext` from `node:vm`. Provide a fake same-origin parent, a root element with measurable height, a listener registry, and a `ResizeObserver` stub.

The core assertions must exercise behavior, not search the source:

```ts
const source = readFileSync(
  resolve(process.cwd(), "public/play/loom/embed-bridge.js"),
  "utf8",
);
const listeners = new Map<string, EventListener>();
const postMessage = vi.fn();
const parentWindow = { postMessage };
const root = {
  dataset: {} as Record<string, string>,
  scrollHeight: 640,
  getBoundingClientRect: () => ({ height: 640 }),
};
let resizeCallback: ResizeObserverCallback | undefined;

runInNewContext(source, {
  window: {
    parent: parentWindow,
    location: { origin: "https://portfolio.test" },
    matchMedia: () => ({
      matches: false,
      addEventListener: vi.fn(),
    }),
    addEventListener: (type: string, listener: EventListener) => {
      listeners.set(type, listener);
    },
  },
  document: {
    documentElement: root,
    body: { scrollHeight: 620 },
  },
  ResizeObserver: class {
    constructor(callback: ResizeObserverCallback) {
      resizeCallback = callback;
    }
    observe = vi.fn();
  },
  Math,
});

listeners.get("load")?.({} as Event);
expect(postMessage).toHaveBeenCalledWith(
  { type: "loom:resize", height: 640 },
  "https://portfolio.test",
);

listeners.get("message")?.({
  origin: "https://portfolio.test",
  source: parentWindow,
  data: { type: "loom:theme", theme: "dark" },
} as unknown as MessageEvent);
expect(root.dataset.theme).toBe("dark");

root.scrollHeight = 734;
resizeCallback?.([], {} as ResizeObserver);
expect(postMessage).toHaveBeenLastCalledWith(
  { type: "loom:resize", height: 734 },
  "https://portfolio.test",
);
```

Also exercise invalid origin, invalid source, and an unsupported theme value. They must not change `root.dataset.theme`.

Parse `index.html` with `DOMParser` and assert that it loads `embed-bridge.js` before `sketch.js`.

- [ ] **Step 2: Run the bridge test and confirm RED**

Run:

```bash
npm test -- src/app/play/__tests__/loom-embed-bridge.test.ts
```

Expected: FAIL because the bridge file does not exist.

- [ ] **Step 3: Implement the child bridge**

Use an IIFE so the static page needs no bundler:

```js
(() => {
  const origin = window.location.origin;
  const systemQuery = window.matchMedia("(prefers-color-scheme: light)");
  let parentThemeReceived = false;

  function isTheme(value) {
    return value === "light" || value === "dark";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  function reportHeight() {
    if (window.parent === window) return;
    const height = Math.ceil(Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.getBoundingClientRect().height,
    ));
    window.parent.postMessage({ type: "loom:resize", height }, origin);
  }

  applyTheme(systemQuery.matches ? "light" : "dark");

  window.addEventListener("message", (event) => {
    if (event.origin !== origin || event.source !== window.parent) return;
    if (event.data?.type !== "loom:theme" || !isTheme(event.data.theme)) return;
    parentThemeReceived = true;
    applyTheme(event.data.theme);
  });

  systemQuery.addEventListener("change", (event) => {
    if (!parentThemeReceived) applyTheme(event.matches ? "light" : "dark");
  });

  new ResizeObserver(reportHeight).observe(document.documentElement);
  window.addEventListener("load", reportHeight);
})();
```

Keep direct-tab behavior: it uses the system theme and skips parent resize messages when `window.parent === window`.

- [ ] **Step 4: Load the bridge and convert static colors to theme variables**

In `index.html`, load `embed-bridge.js` before `sketch.js`.

In `style.css`, replace the light-only page, text, panel, border, input, and button colors with custom properties. Define both theme blocks:

```css
:root {
  color-scheme: light;
  --loom-page: #f4f1ea;
  --loom-panel: #fffdf9;
  --loom-text: #2f2923;
  --loom-border: #dbd3c7;
  --loom-input: #ffffff;
  --loom-button: #8f6d48;
  --loom-button-hover: #7f603e;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --loom-page: #171411;
  --loom-panel: #211d19;
  --loom-text: #f3ede5;
  --loom-border: #514940;
  --loom-input: #2a241f;
  --loom-button: #9b7650;
  --loom-button-hover: #ad865d;
}
```

Remove `min-height: 100%` from the shared `html, body` rule. The iframe begins at 320px and grows from the bridge's measured content. A viewport-forced minimum would make `scrollHeight` reflect the parent's provisional iframe height instead of the Loom document's natural height.

Do not recolor the generative artwork itself in this task. Its thread and loom palette remains part of the artwork, while the surrounding UI follows the portfolio theme without introducing a redraw path beyond the four approved triggers.

- [ ] **Step 5: Verify and commit the child bridge**

Run:

```bash
npm test -- src/app/play/__tests__/loom-embed-bridge.test.ts src/components/__tests__/loom-embed.test.tsx
git diff --check
```

Expected: PASS for both halves of the handshake.

Commit:

```bash
git add public/play/loom/embed-bridge.js public/play/loom/index.html public/play/loom/style.css src/app/play/__tests__/loom-embed-bridge.test.ts
git commit -m "feat: sync Loom embed size and theme"
```

### Task 5: Make p5 event-driven and expose a changing artwork description

**Files:**
- Modify: `public/play/loom/sketch.js:25-147,271-275`
- Modify: `public/play/loom/index.html:21-32`
- Modify: `public/play/loom/style.css:46-81`
- Create: `src/app/play/__tests__/loom-sketch-behavior.test.ts`

**Interfaces:**
- Calls: `noLoop()` once during `setup()`.
- Calls: `redraw()` after setup, a valid response, clear, and resize.
- Does not call: `redraw()` for an empty response.
- Updates: `#status` and `#loom-canvas[aria-label]` after thread-count changes.
- Preserves: five threads per valid answer, the 140-thread cap, and deterministic output for repeated input.

- [ ] **Step 1: Add a failing test that executes the real p5 script**

Create `loom-sketch-behavior.test.ts`. Read `public/play/loom/sketch.js`, execute that exact source with `runInNewContext`, and append only a test API that returns existing functions and a snapshot of the private `strings` array:

```ts
const executable = `${source}
globalThis.__loomTestApi = {
  setup,
  windowResized,
  addThreadFromInput,
  clearThreads,
  getThreads: () => strings.map((thread) => ({
    start: { ...thread.start },
    end: { ...thread.end },
    alpha: thread.alpha,
    weight: thread.weight,
    hue: thread.hue,
  })),
};`;
```

Build a real DOM fixture:

```html
<input id="joy-input" />
<button id="weave-button">Weave</button>
<button id="clear-button">Clear</button>
<p id="status"></p>
<div id="loom-canvas" role="img"></div>
```

Provide p5 stubs for canvas sizing, deterministic `randomSeed` and `random`, and no-op drawing functions. Keep mutable `width` and `height` inside the VM context. Spy on `noLoop` and `redraw`.

Exercise the actual behavior:

```ts
api.setup();
expect(noLoop).toHaveBeenCalledTimes(1);
expect(redraw).toHaveBeenCalledTimes(1);
expect(artwork).toHaveAttribute(
  "aria-label",
  "Generative loom artwork with no woven threads.",
);

input.value = "cooking for friends";
api.addThreadFromInput();
const firstPattern = api.getThreads();
expect(firstPattern).toHaveLength(5);
expect(redraw).toHaveBeenCalledTimes(2);
expect(status).toHaveTextContent("Woven 5 threads so far.");
expect(artwork).toHaveAttribute(
  "aria-label",
  "Generative loom artwork with 5 woven threads.",
);

api.clearThreads();
input.value = "cooking for friends";
api.addThreadFromInput();
expect(api.getThreads()).toEqual(firstPattern);

input.value = "   ";
const redrawCount = redraw.mock.calls.length;
api.addThreadFromInput();
expect(redraw).toHaveBeenCalledTimes(redrawCount);

api.windowResized();
expect(redraw).toHaveBeenCalledTimes(redrawCount + 1);
```

Add a CSS assertion that the shared `input, button` declaration has `min-height: 44px`. This is the only source-level assertion in this file. All p5 behavior must come from executing the real script.

Add a second real-script test that submits 29 distinct non-empty answers and asserts that `getThreads()` contains 140 threads, not 145. This protects the existing cap through runtime behavior.

- [ ] **Step 2: Run the behavior test and confirm RED**

Run:

```bash
npm test -- src/app/play/__tests__/loom-sketch-behavior.test.ts
```

Expected: FAIL because the current script never calls `noLoop` or `redraw`, the artwork label is static, and the controls do not declare a 44px minimum height.

- [ ] **Step 3: Stop the continuous loop and redraw only on state changes**

In `setup()`, save the artwork element, call `noLoop()`, initialize its description, and call `redraw()` once:

```js
let artworkEl;

function setup() {
  const host = document.getElementById("loom-canvas");
  artworkEl = host;
  const canvasWidth = getCanvasWidth();
  const canvasHeight = getCanvasHeight(canvasWidth);
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(host);

  noLoop();
  bindControls();
  recalculateLoomPoints();
  updateThreadFeedback("No threads yet.");
  redraw();
}
```

Call `redraw()` at the end of:

- `windowResized()`, after `resizeCanvas` and point recalculation.
- `addThreadFromInput()`, after a non-empty answer is woven and feedback is updated.
- `clearThreads()`, after the array and feedback are reset.

Do not call it from `draw()`, `updateThreadFeedback()`, the empty-input branch, a timer, or a frame callback.

- [ ] **Step 4: Keep status and artwork description synchronized**

Replace `updateStatus` with one helper that derives the artwork description from `strings.length`:

```js
function updateThreadFeedback(statusMessage) {
  if (statusEl) {
    statusEl.textContent = statusMessage;
  }
  if (artworkEl) {
    const count = strings.length;
    artworkEl.setAttribute(
      "aria-label",
      count === 0
        ? "Generative loom artwork with no woven threads."
        : `Generative loom artwork with ${count} woven thread${count === 1 ? "" : "s"}.`,
    );
  }
}
```

Set the same no-thread description in the static HTML so the accessible name is correct before p5 initializes.

- [ ] **Step 5: Guarantee 44px controls without mobile overflow**

Add `min-height: 44px` to the shared `input, button` rule. Add a narrow rule that lets the input use the full row and splits the two buttons without forcing horizontal scrolling:

```css
input,
button {
  min-height: 44px;
}

@media (max-width: 600px) {
  input {
    min-width: 0;
    flex-basis: 100%;
    margin-right: 0;
  }

  button {
    flex: 1 1 calc(50% - 0.325rem);
  }
}
```

- [ ] **Step 6: Verify and commit the event-driven Loom**

Run:

```bash
npm test -- src/app/play/__tests__/loom-sketch-behavior.test.ts src/app/play/__tests__/loom-embed-bridge.test.ts src/components/__tests__/loom-embed.test.tsx src/lib/__tests__/play-content.test.ts
npx eslint src/app/play/__tests__/loom-sketch-behavior.test.ts
git diff --check
```

Expected: PASS. No test should infer p5 behavior from source strings.

Commit:

```bash
git add public/play/loom/sketch.js public/play/loom/index.html public/play/loom/style.css src/app/play/__tests__/loom-sketch-behavior.test.ts
git commit -m "feat: make Loom drawing event driven"
```

## Final Verification

- [ ] Run all Play and Loom tests:

```bash
npm test -- src/app/play/__tests__ src/components/__tests__/loom-embed.test.tsx src/lib/__tests__/play-content.test.ts
```

- [ ] Run repository checks:

```bash
npm run lint
npm run validate:content
npm test
npm run build
npx tsc --noEmit
git diff --check
```

- [ ] Start the production build locally and inspect `/play` and `/play/loom/index.html`:

```bash
npm run start
```

At 390px, 768px, 1440px, and a wider desktop viewport, verify:

1. The exact active-lab lede and `In the lab` label are visible.
2. The note rows stay quiet and readable, and the optional row creates no blank gap.
3. Sukuna reads in the approved four-step order and still shows the original specimen photographs.
4. Loom has no inner vertical scrollbar after its document reports height.
5. The input and both buttons are at least 44px tall on mobile.
6. Repeating the same answer after Clear produces the same five-thread pattern.
7. The artwork description and live status change from zero to five threads and back to zero.
8. Theme changes update the embedded UI in both directions.
9. `Open Loom in a new tab` works without the parent page.

- [ ] Confirm that p5 is idle between interactions in browser performance tools. There should be no continuous `draw()` activity after the initial render.

- [ ] Search candidate-facing changes for prohibited punctuation:

```bash
git diff -- src/app/play/page.tsx src/lib/content.ts | rg '—|…|passionate about|innovative|seamless'
```

Expected: no matches.

- [ ] Confirm commit scope:

```bash
git show --stat --oneline HEAD~5..HEAD
git status --short
```

Expected: only Play data, Play page and local styles, Loom parent and child files, and Play-specific tests are included. Shared chapter files and shared CSS remain untouched.

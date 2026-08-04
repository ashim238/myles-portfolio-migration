# Myles 97 Portfolio System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the conventional portfolio homepage with the Myles 97 workstation, carry its state into readable project case studies, and adapt the same system into Pocket 97 on mobile.

**Architecture:** Keep the existing content loader, public routes, project chapters, lightbox behavior, and cover destination markers. Add a typed program registry and reducer-driven workstation shell around the homepage, extend the existing project transition with a structured program-window visual and reversible return snapshot, and wrap case studies in a light Reader Mode shell. Use custom SVG/CSS icons first so the identity remains original and no external package is required by default.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS, Web Animations API, local/session storage, Vitest, Testing Library.

## Global Constraints

- The approved homepage line is exactly `Design, code, whatever you need.`
- Supporting context is `Previously TikTok and UMG. Latest project: Fresh Greens.`
- Workstation colors are desktop teal `#087f86`, chrome gray `#c7c7c7`, active cobalt `#263cb8`, boot yellow `#ffe52f`, and near-black `#111111`.
- Reader colors are paper `#f5f3ea` and ink `#171717`.
- System chrome uses `Tahoma, Verdana, Geneva, sans-serif`; long-form prose uses `Georgia, "Times New Roman", serif`.
- Desktop Reader prose is 17–18px at 1.65–1.75 leading and 62–72ch; mobile prose is 16–17px at 1.62–1.72 leading.
- UI type never falls below 12px except nonessential metadata, which may be 10px with adequate contrast.
- Layout uses an 8px macro grid and 4px micro grid. Window content padding is 16–24px desktop and 16–20px mobile.
- Interactive targets are at least 44×44 CSS pixels even when the visible retro control is smaller.
- Boot completes within 1.5 seconds, runs on the first eligible visit only, skips on any key/pointer input, bypasses for reduced motion, and has no sound.
- Window resize is not part of the initial release. Move, minimize, restore, close, and maximize into a case study are required.
- The first desktop opens Selected Work behind a focused Welcome window and includes the Trini roti recipe note without blocking either window.
- Recipe wording must come from Myles or receive his explicit approval. Do not fabricate a family recipe.
- Homepage discovery may be playful. Case-study reading remains about 25% system identity and 75% project identity.
- Existing About, Play, Résumé, and case-study URLs remain canonical and usable without visiting the desktop first.
- Existing case-study prose, evidence, lightboxes, and interactive artifacts are not rewritten.
- Project evidence distinguishes `built`, `shipped`, `observed`, `proposed`, and `needs-proof`.
- Modified clicks preserve native browser behavior and bypass custom same-tab transitions.
- No Microsoft logos, sounds, proprietary icons, wallpaper, or extracted Windows assets.
- Any adopted third-party resource requires a verified permissive license, local vendoring when appropriate, and an entry in `THIRD_PARTY_NOTICES.md`.
- P0 and P1 accessibility, interaction, visual, or code-review findings block release.

## Planned File Map

| Area | Files and responsibility |
|---|---|
| Program data | `src/lib/myles-97/programs.ts` defines stable IDs, project blueprints, evidence states, and registry assembly. |
| Workstation state | `src/lib/myles-97/state.ts` owns reducer actions and initial state. `src/lib/myles-97/persistence.ts` safely reads/writes versioned browser state. |
| Shared shell | `src/components/myles-97/myles-97-shell.tsx` selects Workstation or Pocket 97 and owns hydrated state. |
| Desktop UI | `workstation-desktop.tsx`, `program-window.tsx`, `selected-work-explorer.tsx`, `welcome-program.tsx`, `start-menu.tsx`, and `taskbar.tsx` each own one visible desktop responsibility. |
| Personal/secondary UI | `recipe-note.tsx`, `loose-parts-program.tsx`, and `display-properties.tsx` expose the approved personal artifact and utility programs. |
| Boot | `boot-sequence.tsx` is a removable presentation layer over already-rendered desktop content. |
| Reader | `reader-shell.tsx` and `reader-header.tsx` supply the minimal system chrome around existing project pages and `ProjectToc`. |
| Mobile | `pocket-97-shell.tsx` and `use-pocket-97.ts` replace overlapping windows with full-width programs and a bottom dock. |
| Motion | Existing `src/lib/project-enter.ts` and `src/components/project-enter-transition.tsx` gain structured program visuals and reverse-return state. |
| Styles | `src/app/styles/myles-97.css` owns workstation/Pocket tokens and layout. `src/app/styles/reader-mode.css` owns Reader Mode typography and chrome. |
| Verification | Focused tests live beside the existing `src/lib/__tests__`, `src/components/__tests__`, and `src/app/__tests__` suites. |

---

### Task 1: Typed program registry and evidence model

**Files:**
- Create: `src/lib/myles-97/programs.ts`
- Create: `src/lib/__tests__/myles-97-programs.test.ts`

**Interfaces:**
- Consumes: `Project` from `src/lib/content.ts`.
- Produces: `ProgramId`, `ProjectProgramId`, `EvidenceState`, `ProgramDefinition`, `PROJECT_PROGRAM_BLUEPRINTS`, and `buildProgramRegistry(projects)`.

- [ ] **Step 1: Write the failing registry tests**

```ts
import { describe, expect, it } from "vitest";
import { buildProgramRegistry, PROJECT_PROGRAM_BLUEPRINTS } from "@/lib/myles-97/programs";
import type { Project } from "@/lib/content";

const project = (slug: string, title: string): Project => ({
  slug,
  title,
  summary: `${title} summary`,
  role: "Product Designer",
  timeframe: "2026",
  status: "published",
  order: 1,
  tags: [],
  sections: [],
  bodyHtml: "",
  coverImage: `/projects/${slug}/cover.png`,
});

describe("Myles 97 program registry", () => {
  it("maps each published project to one purpose-built program", () => {
    const programs = buildProgramRegistry([
      project("fresh-greens", "Fresh Greens"),
      project("understandingfafsa", "UnderstandingFAFSA"),
      project("navi", "Navi"),
      project("tiktok", "TikTok DSA"),
    ]);

    expect(programs.map(({ id, appName, primaryEvidence }) => ({ id, appName, primaryEvidence }))).toEqual([
      { id: "fresh-greens", appName: "Fresh Greens.exe", primaryEvidence: "built" },
      { id: "understandingfafsa", appName: "FAFSA Mail.app", primaryEvidence: "observed" },
      { id: "navi", appName: "Navi Places.exe", primaryEvidence: "built" },
      { id: "tiktok", appName: "TikTok Catalog.studio", primaryEvidence: "shipped" },
    ]);
  });

  it("contains no Microsoft asset references", () => {
    expect(JSON.stringify(PROJECT_PROGRAM_BLUEPRINTS)).not.toMatch(/windows|microsoft|start\.wav/i);
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the module is missing**

Run: `npm test -- src/lib/__tests__/myles-97-programs.test.ts`

Expected: FAIL because `@/lib/myles-97/programs` does not exist.

- [ ] **Step 3: Implement the stable registry contract**

```ts
import type { Project } from "@/lib/content";

export type ProjectProgramId = "fresh-greens" | "understandingfafsa" | "navi" | "tiktok";
export type SystemProgramId =
  | "welcome"
  | "selected-work"
  | "about"
  | "loose-parts"
  | "resume"
  | "display-properties"
  | "trini-roti";
export type ProgramId = ProjectProgramId | SystemProgramId;
export type EvidenceState = "built" | "shipped" | "observed" | "proposed" | "needs-proof";

export type ProjectProgramBlueprint = {
  id: ProjectProgramId;
  appName: string;
  applicationType: string;
  primaryEvidence: EvidenceState;
};

export type ProgramDefinition = ProjectProgramBlueprint & {
  title: string;
  summary: string;
  href: `/work/${string}`;
  coverImage?: string;
};

export const PROJECT_PROGRAM_BLUEPRINTS: readonly ProjectProgramBlueprint[] = [
  { id: "fresh-greens", appName: "Fresh Greens.exe", applicationType: "Route-planning software", primaryEvidence: "built" },
  { id: "understandingfafsa", appName: "FAFSA Mail.app", applicationType: "Modular mail composer", primaryEvidence: "observed" },
  { id: "navi", appName: "Navi Places.exe", applicationType: "Place-discovery application", primaryEvidence: "built" },
  { id: "tiktok", appName: "TikTok Catalog.studio", applicationType: "Catalog-template studio", primaryEvidence: "shipped" },
];

export function buildProgramRegistry(projects: readonly Project[]): ProgramDefinition[] {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  return PROJECT_PROGRAM_BLUEPRINTS.flatMap((blueprint) => {
    const project = bySlug.get(blueprint.id);
    return project
      ? [{ ...blueprint, title: project.title, summary: project.summary, href: `/work/${project.slug}` as const, coverImage: project.coverImage }]
      : [];
  });
}
```

- [ ] **Step 4: Run the registry and existing content tests**

Run: `npm test -- src/lib/__tests__/myles-97-programs.test.ts src/lib/__tests__/content-order.test.ts src/lib/__tests__/content-status.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the registry**

```bash
git add src/lib/myles-97/programs.ts src/lib/__tests__/myles-97-programs.test.ts
git commit -m "feat: define Myles 97 program registry"
```

### Task 2: Versioned workstation state and persistence

**Files:**
- Create: `src/lib/myles-97/state.ts`
- Create: `src/lib/myles-97/persistence.ts`
- Create: `src/lib/__tests__/myles-97-state.test.ts`
- Create: `src/lib/__tests__/myles-97-persistence.test.ts`

**Interfaces:**
- Consumes: `ProgramId`.
- Produces: `WorkstationState`, `WorkstationAction`, `createInitialWorkstationState()`, `workstationReducer()`, `loadPersistedWorkstation()`, `saveLocalWorkstation()`, and `saveSessionWorkstation()`.

- [ ] **Step 1: Write reducer tests for every supported window action**

```ts
import { describe, expect, it } from "vitest";
import { createInitialWorkstationState, workstationReducer } from "@/lib/myles-97/state";

describe("workstationReducer", () => {
  it("opens Selected Work behind focused Welcome", () => {
    const state = createInitialWorkstationState();
    expect(state.openPrograms).toEqual(["selected-work", "welcome"]);
    expect(state.focusedProgram).toBe("welcome");
  });

  it("opens, focuses, minimizes, restores, moves, closes, and resets", () => {
    let state = createInitialWorkstationState();
    state = workstationReducer(state, { type: "open", id: "fresh-greens" });
    state = workstationReducer(state, { type: "move", id: "fresh-greens", geometry: { x: 120, y: 80, width: 720, height: 520 } });
    state = workstationReducer(state, { type: "minimize", id: "fresh-greens" });
    expect(state.minimizedPrograms).toContain("fresh-greens");
    state = workstationReducer(state, { type: "restore", id: "fresh-greens" });
    expect(state.focusedProgram).toBe("fresh-greens");
    state = workstationReducer(state, { type: "close", id: "fresh-greens" });
    expect(state.openPrograms).not.toContain("fresh-greens");
    expect(workstationReducer(state, { type: "reset" })).toEqual(createInitialWorkstationState());
  });
});
```

- [ ] **Step 2: Write persistence tests for valid, corrupt, and stale data**

```ts
it("falls back without throwing when persisted JSON is corrupt", () => {
  localStorage.setItem("myles97.desktop.v1", "{");
  expect(loadPersistedWorkstation()).toEqual(createInitialWorkstationState());
});

it("does not replace the canonical theme key", () => {
  localStorage.setItem("theme", "light");
  saveLocalWorkstation(createInitialWorkstationState());
  expect(localStorage.getItem("theme")).toBe("light");
});
```

- [ ] **Step 3: Run both suites and confirm they fail**

Run: `npm test -- src/lib/__tests__/myles-97-state.test.ts src/lib/__tests__/myles-97-persistence.test.ts`

Expected: FAIL because the state modules do not exist.

- [ ] **Step 4: Implement the reducer with explicit actions**

```ts
export type WindowGeometry = { x: number; y: number; width: number; height: number };
export type DisplayPreferences = { highContrast: boolean; reduceMotion: boolean };
export type WorkstationState = {
  version: 1;
  bootCompleted: boolean;
  openPrograms: ProgramId[];
  minimizedPrograms: ProgramId[];
  focusedProgram: ProgramId | null;
  recentPrograms: ProgramId[];
  windowGeometry: Partial<Record<ProgramId, WindowGeometry>>;
  desktopScrollY: number;
  displayPreferences: DisplayPreferences;
};
export type WorkstationAction =
  | { type: "open" | "focus" | "minimize" | "restore" | "close"; id: ProgramId }
  | { type: "move"; id: ProgramId; geometry: WindowGeometry }
  | { type: "boot-complete" }
  | { type: "display"; preferences: DisplayPreferences }
  | { type: "desktop-scroll"; y: number }
  | { type: "reset" };
```

Implement each branch immutably. `move` clamps geometry through a pure `clampWindowGeometry(geometry, viewport)` helper. `open` deduplicates IDs and appends the program to `recentPrograms`; `close` never closes `welcome` and `selected-work` simultaneously during the clean initial state.

- [ ] **Step 5: Implement safe persistence boundaries**

Use `myles97.desktop.v1` for local boot/display/recent state and `myles97.session.v1` for geometry/focus/return state. Parse inside `try/catch`, validate `version === 1`, filter unknown IDs against an exported `isProgramId()`, and return `createInitialWorkstationState()` on any failure. Never read browser storage during server rendering.

- [ ] **Step 6: Run the focused suites**

Run: `npm test -- src/lib/__tests__/myles-97-state.test.ts src/lib/__tests__/myles-97-persistence.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit state and persistence**

```bash
git add src/lib/myles-97/state.ts src/lib/myles-97/persistence.ts src/lib/__tests__/myles-97-state.test.ts src/lib/__tests__/myles-97-persistence.test.ts
git commit -m "feat: add persistent workstation state"
```

### Task 3: Original retro chrome and accessible program windows

**Files:**
- Create: `src/components/myles-97/icons.tsx`
- Create: `src/components/myles-97/program-window.tsx`
- Create: `src/components/myles-97/use-window-drag.ts`
- Create: `src/components/__tests__/myles-97-program-window.test.tsx`
- Create: `src/app/styles/myles-97.css`
- Modify: `src/app/globals.css`
- Modify: `src/app/__tests__/global-style-boundaries.test.ts`

**Interfaces:**
- Consumes: `ProgramId`, `WindowGeometry`, and reducer callbacks.
- Produces: `ProgramWindow` with focus, move, minimize, close, and maximize controls; custom `Myles97Icon` SVGs; `useWindowDrag()`.

- [ ] **Step 1: Write failing keyboard and control tests**

```tsx
render(
  <ProgramWindow
    id="fresh-greens"
    title="Fresh Greens.exe"
    geometry={{ x: 40, y: 64, width: 720, height: 520 }}
    focused
    onFocus={onFocus}
    onMove={onMove}
    onMinimize={onMinimize}
    onClose={onClose}
    onMaximize={onMaximize}
  >
    <p>Program content</p>
  </ProgramWindow>,
);
expect(screen.getByRole("region", { name: "Fresh Greens.exe" })).toBeInTheDocument();
await user.click(screen.getByRole("button", { name: "Minimize Fresh Greens.exe" }));
expect(onMinimize).toHaveBeenCalledWith("fresh-greens");
expect(screen.getByRole("button", { name: "Open Fresh Greens case study" })).toHaveClass("myles97-hit-target");
```

- [ ] **Step 2: Run the component test and confirm it fails**

Run: `npm test -- src/components/__tests__/myles-97-program-window.test.tsx`

Expected: FAIL because the window component does not exist.

- [ ] **Step 3: Add the visual tokens and original icons**

```css
:root {
  --m97-desktop: #087f86;
  --m97-chrome: #c7c7c7;
  --m97-active: #263cb8;
  --m97-signal: #ffe52f;
  --m97-ink: #111111;
  --m97-paper: #f5f3ea;
  --m97-reader-ink: #171717;
  --m97-ui-font: Tahoma, Verdana, Geneva, sans-serif;
  --m97-reader-font: Georgia, "Times New Roman", serif;
  --m97-space-1: 4px;
  --m97-space-2: 8px;
  --m97-space-3: 16px;
  --m97-space-4: 24px;
}
```

Import `./styles/myles-97.css` after `late-polish.css` and update `global-style-boundaries.test.ts` to assert the explicit order `tailwindcss → base.css → late-polish.css → myles-97.css`. Draw folder, document, display, mail, app, and Loose Parts icons as local SVG components using `currentColor`; do not copy pixel art from Windows.

- [ ] **Step 4: Implement the semantic nonmodal window**

Render a `<section role="region" aria-labelledby={`${id}-window-title`}>`, a title-bar drag handle, visible 18–22px retro controls inside 44×44px `.myles97-hit-target` buttons, and a status slot. Pointer dragging uses `setPointerCapture`, updates a preview transform during movement, commits one clamped geometry value on pointer up, and does nothing for keyboard users. Every title-bar action remains a normal button.

- [ ] **Step 5: Add focus, forced-colors, and reduced-motion CSS**

Use cobalt only on the focused title bar. Give every button and link a 3px focus outline with 2px offset. Under `forced-colors: active`, remove decorative gradients and use system colors. Under `prefers-reduced-motion: reduce`, remove transform transitions while retaining final positions.

- [ ] **Step 6: Run component, lint, and type checks**

Run: `npm test -- src/components/__tests__/myles-97-program-window.test.tsx src/app/__tests__/global-style-boundaries.test.ts`

Run: `npm run lint && npx tsc --noEmit`

Expected: all PASS.

- [ ] **Step 7: Commit the chrome foundation**

```bash
git add src/components/myles-97/icons.tsx src/components/myles-97/program-window.tsx src/components/myles-97/use-window-drag.ts src/components/__tests__/myles-97-program-window.test.tsx src/app/styles/myles-97.css src/app/globals.css src/app/__tests__/global-style-boundaries.test.ts
git commit -m "feat: build accessible Myles 97 windows"
```

### Task 4: Working desktop discovery shell

**Files:**
- Create: `src/components/myles-97/myles-97-shell.tsx`
- Create: `src/components/myles-97/workstation-desktop.tsx`
- Create: `src/components/myles-97/welcome-program.tsx`
- Create: `src/components/myles-97/selected-work-explorer.tsx`
- Create: `src/components/myles-97/start-menu.tsx`
- Create: `src/components/myles-97/taskbar.tsx`
- Create: `src/components/__tests__/myles-97-shell.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/__tests__/home-first-impression.test.tsx`
- Modify: `src/app/__tests__/home-statement-layout.test.ts`

**Interfaces:**
- Consumes: `ProgramDefinition[]` from `buildProgramRegistry()` and state from Task 2.
- Produces: `Myles97Shell({ programs })`, which hydrates saved state and renders the desktop.

- [ ] **Step 1: Write the failing first-impression tests**

```tsx
render(<Myles97Shell programs={programs} />);
expect(screen.getByRole("heading", { name: "Myles Ashitey" })).toBeInTheDocument();
expect(screen.getByText("Design, code, whatever you need.")).toBeInTheDocument();
expect(screen.getByText("Previously TikTok and UMG. Latest project: Fresh Greens.")).toBeInTheDocument();
expect(screen.getByRole("region", { name: "Welcome to Myles 97" })).toHaveAttribute("data-focused", "true");
expect(screen.getByRole("region", { name: "Selected Work" })).toBeInTheDocument();
expect(screen.getAllByRole("link", { name: /Open .* case study/ })).toHaveLength(4);
```

Update the homepage test to mock `Myles97Shell`, assert the server page passes four published programs, and remove expectations for `HeroStatementDecoder`, `WorkGallery`, the conventional footer, and the old `/#work` hero layout.

- [ ] **Step 2: Run the homepage and shell tests**

Run: `npm test -- src/components/__tests__/myles-97-shell.test.tsx src/app/__tests__/home-first-impression.test.tsx src/app/__tests__/home-statement-layout.test.ts`

Expected: FAIL because the shell does not exist and the old homepage is still rendered.

- [ ] **Step 3: Implement the server/client boundary**

```tsx
export default async function Home() {
  const projects = await getPublishedProjects();
  return <Myles97Shell programs={buildProgramRegistry(projects)} />;
}
```

`Myles97Shell` renders the clean initial state on the server, then merges valid browser persistence in an effect. It must not hide the four project links behind hydration, JavaScript, dragging, or the boot presentation layer.

- [ ] **Step 4: Implement the Welcome and Selected Work programs**

The Welcome window contains the portrait mark, name, approved line, supporting context, and a `Selected Work` button that focuses the explorer. The explorer lists the four program names, project covers, evidence labels, and native links. Its primary click opens/focuses the corresponding program window; modified clicks follow `/work/<slug>` normally.

- [ ] **Step 5: Implement Start and taskbar state**

Start contains Selected Work, About Myles, Loose Parts, Résumé, E-mail, Display Properties, and Reset Desktop. The taskbar renders one button per open program, toggles minimize/restore, exposes the real local clock through `<time>`, and marks exactly one focused program. Escape closes Start without closing programs.

- [ ] **Step 6: Run the focused tests and validate content**

Run: `npm test -- src/components/__tests__/myles-97-shell.test.tsx src/app/__tests__/home-first-impression.test.tsx src/app/__tests__/home-statement-layout.test.ts`

Run: `npm run validate:content`

Expected: all PASS.

- [ ] **Step 7: Commit the working desktop**

```bash
git add src/components/myles-97/myles-97-shell.tsx src/components/myles-97/workstation-desktop.tsx src/components/myles-97/welcome-program.tsx src/components/myles-97/selected-work-explorer.tsx src/components/myles-97/start-menu.tsx src/components/myles-97/taskbar.tsx src/components/__tests__/myles-97-shell.test.tsx src/app/page.tsx src/app/__tests__/home-first-impression.test.tsx src/app/__tests__/home-statement-layout.test.ts
git commit -m "feat: launch the Myles 97 desktop"
```

### Task 5: Boot sequence and Display Properties

**Files:**
- Create: `src/components/myles-97/boot-sequence.tsx`
- Create: `src/components/myles-97/display-properties.tsx`
- Create: `src/lib/myles-97/theme.ts`
- Create: `src/components/__tests__/myles-97-boot.test.tsx`
- Create: `src/components/__tests__/myles-97-display-properties.test.tsx`
- Modify: `src/components/myles-97/myles-97-shell.tsx`
- Modify: `src/components/theme-toggle.tsx`
- Modify: `src/components/loom-embed.tsx`
- Modify: `src/components/__tests__/loom-embed.test.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/styles/myles-97.css`

**Interfaces:**
- Consumes: `bootCompleted`, `DisplayPreferences`, and canonical `theme` storage.
- Produces: `BootSequence({ eligible, onComplete })` and `DisplayProperties({ preferences, onChange, onReset })`.

- [ ] **Step 1: Write boot eligibility, skip, and reduced-motion tests**

```tsx
render(<BootSequence eligible onComplete={onComplete} />);
expect(screen.getByText("Loading selected work...")).toBeInTheDocument();
fireEvent.keyDown(window, { key: "Enter" });
expect(onComplete).toHaveBeenCalledTimes(1);

vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
render(<BootSequence eligible onComplete={reducedComplete} />);
expect(screen.queryByText("Loading selected work...")).toBeNull();
expect(reducedComplete).toHaveBeenCalledTimes(1);
```

Use fake timers to assert completion at or before 1,500ms and assert cleanup prevents a second completion.

- [ ] **Step 2: Write Display Properties tests**

Assert that light/dark changes update the existing `theme` key and `data-theme`; high contrast updates `data-m97-contrast`; reduced motion updates `data-m97-motion`; Reset Desktop invokes the reducer reset after an explicit confirmation control.

- [ ] **Step 3: Run both suites and confirm they fail**

Run: `npm test -- src/components/__tests__/myles-97-boot.test.tsx src/components/__tests__/myles-97-display-properties.test.tsx src/components/__tests__/theme-toggle.test.tsx`

Expected: FAIL because the new components do not exist.

- [ ] **Step 4: Implement the boot as a removable overlay**

Render the desktop underneath from first paint. The overlay progresses through portrait pixels, clean `/logomark.svg`, `Myles 97`, and the loading bar. Bind one pointerdown and keydown listener with `{ once: true }`; use one 1,500ms maximum timer; cancel timers/listeners on completion and unmount. Persist completion through the Task 2 state boundary.

- [ ] **Step 5: Centralize the theme store**

Extract the current `Theme`, `getThemeSnapshot`, and `setTheme(next)` behavior from `ThemeToggle` into `src/lib/myles-97/theme.ts`. Update `LoomEmbed` to consume the same exported theme store rather than independently reimplementing `theme-change` and storage listeners. Keep the inline `theme-init` script in `layout.tsx` using the same `theme` key so first paint, embeds, ThemeToggle, and Display Properties cannot disagree.

- [ ] **Step 6: Implement display controls and visual states**

Display Properties uses native radio buttons for light/dark, checkboxes for high contrast and reduced motion, and a separate Reset Desktop button. CSS applies high contrast without changing project imagery and removes all nonessential animations when either system or user reduction is active.

- [ ] **Step 7: Run tests, lint, and commit**

Run: `npm test -- src/components/__tests__/myles-97-boot.test.tsx src/components/__tests__/myles-97-display-properties.test.tsx src/components/__tests__/theme-toggle.test.tsx src/components/__tests__/loom-embed.test.tsx`

Run: `npm run lint && npx tsc --noEmit`

```bash
git add src/components/myles-97/boot-sequence.tsx src/components/myles-97/display-properties.tsx src/components/myles-97/myles-97-shell.tsx src/components/theme-toggle.tsx src/components/loom-embed.tsx src/components/__tests__/myles-97-boot.test.tsx src/components/__tests__/myles-97-display-properties.test.tsx src/components/__tests__/theme-toggle.test.tsx src/components/__tests__/loom-embed.test.tsx src/lib/myles-97/theme.ts src/app/layout.tsx src/app/styles/myles-97.css
git commit -m "feat: add Myles 97 boot and display controls"
```

### Task 6: Program-window project entry and reversible return

**Files:**
- Modify: `src/lib/project-enter.ts`
- Modify: `src/components/project-enter-transition.tsx`
- Create: `src/components/myles-97/project-program.tsx`
- Modify: `src/components/__tests__/project-enter-transition.test.tsx`
- Create: `src/lib/__tests__/myles-97-return-state.test.ts`
- Modify: `src/app/styles/myles-97.css`

**Interfaces:**
- Extends: `ProjectEnterVisual` with `{ type: "program"; programId; appName; title; cover }`.
- Produces: `ProjectReturnSnapshot`, `saveProjectReturnSnapshot()`, `readProjectReturnSnapshot()`, and `dispatchProjectReturnRequest()`.

- [ ] **Step 1: Write failing structured-visual and return tests**

```ts
const visual: ProjectEnterVisual = {
  type: "program",
  programId: "fresh-greens",
  appName: "Fresh Greens.exe",
  title: "Fresh Greens",
  cover: { type: "image", src: "/projects/fresh-greens/cover.png" },
};
request({ slug: "fresh-greens", href: "/work/fresh-greens", rect, visual, borderRadius: "0px" });
expect(document.querySelector(".project-enter-program-title")).toHaveTextContent("Fresh Greens.exe");
```

Add tests that valid source geometry produces a reverse overlay to the saved desktop rectangle, missing/stale geometry falls back to a crossfade, Escape and timeout release scroll lock, and reduced motion navigates without geometry animation.

- [ ] **Step 2: Run the transition suites**

Run: `npm test -- src/components/__tests__/project-enter-transition.test.tsx src/lib/__tests__/myles-97-return-state.test.ts`

Expected: FAIL because `program` and return requests are not supported.

- [ ] **Step 3: Extend the discriminated visual without DOM serialization**

```ts
export type ProjectCoverVisual = { type: "image"; src: string } | { type: "tiktok" };
export type ProjectEnterVisual =
  | ProjectCoverVisual
  | {
      type: "program";
      programId: ProjectProgramId;
      appName: string;
      title: string;
      cover: ProjectCoverVisual;
    };
export type ProjectReturnSnapshot = {
  version: 1;
  slug: ProjectProgramId;
  rect: ProjectEnterRect;
  borderRadius: string;
  visual: Extract<ProjectEnterVisual, { type: "program" }>;
};
```

Render the program title bar, cover, and active chrome from this data. Do not call canvas capture, serialize DOM, or store image blobs.

- [ ] **Step 4: Dispatch from the real project program**

`ProjectProgram` measures its complete `.myles97-program-window`, saves the return snapshot to session storage, and dispatches the forward request. Modified clicks and reduced motion retain native navigation. The destination still settles against `.project-page[data-project-slug] [data-project-enter-cover]`.

- [ ] **Step 5: Add reverse-return handling**

Introduce `project-return-request`. From Reader Mode, mount a structured overlay over the current destination cover, navigate to `/`, wait for `[data-m97-program-window="<slug>"]`, then animate to its restored rectangle. If the target does not exist within the existing frame-attempt budget, release locks and crossfade. Browser Back uses the same stored snapshot when navigation returns to `/`.

- [ ] **Step 6: Preserve existing cleanup contracts**

Keep the 4,500ms failsafe, one-shot completion event, animation cancellation, route-change checks, and `project-enter-lock` cleanup. Verify both animated and reduced-motion paths land on one final paint layer.

- [ ] **Step 7: Run the transition regression suite and commit**

Run: `npm test -- src/components/__tests__/project-enter-transition.test.tsx src/lib/__tests__/myles-97-return-state.test.ts src/components/__tests__/work-project-card-layout.test.tsx`

```bash
git add src/lib/project-enter.ts src/components/project-enter-transition.tsx src/components/myles-97/project-program.tsx src/components/__tests__/project-enter-transition.test.tsx src/lib/__tests__/myles-97-return-state.test.ts src/app/styles/myles-97.css
git commit -m "feat: morph Myles 97 programs into case studies"
```

### Task 7: Reader Mode across every case study

**Files:**
- Create: `src/components/myles-97/reader-shell.tsx`
- Create: `src/components/myles-97/reader-header.tsx`
- Create: `src/components/__tests__/myles-97-reader-shell.test.tsx`
- Create: `src/app/styles/reader-mode.css`
- Modify: `src/app/globals.css`
- Modify: `src/app/__tests__/global-style-boundaries.test.ts`
- Modify: `src/components/project-toc.tsx`
- Modify: `src/app/work/[slug]/page.tsx`
- Modify: `src/app/work/fresh-greens/page.tsx`
- Modify: `src/app/work/understandingfafsa/page.tsx`
- Modify: `src/app/work/navi/page.tsx`
- Modify: `src/app/work/tiktok/page.tsx`
- Modify: `src/app/work/__tests__/case-study-tocs.test.ts`

**Interfaces:**
- Consumes: existing `CASE_STUDY_CHAPTERS`, `ProjectToc`, project slug/title, and return snapshot.
- Produces: `ReaderShell({ slug, title, children })` and `ReaderHeader({ slug, title })`.

- [ ] **Step 1: Write Reader Mode semantics tests**

```tsx
render(
  <ReaderShell slug="fresh-greens" title="Fresh Greens">
    <article><h1>Fresh Greens</h1><p>Readable copy</p></article>
  </ReaderShell>,
);
expect(screen.getByRole("banner")).toHaveTextContent("Fresh Greens.exe");
expect(screen.getByRole("link", { name: "Return to Desktop" })).toHaveAttribute("href", "/");
expect(screen.getByRole("main")).toHaveAttribute("data-reader-mode", "fresh-greens");
```

Update route-source tests to require `ReaderShell`, preserve one `ProjectToc`, and forbid `SiteNav` inside the five case-study pages.

- [ ] **Step 2: Run the Reader and TOC tests**

Run: `npm test -- src/components/__tests__/myles-97-reader-shell.test.tsx src/components/__tests__/project-toc.test.tsx src/app/work/__tests__/case-study-tocs.test.ts`

Expected: FAIL because Reader Mode is not present.

- [ ] **Step 3: Implement the shell without a second chapter model**

`ReaderShell` renders the slim header and a semantic `<main className="project-page reader-mode">`. `ReaderHeader` maps the slug through `PROJECT_PROGRAM_BLUEPRINTS`, renders the original app name, and uses the return request only when a valid snapshot exists. Otherwise its Desktop link performs normal navigation.

- [ ] **Step 4: Preserve and restyle `ProjectToc`**

Do not duplicate IntersectionObserver, ResizeObserver, reading time, roving keys, anchors, or live announcements. Add a `variant="reader"` prop that contributes `project-toc--reader`; style the existing taskbar-like chapter navigation through that class.

- [ ] **Step 5: Apply Reader Mode to all routes**

Wrap the generic route plus Fresh Greens, UnderstandingFAFSA, Navi, and TikTok. Remove only the duplicated `SiteNav` and outer `<main>` elements. Keep every project-specific class, `data-project-slug`, cover marker, section ID, component, and content block unchanged. Do not wrap `/work/navi/demo*` or `/work/navi/system*`; their minisite layouts retain independent navigation and typography.

- [ ] **Step 6: Add the reading typography contract**

```css
.reader-mode {
  background: var(--m97-paper);
  color: var(--m97-reader-ink);
}
.reader-mode :where(.project-content, .project-section-body, .project-hero-lede) {
  font-family: var(--m97-reader-font);
  font-size: clamp(17px, 1.2vw, 18px);
  line-height: 1.7;
}
.reader-mode :where(.project-content, .project-section-body) {
  max-width: 68ch;
}
.reader-mode :where(.project-hero-title, .project-section > h2, .project-evidence-heading, .project-toc, .reader-header) {
  font-family: var(--m97-ui-font);
}
```

At `max-width: 767px`, set prose to `clamp(16px, 4.2vw, 17px)` and `line-height: 1.67`. Keep project accent variables, imagery, captions, interactive artifacts, and route-specific components intact. Import `reader-mode.css` after `myles-97.css` and extend `global-style-boundaries.test.ts` to enforce that order.

- [ ] **Step 7: Run focused and project-specific regressions**

Run: `npm test -- src/components/__tests__/myles-97-reader-shell.test.tsx src/components/__tests__/project-toc.test.tsx src/app/work/__tests__/case-study-tocs.test.ts src/app/work/fresh-greens/__tests__ src/app/work/understandingfafsa/__tests__ src/app/work/navi/__tests__ src/app/work/tiktok/__tests__`

Expected: PASS.

- [ ] **Step 8: Commit Reader Mode**

```bash
git add src/components/myles-97/reader-shell.tsx src/components/myles-97/reader-header.tsx src/components/project-toc.tsx src/components/__tests__/myles-97-reader-shell.test.tsx src/app/styles/reader-mode.css src/app/globals.css src/app/__tests__/global-style-boundaries.test.ts 'src/app/work/[slug]/page.tsx' src/app/work/fresh-greens/page.tsx src/app/work/understandingfafsa/page.tsx src/app/work/navi/page.tsx src/app/work/tiktok/page.tsx src/app/work/__tests__/case-study-tocs.test.ts
git commit -m "feat: add readable Myles 97 case-study mode"
```

### Task 8: Trini roti note and secondary programs

**Files:**
- Create: `src/lib/myles-97/recipe.ts`
- Create: `src/components/myles-97/recipe-note.tsx`
- Create: `src/components/myles-97/loose-parts-program.tsx`
- Create: `src/components/myles-97/secondary-programs.tsx`
- Create: `src/components/__tests__/myles-97-secondary-programs.test.tsx`
- Modify: `src/components/myles-97/workstation-desktop.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/app/__tests__/public-route-metadata.test.ts`
- Modify: `src/app/styles/myles-97.css`

**Interfaces:**
- Consumes: `playEntries`, `siteConfig`, and approved `TRINI_ROTI_RECIPE` content.
- Produces: recipe note preview/Notepad view, Loose Parts list, About/Resume preview programs, and themed recoverable 404.

- [ ] **Step 1: Stop at the recipe-content checkpoint**

Ask Myles for the exact recipe title, visible preview fragment, ingredients, and steps. Obtain explicit approval, then write those literal approved strings into `TRINI_ROTI_RECIPE`; do not use temporary copy, empty arrays, or generated substitutions. The data contract is:

```ts
export type RecipeNoteContent = {
  title: string;
  preview: string;
  ingredients: readonly string[];
  steps: readonly string[];
  note?: string;
};

```

This is an explicit user-content gate, not permission to insert filler. Continue the non-recipe steps while waiting if they are independent.

- [ ] **Step 2: Write secondary-program tests**

Assert that the collapsed recipe note is after primary work in DOM order, opens through a button, traps no focus, and closes back to its trigger. Assert Loose Parts renders every `playEntries` title and links to `/play#<slug>`. Assert About and Résumé previews link to canonical routes. Assert the 404 exposes Desktop and Selected Work recovery actions.

- [ ] **Step 3: Run the focused tests and confirm they fail**

Run: `npm test -- src/components/__tests__/myles-97-secondary-programs.test.tsx src/app/__tests__/public-route-metadata.test.ts`

Expected: FAIL because the programs do not exist.

- [ ] **Step 4: Implement the recipe note geometry and semantics**

Use a warm paper color distinct from `--m97-signal`, `rotate(1.5deg)`, a Tahoma label, and Georgia recipe text. Keep it out of the Welcome and Selected Work rectangles through the desktop layout grid, not absolute overlap avoidance. Opening renders a nonmodal Notepad program with semantic ingredient and ordered-step lists.

- [ ] **Step 5: Implement Loose Parts and route previews**

Render existing `playEntries` without duplicating their media or prose. Each row shows title, medium, state, and a canonical link. About and Résumé programs show compact factual previews and native links. E-mail remains a `mailto:` action rather than a fake composer.

- [ ] **Step 6: Theme the 404 with real recovery**

Replace decorative error copy with a Myles 97 system dialog containing `Return to Desktop` (`/`) and `Open Selected Work` (`/#selected-work`). Preserve the existing route metadata and heading semantics.

- [ ] **Step 7: Run tests and commit after recipe approval**

Run: `npm test -- src/components/__tests__/myles-97-secondary-programs.test.tsx src/lib/__tests__/play-content.test.ts src/app/__tests__/public-route-metadata.test.ts`

```bash
git add src/lib/myles-97/recipe.ts src/components/myles-97 src/components/__tests__/myles-97-secondary-programs.test.tsx src/app/not-found.tsx src/app/__tests__/public-route-metadata.test.ts src/app/styles/myles-97.css
git commit -m "feat: add personal and utility programs"
```

### Task 9: Pocket 97 capability-led mobile shell

**Files:**
- Create: `src/components/myles-97/use-pocket-97.ts`
- Create: `src/components/myles-97/pocket-97-shell.tsx`
- Create: `src/components/__tests__/pocket-97-shell.test.tsx`
- Modify: `src/components/myles-97/myles-97-shell.tsx`
- Modify: `src/components/mobile-nav.tsx`
- Modify: `src/components/__tests__/mobile-nav.test.tsx`
- Modify: `src/app/__tests__/portfolio-hardening-contract.test.ts`
- Modify: `src/app/styles/myles-97.css`
- Modify: `src/app/styles/reader-mode.css`

**Interfaces:**
- Consumes: shared program registry/reducer and `matchMedia("(max-width: 767px), (pointer: coarse)")`.
- Produces: `usePocket97()` and single-app `Pocket97Shell` with Start, Work, Loose Parts, and Open Apps dock actions.

- [ ] **Step 1: Write failing capability and mobile-shell tests**

```tsx
vi.mocked(window.matchMedia).mockImplementation((query) => ({
  matches: query === "(max-width: 767px), (pointer: coarse)",
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
} as unknown as MediaQueryList));

render(<Myles97Shell programs={programs} />);
expect(screen.getByRole("navigation", { name: "Pocket 97 dock" })).toBeInTheDocument();
expect(document.querySelector("[data-draggable-window]")).toBeNull();
expect(screen.getAllByRole("link", { name: /Open .* case study/ })).toHaveLength(4);
```

Assert that the old global `MobileNav` does not render on `/` or the four Reader case-study routes once Pocket/Reader navigation owns those surfaces, but remains available on direct About, Play, and Résumé routes. Preserve its current exclusion for `/work/navi/demo*` and `/work/navi/system*`, whose minisite chrome remains independent.

- [ ] **Step 2: Run mobile tests and confirm they fail**

Run: `npm test -- src/components/__tests__/pocket-97-shell.test.tsx src/components/__tests__/mobile-nav.test.tsx`

Expected: FAIL because Pocket 97 does not exist.

- [ ] **Step 3: Implement a hydration-safe capability hook**

Use `useSyncExternalStore` with a server snapshot of `false`, subscribe to the single media query, and render a shared non-overlapping initial program list before capability enhancement. Do not branch server markup on `window.innerWidth`. Update `portfolio-hardening-contract.test.ts` so the previous exclusive 767/768 ownership assertion is intentionally replaced by the approved capability query plus safe-area requirements.

- [ ] **Step 4: Implement the single-app mobile model**

The mobile home shows portrait/name/copy, full-width project programs, then the Trini roti note. Opening a program replaces the stack above the dock; Back returns to the stack; Open Apps lists recent programs. There is no title-bar dragging, desktop panning, or resize affordance.

- [ ] **Step 5: Complete mobile Reader Mode**

Keep `ReaderHeader` and `ProjectToc` sticky, make chapter controls thumb-reachable, set 16–17px Georgia body copy at 1.67 leading, and reserve bottom padding for the dock. The dock must not cover lightbox close controls or the last paragraph.

- [ ] **Step 6: Run mobile, reader, and route tests**

Run: `npm test -- src/components/__tests__/pocket-97-shell.test.tsx src/components/__tests__/mobile-nav.test.tsx src/components/__tests__/myles-97-reader-shell.test.tsx src/app/__tests__/metadata-routes.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit Pocket 97**

```bash
git add src/components/myles-97/use-pocket-97.ts src/components/myles-97/pocket-97-shell.tsx src/components/myles-97/myles-97-shell.tsx src/components/mobile-nav.tsx src/components/__tests__/pocket-97-shell.test.tsx src/components/__tests__/mobile-nav.test.tsx src/app/__tests__/portfolio-hardening-contract.test.ts src/app/styles/myles-97.css src/app/styles/reader-mode.css
git commit -m "feat: adapt the workstation into Pocket 97"
```

### Task 10: Resource licensing, edge states, and performance

**Files:**
- Create if any external resource is adopted: `THIRD_PARTY_NOTICES.md`
- Create: `src/app/__tests__/myles-97-hardening-contract.test.ts`
- Modify only when a focused failure proves necessary: Myles 97 files from Tasks 1–9.

**Interfaces:**
- Consumes: the complete workstation, transition, Reader, and Pocket surfaces.
- Produces: documented resource provenance, safe failure states, and regression contracts.

- [ ] **Step 1: Audit adopted resources before accepting them**

For every new package, SVG, font, or copied reference, record upstream repository URL, exact package version or commit, license identifier, local modifications, and attribution requirement. Reject Microsoft-extracted assets and unclear licenses. If no external resource was adopted, verify the icons are original local components and do not create an empty notices file.

- [ ] **Step 2: Write hardening tests**

Read the source/style files and assert: no hotlinked UI image URLs; no `windows`, `microsoft`, `.wav`, or proprietary asset filenames; boot timeout is at most 1,500ms; transition failsafe exists; public URLs remain unchanged; every project route retains `data-project-slug` and `data-project-enter-cover`; mobile CSS has no horizontal desktop overflow; and reader prose declares the approved font/size/leading contract.

- [ ] **Step 3: Add real fallback states**

Ensure corrupt state resets silently, missing project metadata leaves Selected Work open with title/link fallbacks, image failures retain program title/evidence/open action, transition timeouts release locks, empty Loose Parts explains the surface and links back to Work, and direct case-study URLs render Reader Mode without fake desktop animation.

- [ ] **Step 4: Verify loading behavior**

Keep the server-rendered homepage links visible before hydration. Preserve Next image optimization and existing priority only for the first visible project. Lazy-load heavy project media and avoid any new window-management runtime dependency.

- [ ] **Step 5: Run hardening and performance-sensitive tests**

Run: `npm test -- src/app/__tests__/myles-97-hardening-contract.test.ts src/app/__tests__/layout-first-paint.test.tsx src/app/__tests__/visible-first-motion.test.ts src/components/__tests__/scroll-reveal-fallback.test.tsx src/components/__tests__/lightbox-provider.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit hardening changes**

```bash
git add src/app/__tests__/myles-97-hardening-contract.test.ts
git commit -m "test: harden the Myles 97 experience"
```

If verification required a focused production fix, add only the exact modified file shown by `git status --short`, rerun its focused test, and include it in this commit. If `THIRD_PARTY_NOTICES.md` was created for an adopted resource, stage that file explicitly. Do not stage whole directories.

### Task 11: Rendered quality review and release verification

**Files:**
- Modify only files already in scope when a verified defect requires correction.
- Create: `docs/verification/2026-08-04-myles-97-verification.md`

**Interfaces:**
- Consumes: completed implementation and production build.
- Produces: measured visual/accessibility evidence and a clean release candidate.

- [ ] **Step 1: Run all automated verification**

Run: `npm test`

Run: `npm run lint`

Run: `npx tsc --noEmit`

Run: `npm run validate:content`

Run: `npm run build`

Run: `git diff --check`

Expected: every command exits 0.

- [ ] **Step 2: Verify desktop and intermediate geometry**

Inspect 1440×900, 1280×720, 1024×768, and 768×1024. Measure outer padding, 16–24px window padding, title/control optical centering, icon/label gaps, window reachability, Welcome/Explorer/note separation, focused-title/taskbar agreement, and the four-project one-action discovery path.

- [ ] **Step 3: Verify Pocket 97 and Reader geometry**

Inspect 390×844 and 320×568. Measure 16–20px content padding, 44px targets, 16–17px prose at 1.62–1.72 leading, 62–72ch maximum desktop measure, heading collision clearance, dock clearance, chapter reachability, and absence of horizontal panning.

- [ ] **Step 4: Verify input, accessibility, and failure paths**

Test fine pointer, coarse pointer, keyboard only, 200% zoom, large text, system reduced motion, user-reduced motion, forced colors, direct project entry, homepage-origin entry, Back/Forward, refresh in both modes, transition timeout, Escape cleanup, corrupt storage, missing image, and empty Loose Parts. Confirm reduced-motion final paint matches the animated end state.

- [ ] **Step 5: Run independent review gates**

Use separate reviewers for design direction, typography/geometry, accessibility/motion, interaction integrity, and code quality. Every finding includes a screenshot or source reference plus severity. Fix all P0/P1 findings and rerun the relevant focused tests and measurements.

- [ ] **Step 6: Record verification evidence**

In `docs/verification/2026-08-04-myles-97-verification.md`, record tested commit, commands/results, viewport matrix, measured padding/leading, contrast checks, motion/keyboard results, resource licenses, reviewer findings, fixes, and remaining P2/P3 notes. Do not claim production verification until the branded domain is actually checked.

- [ ] **Step 7: Commit the verified release candidate**

```bash
git add docs/verification/2026-08-04-myles-97-verification.md
git commit -m "docs: verify the Myles 97 portfolio system"
```

## Execution Order and Checkpoints

- Tasks 1–3 establish typed data, state, and chrome.
- Task 4 is the first complete vertical slice: a usable, server-visible Workstation homepage.
- Task 5 adds boot and preferences without gating content.
- Tasks 6–7 connect the workstation to readable case studies.
- Task 8 adds approved personal and secondary surfaces; its recipe copy has a user-content checkpoint.
- Task 9 adapts the shared state model to Pocket 97.
- Tasks 10–11 harden and verify the complete system.
- After Tasks 4, 7, 9, and 11, pause for a rendered review before continuing.

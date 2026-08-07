# Myles 98 Task 4 Gap Review

**Purpose:** harden the Myles 98 desktop shell before implementation by comparing the approved Myles 97/98 workstation plan against the current `codex/myles-97-design` branch.

## Executive summary

Tasks 1–3 now provide the program registry, persisted workstation state, accessible program-window chrome, drag behavior, original icons, and global Myles 97 styles. The branch is ready for the desktop shell, but one state invariant should be corrected before multiple windows are composed: focus must also update the persisted window-stack order.

The lateral-design pass reinforced rather than replaced the approved direction: the OS identity should come primarily from behavior and state, not from maximizing generic retro chrome. Welcome and Selected Work remain the first impression; project programs should progressively carry more project identity as they open.

## Indexed gaps

### G-001 — Focus and stack order can diverge

**Expected:** the state manager owns a bounded window stack, and active title bars, taskbar state, and visual layering agree.

**Current:** `focusedProgram` changes on focus/restore, but `openPrograms` retains its earlier order. Once three or more windows are open, a focused window can be visually below a later-opened window if `openPrograms` is used as the stack.

**Why it matters:** Task 4 needs one authoritative ordering model before the shell begins composing multiple program windows.

**Resolution direction:** treat `openPrograms` as back-to-front stack order and move the focused/restored/opened program to the end.

### G-002 — No hydrated workstation shell

**Expected:** `Myles97Shell` server-renders the clean initial desktop, then merges valid local/session persistence after hydration without hiding project access.

**Current:** no shell component exists.

### G-003 — Homepage still uses the conventional portfolio hero/gallery/footer

**Expected:** the homepage server component builds four project program definitions and renders the workstation shell.

**Current:** `src/app/page.tsx` still renders `SiteNav`, `HeroStatementDecoder`, `WorkGallery`, About, drafts, and the conventional footer.

### G-004 — Welcome and Selected Work programs are missing

**Expected:** focused Welcome sits in front of Selected Work on first load, with the exact approved line and supporting context; Selected Work exposes all four project programs as real links in initial HTML.

**Current:** neither program exists.

### G-005 — Start and taskbar behavior are missing

**Expected:** Start exposes Selected Work, About Myles, Loose Parts, Résumé, E-mail, Display Properties, and Reset Desktop; the taskbar reflects open/minimized/focused programs and exposes a real local clock.

**Current:** neither surface exists.

### G-006 — Project opening has no workstation-level preview state

**Expected:** an unmodified project activation can open/focus its program while the native `/work/<slug>` destination remains available, especially to modified clicks and direct navigation.

**Current:** homepage project interactions navigate directly through the old gallery.

## Lateral design challenge

### Surviving inversion

**Assumption:** a convincing late-1990s workstation should maximize visible OS chrome.

**Flip:** a convincing workstation can use less generic chrome if state changes are unusually legible.

**Where the flip is true:** modern DAWs, IDEs, and professional workspaces often feel more like complete operating environments than decorative desktop replicas because one active tool/channel is unmistakable, open work persists, and switching changes the workspace coherently.

**Implementation consequence:** keep Welcome and Selected Work visually calm; use cobalt only for true focus; let taskbar state, window accumulation, restore behavior, and later project-specific programs carry the metaphor.

### Structural analogy — recording console

The desktop has many available sources, one active channel, persistent open channels, and a need to preserve context while switching. A recording console solves the same shape by making channel state clearer than the surrounding hardware decoration.

**Transferred mechanism:** the focused program, taskbar button, and stacking order must always agree. Inactive windows should recede rather than compete.

## Build order

1. Resolve G-001 in the reducer and tests.
2. Implement G-002, G-004, and G-005 as one shell slice.
3. Replace the homepage for G-003 while preserving four server-rendered project links.
4. Add G-006 as a lightweight program preview; leave the structured route-morph transition to its planned later task.
5. Validate the committed slice through Vercel, then run the next code/gap review before extending the system.

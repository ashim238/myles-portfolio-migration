# Myles 98 / Pocket 98 Verification Record

> Historical filename retained to match the August 4 implementation plan. Canonical product language is **Myles 98** and **Pocket 98**; see `docs/MYLES_98_NAMING.md`.

**Verification date:** 2026-08-07  
**Implementation checkpoint:** `d1990024bbd698b5ee0a58971f74e64d63a2aefd` (`chore: harden and polish Myles 98`)  
**Task 9 base:** `12cff767926037d588d2f6a9b9ef31c1d8969203` (`feat: adapt the workstation into Pocket 97`, historical commit wording)  
**Release status:** **release candidate under verification** — desktop rendered review and Vercel build are verified; Pocket 98 rendered review, the full local command matrix, and branded-domain verification remain open.

## 1. Automated and build evidence

| Check | Result | Evidence / boundary |
|---|---|---|
| Vercel / Next production deployment for `d199002` | **PASS** | GitHub Vercel status: deployment completed successfully. |
| Task 10 diff boundary | **PASS** | Task 10 is one commit ahead of Task 9 and changes only hardening, naming, icon, recovery, shell, and focused test/style files. No case-study prose/evidence changes. |
| `npm test` | **NOT RUN IN THIS CONNECTOR-ONLY WORKSPACE** | The repository contains focused Vitest contracts for Myles 98 language, icons, taskbar clock, Pocket behavior, hardening, Reader Mode, transitions, and secondary programs. A local/CI runner still needs to execute the complete suite. |
| `npm run lint` | **NOT RUN HERE** | Requires a materialized checkout/runtime. |
| `npx tsc --noEmit` | **NOT RUN HERE** | Vercel/Next build gives compile coverage but is not recorded as a substitute for the requested standalone TypeScript command. |
| `npm run validate:content` | **NOT RUN HERE** | Requires a materialized checkout/runtime. |
| `npm run build` | **PASS VIA VERCEL BUILD** | Production deployment for the tested SHA completed successfully. |
| `git diff --check` | **NOT RUN HERE** | Requires a local git checkout. |

No GitHub Actions workflow result is being claimed for commands not shown above.

## 2. Resource and licensing audit

**Result: PASS for adopted Myles 98 UI resources.**

- Myles 98 system/project icons are original local React SVG components in `src/components/myles-97/icons.tsx`.
- No Microsoft logos, startup sounds, extracted Windows icons, wallpaper, `.wav` files, or hotlinked production UI imagery were adopted.
- No new icon/UI dependency was added for the Myles 98 system, so no `THIRD_PARTY_NOTICES.md` file was created.
- The Buss Up Shut recipe note is paraphrased from the user-approved African Bites / Immaculate Bites recipe and retains a visible source link. It is content attribution, not a vendored UI resource.

The hardening source contract checks these boundaries directly.

## 3. Product-language verification

**Canonical names:**

- **Myles 98** — desktop/workstation experience.
- **Pocket 98** — capability-led mobile experience.
- **Reader Mode** — case-study reading surface.

Visitor-facing boot, Welcome, desktop ARIA labels, Start branding, taskbar titles, Pocket labels, recovery UI, README language, and focused tests use the 98 names.

Legacy identifiers such as `src/components/myles-97/`, `.myles97-*`, `Myles97Shell`, `Pocket97Shell`, `POCKET_97_QUERY`, version-1 storage keys, the working branch name, and historical August 4 plan/spec paths are implementation/history identifiers only. `docs/MYLES_98_NAMING.md` makes this distinction explicit and the `myles-98-language` contract prevents visible product copy from regressing to 97.

## 4. Desktop rendered review

**Input:** user-provided screen recording, approximately 59.7 seconds, 1470×956 recording canvas. The recording includes browser/Vercel chrome, so it is useful rendered evidence but is **not** claimed as the exact 1440×900 plan viewport.

### What read correctly

- The desktop immediately reads as an authored workstation rather than a literal Windows reproduction.
- Welcome is clearly focused over Selected Work on first orientation.
- Focused title bars and taskbar state agree during the demonstrated interactions.
- Selected Work exposes all four project programs without requiring window manipulation.
- The right-side Buss Up Shut paper note reads as a personal signal and stays outside the core work path.
- Reader Mode is substantially calmer than the desktop and allows project identity/content to take over.
- `Return to Desktop` restores workstation context rather than resetting to a blank homepage.
- Secondary programs (Loose Parts and Résumé demonstrated) remain coherent with the OS metaphor.

### Findings and fixes from the recording

| Severity | Finding | Fix in `d199002` |
|---|---|---|
| **P1** | Taskbar clock showed server/Vercel time rather than the viewer's browser-local time. | Taskbar now SSR-renders `--:--`, then hydrates from browser-local `new Date()` and refreshes every 30 seconds. A focused taskbar regression test was added. |
| **P2** | Selected Work began too far left and partially competed with desktop shortcut labels. | Default Selected Work x-position moved from 88px to 136px, clearing the 120px shortcut rail plus spacing. |
| **P2** | Loose Parts was materially taller than its two-entry content and left a large dead white region. | Fine-pointer desktop polish caps the Loose Parts window at 400px. |
| **P2** | Generic app glyphs made multiple open programs feel interchangeable. | Four original project glyphs were added for Fresh Greens, FAFSA Mail, Navi, and TikTok Catalog and propagated to title bars, Reader headers, and taskbar buttons. |
| **P2** | Direct Selected Work `Open case study` navigation showed a brief blank/full-navigation frame. | Canonical case-study action remains a real link but now uses Next `Link` for client navigation/prefetch. The project-program path still owns the richer spatial morph. A re-record should confirm the visible flash reduction. |

No P0 issue was observed in the supplied desktop recording.

## 5. Geometry and typography contracts

These values are **source-contracted and build-verified**, not all independently measured from exact requested screenshots yet.

### Desktop / workstation

- 44×44 CSS-pixel interaction targets are used for retro window controls and major actions.
- Window content padding is 16px in the current core window surface, within the approved 16–24px desktop range.
- Selected Work initial geometry is `x:136`, `y:112`, `760×536`.
- Welcome initial geometry is `x:416`, `y:64`, `600×352`.
- The recipe note occupies a dedicated right rail rather than absolute-overlapping primary windows.

### Reader Mode

- Sustained prose target: 18px / 1.7 line height on desktop.
- Mobile Reader prose target: 16.5px / 1.68 line height.
- Sustained prose measure is capped at 68ch.
- Reader controls retain at least 44px target height.

### Pocket 98

- Capability query is `(max-width: 767px), (pointer: coarse)` rather than a server `window.innerWidth` branch.
- Pocket content uses 16px standard gutters and 12px at <=420px.
- Bottom dock reserves safe-area inset and exposes four primary actions.
- Server-first workstation markup is flattened on narrow/coarse devices before hydration so there is no horizontal desktop pan.
- Hydrated Pocket 98 is a single-app model; draggable desktop windows are absent.
- Enhanced Reader chapters move to the bottom thumb zone while the no-JS chapter list remains in normal flow.

**Rendered Pocket measurements at 390×844 and 320×568 remain open.**

## 6. Interaction, accessibility, motion, and failure-path evidence

### Implemented / source-contracted

- Keyboard-focus styles remain visible with 3px Myles 98 focus rings.
- Start transient menu closes on Escape and returns focus to Start.
- Recipe note close returns focus to the paper-note trigger.
- Pocket Start/Open Apps sheets close on Escape and return focus to the initiating dock control.
- Reduced-motion users bypass boot animation and custom project transition behavior.
- Boot duration is capped at 1,450ms and is skippable on the first pointer/key input.
- Project-enter transitions retain Escape cleanup, animation cancellation, and a failsafe timeout.
- Modified project-link clicks retain native browser behavior.
- Forced-colors rules exist across Workstation, Reader, secondary, and Pocket surfaces.
- Corrupt/stale workstation persistence is parsed defensively and falls back to a valid version-one state.
- Missing project metadata now preserves all four canonical programs with title/summary/link fallbacks.
- Missing cover imagery leaves project title/evidence/open-case action available.
- Empty Loose Parts explains the empty state and links back to Work.
- Direct case-study URLs render Reader Mode without requiring a fake desktop transition.
- Unknown routes provide real `Return to Desktop` and `Open Selected Work` recovery actions.

### Still requires rendered/manual verification

- Keyboard-only traversal across the complete deployed experience.
- 200% zoom.
- OS/browser large-text settings.
- Forced-colors rendering in a supporting environment.
- Exact reduced-motion final-paint visual equivalence.
- Coarse-pointer device behavior on a real/mobile-emulated viewport.
- Lightbox close/control clearance above the Pocket/Reader bottom UI.
- Browser Back/Forward across all requested origin combinations after the latest navigation polish.

## 7. Review-gate summary

The current environment cannot provide genuinely independent specialist reviewers, so no false claim of five independent reviewers is made. The following review lenses were nevertheless applied to source plus the supplied desktop recording:

- **Design direction:** OS metaphor reads through behavior/state; desktop feels authored rather than copied. Project-specific icon identity was strengthened after review.
- **Typography / geometry:** Reader typography meets the declared source contract; desktop recording exposed shortcut overlap and Loose Parts excess height, both fixed.
- **Accessibility / motion:** focus, reduced-motion, forced-colors, 44px targets, Escape cleanup, and no-JS mobile fallbacks are covered in implementation/contracts; rendered manual matrix remains partially open.
- **Interaction integrity:** desktop recording confirmed focus/taskbar agreement and return-state continuity; taskbar time and direct-link navigation issues were corrected.
- **Code quality:** no new window-management runtime dependency; canonical content/routes remain reused; heavy mobile/desktop behavior stays capability-gated; Task 10 was squashed to one bounded commit over Task 9.

## 8. Open verification matrix

| View / condition | Status |
|---|---|
| Desktop recording (~1470×956 canvas) | **REVIEWED** |
| Exact 1440×900 | **OPEN** |
| 1280×720 | **OPEN** |
| 1024×768 | **OPEN** |
| 768×1024 | **OPEN** |
| Pocket 98 390×844 | **OPEN — mobile recording requested** |
| Pocket 98 320×568 | **OPEN — mobile recording requested** |
| Direct Reader entry | **SOURCE/ROUTE CONTRACT VERIFIED; rendered matrix open** |
| Homepage-origin Reader entry | **DESKTOP RECORDING REVIEWED** |
| Return to Desktop | **DESKTOP RECORDING REVIEWED** |
| Branded production domain | **OPEN** |
| Full local test/lint/type/content/diff command matrix | **OPEN** |

## 9. Release decision

`d199002` is a **green build and credible desktop release candidate**, but this document does **not** label the system fully production-verified yet.

Release verification closes only after:

1. the full local/CI command matrix exits 0;
2. Pocket 98 is rendered-reviewed at 390×844 and 320×568 (a user screen recording is acceptable evidence for this review pass);
3. the requested desktop/intermediate viewport matrix is checked or explicitly waived;
4. remaining manual accessibility/failure paths are checked;
5. the branded domain is inspected after deployment.

Any P0/P1 finding discovered in those remaining checks blocks release until fixed and re-verified.

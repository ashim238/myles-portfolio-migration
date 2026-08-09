# Codex portfolio closeout handoff

**Prepared:** 2026-08-09  
**Canonical repository:** `ashim238/myles-portfolio-migration`  
**Working branch:** `codex/myles-97-design`  
**Product baseline before this documentation-only handoff:** `a5bc9f4ea2f97a33db9b4a308967c13ed8fe8b44` (`fix: restore Reader Mode contrast`)

## Purpose

Continue the portfolio closeout from the current green checkpoint without reopening the whole visual direction. The remaining work is a focused Navi argument-quality pass, rendered QA, visual-token cleanup, and repository hygiene.

The product should still feel like four authored projects inside the Myles 98 / Pocket 98 portfolio system, not four pages reskinned by one universal case-study template.

## Current remote state

At the product baseline above:

- `Verify Myles 98` completed successfully.
- `Capture Reader evidence review` completed successfully.
- Vercel built the same SHA and reported the preview as `READY`.
- The branch was 58 commits ahead of `main` and 0 behind.
- There was no open pull request.
- The current Reader contrast regression test protects hero, recruiter-cut, and TOC text.

This handoff commit changes documentation only. Treat `a5bc9f4` as the last product-code checkpoint when comparing rendered behavior.

## Important: green automation does not mean the visual pass is finished

The latest Reader evidence artifact has no reported overflow, page errors, or console errors, but human inspection still reveals two contrast failures on Navi:

1. Chapter prose on the light Reader canvas is extremely weak or effectively invisible in several sections.
2. The dark Navi research board has low-contrast inherited headings and card labels.

The likely ownership boundaries are concrete:

- `src/app/styles/base.css` gives `.project-section-body` and `.project-content` `color: var(--foreground)`. Reader Mode changes the canvas to light paper but does not currently override that body-copy color. Add Reader-owned ink for these shared prose containers.
- `src/app/styles/reader-mode.css` makes `.nv-section` inherit Reader ink. `src/app/styles/portfolio-surfaces.css` gives `.nv-research-board` a dark `var(--surface)` background but no explicit project-surface foreground, so headings such as “Research and product scope” and archetype names inherit dark Reader ink. Give the dark board explicit light text ownership while preserving its internal muted hierarchy.

Do not fix this by globally swapping `--foreground`, `--surface`, or the portfolio theme inside Reader Mode. Use narrow semantic ownership at the light Reader prose boundary and at Navi’s dark artifact boundary.

## First closeout task: finish Reader and Navi contrast ownership

### Required behavior

- Reader chapter prose, lists, evidence headings, captions, and chapter counts must be legible on `--m97-paper` in both surrounding site themes.
- Navi’s dark research board must retain its project-owned dark surface and use an appropriate light foreground and muted text.
- Project accents must remain project-owned.
- TikTok’s intentionally dark art-directed cover must remain unaffected.
- Forced-colors and reduced-motion behavior must remain intact.

### Minimum regression coverage

Extend `src/app/work/__tests__/reader-mode-contrast.test.ts` so it protects more than hero, recruiter, and TOC selectors. At minimum, assert that:

- Reader `.project-section-body` and `.project-content` use Reader ink.
- the Reader body copy does not depend on the surrounding site’s `--foreground` token;
- `.nv-research-board` establishes its own foreground on its dark surface;
- the muted research-board text remains contrast-safe against that surface;
- project accent selectors are not overwritten by a broad Reader rule.

Then inspect the rendered result at 1440 × 900 and 390 × 844, in both site themes.

## Navi story source notes

The user supplied a rushed but valuable source memo. Use it as factual and strategic context, not as final copy.

### Hook and framing

A useful opening tension is:

> Everyone knows New York is overcrowded. Navi asks: what if the problem is not only how many visitors arrive, but where attention, access, and spending concentrate?

Do not turn this into an unsupported claim that total visitor volume is harmless. The point is that the team’s actionable design question became distribution and quality of engagement, not that volume has no impact.

### Original project context

- Navi began as a graduate-school UX design challenge conducted over several months in 2025.
- The brief asked for a regenerative response to tourism in New York City: tourism as participation and contribution, not only consumption.
- The intended balance included visitors, local business owners and artisans, and longtime residents.
- Myles’s studio responsibilities included research and the design system.
- The original studio had no engineering resources and no implementation budget.
- The team intentionally scoped the outcome as a responsible concept/prototype rather than a full production website.
- A plausible long-term path was to present the concept and evidence to an established institution such as NYC Tourism for native integration or further development.
- The later React and TypeScript component system and working individual booking flow were a separate solo portfolio rebuild.

### Research inputs

- Resident and stakeholder survey responses.
- Two local businesses within the 14-response sample.
- Conversations or input from tourism-industry professionals, including people familiar with the NYC tourism website and sustainability challenges.
- Local business owners and artisans seeking visibility, sustainable tourism-driven revenue, repeat relationships, and meaningful engagement beyond traditional social channels.
- Longtime residents, many college-aged within this limited sample.
- Platform audits, including a Nielsen-heuristic evaluation of Airbnb by Myles, Kaori Ogawa, and Amy Zhang.
- Secondary research.

### Findings and product implications

- Residents and stakeholders repeatedly raised overcrowding, over-tourism, lack of authentic experiences, and rising costs in heavily visited areas.
- Business owners described weak repeat-customer behavior among visitors and limited discovery outside established social platforms.
- Tourism professionals saw room to highlight more regenerative work already happening across the city.
- The resident perspective helped reveal that moving a pin to a less crowded neighborhood was not enough. Redirection needed local context, authenticity, planning support, and a meaningful next action.
- That redirected the story from the early Manhattan heatmap toward the `Learn, Plan, Go` framework.
- The strongest portfolio argument is the research redirect: evidence changed what the team treated as the product outcome.

### Power-user hypothesis

The notes describe highly engaged travelers, including digital nomads, ethical travelers, and visitors who actively contribute to or share with local communities. Treat this as a research-informed target hypothesis, not a validated market segment or measured adoption result.

## Navi claim and ownership guardrails

These are non-negotiable unless new primary evidence changes them:

- Say **14 resident and stakeholder responses, including two local businesses**.
- Do not say 14 resident responses or generalize the sample to all NYC residents.
- `10 of 14` responses, or `71%`, named overcrowding / over-tourism.
- `7 of 14` responses, or `50%`, named a lack of authentic experiences.
- Do not use the unsupported `78%` concept-preference metric.
- Use **the team** for the early Manhattan redirection concept and the six-platform audit.
- Use **I** for Myles’s survey collection and synthesis, research-informed archetypes, journey and opportunity work, flows, studio design-system contribution, and later solo React rebuild.
- Credit the Airbnb heuristic evaluation to Myles, Kaori Ogawa, and Amy Zhang.
- Keep the heatmap exploratory and reconstructed. It does not show live or measured tourist density.
- Keep archetypes and journeys framed as research-informed internal planning artifacts, not validated personas.
- The studio project did not ship a production website.
- The later React rebuild was not separately tested with residents, travelers, or local hosts.
- The current browser demo proves implemented interaction behavior, not adoption, community benefit, or business outcomes.
- Group booking remains future-facing and is not wired into the demo.
- Separate the original no-dev/no-budget studio constraint from the later solo implementation so the chronology stays truthful.

## Storytelling target

Use the internal storytelling reference to test the arc, but do not name external critique frameworks in candidate-facing copy.

The page should retain one sentence per chapter that a hiring manager can remember:

1. **Frame:** The first heatmap could redirect attention, but it could not change the quality of engagement after arrival.
2. **Research:** A limited resident-and-stakeholder sample exposed authenticity, access, and local-business concerns that the map alone did not answer.
3. **Define:** The research moved the concept from redirection to `Learn, Plan, Go`.
4. **Build:** Myles later translated that framework into a reusable React system and working individual booking flow.
5. **Validate:** The browser build proves current behavior, while community and host value still need direct testing.

Each chapter needs one dominant claim, one dominant proof, and no more than two supporting proofs. Interpretation and caveat should sit next to the artifact they qualify.

## Evidence and artifact review

Preserve these bespoke callsites:

- `LeadMedia`
- `HeatmapExplorer`
- `HeuristicInsightCards`
- `SurveyStatRings`
- `NaviResearchArtifacts`
- `CompositionStrip`
- `NaviDemoEmbed`

Do not replace them with a visually generic `ResearchBoard` or `DemoChrome` abstraction. Shared behavior may cover evidence semantics, captions, caveats, accessibility, loading, responsive ordering, and performance. Composition, typography, colors, diagrams, framing, motion, and proof scale remain project-owned.

For every artifact, record its job:

- what claim it supports;
- whether that claim is descriptive, behavioral, interpretive, outcome, or causal;
- evidence state: built, shipped, observed, proposed, or needs proof;
- what the viewer should notice;
- limitation or caveat;
- whether it is the chapter’s dominant proof.

Remove or demote anything that only demonstrates output volume or duplicates a stronger proof.

## Rendered QA matrix

Run the current case studies inside the final Reader shell, not as isolated components.

### Required viewports

- Desktop: 1440 × 900
- Mobile: 390 × 844
- Add one medium/tablet check when a composition changes behavior between those widths.

### Required routes and states

- `/work/navi`
- Navi chapter deep links
- `/work/navi/demo`
- `/work/navi/system`
- direct entry from a fresh tab
- entry from the home project card
- browser Back and Forward
- return-to-program transition
- reduced motion
- light and dark surrounding portfolio themes
- keyboard traversal and focus visibility
- mobile collapsed TOC / thumb-zone behavior
- image enlargement or other legibility path when screenshot UI is too small

### Human review gates

**90-second scan:** Can a hiring manager identify role, problem, strongest decision, proof, outcome, and caveat?

**10-minute read:** Does the page maintain causal coherence, ownership, specificity, honesty, proof sufficiency, pacing, and memorability?

Record failures as observable comprehension or rendering problems. Do not make additional aesthetic changes after the page passes unless a specific accessibility, evidence, performance, or comprehension failure appears.

## Visual-system cleanup boundary

This is cleanup, not a redesign.

Fix:

- token ownership leaks between dark site chrome, light Reader paper, and project-owned dark artifacts;
- insufficient contrast;
- inconsistent type hierarchy or spacing caused by shared selectors;
- accidental overflow or unreadable evidence at rendered size;
- interaction/focus states that diverge from the system contract;
- duplicate or contradictory responsive rules;
- generated screenshots and logs that should not ship.

Preserve:

- project-owned palettes;
- Navi typography and urban-wayfinding character;
- project-specific diagrams and research composition;
- TikTok’s art direction;
- Fresh Greens’ product and illustration language;
- FAFSA’s operational/editorial framing;
- the Myles 98 / Pocket 98 shell and entry-return model.

## Verification commands

Before editing:

```bash
git fetch --all --prune
git switch codex/myles-97-design
git status --short --branch
git stash list
git worktree list
git branch -vv
```

Install and verify the full branch:

```bash
npm ci
npm test
npm run lint
npx tsc --noEmit
npm run validate:content
npm run build
git diff --check
```

Focused Navi / Reader checks:

```bash
npm test -- \
  src/app/work/__tests__/reader-mode-contrast.test.ts \
  src/app/work/navi/__tests__/claim-accuracy.test.ts \
  src/app/work/navi/__tests__/prose-structure.test.ts \
  src/app/work/navi/__tests__/toc-chronology.test.ts \
  src/components/navi/__tests__/research-artifacts.test.tsx \
  src/components/__tests__/navi-artifact-layout.test.tsx
```

Download the known baseline render artifact while it remains available:

```bash
gh run download 31325344074 \
  --name reader-evidence-review-a5bc9f4ea2f97a33db9b4a308967c13ed8fe8b44 \
  --dir .artifacts/reader-evidence-a5bc9f4
```

The artifact is scheduled to expire on 2026-08-23.

## Remote branch inventory and cleanup recommendation

Do not delete divergent branches until their unique commits are reviewed. The branch names below reflect remote state on 2026-08-09.

| Branch | State relative to the target | Recommendation |
|---|---|---|
| `main` | Default branch | Keep |
| `codex/myles-97-design` | Active branch; product baseline green | Keep and continue |
| `archive/reader-evidence-grammar-pre-cleanup-2026-08-07` | Explicit archive | Keep until the evidence work is merged and verified |
| `ignore-this-call` | Exact same commit as `main` | Safe deletion candidate |
| `codex/reader-evidence-grammar` | Exact same commit as the archive branch | Safe deletion candidate once the archive is retained |
| `tmp-do-not-use` | Fully contained in `codex/myles-97-design`; 0 commits ahead and 53 behind at audit time | Safe deletion candidate |
| `codex/reader-evidence-grammar-cleanup` | Diverged; 1 commit ahead and 10 behind; unique `verify-reader-evidence.yml` workflow | Hold. Decide whether the workflow is superseded or should be cherry-picked |
| `tmp/m98-visual-capture-20260808` | Diverged; 10 commits ahead and 128 behind; includes evidence-map/capture work | Hold. Review unique commits before deletion |
| `codex/myles-98-visual-refinement` | Heavily diverged; 139 commits ahead and 10 behind relative to the target comparison | Hold. Treat as a separate work line until intentionally reconciled |

After reviewing the three safe candidates locally, cleanup would be:

```bash
git push origin --delete \
  ignore-this-call \
  codex/reader-evidence-grammar \
  tmp-do-not-use

git fetch origin --prune
```

Do not include the archive, visual-refinement, visual-capture, or evidence-cleanup branches in that command.

## Local unsaved-work limitation

This audit can verify GitHub branches, commits, Actions, and Vercel deployments. It cannot see untracked files, uncommitted edits, stashes, or extra worktrees on a separate local computer.

Before Codex changes anything, the local `git status`, `git stash list`, and `git worktree list` checks above are mandatory. If they show local work, preserve it in a named stash or temporary branch before switching or rebasing. Do not assume the remote inventory proves the Mac working tree is clean.

## Suggested implementation sequence

1. Reproduce and fix the Reader body-copy and Navi dark-board contrast leaks.
2. Expand the contrast regression contract and rerun rendered QA in both site themes.
3. Integrate the new Navi context into the existing five-chapter arc without inflating the page or weakening claim qualifiers.
4. Produce the explicit chapter evidence map and artifact-value inventory.
5. Run the 90-second and 10-minute hiring reviews.
6. Address only observed failures.
7. Run the full verification matrix and capture fresh evidence.
8. Reconcile or retire remote branches after unique-commit review.
9. Keep the final PR in draft until the rendered QA and hiring reviews pass.

## Definition of done

The closeout is complete when:

- Navi body text and dark artifact labels are clearly legible at desktop and mobile sizes in both surrounding themes;
- every Navi chapter has one dominant claim and sufficient proof;
- the new context and original constraints are represented without confusing studio work with the solo rebuild;
- all sample, ownership, prototype, and outcome qualifiers remain truthful;
- direct entry, deep links, Back, Forward, return, reduced motion, keyboard focus, and mobile TOC behavior pass;
- relevant product screenshots are legible or enlargable;
- the full test, lint, type, content, and build matrix is green;
- a fresh Reader evidence artifact has been inspected by a human;
- the 90-second and 10-minute reviews pass;
- safe stale branches are pruned and divergent branches have a recorded disposition;
- no generated critique captures or logs are accidentally committed;
- candidate-facing copy and artifact order are frozen unless a specific failure justifies another change.

## Paste-ready Codex kickoff

```text
Continue ashim238/myles-portfolio-migration on branch codex/myles-97-design.
Read docs/handovers/2026-08-09-codex-portfolio-closeout.md before editing.
Treat a5bc9f4 as the last green product-code baseline. First reproduce and fix the remaining Reader body-copy and Navi dark-research-board contrast leaks, extend the regression tests, and verify at 1440×900 and 390×844 in both surrounding themes. Then integrate the user-provided Navi context into the existing five-chapter resident-led arc while preserving all claim and ownership guardrails. Do not perform a wholesale redesign, do not flatten project identity, do not delete divergent branches, and do not claim the remote audit proves the local working tree is clean. Finish with full tests, lint, typecheck, content validation, build, rendered evidence, 90-second/10-minute reviews, and a branch-cleanup recommendation.
```

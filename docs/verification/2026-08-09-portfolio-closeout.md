# Portfolio closeout verification

Date: 2026-08-09

Branch: `codex/myles-97-design`

Starting branch head: `15e67a0`
Last green product-code reference: `a5bc9f4`

## Closeout result

This closeout keeps the Myles 98 workstation, Pocket 98, and each project-owned visual language intact. It does not merge a divergent branch wholesale. It manually adapts the verified contrast, rail, touch-target, performance, and narrative work that belongs on the active branch.

The locked positioning line is:

> Design, code, and everything in between.

## Product and visual fixes

| Area | Result | Evidence |
| --- | --- | --- |
| Shared Reader body copy | Reader paragraphs now own the Reader ink token instead of inheriting the surrounding theme. | Static contrast contract plus 16.13:1 rendered contrast in dark and light surroundings. |
| Navi research board | The board owns surface, card, ink, muted, line, border, and accent tokens. | Heading 18:1, muted copy 11.35:1, and borders 3.84:1 in desktop and Pocket captures for both themes. |
| Navi research rails | Desktop formulas and the Pocket rail share one coordinate system. | Geometry regression test plus 820px and 390px evidence captures. |
| Shared evidence summary | Removed the shared 3px side stripe while keeping the top rule and evidence spacing. | Composition and hardening contracts. |
| Fresh Greens hierarchy | Corrected the pulled-over reconstruction from `h4` to `h3`. | Focused semantic test. |
| Navi targets | Search input and pagination-dot buttons have real 44px targets. | Rendered bounds and component tests. |
| Above-fold images | Homepage and Navi demo preload one measured project image each. | Head-link inspection in the production browser pass. |
| Performance | Added fail-closed Reader route budgets and a CI report artifact. | Exact production-build measurements and four behavior tests. |
| Capture tooling | Evidence review now defaults to dark and light themes at 1440x900, 820x900, and 390x844. | 24 full-page captures and 48 proof captures. |

## Narrative map

| Project | Five-chapter center | Dominant proof | Boundary kept explicit |
| --- | --- | --- | --- |
| Fresh Greens | Personal hypothesis, six interviews, route-preview pivot, stress support, trust and validation. | Working React Native prototype and reconstructed safety flows. | Six interviews do not represent every Black driver. The prototype does not prove a route or encounter is safer. |
| Navi | Regenerative-tourism brief, survey and platform audit, Learn Plan Go, working system, validation. | 14-response survey, research artifacts, React system, and working individual booking flow. | Studio concept, later solo rebuild, and future institutional path remain separate. No adoption or community-benefit claim. |
| UnderstandingFAFSA | Founder autonomy, audit, modular rules, Mailchimp feasibility, editable kit and measurement limits. | Mailchimp-native kit and interactive composer explanation. | The founder-editable result leads. Rules and feasibility work are enabling decisions. No unsupported performance result. |
| TikTok | DSA brief, cultural research, shared slot map, modular exploration, shipped boundary. | Three static directions and the interactive system explanation. | One of three templates shipped in the launch library. No unsupported campaign-impact claim. |

### Navi source boundaries

- The workbook contains 14 responses.
- 10 of 14 selected overcrowding or over-tourism.
- 7 of 14 selected a lack of authentic experiences.
- Rising costs and local-business displacement appear in the survey concerns.
- Repeat visitor relationships and discovery-channel needs are labeled as other stakeholder input.
- Tourism-professional observations are separate from the 14-response survey.
- The workbook records 10 graduate students and 4 working professionals. It does not encode which two respondents were local businesses, so that detail remains sourced from the user handoff.

## Impeccable critique disposition

The pre-fix design critique scored 28/40 and the technical audit scored 16/20. The deterministic scan reported 178 findings before the final side-stripe fix. Most were deliberate project colors, device radii, and pill shapes. The font and broken-image warnings were test-fixture or inline-SVG false positives.

Closed in this branch:

- Navi board contrast and theme isolation.
- Reader body-copy contrast.
- Navi search and pagination targets.
- LCP preload competition.
- Shared Reader side stripe.
- Fresh Greens heading skip.
- Navi rail alignment.
- Live keyboard focus, mobile TOC, deep-link, history, and return-path evidence.

Deferred as design decisions rather than silently changed:

- Desktop Welcome overlap and how much work should be exposed before opening Projects.
- Moving full recruiter facts before dominant lead media across every case study.
- Removing one of the redundant mobile Reader exits.
- Extending Pocket through 1024px.
- Documenting every intentional project-color, device-radius, and pill exception in the design sidecar.

These deferred items should be handled as a small visual-shell phase. They should not be bundled into a Reader contrast or case-study narrative patch.

## Rendered evidence

Evidence root: `/tmp/portfolio-closeout-evidence-20260809`

- Manifest: `/tmp/portfolio-closeout-evidence-20260809/manifest.json`
- Browser interactions and computed contrast: `/tmp/portfolio-closeout-evidence-20260809/interactions.json`
- Route captures: 4 routes x 3 viewports x 2 themes = 24
- Dominant-proof captures: 48
- Horizontal overflow: 0
- Broken images: 0
- Console errors: 0
- Page errors: 0
- Theme mismatches: 0
- Proof-to-summary gap: 20px to 42px

Representative Navi board evidence:

- `/tmp/portfolio-closeout-evidence-20260809/navi-navi-research-artifacts-dark-desktop-artifact-1.png`
- `/tmp/portfolio-closeout-evidence-20260809/navi-navi-research-artifacts-light-desktop-artifact-1.png`
- `/tmp/portfolio-closeout-evidence-20260809/navi-navi-research-artifacts-dark-pocket-artifact-1.png`
- `/tmp/portfolio-closeout-evidence-20260809/navi-navi-research-artifacts-light-pocket-artifact-1.png`

## Hiring-manager reviews

### 90-second review

Verdict: pass with one intentional discovery cost.

- The opening communicates Myles's name, the exact design-and-code positioning, prior TikTok and UMG context, and four project identities.
- Fresh Greens immediately signals solo design and engineering plus a working 26-screen prototype.
- Navi quickly states the 14-response pivot and offers a working booking flow.
- UnderstandingFAFSA now leads with the founder-editable newsletter result.
- TikTok states the internship role, three-template contribution, and one-of-three shipped outcome.
- The workstation metaphor still asks a first-time reviewer to open Projects or use a desktop icon. That authored interaction is memorable, but it is a real cost for a reviewer who will not click.

### 10-minute review

Verdict: pass.

- Each project has a causal sequence from brief or hypothesis to evidence, decision, artifact, and limit.
- Team work, individual studio contribution, later solo rebuilds, and shipped outcomes are distinguishable.
- Dominant artifacts sit inside the chapter that makes the claim they support.
- Fresh Greens and Navi provide the strongest product reasoning and working behavior.
- UnderstandingFAFSA now has the correct result hierarchy rather than presenting rules as the product.
- TikTok is appropriately concise. It does not need blocking narrative work for this closeout.
- Limitations are specific enough to increase trust without overwhelming the project story.

No additional Grill Me answer is required to merge this closeout. A later TikTok interview would be optional if Myles wants to add downstream team use or selection rationale that can be supported by firsthand evidence.

## Verification ledger

| Gate | Result |
| --- | --- |
| Full Vitest suite | 166 files, 885 tests passed |
| ESLint | Passed |
| TypeScript | Passed with `npx tsc --noEmit` |
| Content validation | Passed for 4 project files |
| Whitespace | Passed with `git diff --check` |
| Production build | Passed on Next.js 16.2.10 with webpack |
| Reader performance | All 4 route budgets passed |
| Rendered matrix | 24 route and 48 proof captures passed |
| Browser behavior | 16 interaction and 16 contrast checks passed |

The project build script explicitly uses webpack because the Next.js 16.2.10 Turbopack compiler repeatedly stalled during local production compilation. The webpack path completed normally and is now the shared local and CI build path.

## Branch consolidation recommendation

Current remote evidence after the task's fetch:

| Ref | Commit | Recommendation |
| --- | --- | --- |
| `codex/myles-97-design` | `15e67a0` plus this verified working tree | Commit this closeout here, push, and use it as the integration branch. |
| `archive/reader-evidence-grammar-pre-cleanup-2026-08-07` | `08a9b71` | Keep until the active closeout is accepted and tagged. |
| `codex/reader-evidence-grammar` | `08a9b71` | Keep with the archive until acceptance. |
| `codex/reader-evidence-grammar-cleanup` | `8ddbf01` | Its tree is byte-identical to `08a9b71`. It is the only branch that becomes a deletion candidate after a fresh fetch, retained archive tag, and accepted active branch. |
| `tmp/m98-visual-capture-20260808` | `c4f2b85` | Keep until this broader rendered matrix is accepted and preserved outside `/tmp`. |
| `codex/myles-98-visual-refinement` | `8d4dd55` | Keep. It contains unresolved Pocket breakpoint, optical, and content choices. Do not merge it wholesale. |
| `codex/myles-97-implementation` | `22e78ff` | Keep. It has its own worktree and stash context. |

Do not delete a branch or stash in this closeout. After the active branch is committed and pushed, refresh all remote refs, create a retained archive tag, preserve the rendered evidence, and then delete only the byte-identical cleanup branch if the comparison still holds.

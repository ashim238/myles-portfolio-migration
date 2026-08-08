# Reader evidence-map baseline

**Audited:** 2026-08-07
**Branch:** `codex/reader-evidence-grammar`
**Source of truth:** `src/lib/project-evidence/`

## Result

All 20 published case-study chapters now have a typed evidence record containing:

- one dominant claim,
- a claim class,
- an evidence state,
- one dominant proof,
- no more than two supporting proofs,
- an interpretation,
- a caveat or proof boundary,
- a concrete reopen trigger when the claim still needs proof.

No current dominant claim is classified as causal. The two final validation chapters that depend on future research use `needs-proof` and name the event that would reopen the claim.

## Evidence-state language

| State | Meaning |
|---|---|
| `built` | The artifact or product behavior exists and can be inspected. |
| `shipped` | The deliverable entered a real production or launch context. |
| `observed` | The case study records a bounded research finding or measured result. |
| `proposed` | The rule or safeguard is intended but is not fully implemented. |
| `needs-proof` | The current product exists, but the outcome claim is deferred until named research occurs. |

## Navi

| Chapter | Claim class / state | Dominant proof | Proof boundary | Composition status |
|---|---|---|---|---|
| `nv-intro` | Interpretive / observed | `HeatmapExplorer` | Exploratory reconstruction, not live density or visitor-behavior evidence | Adjacent |
| `nv-insights` | Interpretive / observed | `SurveyStatRings` | Fourteen responses, including two local businesses, do not represent all NYC residents | Adjacent, but the supporting heuristic audit currently renders before the dominant survey proof |
| `nv-framework` | Interpretive / built | `NaviResearchArtifacts` | Internal planning artifacts, not validated personas or journeys | Adjacent |
| `nv-build` | Behavioral / built | `NaviDemoEmbed` | Working browser behavior does not establish usability, demand, or marketplace viability | Adjacent |
| `nv-outcome` | Outcome / needs proof | Validation ledger | Authored implementation scope is not user-outcome evidence | Adjacent |

**Immediate Navi composition action:** make the survey the unmistakable first and dominant proof in the Research chapter, with the platform audit retained as supporting evidence.

## Fresh Greens

| Chapter | Claim class / state | Dominant proof | Proof boundary | Composition status |
|---|---|---|---|---|
| `fg-problem` | Interpretive / observed | First-person origin narrative | One experience and historical lineage do not establish population prevalence or equivalence | Adjacent |
| `fg-research` | Interpretive / observed | Plan, Respond, Trust synthesis | Six qualitative interviews do not represent every Black driver | Adjacent |
| `fg-design` | Behavioral / built | `PivotJourney` | An explainable route preference does not prove a safer route | Adjacent |
| `fg-pulled-over` | Behavioral / built | `PulledOverJourney` | Prototype behavior does not prove a better police encounter or roadside outcome | Adjacent |
| `fg-trust` | Interpretive / proposed | Moderation sequence | One report can currently affect one scored zone; provenance and trust levels are not built | Adjacent |
| `fg-scope` | Outcome / needs proof | Built-now / what-remains ledger | Implementation scope is not safety or efficacy evidence | Adjacent |

The Trust chapter correctly contains both a current contribution-and-review surface and a proposed corroboration model. The evidence map keeps the dominant claim in `proposed` rather than allowing the built moderation flow to imply that the full trust model exists.

## UnderstandingFAFSA

| Chapter | Claim class / state | Dominant proof | Proof boundary | Composition status |
|---|---|---|---|---|
| `uf-context` | Descriptive / observed | `BeforeAfterPhones` | Expert visual audit, not controlled comprehension research | Adjacent |
| `uf-audit` | Interpretive / observed | Audit finding-to-rule list | Benchmark analysis does not replace direct audience or founder research | Adjacent |
| `uf-locked` | Behavioral / built | `NewsletterComposerDemo` | No measured time-savings claim; counselor toolkit remains in progress | Adjacent |
| `uf-figma` | Behavioral / shipped | `FigmaMailchimpPair` | Comparison cannot establish every-client deliverability | Adjacent |
| `uf-results` | Outcome / observed | Observed 52.6% open-rate context | Not a controlled attribution test | Adjacent |

**Artifact-value finding:** `ColorPalette` is present in the page but is not required by any mapped claim. It is the first candidate for demotion or removal unless the composition review identifies a unique decision that it proves better than the locked-versus-swappable view.

## TikTok

| Chapter | Claim class / state | Dominant proof | Proof boundary | Composition status |
|---|---|---|---|---|
| `tt-brief` | Descriptive / built | Brief-facts definition list | Static layered files, not downstream production ownership or performance | Adjacent |
| `tt-research` | Interpretive / observed | Three-direction comparison | Design judgment and internal review, not audience preference | **Cross-chapter**: the proof appears in `tt-system` |
| `tt-system` | Behavioral / built | `TikTokTemplateSystem` | Visual-system behavior does not establish ad effectiveness | Adjacent |
| `tt-outcome` | Outcome / shipped | Critique → response → shipped-result sequence | American Eagle relationship was indirect; no performance evidence | Adjacent |

**Immediate TikTok composition action:** test a compact three-direction preview in the Choose chapter, or revise the chapter boundary so the selection rationale and visual comparison are read together.

## Orientation surfaces

`LeadMedia` and `RecruiterCut` are intentionally not counted as chapter proof by default. They establish first impression, role, scope, and project orientation. A hero image should only become evidence when the page explicitly states what the reader should inspect and what the image cannot prove.

## First artifact-value decisions

1. Preserve Navi's research board and working demo as materially different proof types.
2. Preserve Fresh Greens' route and stress-state sequences as dominant behavioral proof.
3. Review the FAFSA palette inventory against the artifact-value filter before keeping it in the primary path.
4. Keep TikTok's project-owned visual sequencing and solve the proof-adjacency gap without introducing a generic portfolio card pattern.
5. Do not add a universal visual wrapper around every proof. Shared behavior should remain semantic, accessible, responsive, and measurable while project composition stays authored.

## Next implementation steps

1. Correct Navi's Research hierarchy around its dominant survey proof.
2. Add semantic evidence contracts around the image, analytical, and interactive proof callsites.
3. Add rendered legibility and measurable performance budgets.
4. Complete project composition reviews in the order Navi, Fresh Greens, UnderstandingFAFSA, TikTok.
5. Run the internal 90-second and 10-minute hiring reviews, then prepare the protocol for outside readers.

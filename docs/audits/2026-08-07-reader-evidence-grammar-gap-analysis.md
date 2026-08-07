# Reader evidence grammar gap analysis

**Audited:** 2026-08-07
**Branch:** `codex/myles-97-design`
**Product language:** Myles 98 / Pocket 98
**Method:** Han-style plan gap analysis plus a lateral-design challenge of the proposed abstraction boundary

## Verdict

The tentative case-study revival plan was **partially executed, not completed as a distinct phase**.

The July 29 case-study refinement already improved the four published stories substantially. It established clearer chapter arcs, tightened ownership and claim boundaries, removed or demoted weak evidence, preserved project identity, and added extensive accessibility and responsive contracts. The later Myles 98 work added Reader Mode, entry and return transitions, and a new portfolio shell around those pages.

What does **not** yet exist is the explicit Reader evidence grammar described in the tentative plan: no chapter-by-chapter evidence map, no typed claim-strength model, no formal cross-project artifact-value inventory, no quantitative performance budget, and no current 90-second / 10-minute hiring-manager review of the pages inside the final Myles 98 Reader experience.

The correct follow-on is therefore not a wholesale rewrite. It is a focused argument-quality and composition phase built on top of the existing case studies.

## Coverage of the tentative plan

| Item | Status | Current evidence | Remaining work |
|---|---|---|---|
| 1. Chapter evidence maps | **Partial** | Page-specific claim, ownership, prose-order, and truthfulness tests exist. | Create an explicit map for every chapter: claim, claim class, supporting artifact, interpretation, evidence state, caveat/outcome, and dominant-proof status. |
| 2. Three materially different proof callsites | **Implemented in bespoke form** | `LeadMedia`, `NaviResearchArtifacts`, and `NaviDemoEmbed` cover image, structured information, and interaction. | Prove any shared grammar against these exact callsites without flattening their identities. |
| 3. Whole-chapter composition review | **Previously performed; current rerun required** | The July UI audit reviewed hierarchy, artifacts, pacing, breakpoints, and project identity. | Repeat against the final Myles 98 Reader shell. Explicitly score claim-artifact adjacency, dominant proof, interpretation distance, and chapter endings. |
| 4. Artifact-value filter | **Partial** | Fresh Greens and TikTok have explicit pruning/priority tests; Navi and FAFSA have focused narrative contracts. | Inventory every current artifact and mark its job. Remove or demote anything that only records output volume or duplicates another proof. |
| 5. Protect project identity | **Implemented** | Current pages retain project-owned color, typography, diagrams, imagery, and interaction models. | Add a regression review so new shared primitives cannot introduce reskinned-template sameness. |
| 6. Responsive transformation rules | **Mostly implemented** | Existing tests cover stacked research artifacts, hidden or changed connectors, keyboard-scrollable diagrams, static fallbacks, touch targets, and Pocket/Reader boundaries. | Consolidate these into a primitive-level contract and add rendered checks for evidence legibility, not only overflow. |
| 7. Media-quality verification | **Mostly implemented technically** | Source assets, dimensions, optimized delivery, alt text, lightbox behavior, and several crop rules are tested. | Add a human rendered-size legibility check, caption-visible-content check, and product-color fidelity check on the current build. |
| 8. Performance budgets | **Partial** | Lead media reserves dimensions, non-lead media is generally deferred, videos and TikTok layers have loading controls, and the Navi iframe is conditional with a fallback. | Define measurable route budgets for LCP, CLS, transferred media, eager requests, and iframe/demo activation. |
| 9. Entry and return gates | **Mostly implemented** | Direct URLs, Reader header, browser Back, return-to-program transitions, reduced motion, and fallback cleanup have focused tests. | Add Forward navigation, chapter deep-link return, and explicit Reader-theme isolation to the final rendered matrix. |
| 10. Follow-on migration phase | **Missing as a current execution phase** | Earlier page-specific refinements exist, but no post-Myles-98 evidence-grammar migration is tracked. | Execute in the proposed order: Navi, Fresh Greens, FAFSA, TikTok. |
| 11. Hiring-manager review | **Missing in the requested form** | Prior copy/UI audits were comprehensive but not framed as a timed hiring scan. | Run a 90-second scan and a 10-minute read for each current page, recording comprehension failures and confidence gaps. |

## What is already strong

### The image proof callsite exists

`LeadMedia` provides a stable figure boundary, responsive optimized media, reserved dimensions, an optional video path, and the route-transition target. It is the right image-led callsite for proving shared evidence semantics.

### The analytical proof callsite exists

`NaviResearchArtifacts` already connects research provenance to archetypes, journey stages, product needs, and booking decisions. It is more valuable than a generic decorative research board because it keeps the actual reasoning visible in text and semantic lists.

### The interaction proof callsite exists

`NaviDemoEmbed` already covers conditional activation, a loading state, lazy iframe delivery, a static image fallback, accessible frame exposure, and a protected full-demo link. It is the correct interaction callsite.

### Claim discipline is already unusually strong

Existing tests and audits guard small-sample qualifiers, team-versus-individual ownership, prototype-versus-outcome boundaries, causal overclaiming, future work, and unsupported adoption or safety claims. The new phase should preserve those contracts rather than replace them.

## Critique of the proposed abstraction

The plan is directionally right, but a large universal component kit would be the wrong interpretation.

A generic `ResearchBoard` or `DemoChrome` risks making four authored projects feel like content inserted into one portfolio template. The better abstraction boundary is **semantic, not visual**:

Shared semantics should include:

- evidence captions and notes,
- interpretation and caveat roles,
- comparison and sequence accessibility,
- responsive ordering rules,
- media loading and fallback behavior,
- focus and keyboard-scroll behavior,
- measurable performance gates.

Project-owned composition should continue to include:

- the visual shape of research boards,
- diagram language,
- product typography,
- accent systems,
- screenshot framing,
- motion and interaction models,
- the relative scale of each proof.

The goal is family resemblance in reading behavior, not component uniformity.

## Additional rules worth instituting

### 1. Classify the claim before judging the artifact

Every chapter claim should be typed as one of:

- **Descriptive:** what existed or was made.
- **Behavioral:** what the prototype demonstrably does.
- **Interpretive:** what the research or artifact suggests and why it shaped a decision.
- **Outcome:** what changed after release or delivery.
- **Causal:** what the work itself caused.

An interface screenshot can prove existence or behavior. It cannot independently prove adoption, outcome, or causality. The map should make that mismatch impossible to hide.

### 2. Require one dominant claim as well as one dominant artifact

A visually dominant figure is not enough if a chapter makes several equally important arguments. Each chapter should have one sentence that a hiring manager can retain, one dominant proof for it, and at most two supporting proofs.

### 3. Add an evidence-state field

Use the existing portfolio language consistently:

- built,
- shipped,
- observed,
- proposed,
- needs proof.

The state belongs beside the claim, not only in project cards.

### 4. Audit the portfolio as a set

Ask what each case study proves that the others do not:

- **Fresh Greens:** research-to-product reasoning plus solo design and engineering.
- **Navi:** research synthesis, system thinking, and a working browser product.
- **UnderstandingFAFSA:** operational constraints, modular content systems, and a qualified observed result.
- **TikTok:** visual-system judgment, art direction, and a shipped creative artifact.

Artifacts that repeat another project’s strongest signal should face a higher bar.

### 5. Define rendered evidence legibility

At a normal 390px viewport, a product screenshot must either make its relevant UI legible or provide a clear enlargement path. Tiny interface text cannot count as evidence merely because the source image is high resolution.

### 6. Freeze after argument review

After a project passes its evidence map, composition review, hiring scan, and regression gates, candidate-facing copy and artifact order should enter change control. Further edits should require a specific comprehension, evidence, accessibility, or performance failure. This prevents endless aesthetic churn.

## Recommended execution order

### Phase 0: Finish the Myles 98 release gate

Get the current branch fully green and remove generated critique screenshots/logs that should not ship in the repository. The evidence phase should begin from a stable Reader implementation.

### Phase 1: Establish the grammar without mass migration

1. Add the typed evidence-map schema and project maps.
2. Add shared semantic caption/note roles only where current markup lacks them.
3. Prove the grammar against:
   - `LeadMedia`,
   - `NaviResearchArtifacts`,
   - `NaviDemoEmbed`.
4. Add responsive, accessibility, media-quality, and performance contracts around those callsites.

### Phase 2: Project migrations

1. **Navi** — structured research plus interactive demo makes it the strongest stress test.
2. **Fresh Greens** — widest evidence variety and the highest argument-quality stakes.
3. **UnderstandingFAFSA** — comparison, long captures, workflow constraints, and outcome caveats.
4. **TikTok** — preserve the most project-specific visual sequencing and avoid over-componentizing it.

### Phase 3: Human review

For each project:

- **90 seconds:** identify role, problem, strongest decision, proof, outcome, and caveat.
- **10 minutes:** assess causal coherence, ownership, specificity, honesty, proof sufficiency, pacing, and memorability.

Record misses as observable failures, then make only the changes needed to resolve them.

## Release criteria for the evidence phase

A project passes when:

- every chapter has a mapped claim and evidence state,
- every claim has a sufficient artifact or an explicit limitation,
- every chapter has one dominant claim and proof,
- interpretation and caveat stay adjacent to the artifact,
- no artifact exists only to show output volume,
- mobile evidence remains legible or enlargable,
- project identity remains unmistakable,
- route performance stays within the agreed budget,
- direct entry, deep links, Back, Forward, return-to-program, and reduced motion work,
- the 90-second and 10-minute reviews both pass.

## Conclusion

The portfolio does not need another wholesale case-study rewrite. It needs the argument-quality phase that the tentative plan correctly anticipated. The existing pages are a strong base; the next work should make their proof structure explicit, measurable, and resistant to regression.
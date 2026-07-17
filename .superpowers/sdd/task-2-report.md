# Task 2 RED/GREEN Report

## Scope

Integrated the Task 1 `NaviResearchArtifacts` component into the Navi case study and revised the surrounding narrative so research evidence, internal planning artifacts, current rebuild scope, and future work stay distinct.

Commit: `9a85b55` (`fix: connect Navi research to product decisions`)

Committed files:

- `src/app/work/navi/page.tsx`
- `src/app/work/navi/__tests__/claim-accuracy.test.ts`
- `src/app/work/navi/__tests__/prose-structure.test.ts`
- `src/app/work/__tests__/case-study-tocs.test.ts`

All other dirty work remained unstaged and uncommitted.

## RED 1: Evidence and heading contracts

Tests changed before production code:

- Added positive contracts for `research-informed archetypes` and `internal planning artifacts`.
- Added future-scope contracts for group booking and the current rebuild.
- Added negative contracts for `three personas` and `Those flows are present in the rebuild`.
- Changed both chronology contracts so the fifth heading is `Mapping the experience before the build`.

Command:

```bash
npm test -- src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/__tests__/case-study-tocs.test.ts
```

Observed result:

- 3 test files failed.
- 3 tests failed and 13 tests passed.
- The failures were the intended missing heading and evidence-safe narrative claims.
- The first missing positive claim reported was `research-informed archetypes`.

## GREEN attempt 1

Minimal page changes:

- Imported and rendered `NaviResearchArtifacts` after the process copy.
- Updated the fifth TOC title and H2.
- Replaced persona language with three research-informed archetypes grounded in survey findings, platform audits, and secondary research.
- Labeled journey maps and user flows as internal planning artifacts.
- Connected neighborhood exploration to nearby resident activity and avoiding repeated concentration in tourist-heavy areas.
- Connected booking transparency to the Airbnb audit and secondary research about cost, requirements, timing, and trust in lesser-known vendors.
- Preserved the Learn, Plan, Go definitions.
- Reframed deeper neighborhood pages, host onboarding, and group booking as future work.

Observed result:

- 1 test file passed.
- 2 tests failed and 14 tests passed.
- One failure came from a source-sensitive regular expression split across JSX lines.
- One failure came from an older structure assertion that still required the paragraph Task 2 explicitly replaces.

## RED 2: Replacement future-work contract

The older future-work assertion was replaced with contracts for:

- Deeper neighborhood pages in Learn.
- Onboarding for local hosts and businesses.
- Group booking as a future opportunity.
- Group booking not being wired into the current rebuild.

The old paragraph was restored temporarily before running the tests.

Observed result:

- 1 test file passed.
- 2 tests failed and 14 tests passed.
- Failures were the intended missing future-work language.

## GREEN final

The revised final paragraph was restored, with the strict claim phrase kept contiguous in source.

Fresh verification command:

```bash
npm test -- src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/__tests__/case-study-tocs.test.ts
```

Final result:

- 3 test files passed.
- 16 tests passed and 0 failed.
- Exit code 0.

## Anti-AI prose review

### Assessment A: Editorial read-through

The read-through was completed before the mechanical scan.

- Sentence shape: 4 of 4. No new antithesis or parallel-if scaffolds.
- Rhythm: 4 of 4. Sentence lengths vary and no empty signposts were added.
- Structure: 4 of 4. The eight headings identify distinct process stages and the TOC matches them.
- Content: 4 of 4. New claims name their evidence and distinguish planning artifacts from implemented scope.
- Vocabulary: 4 of 4. No flagged AI vocabulary was added.
- Voice match: 4 of 4. The prose is direct, specific, and follows Myles's punctuation rules.
- Total: 24 of 24.

Density review:

- Antithesis: 0.
- Aphoristic closers: 0.
- Empty signposts: 0.
- Flagged vocabulary: 0.
- Genuine three-part lists: 2. Both carry required research or booking information.

### Assessment B: Mechanical scan

The exact requested scan matched only TypeScript statement terminators and the `&apos;` source entity. None are rendered prose punctuation.

A source-aware rerun that removed the raw semicolon branch returned no matches and exit code 1, which is the expected clean `rg` result.

## Self-review

- The fifth TOC entry and fifth H2 match exactly.
- The chronology still contains eight stages.
- The research-artifact component appears after the process copy.
- The three required evidence sources are named.
- Journey maps and user flows are labeled as internal planning artifacts.
- Neighborhood exploration and booking transparency are tied to the specified evidence.
- Learn, Plan, Go definitions are unchanged.
- Deeper neighborhood pages and local-host onboarding remain validation work.
- Group booking is a future opportunity and is not represented as wired into the rebuild.
- `git diff --cached --check` passed before commit.
- The staged file list contained only the four Task 2 files.

## Concerns

The exact mechanical scan cannot return zero raw matches on a TypeScript file because its semicolon branch also matches statement terminators and HTML entities. The source-aware scan confirms there are no prohibited rendered-prose matches.

---

## Review correction: independent Navi TOC contract

The original GREEN report overstated the evidence from the three-file command. Commit `9a85b55` changed `case-study-tocs.test.ts` to require later TikTok and UnderstandingFAFSA chronologies, but those page changes were not part of the commit. The command passed against the existing dirty worktree because its uncommitted TikTok and UnderstandingFAFSA pages already matched those expectations. It was not proof that `9a85b55` was green from parent `9f4a571`.

The cross-case test remains unchanged because its current TikTok, Navi, and UnderstandingFAFSA coverage is intentional. Making the full snapshot green would require committing unrelated page work or weakening those expectations. Both options would broaden this fix and risk absorbing existing user changes.

The correction adds `src/app/work/navi/__tests__/toc-chronology.test.ts`. This focused regression test checks Task 2 directly:

- The Navi `ProjectToc` contains the exact eight-stage chronology.
- The fifth entry is `Mapping the experience before the build`.
- All eight rendered `h2` headings match the TOC in order.

No production files or preexisting dirty files were edited for this correction.

### Verification

Focused command:

```bash
npm test -- src/app/work/navi/__tests__/toc-chronology.test.ts
```

Result:

- 1 test file passed.
- 1 test passed and 0 failed.
- Exit code 0.

Covering command:

```bash
npm test -- src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/toc-chronology.test.ts src/app/work/__tests__/case-study-tocs.test.ts
```

Result:

- 4 test files passed.
- 17 tests passed and 0 failed.
- Exit code 0.

### Remaining concern

The full cross-case test in the `9a85b55` snapshot is still not independently green without the unrelated TikTok and UnderstandingFAFSA work. This correction does not claim otherwise. It supplies a Navi-only contract whose pass depends only on the committed Navi Task 2 page behavior.

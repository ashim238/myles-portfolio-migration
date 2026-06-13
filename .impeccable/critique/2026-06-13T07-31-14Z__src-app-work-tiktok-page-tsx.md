---
target: src/app/work/tiktok/page.tsx
total_score: 37
p0_count: 1
p1_count: 1
timestamp: 2026-06-13T07-31-14Z
slug: src-app-work-tiktok-page-tsx
---
# Critique Re-roll — `src/app/work/tiktok/page.tsx`

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Copy-feedback live region + hover/copied states clean |
| 2 | Match System / Real World | 4 | Labels match how the work was actually done |
| 3 | User Control and Freedom | 4 | TOC + breadcrumb + work-jump present |
| 4 | Consistency and Standards | 3 | Tracked-uppercase eyebrow + meta dt + numbered TOC contradict the anti-eyebrow stance |
| 5 | Error Prevention | 4 | N/A |
| 6 | Recognition Rather Than Recall | 4 | Strong labels, palette + hex inline |
| 7 | Flexibility and Efficiency | 3 | Mobile TOC eats space on every scroll |
| 8 | Aesthetic and Minimalist Design | 3 | Hero chrome stacks three SaaS-template tropes |
| 9 | Error Recovery | 4 | N/A |
| 10 | Help and Documentation | 4 | Console hello, alt text, figcaptions genuine |
| **Total** | | **37/40** | **Excellent — minor polish only; ship it** |

Trend: 31 → 37 (+6).

## Anti-Patterns Verdict

The case study body reads as a human-written piece. Remaining tells are in shared portfolio chrome — hero eyebrow, Role/Stack/Timeline meta strip, numbered TOC — not in TikTok-specific surfaces.

Deterministic scan: 0 findings.

## What's Still Weak

**[P0] Hero eyebrow + meta strip tracked-uppercase.** `INTERNSHIP · 2021`, `ROLE`, `STACK`, `TIMELINE` uppercase with ~0.12em tracking. Portfolio-wide shared patterns; addressing them is a design-system decision, not a feature edit.

**[P1] Numbered TOC accordion (01. 02. 03.).** Same caveat — `ProjectToc` is shared across all case studies.

**[P2] Quote glyph collides with floating nav widget at certain scroll positions.** Cosmetic.

## What Improved

1. OutcomeCard rebuild — editorial two-up is now one of the strongest blocks on the page.
2. Aesthetic card meta labels softened correctly — sentence-case body weight.
3. Hi-fi templates carry weight — feels like real deliverables.
4. Pullquote + feedback blockquote clean without side-tab borders.

## Persona Red Flags

**Jordan (recruiter):** No red flag. AE outcome line is quotable.

**Casey (mobile):** Body type generous; numbered TOC ~80px overhead per section is minor friction.

**Hiring Manager (5-min):** Lands on the outcome + lineage timeline; the chrome tropes are why this is 37 not 39.

## Minor Observations

- Console hello hits the right register.
- Click-to-copy with inline "Copied" swap is correct pattern.
- Lineage timeline reads correctly relative to current date.

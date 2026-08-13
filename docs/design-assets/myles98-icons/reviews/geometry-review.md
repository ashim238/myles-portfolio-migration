# Myles 98 Icon Geometry Review

**Verdict:** INTERNAL INFORMED REVIEW PASS. CLEAN-CONTEXT RECOGNITION IS
PENDING.

**Review date:** 2026-08-12

## Candidate lock

- **Master snapshot:** `e9f724d586c9` before this documentation-only Task 5
  commit.
- **Aggregate:** `1177575d1c60ccc75c74c7d700e5424790a8ba7618515a0315df0fa19a34005e`.
  This is SHA-256 over every sorted relative master path, a NUL byte, its
  exact UTF-8 SVG source, and a trailing NUL byte.
- **Manifest:** `d58b7100f8209080eb62968306af505477726e48b6a9614f1f8fab55d9793697`.
- **Canonical sheet:** `bb04413d3dfb6eb47f1e257c5d3eb8442eb4534d60238bdf3ff4355243c29ba7`.
- **Labeled render:** `/private/tmp/myles98-contact-labeled-task5-v9.png`,
  `b9fb9af01b6994cb8e05e302d75657a73e96e30ef959ed90b0b32acea47c0f92`.
- **Mechanical full blind render:**
  `/private/tmp/myles98-contact-blind-task5-v9.png`,
  `4fdeb6f6bc0b08ee5e0295fb8d2de9a588f9c58c1e2934ecda0b3dfd9337b647`.

The hash lock is invalidated by any master source change. The Task 5 manifest
wording aligns the email and portrait descriptions with their approved pixels;
it does not alter master geometry.

## Mechanical result

- `npm run icons:verify`: 48 of 48 masters passed.
- Source and public mirrors: 48 of 48 byte-identical.
- Raster audit: binary alpha only, with no opaque canvas-perimeter pixel in
  all 48 masters.
- Contact-sheet build and its 2 browser checks passed.
- The focused icon contract, topology, concept, and contact-sheet suites:
  216 tests passed across 15 files.

## Informed geometry result

The current labeled sheet was inspected at native size and nearest-neighbor
enlargement on teal, system gray, and white. Severity counts are **P0 0, P1
0, P2 0, P3 0**.

- Every master has integer-aligned hard edges, a one-pixel transparent
  perimeter, and no clipped contour or partial-alpha fringe.
- The portrait retains a horizontally continuous moustache while the chin hair
  remains a separate lower feature.
- E-mail’s 16px side folds now have equal geometry; the larger tiers are a
  stamp-free sealed envelope with symmetric side folds.
- UnderstandingFAFSA keeps a physical crease, lower paper leaf, and shadowed
  edge without becoming browser chrome.
- Fresh Greens’ 16px destination is a light asymmetric endpoint that leaves
  the route visible. Loose Parts remains a compact 2+1 block stack with no
  trapped alpha. Reset is an open C-loop with a single directional wedge.

## Topology exceptions

| Master | Allowed construction |
| --- | --- |
| Resume 24px | Compact paperclip opening at `(19,3)` and `(19,4)` |
| Resume 32px | Compact paperclip opening at `(26,4)` and `(27,4..8)` |
| Navi 24px and 32px | Exactly two opaque components: detached pin and storefront |

All remaining masters are one opaque component with no enclosed transparent
pixel.

## Remaining gate

This review cannot act as a clean-context recognition evaluation because the
reviewer saw names and source. Use the three source-free v8 batches listed in
the family-consistency review with two reviewers who have not seen the source,
manifest, labels, or earlier conclusions.

## Latest mechanical geometry addendum

The four v10 target masters have since been redrawn and the contact sheet has
been rebuilt. This is a mechanical addendum, not an informed or blind
recognition PASS.

- Current aggregate: `750a02964c6d937f8252e3dacc067700c800157e273a0dfdaa50d38e8edb3226`.
- Current manifest: `aa70f4a8577107fd81bcc4cbd0c804ec48a959b8d5c8a3157469bb852aa0ca61`.
- Current sheet: `fd650aabefe43abdbb1b4b577b5d9a326a9a99e0f179ab68ce81e37489524178`.
- All 48 current masters pass source validation with integer hard-edged
  geometry, binary alpha, and transparent perimeters. Master/public mirrors
  remain byte-identical.
- The current source-free outcome is mixed and lives in the family-consistency
  review. It remains the controlling semantic gate.

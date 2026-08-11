# Loose Parts three-cube pyramid review

**Review status: PASS**

This review covers only the independently authored `loose-parts` masters at 16, 24, and 32 units. It is an informed geometry, period-fidelity, and sibling-collision review, not a blind-recognition result.

## Metaphor contract

The three masters now depict one brand-neutral construction at every tier: two square cubes on the bottom with one square cube centered above them. The compact pyramid replaces both the prior detached wooden pieces and the rejected studded-block and block-arch drafts.

- Accepted readings: construction blocks, toy cubes, three-block stack, pyramid of blocks.
- Rejected readings: LEGO or another commercial building system, table, gate, pi symbol, food, loose wood scraps, letters, tools, scattered pieces, or flat interface tiles.
- Stable count: three cubes at 16, 24, and 32 units.
- Stable pose: teal lower-left cube, violet lower-right cube, magenta upper cube.
- Stable topology: the upper cube touches both lower cubes, and the lower cubes touch each other, producing one connected cluster without loose components.

## Native-size construction

### 16 units

The smallest master uses three equal seven-unit square silhouettes. Each cube keeps a square colored face, one-pixel upper highlight, one-pixel dark right plane, and one-pixel lower plane. The compact pyramid contains no studs, gaps, accessories, or fourth shape.

### 24 units

The middle master uses three equal ten-unit square silhouettes. Eight-unit square faces stay visually dominant while two-unit orthogonal highlight, right, and lower planes add depth. The composition grows through independently authored geometry without changing count, pose, or color ownership.

### 32 units

The largest master uses three equal thirteen-unit square silhouettes. Eleven-unit square faces remain dominant while three-unit orthogonal upper, right, and lower tonal planes add native-grid depth. No extra detail changes the three-cube noun.

## Period and brand-fidelity check

- Integer-aligned filled rectangles only.
- `shape-rendering="crispEdges"` at every tier.
- Binary transparency with one transparent perimeter pixel.
- Upper-left lighting expressed through pale upper planes and darker right and lower planes.
- Restrained indexed-style palette with near-black contours and teal, violet, and magenta faces.
- No strokes, transforms, opacity, gradients, filters, masks, rounded geometry, or antialiasing effects.
- No studs, red-yellow-blue primary palette, proprietary proportions, logos, or other commercial construction-toy cues.
- No open arch, separated supports, or lintel, which removes the prior table, gate, and pi-symbol reading.

## Topology and fill integrity

The native raster audit reports one opaque connected component at all three tiers. The focused fill-integrity suite reports binary alpha, a transparent perimeter, and zero unapproved enclosed transparent pixels for 16, 24, and 32 units.

## Sibling-collision review

The personal-family comparison places the three-cube pyramid beside About Myles, Resume, Reminders, and the personal note at all three native tiers. Its compact three-square silhouette, saturated cube faces, and stacked topology do not reuse the badge, paper, bound-pad, or folded-note anatomy. The stable block count and pyramid pose also remove the former food, key, lever, scrap-wood, table, gate, and pi-symbol collisions.

## Rendered evidence

- Canonical three-surface family sheet: `docs/design-assets/myles98-icons/contact-sheet.html`
- Exact reviewed contact-sheet SHA-256: `177db7abce08f9229ba87b4e9e2819bc15c9ad64baa6facdee8fdba028e92d7a`

The canonical artifact embeds the verified 16, 24, and 32 masters byte-for-byte, then renders each at its native grid and at 6× with nearest-neighbor sampling on teal `#008080`, system gray `#C0C0C0`, and white. Browser verification confirms the magnified raster uses uniform 6×6 pixel blocks.

## Verification

- `npm run icons:verify -- --group personal`: 15 personal masters verified.
- `npm exec vitest -- run scripts/__tests__/myles98-icon-fill-integrity.test.ts -t 'loose-parts'`: 3 passed, 47 skipped.
- `xmllint --noout` on all three Loose Parts masters: passed.
- Custom native-alpha audit: binary alpha and exactly one opaque connected component at all three tiers.
- `git diff --check -- docs/design-assets/myles98-icons/masters/loose-parts docs/design-assets/myles98-icons/reviews/loose-parts-blocks-review.md`: passed.

## Integration boundary

The parent integration now locks the three-cube-pyramid noun in the manifest and semantic contract, tests the accepted and rejected readings, and regenerates the canonical contact sheet from all 48 verified masters. Production `Myles97Icon` integration remains a separate step after final design-master approval.

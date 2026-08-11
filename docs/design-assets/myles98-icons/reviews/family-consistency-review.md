# Myles 98 icon family consistency review

**Final verdict: PASS**

**Severity summary:** P0: 0 | P1: 0 | P2: 0 | P3: 2 non-blocking observations

## Scope and evidence

This review covers the exact current set of 48 SVG masters: 16 families at purpose-drawn 16px, 24px, and 32px tiers. Every master was inspected directly and then compared in the canonical labeled contact sheet at native size and 6× nearest-neighbor magnification on teal, system gray, and white.

- Canonical source: `docs/design-assets/myles98-icons/contact-sheet.html`
- Canonical source SHA-256: `177db7abce08f9229ba87b4e9e2819bc15c9ad64baa6facdee8fdba028e92d7a`
- Inspected labeled render: `/private/tmp/myles98-contact-labeled-fix2.png`
- Inspected labeled-render SHA-256: `d643d8b9fba918b493465166073ac8c3e9f67417bc6dc86fdb60472af028e105`

This is an informed review, not a blind recognition study. Family names, tier labels, the manifest, and the intended nouns were visible during inspection. The conclusions therefore address internal family consistency, native-size legibility, visual weight, and known sibling collisions; they do not claim independent unlabeled recognition rates.

## Decision

All 16 families preserve a stable primary noun across tiers. Added detail at 24px and 32px clarifies the same object rather than replacing it. Every 16px master retains a recognizable native-size silhouette, and no sibling pair collapses into the same outer geometry or dominant internal mark.

The two changed project families are now clean:

- Navi is a location marker above a separate storefront, not a storefront fused into a map badge. It no longer collides with Fresh Greens' square route-map tile.
- TikTok Catalog is a standalone shopping bag at every tier. It no longer borrows document, envelope, newsletter, note, or checklist framing from Email, UnderstandingFAFSA, Resume, Trini Roti / Notes, or Reminders.

No P0, P1, or P2 issue remains.

## Priority findings

### P0

None.

### P1

None.

### P2

None.

### P3

1. **Navi's 16px tier carries only the primary marker noun.** The neighborhood storefront enters at 24px and 32px. This is a sound tiered simplification because the same teal pin remains dominant in all three masters, but the neighborhood-destination specificity at 16px still depends on the launcher label or surrounding context.

2. **The family intentionally spans a broad mass range.** Start, Selected Work, Reminders, Reset Desktop, Navi at 32px, and TikTok Catalog at 32px are denser than Email, Resume, and Trini Roti / Notes. Hard one-pixel outlines, stable color blocks, and distinct silhouettes keep that range from becoming a weight or collision defect.

## Changed-family review

### Navi versus Fresh Greens

**Tier continuity:** PASS.

- 16px: a compact teal teardrop pin with a small orange center. The pin is complete without relying on storefront microdetail.
- 24px: the same pin sits above a discrete orange-awning storefront. A visible blank gap keeps the two nouns separate.
- 32px: the same stack gains storefront window, door, sill, and depth cues without changing the pin silhouette or making the store part of the marker body.

**Native 16px recognition:** PASS. The pointed tail and rounded shoulders establish a location marker before color or interior detail is considered.

**Collision check:** PASS. Fresh Greens remains a near-square green map tile containing one non-monotonic route and orange destination. Navi remains a free-standing teardrop marker, then a vertically stacked marker-plus-store at the larger tiers. The shared orange accent is subordinate and does not create a sibling collision.

**Density and weight:** PASS. The 24px and 32px compositions are tall, but the air gap prevents a fused emblem and keeps the marker visually dominant. The storefront is wider and lower, so the hierarchy reads marker first, place second.

### TikTok Catalog versus document and task siblings

**Tier continuity:** PASS.

- 16px: a standalone magenta shopping bag with a rectangular handle, tapered body, top lip, and lower plane.
- 24px: the same bag adds a clearer opening and right-side gusset.
- 32px: the same bag adds a stronger side plane and restrained lower contact depth. No catalog page, app frame, logo, or music-note cue returns.

**Native 16px recognition:** PASS. The raised handle plus tapered body establishes a shopping bag without borrowing evidence from the larger tiers.

**Collision check:** PASS.

- Email is a low beige sealed envelope led by its flap geometry.
- UnderstandingFAFSA is a tall blue-header information sheet emerging from an open envelope.
- Resume is a white portrait-oriented profile sheet with a folded corner or paperclip and structured lines.
- Trini Roti / Notes is a lilac memo sheet with a folded corner and handwritten marks.
- Reminders is a yellow spiral-bound checklist led by binding and checks.
- TikTok Catalog is the only handle-led, tapered magenta container.

**Density and weight:** PASS. The bag is deliberately simpler than the newsletter and document families. Its dark perimeter is strong enough to survive native size, while the open handle and flat interior keep the 16px and 24px tiers from becoming an undifferentiated block.

## Full 16-family regression

| Family | Same noun across 16/24/32 | Native 16px read | Closest sibling separation | Result |
| --- | --- | --- | --- | --- |
| Start | Portrait at every tier; likeness detail increases with size. | Head, locs, and glasses silhouette. | Bare portrait versus About Myles' framed ID card. | PASS |
| Selected Work | Portfolio folder throughout; thumbnails are additive. | Open yellow work folder. | Folder mouth and tab separate it from documents and app windows. | PASS |
| About Myles | ID / profile card throughout. | Wide clipped card with portrait-left, information-right split. | Wider card frame and portrait separate it from Resume and Generic App. | PASS |
| Resume | Structured professional profile sheet throughout. | Tall white page with blue header and content lines. | Portrait page, paperclip language, and no binding separate it from Notes and Reminders. | PASS |
| Email | Sealed envelope throughout; stamp is additive. | Low horizontal envelope with central flap. | Flat sealed silhouette separates it from FAFSA's tall page-in-envelope construction. | PASS |
| Reminders | Spiral checklist pad throughout. | Yellow bound pad with checks. | Top binding and check marks separate it from Resume and Notes. | PASS |
| Trini Roti / Notes | Single handwritten memo sheet throughout. | Lilac sheet with folded lower corner and writing. | No clip, binding, envelope, or masthead; distinct from all document siblings. | PASS |
| Loose Parts | Three generic construction blocks in the same pyramid throughout. | Three colored blocks, two below and one above. | Unique component count, color triad, and stepped pyramid silhouette. | PASS |
| Display Properties | Beige CRT throughout; color-test detail increases with size. | Monitor body with stand. | Stand and single casing separate it from Open Apps, Reset Desktop, and Generic App. | PASS |
| Open Apps | Two layered application windows throughout. | Overlapping double-window silhouette. | Layer count separates it from the single Generic App window and CRT families. | PASS |
| Reset Desktop | Screen / CRT with opposing reset arrows throughout. | Teal screen between red directional arrows. | Red arrows dominate before the display casing, preventing a Display Properties collision. | PASS |
| Generic App | One neutral application window throughout. | Single square program frame. | One blue-titlebar window, with no stand or overlap, separates it from system siblings. | PASS |
| Fresh Greens | Square road-map tile with one route throughout. | Green square tile with a bent route and orange endpoint. | Tile boundary and embedded route separate it from Navi's free pin. | PASS |
| UnderstandingFAFSA | Information sheet emerging from an envelope throughout. | Tall blue-header page above a shallow mail pocket. | Tall page-to-pocket ratio separates it from Email and Resume. | PASS |
| Navi | Location marker throughout; storefront is additive at 24px and 32px. | Teardrop map pin. | Free marker and separate store do not collide with Fresh Greens' square map tile. | PASS |
| TikTok Catalog | Standalone retail shopping bag throughout. | Handle-led tapered magenta bag. | Handle, taper, and saturated body separate it from every document, mail, note, and checklist sibling. | PASS |

## Verification

- `npm run icons:verify`: PASS, 48 masters verified.
- Focused non-browser icon suites: PASS, 83 tests across contact-sheet generation, icon contracts, and fill integrity.
- Focused browser contact-sheet suite: PASS, 2 tests. The first sandboxed Chromium launch was denied by the macOS Mach-port boundary; the unchanged npm test passed when rerun outside that sandbox.

## Release boundary

The exact current 48-master family passes this informed consistency and collision regression. The new Navi and TikTok Catalog silhouettes close the requested semantic ambiguities, and no P0-P2 issue blocks the set.

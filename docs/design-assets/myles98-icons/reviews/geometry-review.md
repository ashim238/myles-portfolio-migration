# Myles 98 Icon Geometry Review

**Verdict:** PASS
**Review date:** 2026-08-11
**Scope:** Fresh exact-candidate review of all 48 SVG masters in `docs/design-assets/myles98-icons/masters/` and the canonical `docs/design-assets/myles98-icons/contact-sheet.html`.

## Exact candidate identity

- **Contact-sheet SHA-256:** `177db7abce08f9229ba87b4e9e2819bc15c9ad64baa6facdee8fdba028e92d7a`
- **Contact-sheet size:** 521,220 bytes
- **Reviewed labeled screenshot:** `/private/tmp/myles98-contact-labeled-fix2.png`
- **Screenshot SHA-256:** `d643d8b9fba918b493465166073ac8c3e9f67417bc6dc86fdb60472af028e105`
- **Screenshot geometry:** 1440 x 8431 at device scale factor 1
- **Master count:** 48
- **Sorted 48-master hash-list SHA-256:** `13e3dec8b8d53e8bed5ee6fe34d5cf04f72e3113b1ebb5352d9d41f0067689e6`

The contact-sheet generator test confirmed that the canonical HTML embeds every current master unchanged, renders every tier natively, and magnifies a rasterized native canvas at true 6x nearest-neighbor scale on teal (`#008080`), system gray (`#C0C0C0`), and white (`#FFFFFF`).

## Review method

The review combined source inspection, native-grid raster topology analysis, and an informed scan of all 144 labeled master/surface combinations. It checked:

- integer alignment and hard-edge rasterization;
- one-pixel perimeter clearance and cut-off planes;
- binary alpha and partially transparent pixels;
- exact opaque connected-component counts;
- exact enclosed transparent regions;
- horizontal and vertical centering, optical balance, and tier density;
- contour, face, side, highlight, lower-plane, and accessory containment;
- cross-tier anatomical continuity at 16px, 24px, and 32px.

Every master uses whole-unit geometry with `shape-rendering="crispEdges"`. No master contains transforms, filters, masks, strokes, opacity, fractional coordinates, or geometry outside its native grid.

## Severity key

- **P0:** corrupt or unusable asset.
- **P1:** release-blocking clipping, topology, or fill failure.
- **P2:** visible native-size geometry defect requiring revision.
- **P3:** optional geometry polish that does not block approval.

## Findings

- **P0:** None.
- **P1:** None.
- **P2:** None.
- **P3:** None.

## Alpha and topology census

- All 48 masters rasterize with binary alpha only: every pixel is exactly `0` or `255` alpha.
- All 48 masters retain at least one fully transparent pixel on every canvas edge; no opaque pixel touches the perimeter.
- Forty-five masters have one opaque component. The only intentional two-component masters are Navi 24px, Navi 32px, and Reset Desktop 16px.
- Forty-five masters have no enclosed transparency. The only intentional enclosed regions are the Resume paperclip openings at 24px and 32px and the three negative-space regions formed by Reset Desktop 32px's orbiting arrow geometry.
- Forty-two masters are both single-component and hole-free. All six topology exceptions are explicit and disjoint.

### Intentional opaque components

| Master | Exact components | Separation | Result |
| --- | --- | --- | --- |
| Navi 24px | Marker: 118 px, bounds `x=6..17`, `y=1..13`, centroid `(11.50, 6.44)`. Storefront: 96 px, bounds `x=5..18`, `y=16..22`, centroid `(11.50, 19.06)`. | Two complete transparent rows, `y=14..15`. | PASS. The marker and storefront are separate nouns on one exact axis. |
| Navi 32px | Marker: 266 px, bounds `x=7..24`, `y=1..19`, centroid `(15.61, 9.37)`. Storefront: 198 px, bounds `x=6..25`, `y=21..30`, centroid `(15.50, 25.55)`. | One complete transparent row, `y=20`. | PASS. The one-pixel native gap remains plainly visible at 1x and 6x on all three surfaces. |
| Reset Desktop 16px | Detached upper arrow: 24 px. Monitor plus lower arrow: 92 px. | Authored outside space between the cycle-arrow parts. | PASS. Both components are complete and keep a one-pixel canvas perimeter. |

### Intentional enclosed transparency

| Master | Exact enclosed transparent pixels | Result |
| --- | --- | --- |
| Resume 24px | `(19,3)`, `(19,4)` | PASS. One two-pixel paperclip opening. |
| Resume 32px | `(26,4)` and `(27,4..13)` | PASS. One eleven-pixel paperclip opening. |
| Reset Desktop 32px | Region 1: `(22,6)`; region 2: `(5,24)`, `(6,24)`; region 3: `(9..13,25)` | PASS. Three exact negative-space regions inside the orbiting arrow silhouette. |

No other enclosed transparent pixel exists in the 48-master set.

## Newly approved Navi geometry

Navi now implements the approved topology rather than placing a store inside the marker.

- **16px:** the semantic minimum remains one location marker. Bounds are `x=2..13`, `y=1..14`; margins are `2/2/1/1`; one component; no holes.
- **24px:** the full silhouette bounds are `x=5..18`, `y=1..22`; margins are `5/5/1/1`; the marker and storefront are exactly two opaque components. Both component centroids sit at raster axis `x=11.50`, and the two empty rows prevent contact or implied containment.
- **32px:** the full silhouette bounds are `x=6..25`, `y=1..30`; margins are `6/6/1/1`; the marker and storefront are exactly two opaque components. The combined opaque centroid is `x=15.56` against the `x=15.50` raster center, and the complete `y=20` gap prevents fusion.
- The storefront contour, awning, window, door, highlight, right depth, and lower bands are fully contained. Neither tier has a cut-off plane or an accidental internal seam.

**Navi result:** PASS. The marker-above-storefront relationship is geometrically explicit, centered, and intentionally two-component at 24px and 32px.

## Newly approved TikTok Catalog geometry

All three tiers are now a standalone shopping bag with no catalog-page frame, TikTok mark, or detached accessory.

| Tier | Opaque bounds | Margins L/R/T/B | Opaque pixels and density | Centroid | Topology | Result |
| --- | --- | --- | --- | --- | --- | --- |
| 16px | `x=2..13`, `y=2..13` | `2/2/2/2` | 117; `0.4570` canvas density | `(7.45, 7.91)` | 1 component, 0 holes | PASS |
| 24px | `x=3..20`, `y=2..21` | `3/3/2/2` | 288; `0.5000` canvas density | `(11.50, 12.04)` | 1 component, 0 holes | PASS |
| 32px | `x=4..27`, `y=2..28` | `4/4/2/3` | 514; `0.5020` canvas density | `(15.50, 15.66)` | 1 component, 0 holes | PASS |

The handle meets the upper rim at every tier, so the icon remains one object. The pale handle opening is authored opaque material rather than an accidental transparent hole. The magenta face, upper highlight, right gusset, lower plane, and restrained 32px contact band remain inside the dark silhouette with no clipped or incomplete plane. Density stabilizes at 24px and 32px while 16px preserves the same dominant bag silhouette.

**TikTok Catalog result:** PASS. The standalone shopping-bag anatomy is centered, continuous, and clean at all three native sizes.

## Current changed-master regression

The current worktree changes sixteen masters across nine families. All pass their exact geometry contract.

| Family and tiers | Exact current evidence | Result |
| --- | --- | --- |
| About Myles 16 | Bounds `x=1..14`, `y=2..13`; margins `1/1/2/2`; 143 opaque px; centroid `(7.45, 8.14)`; 1 component; 0 holes. The clip joins the card and remains inside the perimeter. | PASS |
| Fresh Greens 16/24/32 | Bounds `x=1..13,y=2..13`; `x=2..21,y=2..21`; `x=3..28,y=3..28`. Topology is 1 component and 0 holes at every tier. The stepped route, start, destination, and face/shadow bands are completely covered. | PASS |
| Loose Parts 16/24/32 | Bounds `x=1..14,y=1..14`; `x=2..21,y=3..22`; `x=3..28,y=4..29`. Each tier is 1 component, 0 holes, and exactly `0.7500` filled within its silhouette bounds. Every cube's face, highlight, side, and lower plane remains contained. | PASS |
| Navi 24/32 | Balanced full bounds `x=5..18` and `x=6..25`; exact intentional two-component topology; zero enclosed holes. Marker and storefront separation is preserved by two rows at 24px and one row at 32px. | PASS |
| Reminders 32 | Bounds `x=4..27`, `y=2..29`; margins `4/4/2/2`; centroid `(15.57, 16.18)`; 1 component; 0 holes. Binding, pad, checks, and lower/right bands are complete. | PASS |
| Reset Desktop 16 | Bounds `x=1..14`, `y=1..14`; margins `1/1/1/1`; exact intentional 2 components; 0 holes. Upper arrow and monitor/lower-arrow unit are uncut. | PASS |
| Resume 16 | Bounds `x=2..13`, `y=1..14`; margins `2/2/1/1`; 156 opaque px; 1 component; 0 holes. Header and structured lines stay inside the paper face. | PASS |
| TikTok Catalog 16/24/32 | Symmetric horizontal margins `2/2`, `3/3`, and `4/4`; 1 component and 0 holes throughout; densities `0.4570`, `0.5000`, `0.5020`. No catalog frame remains. | PASS |
| UnderstandingFAFSA 16 | Bounds `x=1..14`, `y=1..14`; margins `1/1/1/1`; 157 opaque px; centroid `(7.53, 8.19)`; 1 component; 0 holes. Page, pocket, side planes, and baseline are complete. | PASS |

## Full 48-master bounds ledger

Notation: `B` = inclusive opaque bounds; `M` = clear left/right/top/bottom margins; `C/H` = opaque-component count / enclosed-transparent-region count.

| Concept | 16px | 24px | 32px |
| --- | --- | --- | --- |
| Start | `B 1..13,1..13; M 1/2/1/2; 1C/0H` | `B 2..21,1..21; M 2/2/1/2; 1C/0H` | `B 2..29,1..29; M 2/2/1/2; 1C/0H` |
| Selected Work | `B 1..14,3..14; M 1/1/3/1; 1C/0H` | `B 2..21,4..21; M 2/2/4/2; 1C/0H` | `B 2..29,5..29; M 2/2/5/2; 1C/0H` |
| About Myles | `B 1..14,2..13; M 1/1/2/2; 1C/0H` | `B 2..21,1..20; M 2/2/1/3; 1C/0H` | `B 2..29,2..27; M 2/2/2/4; 1C/0H` |
| Resume | `B 2..13,1..14; M 2/2/1/1; 1C/0H` | `B 3..22,2..22; M 3/1/2/1; 1C/1H` | `B 4..30,2..29; M 4/1/2/2; 1C/1H` |
| Email | `B 1..14,4..13; M 1/1/4/2; 1C/0H` | `B 1..22,7..19; M 1/1/7/4; 1C/0H` | `B 2..29,9..26; M 2/2/9/5; 1C/0H` |
| Reminders | `B 2..13,1..14; M 2/2/1/1; 1C/0H` | `B 3..20,2..22; M 3/3/2/1; 1C/0H` | `B 4..27,2..29; M 4/4/2/2; 1C/0H` |
| Trini Roti | `B 2..13,2..13; M 2/2/2/2; 1C/0H` | `B 3..21,2..21; M 3/2/2/2; 1C/0H` | `B 4..28,3..28; M 4/3/3/3; 1C/0H` |
| Loose Parts | `B 1..14,1..14; M 1/1/1/1; 1C/0H` | `B 2..21,3..22; M 2/2/3/1; 1C/0H` | `B 3..28,4..29; M 3/3/4/2; 1C/0H` |
| Display Properties | `B 1..14,1..14; M 1/1/1/1; 1C/0H` | `B 2..21,2..21; M 2/2/2/2; 1C/0H` | `B 2..29,2..29; M 2/2/2/2; 1C/0H` |
| Open Apps | `B 1..14,2..14; M 1/1/2/1; 1C/0H` | `B 2..21,3..22; M 2/2/3/1; 1C/0H` | `B 2..29,3..29; M 2/2/3/2; 1C/0H` |
| Reset Desktop | `B 1..14,1..14; M 1/1/1/1; 2C/0H` | `B 1..22,2..22; M 1/1/2/1; 1C/0H` | `B 1..30,2..30; M 1/1/2/1; 1C/3H` |
| Generic App | `B 1..14,2..14; M 1/1/2/1; 1C/0H` | `B 2..21,3..21; M 2/2/3/2; 1C/0H` | `B 2..29,3..29; M 2/2/3/2; 1C/0H` |
| Fresh Greens | `B 1..13,2..13; M 1/2/2/2; 1C/0H` | `B 2..21,2..21; M 2/2/2/2; 1C/0H` | `B 3..28,3..28; M 3/3/3/3; 1C/0H` |
| UnderstandingFAFSA | `B 1..14,1..14; M 1/1/1/1; 1C/0H` | `B 2..21,2..21; M 2/2/2/2; 1C/0H` | `B 2..29,2..29; M 2/2/2/2; 1C/0H` |
| Navi | `B 2..13,1..14; M 2/2/1/1; 1C/0H` | `B 5..18,1..22; M 5/5/1/1; 2C/0H` | `B 6..25,1..30; M 6/6/1/1; 2C/0H` |
| TikTok Catalog | `B 2..13,2..13; M 2/2/2/2; 1C/0H` | `B 3..20,2..21; M 3/3/2/2; 1C/0H` | `B 4..27,2..28; M 4/4/2/3; 1C/0H` |

## Geometry conclusions

- **Integer alignment:** PASS. All source geometry is native-grid aligned and rasterizes without partial alpha.
- **Perimeter and clipping:** PASS. Every viewBox edge remains transparent; no contour, accessory, highlight, side band, lower plane, or contact band is cut off.
- **Topology:** PASS. Component and hole counts match the exact intentional map above; there are no orphan pixels, accidental contacts, unintended enclosed gaps, or fused independent objects.
- **Centering:** PASS. Directional accessories account for the few intentionally asymmetric bounds. The newly changed Navi, Reminders, TikTok Catalog, Fresh Greens, and Loose Parts silhouettes remain balanced at their native tiers.
- **Plane coverage:** PASS. Pale paper, envelope, screen, ID-card, map, storefront, bag-handle, and application-window regions are authored opaque material, not missing fill.
- **Native-size balance:** PASS. The 16px tiers preserve the dominant noun; 24px and 32px add object-specific planes without collapsing negative space or changing the primary silhouette.

## Verification commands

```text
shasum -a 256 docs/design-assets/myles98-icons/contact-sheet.html /private/tmp/myles98-contact-labeled-fix2.png
find docs/design-assets/myles98-icons/masters -type f -name '*.svg' | sort | wc -l
find docs/design-assets/myles98-icons/masters -type f -name '*.svg' | sort | xargs shasum -a 256 | shasum -a 256
npm run icons:verify
npm exec -- vitest run scripts/__tests__/myles98-icon-fill-integrity.test.ts scripts/__tests__/myles98-icon-contract.test.ts scripts/__tests__/myles98-icon-contact-sheet.test.ts
npm exec -- vitest run scripts/__tests__/myles98-icon-contact-sheet.browser.test.ts
```

The focused browser command initially encountered the macOS sandbox's Mach-port launch denial. The unchanged command was rerun outside that sandbox and passed both browser tests.

## Approval gate

Geometry is approved for the exact contact-sheet candidate identified above. There are no remaining P0, P1, P2, or P3 findings, and no SVG geometry revision is recommended.

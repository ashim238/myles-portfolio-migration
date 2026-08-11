# Myles 98 Icon Period-Fidelity and Originality Review

**Verdict:** PASS
**Severity summary:** P0 0, P1 0, P2 0, P3 0
**Review date:** 2026-08-11
**Scope:** All 48 current SVG masters in `docs/design-assets/myles98-icons/masters/`, the exact current contact sheet, and the supplied labeled PNG render.

## Evidence lock

- **48-master aggregate SHA-256:** `13e3dec8b8d53e8bed5ee6fe34d5cf04f72e3113b1ebb5352d9d41f0067689e6`. This is the digest of the path-bearing `shasum -a 256` lines for all 48 SVGs after paths were sorted with `LC_ALL=C`.
- **Contact-sheet HTML SHA-256:** `177db7abce08f9229ba87b4e9e2819bc15c9ad64baa6facdee8fdba028e92d7a`.
- **Supplied labeled PNG SHA-256:** `d643d8b9fba918b493465166073ac8c3e9f67417bc6dc86fdb60472af028e105`.
- **PNG dimensions:** 1440 × 8431, 8-bit RGB.
- **Sheet/source correspondence:** each current SVG master's exact trimmed source occurs six times in the HTML: labeled and blind review modes on teal (`#008080`), system gray (`#C0C0C0`), and white (`#FFFFFF`).
- **Raster method:** the HTML first draws each SVG to a native 16, 24, or 32px canvas, then enlarges that bitmap 6× with smoothing disabled.
- **Structural verification:** `npm run icons:verify` completed successfully with `Verified 48 Myles 98 icon masters.`

Any master or contact-sheet edit invalidates this evidence lock and requires a new review.

## Review method

This is an informed late-1990s Windows 98-era period-fidelity and visual-originality review, not a blind-recognition result. I read every SVG master, inspected all tiers in the supplied labeled sheet on all three backgrounds, and checked the native-to-6× raster implementation.

The release criteria were:

1. the literal object noun survives at its assigned tier;
2. light comes from the upper left, with compact right, lower, or contact shade bands;
3. contours, diagonals, folds, and depth are built from opaque pixel bands;
4. palette size and detail remain appropriate to the native grid;
5. depth follows the depicted object's anatomy instead of a reusable family-wide extrusion;
6. the source has no modern or AI-vector tells such as smooth curves, long decimals, transforms, gradients, blur, opacity, rounded strokes, or generic soft shadows;
7. the artwork does not reproduce a Microsoft, Windows, TikTok, LEGO, or other proprietary logo or distinctive branded glyph;
8. larger tiers add meaningful anatomy without turning into miniature illustrations.

The source scan found only `path`, `rect`, and `polygon` artwork with integer geometry and opaque six-digit hex fills. All 48 roots declare the correct native viewBox, `shape-rendering="crispEdges"`, concept id, and grid id. No master contains strokes, curve commands, transforms, gradients, filters, masks, clipping, opacity, eight-digit colors, or fractional coordinates.

## Severity key

- **P0:** corrupt, unusable, or demonstrably copied asset.
- **P1:** release-blocking period-fidelity or originality failure.
- **P2:** visible native-size fidelity defect that requires revision.
- **P3:** optional fidelity polish that does not block approval.

## Findings

### P0

None.

### P1

None.

### P2

None.

### P3

None. Additional dithering, texture, bevel bands, or decorative pixels would reduce clarity rather than improve period fidelity.

## Changed-family decision: Navi

**Result:** PASS across 16, 24, and 32px.

- **Literal noun and tier progression:** the 16px master deliberately carries only the dominant location-pin noun, with an orange destination center. The 24px and 32px masters add a separate storefront below the pin. They do not place the shop inside the marker, so the two nouns remain topologically distinct.
- **Separation:** at 24px the pin geometry ends at coordinate 14 and the store begins at 16. At 32px the pin geometry ends at 20 and the store begins at 21. The transparent separation and centered stacking read as “location above destination,” not a badge enclosing a building.
- **Upper-left lighting:** four cool tones construct the pin from dark contour through blue face to a pale upper-left band. The storefront uses its own orange awning highlights, cream facade, blue window highlight, brown door, and lower contact plane.
- **Pixel bands and palette:** Navi uses 5 elements/5 colors at 16px, 13 elements/12 colors at 24px, and 17 elements/15 colors at 32px. The stepped pin contour is authored directly at each grid; it is not a scaled smooth teardrop.
- **Object-specific depth:** the marker's curved volume comes from nested stepped silhouettes. The store's depth comes from awning stripes, facade openings, sill, and base planes. No generic shadow wrapper is shared between the two objects.
- **Originality and brand safety:** there is no Microsoft map glyph, Windows flag, proprietary map tile, wordmark, or copied application badge. The blue pin plus neighborhood storefront is a project-specific arrangement of generic nouns.
- **Detail control:** 16px correctly omits the store; forcing both objects into that tier would crowd the pin and weaken recognition. The 24px store carries one window and one door. The 32px tier adds only the window highlight and base depth needed to support the larger grid.

## Changed-family decision: TikTok Catalog

**Result:** PASS across 16, 24, and 32px.

- **Literal noun:** every tier is now a standalone handled retail shopping bag. There is no remaining catalog page, dashboard, cursor, frame, or social-app panel.
- **Tier progression:** 16px establishes handle plus tapered bag body. The 24px tier clarifies the opening and one side plane. The 32px tier adds a restrained gusset, lower plane, and one-pixel contact band.
- **Upper-left lighting:** the light pink upper band sits on the top-left/front face. Deeper magenta planes stay on the right and lower edges. The dark handle and contour anchor the pale opening without creating a soft halo.
- **Pixel bands and palette:** the tiers use 8/10/11 elements and 6/7/8 colors respectively. Every edge is integer-aligned, every diagonal is a short stepped polygon, and the increasing detail is proportional to the grid.
- **Object-specific depth:** the handle opening, tapered body, right gusset, lower fold, and contact strip describe shopping-bag construction. They do not reuse the page thickness, window bevel, folder lip, or CRT casing logic found elsewhere in the family.
- **Originality and brand safety:** the artwork contains no TikTok music-note mark, offset cyan/red note treatment, wordmark, initials, social-media glyph, or Microsoft cue. The magenta retail palette alone is not a traced brand mark. “TikTok Catalog” remains the project identifier in filenames and labels, not a logo drawn into the bag.
- **Detail control:** the bag remains readable because it has no product thumbnails, typography, cursor, or micro-interface. Its 32px master stops at material planes rather than adding ornamental content.

## Whole-family regression review

| Concept | Native-tier progression | Period-fidelity and originality result |
|---|---|---|
| Start | head-and-glasses silhouette to the fuller portrait mark | Stepped hair, glasses, skin, and contour planes remain authored per tier; no Windows Start flag or Microsoft portrait asset |
| Selected Work | folder to one thumbnail to contact-sheet folder | Folder lip and paper content use separate material planes; generic folder noun, project-specific contents |
| About Myles | portrait card to detailed ID card | Card clip, portrait, and information fields scale with available space; no copied Windows user-card layout |
| Resume | profile sheet to paperclipped structured résumé | Paper thickness and clip geometry are distinct; detail remains inside the page hierarchy |
| Email | sealed envelope to stamped dimensional envelope | Fold topology, left highlight, right shade, and lower seam remain literal and compact |
| Reminders | spiral checklist pad with increasing rows | Binding, paper face, checks, right edge, and base band use notebook-specific depth |
| Trini Roti | memo sheet to folded-corner handwritten note | Page fold and handwritten bands stay materially legible without becoming a generic application window |
| Loose Parts | three construction blocks at every tier | Top, right, and lower block planes remain consistent; no studs, LEGO proportions, letters, or branded colors |
| Display Properties | CRT to color-test CRT with controls | Casing, glass, stand, and controls use monitor-specific planes; no Windows logo or copied Control Panel badge |
| Open Apps | two overlapping windows with richer panes | Overlap is the depth cue; titlebars and content distinguish the two windows without tracing a branded program |
| Reset Desktop | simplified screen plus arrows to full CRT reset | Arrows remain subordinate to the device; 16px avoids forcing the larger stand into the smallest tier |
| Generic App | one window to a restrained program window | Common GUI noun with original pane proportions; no application logo, Windows flag, or branded toolbar |
| Fresh Greens | route-map tile to route with start/destination | Flat map regions and dimensional route use a distinct project palette and avoid folded-map clutter |
| UnderstandingFAFSA | newsletter page to modular newsletter in envelope | Page, masthead, content blocks, and envelope folds progress meaningfully without colliding with sealed Email |
| Navi | pin to pin above storefront | Revised composition passes; see the changed-family decision above |
| TikTok Catalog | standalone bag with increasing material depth | Revised composition passes; see the changed-family decision above |

Family-wide metrics also remain controlled:

- element counts range from 5 to 30; the 30-element maxima occur only in 32px About Myles and Resume, where portrait or document structure justifies the density;
- unique opaque-color counts range from 5 to 24; Navi 16 is the semantic minimum and About Myles 32 is the justified maximum;
- upper-left highlights and right/lower shade placement remain consistent across paper, folder, portrait, map, monitor, window, block, pin, storefront, and bag materials;
- depth is visibly object-specific: folder lip, ID-card clip, paper thickness, envelope folds, spiral binding, note fold, block planes, CRT casing, window overlap, map route, pin curvature, storefront facade, and bag gusset do not collapse into one reusable treatment;
- generic system nouns use the era's beige, gray, blue-titlebar, and CRT vocabulary without reproducing a Microsoft flag, wordmark, Internet Explorer mark, Recycle Bin shell, or other distinctive proprietary glyph;
- no family regressed into a smooth modern outline, glossy gradient, homogeneous drop shadow, or over-rendered miniature illustration.

## Originality conclusion

The set is an original Myles 98 interpretation of late-1990s desktop icon construction. Its period reference comes from grid-authored silhouettes, restrained hard ramps, upper-left lighting, and object-specific material planes. It does not depend on tracing a Microsoft icon or inserting a third-party logo. Common nouns such as folders, CRTs, windows, envelopes, map pins, storefronts, and shopping bags are arranged and shaded in project-specific compositions.

## Limitations

- This was an informed review with filenames and labels visible. It does not replace the separate blind-recognition evidence.
- The supplied PNG is the labeled 1440 × 8431 render. I inspected the HTML's blind-mode construction, but did not collect new uninformed participant responses.
- The originality conclusion is a visual and source-construction assessment, not legal clearance. No exhaustive Microsoft icon-archive comparison, reverse-image search, or forensic provenance analysis was performed.
- This review does not certify portrait likeness, accessibility in forced-colors mode, live-UI CSS scaling, optical centering in every callsite, or sibling collision beyond the supplied contact-sheet surfaces. Those belong to the geometry, recognition, integration, and accessibility reviews.
- The static sheet proves the exact digested masters on teal, system gray, and white. It does not prove behavior after future source, renderer, browser, or integration changes.

## Approval boundary

The exact 48-master set identified above requires no period-fidelity or visual-originality revision. Navi's pin-over-store hierarchy and TikTok Catalog's standalone shopping-bag metaphor are approved. Preserve their tier-specific simplification, hard palette bands, upper-left lighting, and object-authored depth; do not add Microsoft/TikTok marks, generic soft shadows, gradients, or detail merely to make the smaller tiers busier.

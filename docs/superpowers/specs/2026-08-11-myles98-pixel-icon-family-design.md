# Myles 98 Pixel Icon Family Design

**Date:** 2026-08-11

**Status:** Exact 48-master candidate verified; full-sheet approval pending before production integration

**Reference boundary:** The Windows 98 icon archive is a construction reference only. Every Myles 98 metaphor, silhouette, palette arrangement, and pixel layout remains original.

## Goal

Replace the current flat and occasionally ambiguous Myles 98 glyphs with an original, coherent family of late-1990s desktop pixel illustrations. The icons should feel dimensional and period-aware at native size without tracing Microsoft assets, copying proprietary symbols, or turning the portfolio into a literal Windows reproduction.

The family covers 16 user-facing concepts. Each concept receives independently authored 16, 24, and 32-unit SVG masters, for 48 masters total. No master is scaled to create another tier.

## Native tiers and semantic burden

The three tiers do not carry the same amount of meaning.

### 16-unit chrome tier

- Used by titlebars, taskbar items, Reader chrome, and dense system identity.
- Communicates one dominant object category and its family color.
- Uses one silhouette and, only when essential, one secondary cue.
- Does not attempt to explain the full program metaphor without the adjacent label.
- Accepted blind-review language is the primary noun, such as `map`, `document`, `location marker`, `catalog`, `monitor`, or `portrait`.

### 24-unit menu tier

- Authored on a 24-unit grid and commonly rendered at 20 CSS pixels.
- Adds one defining cue that separates neighboring concepts.
- Keeps material planes and highlights subordinate to recognition.
- Must remain distinct from every sibling icon when shown without labels.

### 32-unit discovery tier

- Used by desktop shortcuts and other discovery-scale identity.
- Carries the complete literal-object metaphor.
- May add one accessory, material texture, or secondary plane.
- Still prioritizes silhouette over decorative detail.

This tiering resolves the small-size complexity concern by changing what each icon is required to communicate. Simplification is semantic, not merely geometric.

## Approved literal-object vocabulary

| Concept | 16-unit noun | 24-unit defining cue | 32-unit complete object |
|---|---|---|---|
| Start | Head-and-glasses silhouette | Locs and glasses within the portrait mark | Pixel adaptation of Myles's existing portrait mark |
| Selected Work | Portfolio folder | One visible image thumbnail | Open portfolio folder containing a contact sheet |
| About Myles | Portrait card | ID-card frame and one information line | ID card with portrait and information lines |
| Résumé | Profile sheet with blue header | Blue paperclip and two bullets | Professional profile sheet with paperclip and structured lines |
| E-mail | Sealed envelope | Sealed envelope with one yellow stamp | Dimensional sealed envelope with one subordinate stamp |
| Reminders | Spiral checklist pad | Two checks and a bound paper edge | Personal checklist pad with checks and paper depth |
| Notes (`trini-roti` program ID) | Single memo sheet | Folded corner and handwritten lines | Personal memo sheet with folded corner, handwritten lines, and paper depth |
| Loose Parts | Three stacked construction blocks | Three colored cubes with face shading | Three colored building blocks in a compact pyramid |
| Display Properties | CRT monitor | Color-test tiles | Beige CRT with color-test window, controls, and object-specific casing depth |
| Open Apps | Two overlapping windows | Distinct titlebars | Two layered application windows with separate content panes |
| Reset Desktop | Desktop screen with two reset arrows | Compact red reset arrow | CRT desktop with a clear, subordinate reset arrow |
| Generic App / Welcome | Single application window | Blue titlebar and inner pane | Neutral program window with restrained chrome depth |
| Fresh Greens | Road-map tile with one route | One route with start and destination | Road-map tile with one non-monotonic road, start point, and orange destination |
| UnderstandingFAFSA | Newsletter page | Blue masthead within open envelope | Modular newsletter emerging from an envelope with three content regions |
| Navi | Location marker | Location marker above a storefront | Location marker above a neighborhood storefront with one depth cue |
| TikTok catalog studio | Standalone retail shopping bag | Shopping bag with a top opening and one side plane | Dimensional shopping bag with gusset, lower plane, and restrained contact depth |

## Portrait likeness contract

Start and About Myles depict Myles, not a generic user. `public/logomark.svg` is the canonical portrait-mark reference and confirms the glasses. The user-provided likeness correction governs the features that the pixel adaptations must preserve:

- Dark skin.
- Long locs with the hair tapered on the sides.
- Glasses.
- A moustache and separated chin hair.
- No continuous full-beard mass across the cheeks or jaw.

The likeness contract follows the semantic burden of each native tier instead of forcing every feature into every grid:

- At 16 units, Start carries the primary portrait noun with dark skin and the essential head, glasses, and long-locs/tapered-sides silhouette. About Myles carries the primary ID-card noun with a dark portrait and the essential long-locs/tapered-sides silhouette. Facial-hair and interior likeness microdetail must be removed before either primary noun is weakened.
- At 24 units, both concepts resolve the defining likeness cues: long locs with tapered sides, glasses, moustache, and separated chin hair. About Myles still retains the ID-card frame and one information line.
- At 32 units, each concept carries its complete approved object and every likeness cue. The moustache and chin hair remain visually separated; cheek or jaw pixels must not close them into a full beard.

Blind recognition still evaluates the portrait or ID-card noun without coaching. The later informed specialist review additionally compares Start and About Myles against this likeness contract and confirms that both concepts depict the same person across all three tiers.

## Collision rules

- Fresh Greens owns a route through a road-map tile. Navi owns one neighborhood destination marker.
- E-mail is a sealed message. UnderstandingFAFSA is an open modular newsletter.
- Reminders is a personal checklist. Résumé is a professional profile document.
- Display Properties is a monitor. Open Apps is overlapping windows. Reset Desktop is a monitor with an explicit reset cue.
- Start uses Myles's portrait identity. Generic App remains neutral system chrome.
- Loose Parts must read as three generic construction blocks, never a proprietary toy-brick system, food, or furniture.
- TikTok uses one standalone retail shopping bag and no enclosing page, social-media logo, music note, or branded interface.

## Pixel construction grammar

- Exact viewBoxes: `0 0 16 16`, `0 0 24 24`, and `0 0 32 32`.
- Integer-coordinate filled rectangles, polygons, and deliberately stepped paths.
- `shape-rendering="crispEdges"` at every tier.
- Binary transparency only.
- Filled contour bands rather than one uniform SVG stroke.
- Square and stair-stepped corners. No rounded linecaps or joins.
- Horizontal, vertical, and 45-degree runs for mechanical planes; manually stepped curves where the object requires them.
- No fractional coordinates, smooth curves, transforms, filters, masks, blur, gradients, or translucent shadows.
- Consistent upper-left lighting with near-white highlights, a light-facing plane, a midtone face, a darker right or lower plane, and compact near-black contact shadows.
- Object-specific depth. No shared extrusion or generic shadow wrapper.
- Approximately 8 to 24 opaque colors, with near-black contours, warm and cool neutrals, and no more than two saturated accent families per icon.
- Dithering only when it clarifies material or tonal separation.
- At least one unit of breathing room around all visible geometry and shadows.

## Review protocol

### Blind recognition

Two uninformed reviewers receive randomized, unlabeled native-size renders on teal, system gray, and white.

- At 16 units, reviewers must identify the primary noun or an approved synonym and must not confuse it with a sibling.
- At 24 units, reviewers must identify the object plus its defining cue.
- At 32 units, reviewers must identify the full object category without coaching.
- Any prohibited brand reading or sibling collision fails the icon.
- Disagreement between reviewers is a failure, not a split decision.
- Failed icons return to metaphor and silhouette design. Extra detail is not used to rescue an unclear icon.

### Specialist review

After either a clean blind-recognition pass or the disclosed exact-sheet approval exception, separate iconographers review:

1. Integer alignment, bounds, contour bands, and pixel stair steps.
2. Late-1990s palette, lighting, object-specific depth, and native-size balance.
3. Family density, collision resistance, and consistency across all three tiers.

### Final-candidate review disposition

The earlier anonymous rounds remain valid evidence for the candidates they actually rendered, but they do not automatically transfer to later pixels. A final-candidate blind retest was discarded before image inspection because mandatory task-observer context exposed earlier icon readings. It must not be described as a blind pass.

The exact approval candidate is bound to these deterministic identifiers:

- Aggregate 48-master SHA-256: `13e3dec8b8d53e8bed5ee6fe34d5cf04f72e3113b1ebb5352d9d41f0067689e6`.
- Canonical contact-sheet HTML SHA-256: `177db7abce08f9229ba87b4e9e2819bc15c9ad64baa6facdee8fdba028e92d7a`.
- Browser-rendered labeled-sheet PNG SHA-256: `d643d8b9fba918b493465166073ac8c3e9f67417bc6dc86fdb60472af028e105`.
- Myles approved the revised Navi pin-over-store and TikTok standalone-shopping-bag directions. Exact full-sheet approval remains the final production-integration gate.

The exact final 48-master candidate therefore uses a transparent exception path: Myles reviews the complete rendered contact sheet, and separate informed specialists must pass geometry, period fidelity, and family consistency with no P0–P2 findings. Production integration can begin only after Myles approves that exact sheet with the blind-review limitation disclosed. A future external or clean-context blind retest may strengthen the evidence, but it is not fabricated inside a contaminated task context.

### Rendered context

The final contact sheet shows every master at 1× and nearest-neighbor magnification on teal `#008080`, system gray `#C0C0C0`, and white. Production verification later checks the icons inside Workstation, Pocket, titlebar, taskbar, Start, Reader, forced-colors, and focus states.

## Deliverables

- 48 complete raw SVG design masters.
- A manifest naming each concept, intended object, accepted blind readings, prohibited readings, tier, palette, and review status.
- Native-size and magnified contact sheets.
- Blind-recognition and specialist-review results.
- A later implementation plan that adapts the approved geometry into `Myles97Icon` without generic depth wrappers or master scaling.

Design masters remain isolated from production until the full family contact sheet is approved. Existing dirty working-tree changes and unrelated project surfaces remain untouched.

## Acceptance criteria

- All 16 concepts have independent 16, 24, and 32-unit masters.
- The 16-unit tier remains legible because it carries only the primary noun.
- Every 24 and 32-unit master is visually distinct from its siblings without labels.
- Every icon either passes two uninformed reviewers on its exact bytes or receives Myles's explicit exact-sheet approval under the disclosed final-candidate exception; all icons still pass the three specialist review dimensions.
- No icon copies an existing Windows asset, logo, or pixel arrangement.
- No production integration begins until Myles approves the complete contact sheet and written implementation plan.

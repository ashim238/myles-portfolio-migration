# Fresh Greens and UnderstandingFAFSA Object-Rendering Review

**Verdict:** PASS for the six reviewed masters at native size.

**Review date:** 2026-08-12
**Scope:** Fresh Greens and UnderstandingFAFSA at 16px, 24px, and 32px only.

## Evidence lock

- Native and 8x nearest-neighbor render on teal, system gray, and white:
  `/private/tmp/myles98-fresh-fafsa-object-rendered.png`
  (`f82466cdfe7f987c9774c9ea4289efdf98f35d7180ac09a666b68d95cce85cfc`).
- Regenerated canonical contact sheet:
  `52e6f7e3a0c26975a504bde96ba65a285cff5f17e1d25833657aee5646e388af`.
- Every public SVG mirror byte-matches its reviewed master.

## Fresh Greens: GPS navigation unit

The icon is a literal compact GPS navigator, rather than a free-floating road
diagram. A dark, complete bezel encloses a light device housing and inset map
screen. The lower confirmation control stays outside the screen so the object
does not collapse into a generic app window. At 24px and 32px, the small gold
side button provides an object-specific hardware cue without competing with the
route. The water, land, dark route, and orange destination are contained by the
screen at every tier.

At 16px, the casing, screen border, lower control, and single destination pixel
are retained. At 24px and 32px, detail grows through screen geography and the
side button rather than extra decorative panels.

## UnderstandingFAFSA: printed newsletter packet

The icon is a physical newsletter packet rather than an editorial layout in an
abstract frame. The front paper face is offset from a visible rear sheet and
shadow, with a light-facing top and left edge, darker right paper edge, fold
crease, lower paper face, and an intentional print gutter. The segmented blue
masthead, headline, photo, copy lines, and lower modules remain printed detail,
not UI controls.

At 16px, the stack, masthead, crease, and lower print structure survive. At
24px and 32px, the rear sheet, page depth, editorial hierarchy, and print
gutter become more explicit without adding browser chrome or dashboard tiles.

## Native-size checks

- **Silhouette:** both objects have a filled, readable outer construction with
  no clipped perimeter pixels.
- **Planes:** upper-left highlights and darker lower or right planes describe
  material depth rather than a generic bevel wrapper.
- **Negative space:** Fresh Greens uses its inset screen and the gap above its
  control deliberately. UnderstandingFAFSA uses its print gutter and exposed
  stack offsets deliberately. Neither relies on unexplained holes.
- **Collision resistance:** Fresh Greens rejects folded-map, circuit, and
  generic-screen readings. UnderstandingFAFSA rejects browser, dashboard,
  envelope, and folder readings.

## Mechanical support

The focused object-rendering, project-metaphor, contract, and fill-integrity
tests passed after deliberate negative mutations that remove Fresh Greens'
control or flatten UnderstandingFAFSA's packet. The project master verifier,
XML parsing, contact-sheet generation, and contact-sheet browser checks also
passed. The later v10 source-free recognition record confirms the newsletter
packet but requires a Fresh Greens redraw. See
[`family-consistency-review.md`](family-consistency-review.md) for the
hash-bound disposition. Any later metaphor change requires a fresh review.

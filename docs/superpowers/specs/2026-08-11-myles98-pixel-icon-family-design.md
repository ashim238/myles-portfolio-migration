# Myles 98 Pixel Icon Family Design

**Date:** 2026-08-12

**Status:** Task 5 mechanical verification and internal informed review pass
for the current 48-master aggregate. Fresh clean-context recognition remains
the only open release gate. Production rendering is separately integrated and
out of scope for this asset-family acceptance document.

**Reference boundary:** Windows 98 is a construction reference only. Every
metaphor, silhouette, palette arrangement, and pixel layout is original.

## Goal

The family contains 16 original late-1990s pixel illustrations. Every concept
has independently authored 16, 24, and 32-unit SVG masters. Each must preserve
a literal noun, object-specific depth, and native-size legibility without
tracing or copying proprietary assets.

## Native tiers

| Tier | Required meaning |
| --- | --- |
| 16-unit chrome | One dominant object category and family color. |
| 24-unit menu | One defining cue separating the object from siblings. |
| 32-unit discovery | Complete literal metaphor, with only clarifying detail. |

## Approved literal-object vocabulary

| Concept | 16-unit noun | 24-unit defining cue | 32-unit complete object |
| --- | --- | --- | --- |
| Start | Head-and-glasses portrait | Locs and glasses | Pixel adaptation of Myles’s portrait mark |
| Selected Work | Project dossier folder | Two project cards | Open dossier containing two project cards |
| About Myles | Portrait card | ID-card frame and information line | ID card with portrait and information lines |
| Résumé | Profile sheet with blue header | Subordinate paperclip and bullets | Profile sheet with compact paperclip and lines |
| E-mail | Sealed envelope | Symmetric closed side folds | Dimensional envelope with side folds and lower depth band |
| Reminders | Checklist pad with two check pairs | Three check pairs and paper edge | Checklist pad with paper depth |
| Notes (`trini-roti` ID) | Memo sheet | Folded corner and handwriting | Memo with folded corner, handwriting, and paper depth |
| Loose Parts | Compact 2+1 wooden block stack | Visible top/right planes and highlights | Three wooden construction blocks with object-specific depth |
| Display Properties | CRT with settings cue | In-screen slider controls | Beige CRT with controls and casing depth |
| Open Apps | Two overlapping windows | Distinct titlebars | Layered app windows with content panes |
| Reset Desktop | Open restart C-loop | C-loop plus directional wedge and gap | Stepped open restart C-loop with compact wedge |
| Generic App / Welcome | Application window | Blue titlebar and inner pane | Neutral window with restrained chrome depth |
| Fresh Greens | Street-block map with route and markers | Route, markers, four parcel cues | Road-map tile with street network and route |
| UnderstandingFAFSA | Folded printed newsletter | Rear sheet, blue masthead, photo, crease | Wide newsprint with stack, crease, lower leaf, and print hierarchy |
| Navi | Location marker | Orange-center pin above storefront | Pin above widened neighborhood storefront |
| TikTok catalog studio | Handled shopping bag | Bag with one side plane | Dimensional shopping bag with opening and side depth |

The manifest is the authority for intended objects, accepted readings,
rejected readings, grouping, and tier wording.

## Portrait likeness

Start and About Myles depict Myles, not a generic user. The pixel adaptations
preserve dark skin, long locs with tapered sides, glasses, a continuous
moustache, and separate chin hair. A continuous full beard mass is prohibited.

## Collision rules

- Fresh Greens is a street-block route map, never a music note, folded map,
  circuit, landscape, wand, or leaf logo. Navi owns pin-over-storefront.
- E-mail is a sealed message with symmetric side folds. UnderstandingFAFSA is
  a physical folded newsletter with editorial print anatomy, never browser
  chrome, a dashboard, a screen, envelope, folded map, mountain, or letter.
- Reminders is a checklist and Notes a folded memo. Display Properties is a
  CRT with controls. Reset Desktop is an open restart arrow, not a device,
  cable, chain link, telephone handset, or alarm clock.
- TikTok Catalog is a handled shopping bag, never a catalog page, social mark,
  music note, basket, or wastebasket.
- Loose Parts is a non-branded 2+1 stack of wooden blocks, never books, boots,
  clothing, a stair, bar chart, furniture, food, or a studded branded brick.

## Pixel construction grammar

- Exact `0 0 16 16`, `0 0 24 24`, and `0 0 32 32` viewBoxes.
- Integer-coordinate filled `path`, `rect`, and `polygon` primitives with
  `shape-rendering="crispEdges"`.
- Binary transparency, one-pixel transparent perimeter, filled contour bands,
  square or stair-stepped corners, and upper-left lighting.
- No strokes, fractional coordinates, transforms, smooth curves, filters,
  masks, clipping, gradients, opacity, rounded geometry, text, or brand mark.

## Exact topology contract

- Navi 24px and 32px have two opaque components: detached pin and storefront.
- Resume 24px and 32px retain only their exact compact paperclip openings.
- All remaining masters are one opaque component with no enclosed transparent
  pixels.

## Task 5 evidence lock

- **Master snapshot:** `e9f724d586c9` before this documentation-only update.
- **48-master aggregate:**
  `1177575d1c60ccc75c74c7d700e5424790a8ba7618515a0315df0fa19a34005e`.
- **Manifest:** `d58b7100f8209080eb62968306af505477726e48b6a9614f1f8fab55d9793697`.
- **Canonical sheet:**
  `bb04413d3dfb6eb47f1e257c5d3eb8442eb4534d60238bdf3ff4355243c29ba7`.
- **Labeled render:** `/private/tmp/myles98-contact-labeled-task5-v9.png`,
  `b9fb9af01b6994cb8e05e302d75657a73e96e30ef959ed90b0b32acea47c0f92`.
- **Anonymous reviewer batches:**
  - `/private/tmp/myles98-icon-anonymous-v9-batch-01.png`,
    `d5fea31332392b80df97d57aff5d37421b9b8958993818d0aadd6cae371f7e90`
  - `/private/tmp/myles98-icon-anonymous-v9-batch-02.png`,
    `e4203b67aba0ea3f723284de498f336578c78bf7607fb8418f7522e73e912663`
  - `/private/tmp/myles98-icon-anonymous-v9-batch-03.png`,
    `27561d9ca96c25b266fd91cdd1fc1ab50cea7d691f278bd35c4796e95e17b872`

The candidate passed 48-master verification, contact-sheet generation, 216
focused tests, two contact-sheet browser tests, mirror parity, binary-alpha
and perimeter audits, and an internal informed geometry, period, and family
review with P0–P3 all at zero.

The historical v7 clean-context ledger is not evidence for this aggregate:
later Email, Fresh Greens, Notes, portrait, and FAFSA edits changed master
source. The final remaining gate is two new clean-context reviewers using only
the three v8 anonymous batches. Each must name the object, give two plausible
alternatives, flag brand implication, and confirm tier continuity. Map IDs to
concepts only after both records are complete. A rejected reading, unaccepted
primary noun, brand implication, or tier mismatch blocks that family.

# Project preview layers

Each Projects cover links to its case study. Hover or keyboard focus reveals the layers. A tap or Enter opens the case study. All lettering on the spread comes from the work.

| Project | Source artwork | Arrangement |
| --- | --- | --- |
| Fresh Greens | The route, three visible line samples, route summary, road condition and Go button all come from the five-minute Weeksville preview in the November 20 Daylight Key set, captured at app commit `58bc9e2e1aafef5827398bde358add993d2c653f`. The atlas fold uses a second crop of that same map. | The route stays with the map. The destination, condition and action pull away in reading order. |
| UnderstandingFAFSA | Original orange masthead, students story, the guides page with its two PDF covers lifted out, and the newsletter footer. | The guide covers separate as a pair from the space between the story and footer in a representative weekly send. |
| Navi | Prospect Park activity source, gallery photos, listing title, reservation panel and location map. | Photograph and supporting gallery images lift together. The map and reservation come from the listing below the gallery. |
| TikTok | Original e-Boy/e-Girl, Fit Check sketch, Dopamine Dressing and Light Academia art. The peach template uses its own barcode, masthead and catalog slot bounds. | The catalog proofs fan apart, exposing the sketch and the empty product slot. The editorial title lifts off the Light Academia proof as a separate strip. |

The views are conceptual paper assemblies. Each piece keeps one camera, texture and outline throughout its movement. Physical thickness and separation are illustrative. Gennady Muzych’s [Card — Folder](https://aiuxplayground.com/inspirations/card-folder) informed the transition from a recognizable closed object to its contents.

The PNG and SVG shapes keep their drawing order so overlapping paper still reads as paper. Timing follows a separate group number. The fixed masthead and footer move together, as do the Prospect Park photo and activity name. The TikTok sketch sits lower than the neighboring templates so all three silhouettes can be recognized.

Li and colleagues show in [figure 2 and section 3.1](https://grail.cs.washington.edu/wp-content/uploads/2015/08/li2008ago.pdf#page=2) how a stable view and a few predictable directions keep parts traceable to their parent. Agrawala and colleagues study [part visibility in figure 6](https://graphics.stanford.edu/papers/assembly_instructions/). These assembly-illustration principles informed the spacing and grouping. Whether a first-time visitor understands the systems still needs a reader test. The first tap or Enter follows a native [link](https://www.w3.org/WAI/ARIA/apg/patterns/link/).

The generated sheets are checked in. To edit the four bespoke foldouts, install the optional Teardown authoring skill into this repo's `.agents/skills/teardown` from [the upstream skill](https://github.com/jakubkrehel/skills/tree/main/skills/teardown). Set `TEARDOWN_SKILL_DIR` to use an existing installation elsewhere. The standard project template and production build use the committed artwork directly.

Regenerate the crops and SVG geometry with:

```sh
node scripts/preview-layers/crop-weeksville.cjs
node scripts/preview-layers/crop-inserts.cjs
node scripts/preview-layers/build.cjs
```

## Case-study openings

The four opening animations are editorial demonstrations. The original case-study artwork supplies the resting frame. Navi reveals the current Prospect Park activity page from the local React demo, cropped below the site header and registered to the tablet screen. UnderstandingFAFSA scrolls the college-discounts story into its Related Reading section. The paper comes from the original blue phone screen and `modular-related.png`. The phone frame, notch and orange phone stay fixed. TikTok uses the three original template exports and the same catalog coordinates as the in-page inspector. Fresh Greens animates the illustrator’s original welcome drawing inside the phone, with a speech bubble drawn from the onboarding copy.

The three finite demonstrations play once and expose a Replay control. Fresh Greens has Pause for the continuously moving clouds. The static compositions support reduced motion.

# Project preview layers

Work Stuff starts with the project jacket. The Layers tab starts with the assembled model. Both open to the same spread. A mouse hover opens the jacket. Leaving the artwork restores it. Keyboard focus reveals the pieces, Escape closes them, and touch toggles them. The part names are available to screen readers. All lettering on the spread comes from the work.

| Project | Source artwork | Arrangement |
| --- | --- | --- |
| Fresh Greens | The route, three visible line samples, route summary, road condition and Go button all come from the five-minute Weeksville preview in the November 20 Daylight Key set, captured at app commit `58bc9e2e1aafef5827398bde358add993d2c653f`. The atlas fold uses a second crop of that same map. | The route stays with the map. The destination, condition and action pull away in reading order. |
| UnderstandingFAFSA | Original orange masthead, students story, the guides page with its two PDF covers lifted out, and the newsletter footer. | The guide covers separate as a pair from the space between the story and footer in a representative weekly send. |
| Navi | Prospect Park activity source, gallery photos, listing title, reservation panel and location map. | Photograph and supporting gallery images lift together. The map and reservation come from the listing below the gallery. |
| TikTok | Original e-Boy/e-Girl, Fit Check sketch, Dopamine Dressing and Light Academia art. The peach template uses its own barcode, masthead and catalog slot bounds. | The catalog proofs fan apart, exposing the sketch and the empty product slot. The ink stays printed on its sheet. |

The views are conceptual paper assemblies. Each piece keeps one camera, texture and outline throughout its movement. Physical thickness and separation are illustrative. Gennady Muzych’s [Card — Folder](https://aiuxplayground.com/inspirations/card-folder) informed the transition from a recognizable closed object to its contents.

The generated sheets are checked in. To edit the four bespoke foldouts, install the optional Teardown authoring skill into this repo's `.agents/skills/teardown` from [the upstream skill](https://github.com/jakubkrehel/skills/tree/main/skills/teardown). The standard project template and production build use the committed artwork directly.

Regenerate the crops and SVG geometry with:

```sh
node scripts/preview-layers/crop-weeksville.cjs
node scripts/preview-layers/crop-inserts.cjs
node scripts/preview-layers/build.cjs
```

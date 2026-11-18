# Case-study control visibility — November 18, 2026

Checked Fresh Greens, Navi, TikTok, and UnderstandingFAFSA in Chromium at 375px and 1440px, each with light and dark preferences. The audit focuses on visible controls and nearby labels, following the reported FAFSA arrow/X contrast problem.

## Confirmed findings and corrections

| Surface | Evidence before the fix | Correction |
| --- | --- | --- |
| Shared mobile chapter navigation | Chapter number measured 4.14:1 against the gray button in both themes. | Let the number and separators inherit the button's dark ink, matching the chapter label. |
| Fresh Greens route comparison | Disabled arrows compounded muted gray with 45% opacity and became difficult to distinguish. | Keep the disabled gray at full opacity; enabled arrows remain darker. Disabled behavior is preserved. |
| Navi interactive map | Dark preference changed the map fill to near-black while the containing card stayed light. Selectable boundaries were faint in both themes. | Use the card's paper palette, stronger selectable outlines, and a distinct blue keyboard-focus stroke. Map dimensions and geography are unchanged. |
| FAFSA Figma/Mailchimp captions | Two bold captions measured approximately 1.01:1 in dark mode. | Bind the caption headings to paper ink. |
| FAFSA mobile composer preview | Preview labels measured 2.91:1 because the preview switched to black behind paper-colored text tokens. | Keep the preview on the same paper surface as the rest of the composer. |

TikTok's template/part controls and the shared image viewer did not reproduce the reported visibility defect. Mobile navigation receives the shared fix on TikTok too.

## Verification

- All 16 route/theme/viewport combinations checked in resting and expanded/selected states, with image viewers opened where present.
- No automated text-contrast failures remained in the local full-page scans or inspected hover states.
- Exercised every TikTok template/part combination, Fresh Greens safety-sequence tabs and route-arrow endpoints, FAFSA template and annotation-layer selections, Navi map/list keyboard synchronization, mobile chapter expansion, and the embedded Navi demo landing view.
- Visually compared map boundaries, focus, and route-arrow screenshots before and after. The lightbox close-icon scan produced a compositing false positive because its dark backdrop is a sibling; rendered screenshots confirmed visibility.
- 23 targeted tests passed, including rendered contrast regressions for both themes and sizes, map behavior, route selection, and composer controls. Production build, TypeScript, and targeted ESLint passed.
- No copy, story, layout dimensions, or Navi map-size changes.

This is a focused browser visibility review, not a full accessibility-conformance or assistive-technology audit. Text inside source images and browser-native video controls was not assigned a computed contrast score.

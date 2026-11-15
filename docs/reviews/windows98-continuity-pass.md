# Visual continuity and readability — decision record

Baseline: 6e439a787da7170c80e6b07741196be2a334391a, preview dpl_822bc1WNpxP3RsZSRv9V6Y4v6grP. Production rechecked at 46b8d4b8f28df4a97a304938526fa7b8b7a739b4 / dpl_36nzK2TwvoVj3AeakepXCnPjKSf5. Work on codex/windows98-continuity-pass; no merge or production promotion.

## Standard declared before implementation

Project artwork attracts attention; title and summary explain the work; controls make the next action clear. The desktop background and inactive chrome recede. Active window title bars retain the established blue. Square geometry, upper-left bevel lighting and explicit pressed/focus states remain essential Windows vocabulary. Original project art, distinct palettes and readable case-study typography remain intact. Touch-sized controls and larger reading text are deliberate contemporary adaptations.

Cross-surface recognition depends on original subject matter and distinctive project color, not identical crops. Fresh Greens' route demonstration and original onboarding illustration serve different purposes. FAFSA's orange newsletter sheet and original two-theme phone cover explain a common system at different scales. Navi's park card and original tablet composition share the same content. Preserve these differences. TikTok's template collage and unrelated decorative blob opening require a stronger connection.

## Hypotheses, tradeoffs and acceptance criteria

1. Desktop hierarchy. Four blue action bars, a blue selected taskbar button and seven wallpaper layers create competing emphases. Compare the populated desktop with a flat teal field, then with quieter neutral project actions and a recessed light taskbar selection. Retain blue active title bar and yellow personal Start accent. Criterion: imagery becomes the primary repeated color area; links remain explicitly named, 44px tall and visibly focused/pressed; selected program remains distinguishable without color alone. Tradeoff: less decorative wallpaper and less saturated CTA emphasis. This is an art-direction judgment, not a measured usability improvement.
2. Preview framing and reading. Baseline cover box is 394.8x412px around a 16:9 SVG; FAFSA's bottom alignment makes the empty top especially conspicuous. The adjacent 263.2px text column uses 14/21px body type. Compare a slightly wider project window, balanced columns, an explicit 4:3 art frame and 16/24px summary. Criterion: source artwork remains undistorted, meaningful subjects remain visible, longest title and action fit, summary and action are available without inner clipping at desktop and portrait widths. Tradeoff: wider preview footprint; artwork crops retain intentional project differences.
3. TikTok continuity. The home resting collage obscures most of its two secondary templates; the case-study opening uses an unrelated animated decorative blob. Reveal all three source templates in the resting collage and use a static source-derived composition beside the unchanged case-study title and introduction. Criterion: all three directions identifiable before hover; no artwork behind reading text; original evidence and content unchanged; clean desktop-to-portrait stacking and no autonomous decorative animation. Preserve the original hero as a preview-only comparison. Tradeoff: less brand spectacle, more immediate presentation of the actual work.

## Control semantics

Taskbar items are window toggle buttons (aria-pressed), not tabs. Project card actions are navigation links and preview buttons. Reader chapter controls are anchor links. Newsletter variants are pressed selection buttons. Actual tabs in project exhibits retain project-specific identity and behavior unless inspection finds a defect. Do not impose a Windows tab silhouette on controls with different roles.

## References

- Microsoft, The Microsoft Windows User Experience, archived 2001 edition for Windows 98/2000: upper-left light source and restrained dimensionality (PDF pp. 315–316); taskbar buttons represent windows and restore/minimize commands (pp. 38 and 124). https://blog-geofcrowl-static-images.s3.us-east-1.amazonaws.com/2020-02-17-collection-higs/MS-Windows-User-Experience-2001.pdf
- U.S. Web Design System, Typography: assess effective text size, measure and line height together; use whitespace to express relationships. https://designsystem.digital.gov/components/typography/

Historical references guide construction; the particular teal, blue, yellow, neutral-action balance and editorial compositions are deliberate aesthetic choices. No running Windows 98 environment or independent reviewers are available.

## Browser refinements

The rendered preview favored the flat field and neutral actions. New preview artwork measures about 390x293px and the adjacent reading column about 340px at a 1363px viewport. Summary text is 16/24px; all four titles and action labels fit. TikTok's desktop facts were aligned with the new title inset after inspecting the complete composition; portrait text padding was reduced to 16px so it follows the facts column. The taskbar's horizontally scrolling button strip can clip an outside focus ring, so its ring is inset 4px, matching the card actions. These are consequences of the chosen composition, not separate redesign work.

## Independent review protocol — outstanding

Randomize matched alternatives without version labels. Ask portfolio evaluators to identify each project across home/preview/reader, locate the designer's role and supporting evidence, select a project, enter and return. Record task errors and explanations separately from visual preference. Compare one decision at a time; do not treat a small preference sample as objective proof of taste.

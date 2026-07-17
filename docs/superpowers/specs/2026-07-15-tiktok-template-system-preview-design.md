# TikTok Template System Preview

## Goal

Replace the tumbling-phone hero with a faster, clearer explanation of the three static Dynamic Showcase Ad templates Myles designed during his 2021 internship. The preview must use original artifacts, keep the current public page unchanged, and make the scope of Myles's work precise.

## Ground truth

- Official role: Creative Strategist Intern.
- Team: Global Creative Lab.
- Myles researched Y2K, Maximalism, Dark Academia, WitchTok, and Cottagecore before narrowing the landscape to three visually distinct template directions.
- The final template names were `#DopamineDressing`, `#e-Boy/#e-Girl`, and `#LightAcademia`. No secondary editorial names were used on the project.
- Myles designed three static templates as layered Photoshop files with a slot map showing where catalog assets would populate.
- Catalog products populated pre-made templates. Myles did not design the motion behavior used by the functioning ads.
- Myles built each template in parts and pitched a more modular direction while constructing them. Global Creative Lab encouraged the proposal.
- Most modular combinations worked within each template's visual system. Some Light Academia and `#e-Boy/#e-Girl` parts could mix, but no surviving hybrid artifact exists.
- Light Academia was the only one of Myles's three templates that shipped in the launch library.
- Myles later learned through Global Creative Lab that American Eagle selected Light Academia.
- Review feedback on the page is paraphrased sentiment, not a direct quotation.
- The public record confirms that DSA catalog content populated templates and that later TikTok template products allowed customization. It does not establish that Myles's modular proposal shipped.

## Preview architecture

Create a noindex route at `/work/tiktok/preview`. The route uses the same site chrome and related-work navigation as the published case study but renders the approved preview composition. The existing `/work/tiktok` route stays unchanged until Myles approves the preview.

The preview is assembled from focused components in `src/components/tiktok-dsa.tsx` or a nearby TikTok-specific component module. It uses the original SVG exports copied into `public/projects/tiktok/system/`:

- Full-template SVGs: Academia, Dopamine, and e-Boy/e-Girl.
- Original component exports: Light Academia barcode, Light Academia text, and Dopamine title.

Do not publish PSD files. Do not reconstruct a polished cross-template hybrid.

## Hero composition

Keep the dark 3D TikTok cover as the expressive opening. Tighten the extracted logo pieces so the mark reads immediately, then reduce their animation travel so the logo remains recognizable throughout the loop.

Remove the tumbling-phone image from the preview. The hero lede states the project scope in plain language and uses the formal role and team.

## Three-template contact sheet

Show all three flat template exports together before asking for interaction. Light Academia receives a small `Shipped` label, followed by the outcome that Myles later learned American Eagle selected it. Do not use an American Eagle logo or imply direct client collaboration.

Each template is a real button with a 44px minimum touch target. Selecting one opens its detailed inline view. Keyboard focus, selected state, and reduced-motion behavior are required.

## Inline exploded view

The selected template remains upright and flat. A compact control reveals four conceptual regions: title, catalog slot, supporting graphics, and TikTok interface. Use original exported components where available and a clearly labeled overlay where the PSD component was not exported separately.

The interaction explains assembly. It does not simulate motion Myles did not design, imply that every layer was interchangeable, or present a reconstructed hybrid as historical work.

## Process presentation

Rename the section `Three templates`. Use the original project names as headings. Remove `High-saturation joy`, `Edge and texture`, `Quiet and considered`, and the redundant `Working name` line.

Present the sketches on a fixed deep-slate matte in both themes. Increase their useful rendered area and keep the finished template close enough that the progression reads without a long vertical gap.

Replace blockquotes with first-person iteration notes attributed to feedback from Global Creative Lab. Preserve the paraphrased nature of the feedback.

## Candidate-facing voice

Follow `/Users/mylesashitey/.claude/writing-style-myles.md`: no em dashes, semicolons, hype words, rhetorical question-and-answer structures, or aphoristic closers. Use conversational first-person prose, concrete evidence, and candid limits.

## Accessibility and motion

- Text contrast meets WCAG AA in light and dark themes.
- Interactive controls use at least a 44px touch target on mobile.
- Every control has a visible focus state and accessible name.
- Template selection and layer selection expose state through native or ARIA semantics.
- Reduced motion removes drift, crossfade travel, and hover tilt while preserving the complete composition.

## Testing

- A route-level regression test locks the formal role, team, template names, shipped scope, and American Eagle relationship.
- Component tests verify all three templates render, selection changes the detailed view, and the shipped label belongs only to Light Academia.
- Source guards reject the retired secondary names and direct-quote styling.
- Browser verification covers 390px and 1440px in both themes, keyboard selection, reduced motion, contrast, and overflow.

# Windows 98 implementation standard

Baseline: production dpl_36nzK2TwvoVj3AeakepXCnPjKSf5; source 46b8d4b8f28df4a97a304938526fa7b8b7a739b4. Work stays on codex/windows98-visual-system and Preview deployments.

## Reference and judgment

Primary reference: Microsoft's *The Microsoft Windows User Experience* (Windows 98/2000), archived 2001 PDF, printed pp. 315, 326, 341–343, 351:
https://blog-geofcrowl-static-images.s3.us-east-1.amazonaws.com/2020-02-17-collection-higs/MS-Windows-User-Experience-2001.pdf

Historical fact: relief uses upper-left light; avoid unnecessary dimensionality. The manual distinguishes Win98 MS Sans Serif from Win2000 Tahoma and uses font-relative dialog units. No running Windows 98 instance or licensed original OS font files were available; this is not a claim of binary-exact reproduction.

Design choices: keep the existing teal/gray/blue palette and custom icon tiers. Use the existing four-tone bevel for portfolio controls, inverted for pressed/selected states. Keep square geometry, no scale/lift animation on system controls, visible keyboard focus, and 44px targets. The current Tahoma fallback stack and 18px Georgia reading text are deliberate contemporary adaptations. Project images, typography and colors inside exhibits retain their identity.

## Changes and acceptance

1. TikTok: .tt-section--wide excluded its nested prose from the 48rem column rule. Apply the same left offset to that direct body only; keep the 76rem exhibit canvas. Heading/body x positions must agree within 1px at desktop and narrow widths. Tradeoff: less asymmetry, clearer association.
2. FAFSA: replace legacy 42ch lede cap with fluid 35rem. The old width was 378px at 18px/1.7; verify browser line breaks before final acceptance. Preserve copy, type size and title. Target four balanced desktop lines without a lone final word; no narrow overflow. Tradeoff: less empty opening, earlier evidence.
3. Image delivery: LeadMedia's 900px cap understated its actual 90%-of-padded-shell display. Match sizes to the existing 22.4px side padding and 760px breakpoint. Image dimensions/crop are unchanged. Inspect currentSrc at desktop and portrait widths. Tradeoff: larger candidates consume more bytes.
4. Reader controls: explicit reader-control opt-in for Return, chapter links/toggle, TikTok template/region buttons and FAFSA variant buttons. One shared stylesheet owns material, hover, pressed, disabled and focus states, using existing desktop tokens. Accessibility preferences load afterward. Existing behavior and ARIA remain unchanged. Check real states, grayscale selection, focus visibility and forced-color fallback. Keep the wide-screen chapter rail.

## Review surface

/review/windows98 is noindex and returns 404 on Vercel production. It contains a state specimen, actual newsletter switcher and same-origin 390/430 × 844px frames of the running pages. Frames establish layout widths, not physical touch hardware or DPR 2/3. No security policy is relaxed for review.

## Independent review protocol

No external review has been performed. Give five portfolio evaluators randomized A/B captures at identical viewports, without version labels. Test each change separately. Ask for role/outcome recall, evidence interpretation and return-to-work navigation; record errors and reasons for preference. Favor coherent styling only when reading and task completion do not regress. Treat this as qualitative evidence, not statistical proof.

## Verification status

- Production revalidated: same deployment/source as baseline. Live FAFSA lede settled at 378 × 183.5625px; live TikTok heading x=290 and prose x=66. The first transient measurement during entry animation was discarded.
- First preview build READY at d047b9218fecfa4e64de79ad6204ac7fbb3b2bbb. Preview-only target; no production alias changed.
- TypeScript and targeted ESLint checks passed. LeadMedia, ReaderShell and ProjectToc: 23 tests passed. Existing ProjectToc layout suite: 9 tests passed. TikTok template and FAFSA composer suites: 17 tests passed (49 targeted tests total).
- Remote browser redirected the protected preview to Vercel account access. Automatic approval denied that navigation. It also denied creating/reusing an anyone-with-link share URL without explicit recipient-scope authorization. Protection was not disabled and no alternate browser or transport was used to evade those decisions.
- Therefore rendered after captures, final FAFSA line-break selection, mobile frame measurements, native font identification, DPR checks, real pressed/hover states, network loading and visual regression acceptance remain outstanding. Do not treat the current 35rem measure or control material as visually approved.
- An accidental Navi lede edit was found during diff review and reverted before the final revision; only FAFSA's opening measure changes.

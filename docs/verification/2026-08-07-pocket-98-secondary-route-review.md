# Pocket 98 secondary-route immersion review

**Date:** 2026-08-07  
**Trigger:** user-provided Pocket 98 screen recording (`Screen Recording 2026-08-07 at 4.41.12 PM.mov`) and direct review feedback.  
**Relationship to prior verification:** this is a follow-up to `docs/verification/2026-08-04-myles-97-verification.md`, which remains the verification record for the earlier green `d199002` implementation checkpoint.

## Observed issue

The Pocket 98 home and in-shell secondary programs read coherently, but following About, Résumé, or Loose Parts through to their canonical routes exposed the pre-Myles-98 site shell. The recording showed three specific immersion breaks:

1. The legacy portrait logo/theme-toggle header returned on `/about`, `/resume`, and `/play`.
2. The separate legacy mobile dock (`Work / About / Play / Resume / E-mail`) returned on those routes.
3. The old `← Home` breadcrumb sat well below the top-left edge because it appeared beneath the legacy header, making the return affordance feel detached from the Pocket 98 shell.

This is classified as **P1 interaction/experience continuity** for the Myles 98 release candidate: the content remained usable, but the system metaphor visibly broke at a major navigation boundary.

## Fix applied

- Added a shared `SystemDocumentShell` for canonical secondary routes.
- `/about`, `/resume`, and `/play` no longer render the legacy `SiteNav` or old breadcrumb.
- The replacement header is sticky system chrome with a 44px `← Selected Work` control anchored close to the top-left safe-area edge and document identity on the opposite side.
- `MobileNav` now treats `/about`, `/resume`, and `/play` as Myles 98-owned routes and does not render its legacy bottom dock there.
- The visible `/play` product name, route metadata, nav labels, and continuation labels are now **Loose Parts**. The canonical URL remains `/play`.
- The old `/#work` navigation target was replaced with `/#selected-work` across the touched Myles 98 navigation surfaces.
- Workstation `ProgramWindow` and hydrated Pocket 98 Selected Work both expose the stable `selected-work` anchor.
- Internal About/Résumé/Loose Parts links use Next client navigation so the route handoff stays within the same application experience.
- About and Résumé no longer retain the legacy top-margin assumption that expected the removed header/breadcrumb above them.

## Regression contracts

Focused source/component contracts now assert that:

- About, Résumé, and Loose Parts use `SystemDocumentShell` and do not render `SiteNav`/legacy breadcrumbs.
- Legacy `MobileNav` stays out of `/about`, `/resume`, and `/play`.
- Current navigation uses **Selected Work** and **Loose Parts**, not the old Work/Play labels.
- `/play` remains canonical while publishing **Loose Parts** metadata.
- Both Workstation and Pocket 98 expose a stable `#selected-work` return target.

## Build boundary

A Vercel deployment attempt after this review was rejected with the project/account **build-rate-limit** target (`upgradeToPro=build-rate-limit`). This is an infrastructure/rate-limit result, not evidence of a compile or runtime failure.

The earlier `d199002` implementation checkpoint remains Vercel-green. The secondary-route fixes in this addendum still require a fresh production build once Vercel accepts another deployment.

## Re-review target

Once a fresh deployment is available, re-record or inspect at approximately 390×844 and confirm:

- Pocket 98 home → About → full About retains Myles 98 system chrome only.
- Pocket 98 home → Résumé → full Résumé retains Myles 98 system chrome only.
- Pocket 98 Loose Parts → one full lab entry retains Myles 98 system chrome only.
- `← Selected Work` sits at the upper-left edge with a 44px target and returns to the Selected Work anchor.
- The old Work/About/Play/Resume/E-mail mobile dock never appears on those secondary routes.
- Browser Back/Forward does not reintroduce legacy chrome.

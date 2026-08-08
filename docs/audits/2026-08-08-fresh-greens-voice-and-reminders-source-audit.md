# Fresh Greens voice, story, and Reminders source audit

**Audited:** 2026-08-08
**Portfolio branch:** `codex/myles-98-visual-refinement`
**Product source:** `ashim238/fresh-greens` on `main`
**Narrative source:** `MENTORSHIP MEETING W/ JAMES CARTER` → `Screenplay: Fresh Greens`
**Purpose:** Restore Myles's voice, follow the screenplay's linear cause-and-effect story, and keep public claims inside the available evidence.

## Canonical story sources

The public case study now draws from four sources in this order:

1. Myles's annotated Fresh Greens screenplay.
2. James Carter's unresolved mentorship comments on that screenplay.
3. Myles's follow-up answers about daylight reminders, permission timing, the pulled-over feature, and how he describes the product.
4. The working Fresh Greens repository for implementation facts.

The typed evidence map remains an editorial check. It is not the public writing template.

## Linear story now used by the portfolio

The Reader page follows this sequence:

1. The personal experience that started the thesis.
2. Why six interviews were necessary.
3. The customer problems and route factors those interviews surfaced.
4. The Google Maps add-on that failed to communicate the thesis.
5. The pivot to a standalone product.
6. The daylight reminder and pulled-over feature as consequential decisions.
7. The trust model and its current limits.
8. Classmate usability feedback, the thesis-day working route demonstration, and what still needs testing.

This order follows James's central feedback: keep asking why, make the larger thesis clear, describe the current process, identify the customer problems, walk through the things to solve for, and show how the design changed.

## Myles's answers captured in the rewrite

### Why the reminder exists

The daylight reminder emerged through interviews rather than being part of the original thesis concept. Participants described families leaving a few hours before sunrise on long-haul trips to maximize daylight. Advice such as “make sure you're home before dark” appeared often enough to become a product requirement.

Myles saw long-haul planning as an involved, anxiety-inducing process: timing the trip, planning stops, avoiding less savory areas, and accounting for unknowns. The reminder is a small way to take one thing off the driver's plate once Fresh Greens identifies a better daylight window.

### Why permission waits

The notification-permission decision happened during implementation. Location and microphone access were essential enough to explain during onboarding. Notifications were not. Asking for every permission up front felt deceptive because someone might approve the request simply to finish onboarding, then forget what they granted before seeing its value.

Fresh Greens therefore waits until the driver presses Schedule, when the reason for the permission is clear. The public case study presents this as an honesty decision, not as notification-library minutiae.

### The decision Myles is proudest to explain

The pulled-over feature carries the most weight for Myles. He revised the flow repeatedly to demand as little as possible during a high-stress moment. The guidance changes with the situation and uses ACLU information. The feature earns its place when it—and hopefully never—kicks in.

### Myles's plain-language product description

Fresh Greens is a wayfinding app for Black drivers. It brings daylight, road conditions, police presence, wildlife, and community knowledge into the route decision so a driver can feel more comfortable with the route, near or far.

The portfolio avoids converting that intent into a claim that the product has already made trips safer.

## Usability and functionality evidence

### Classmate sessions

Myles put the early Figma prototype in front of classmates. They were not the intended audience, so those sessions are used only as basic usability evidence: where people hesitated, what they expected to tap, and whether the route-planning flow made sense without explanation.

The sessions do not validate the product's cultural relevance, route quality, trust model, or safety premise.

### Thesis-day demonstration

On thesis presentation day, several students entered their own addresses and received Fresh Greens routes with the daylight gradient. This is an end-to-end functionality demonstration for people other than Myles.

The public page uses Myles's phrase `Basic functionality achieved!` rather than the generic product phrase `the core loop worked`.

## What was removed or demoted

The five-minute path no longer uses these items as proof of product quality:

- `26+ screens`;
- `300 accessibility touchpoints`;
- `62 Figma variables`;
- the full Claude Code and PR workflow;
- `/superpowers` and `/impeccable` process detail;
- the route-input architecture diagram;
- an implementation inventory presented as the outcome.

Those facts may remain useful in an interview or technical appendix, but they do not carry the central story.

The route reminder was also simplified. The page now connects the interview insight, the Schedule action, the notification, and the permission decision without a three-step evidence exhibit or equal emphasis on refuel-notification mechanics.

## Voice rules

Public copy should:

- start from Myles's original or historically approved wording;
- use concrete memories and decisions before abstractions;
- explain why a decision changed, not merely what component was built;
- retain natural phrases such as `I was disheartened, but it made sense`, `I tweaked it a bunch`, and `hopefully never` when they fit;
- keep caveats close without repeating compliance-style syntax;
- use implementation detail only when it reveals judgment.

Avoid stock constructions such as:

- `This wasn't just X. It was Y.`
- `I set out to...`
- `At the intersection of...`
- `Leveraging insights...`
- `The goal was to create a seamless...`
- `The core loop worked.`
- repeated `This proves... but does not prove...` sentences.

## Evidence boundary

The current evidence supports these statements:

- six interviews shaped the problem and route criteria;
- classmates helped identify basic usability issues in the Figma prototype;
- thesis-day participants entered addresses and generated Fresh Greens routes;
- the working prototype contains route comparison, contextual reminders, pulled-over support, community reporting, and moderation behavior.

It does not yet establish:

- that a recommended route is safer;
- that reminders change departure behavior;
- that the pulled-over flow improves a real encounter;
- that Black drivers trust the recommendations;
- that the trust and moderation model works across regions or at scale.

## Freeze boundary

Do not reconstruct the public story from the evidence map again. Future edits should begin with the screenplay and Myles's language, then use the map only to check claims, ownership, and caveats. Reopen the story only when new research, testing, or a specific comprehension problem justifies it.

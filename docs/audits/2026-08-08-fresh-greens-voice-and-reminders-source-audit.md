# Fresh Greens voice and Reminders source audit

**Audited:** 2026-08-08
**Portfolio branch:** `codex/myles-98-visual-refinement`
**Product source:** `ashim238/fresh-greens` on `main`
**Purpose:** Restore Myles's voice without weakening claim accuracy, and add the omitted Reminders behavior from the working prototype.

## What changed in this slice

The Plan chapter now includes a bounded Reminders artifact built from implemented behavior:

- the route preview offers `Schedule for [suggested time]` when a different departure preserves more daylight;
- notification permission is requested only after the driver chooses Schedule;
- the phone stores one local notification for the suggested departure;
- the implemented notification says `Time to head out` and explains that leaving now provides more daylight;
- the same local-notification layer supports recurring and distance-triggered refuel or recharge reminders.

The public artifact uses the existing `route-preview.png` capture and a clearly labelled reconstruction of the implemented notification copy. It does not claim that the reminder changes behavior or makes a route safer.

The recruiter summary no longer presents `26+ screens` as the outcome. It names the connected product behaviors instead.

## Voice diagnosis

The current case study became more accurate during the evidence pass, but several passages began to sound like a visible argument map rather than a person explaining their work. The recurring symptoms are:

- repeated proof disclaimers using nearly identical syntax;
- compressed transitions that tell the reader what a paragraph means before letting the story show it;
- abstract portfolio language replacing concrete memories or design decisions;
- uniformly polished sentence length and cadence;
- implementation lists standing in for what Myles found surprising, difficult, or personally important.

The evidence map should remain the private editorial guardrail. It should not dictate the public prose rhythm.

## Recovered Myles-approved voice markers

Commit `15069530db1b5f9b10cb394658f4ddf98c9549d3` records edits explicitly described as Myles's revisions. Useful signals include:

- prefer `Black travelers` to the more abstract `Black travel`;
- name the real missing information: `Which block did someone mark unsafe last week that the city's data hasn't caught?`;
- explain technical behavior plainly: `same inputs of street data, daylight calculations, and community reports always produce the same routing decision`;
- describe research synthesis as something participants already carried: `They had a working taxonomy, one that could be translated to something tangible if done correctly`;
- connect features to the interview structure directly: `The four things the app scores routes against are the four markers that recurred across the conversations`;
- remove performative design language such as `design's job was to listen for it`.

Additional earlier language worth considering, without automatically restoring it verbatim:

- `A lineage older than the app store.`
- `Six interviews. Four markers. Four features.`
- `The categories the app flags are the categories drivers told me they already watch for.`

The pattern is concrete, conversational, and specific. It does not avoid emotion or technical detail, but it does avoid narrating design virtue.

## Source-backed Reminders decisions

### Departure reminder

The product source ties the reminder to the daylight model rather than presenting a generic notification toggle. The route card shows Schedule only when it has a meaningful suggested departure. The reminder is one-shot and local to the device.

### Permission timing

The app asks for notification access at the moment the driver selects Schedule. It does not make notification permission part of onboarding. This is a meaningful product decision because the request is attached to an immediately understandable benefit.

### Refuel and recharge reminders

The notification layer also supports:

- recurring time-based reminders;
- immediate distance-triggered reminders;
- gas or electric language;
- a trusted or on-route stop name when one is available.

The primary case-study artifact stays focused on the daylight reminder because it is closest to the Plan argument and has an existing route-preview capture. Refuel behavior is mentioned as supporting scope rather than being given equal visual weight without a dedicated capture.

## Public-copy rule for the next pass

For each paragraph:

1. Start from Myles's original or historically approved wording.
2. Add product-source facts only where they clarify what changed or what was built.
3. Ask Myles when intent, emotion, chronology, or authorship cannot be established from the source.
4. Run the final wording against the evidence map.
5. Keep caveats close to the claim, but vary the phrasing so the page does not read like a compliance document.

Avoid stock constructions such as:

- `This wasn't just X. It was Y.`
- `I set out to...`
- `At the intersection of...`
- `Leveraging insights...`
- `The goal was to create a seamless...`
- repeated `This proves... but does not prove...` sentences in public prose.

## Questions for Myles before the full voice rewrite

These are the remaining details that source code cannot answer reliably:

1. Was the daylight departure reminder part of the thesis concept, or did it emerge later while you were building the product?
2. What problem did you personally think the reminder solved: forgetting the window, avoiding another planning session, reducing anxiety before leaving, or something else?
3. Was requesting notification permission only after Schedule an intentional design principle from the start, or a decision you made during implementation?
4. Which Fresh Greens decision are you proudest to explain in an interview, even if it is not the flashiest artifact?
5. In two informal sentences, how would you describe Fresh Greens to another designer who asked what you made and why?

These questions should guide the rewrite; they do not block the factual Reminders artifact.

## Freeze boundary

Do not rewrite the entire case study from the evidence map again. The next editorial pass should be collaborative, beginning with the five questions above and the recovered Myles-approved language. The typed map remains unchanged unless new source material alters a claim, proof, caveat, or ownership boundary.

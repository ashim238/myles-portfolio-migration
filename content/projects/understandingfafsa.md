---
slug: understandingfafsa
title: UnderstandingFAFSA
summary: Redesigned a newsletter system to match a fresh site rebrand—modular templates, competitive research across 120+ examples, and a 75% lift in open rates.
role: Product Designer
timeframe: February 2025 - Ongoing
status: published
order: 2
coverImage: /projects/understandingfafsa/cover.png
highlightQuote: The newsletter should feel as trustworthy and modern as the newly rebranded website.
outcomeMetricLabel: open rate after redesign (MPP excluded)
outcomeMetricValue: ~52.6%
tags:
  - Product Design
  - Content Design
  - Email Design
sections:
  - title: Context
    body: |
      UnderstandingFAFSA helps students, parents, and counselors navigate the Free Application for Federal Student Aid (FAFSA). The newsletter is a primary touchpoint. The website had already moved to a calmer, modern visual language (Saans typeface, refreshed palette), but the newsletter still carried an older system — subscribers were seeing two different brands. The scope was email-only; the founder assembles every issue, so the system had to maintain the brand's identity regardless of who was building it.

  - title: The Problem
    body: |
      The old template failed where busy readers notice first: uneven CTAs, a muted palette that didn't carry the rebrand, long unscannable stretches of text, weak section breaks, and a layout that wasn't optimized for mobile users. Open rates sat around **~30%**.

      If email stayed weak, people would miss deadline-driven guidance at key checkpoints: FAFSA filing windows, scholarship deadlines, policy changes. The channel needed the same credibility the site had worked to develop.
    images:
      - src: /projects/understandingfafsa/mobile-after.jpg
        alt: Old newsletter template on mobile before the redesign.
      - src: /projects/understandingfafsa/mobile-before.jpg
        alt: Redesigned newsletter on mobile with updated hierarchy and brand system.

  - title: Competitive Audit
    body: |
      Before touching templates, we compiled over **120 newsletter examples** and evaluated them against four criteria: clarity, personalization, tone of voice, and visual appeal and branding consistency.

      Five newsletters got the deepest treatment: Revenews, The 74, Next by Jeff Selingo, Medium, and Folderly. Each newsletter adopted a different approach to the same problem: making a recurring email feel worth opening.

      The rest of the newsletter pool served as lighter references for layout, color, and hierarchy patterns.

      The deep dive highlights:

      - All five newsletters leveraged selective type bolding to create visual entry points without adding imagery — Revenews used this well with emoji section headers and concise intros
      - Custom bespoke bulletpoints that reinforced brand identity in the smallest details, like Folderly's use of brand-colored accents
      - Action-focused section titles that turned bulk information into content readers could parse in a single scroll
      - Tone calibration by audience: student-facing emails could carry emojis and GIFs; counselor-facing emails needed the more earnest, formal register we saw in The 74
      - Personalization through structure: Next's if/then link framing ("if you're looking for help with X, then...") gave readers agency, and author photos with brief bios made the sender feel human

      From there we put our own spin on it—adapting these patterns to UnderstandingFAFSA's voice, the founder's preference for vibrancy, and the practical constraint that a non-designer would assemble every issue.

  - title: Building the System
    body: |
      The system ships four template types through a shared modular framework: a welcome email that sets expectations on frequency and content, the core weekly newsletter, a lighter ICYMI/event variant with fewer blocks and faster assembly, and a counselor-focused toolkit with a more professional tone—duotone icons instead of emojis.

      The welcome email follows a deliberate structure shaped by the audit. It includes a banner, gratitude, what to expect, a brief history that transitions into the current mission, a CTA, suggested reading, and social links. It's the subscriber's first impression of the redesigned brand.

      Template work lived in Figma and Mailchimp. The founder drafts each week's copy for editorial. Editors swap body copy and emoji-style section images. Spacing, dividers, type, and the structural skeleton stay locked so swaps don't quietly undo the brand.

      Color variants were chosen to stay in harmony with UnderstandingFAFSA's design system. The locked-vs-swappable distinction was the core design decision: enough flexibility for the founder to move fast, enough rigidity that no send drifts off-brand.
    colors:
      - "#be5abf"
      - "#164f73"
      - "#82c5fb"
      - "#f2b544"
      - "#f26938"
      - "#2fac38"
      - "#6d2161"
      - "#2788c1"
      - "#48d1c7"
      - "#004aad"
      - "#e572e4"
      - "#7100bf"
    images:
      - src: /projects/understandingfafsa/modular-header.png
        alt: Redesigned newsletter header block with orange brand palette and cap icon.
      - src: /projects/understandingfafsa/modular-students.png
        alt: Student-focused content block with audience segmentation for juniors and seniors.
      - src: /projects/understandingfafsa/modular-best.png
        alt: Curated reading block with trophy icon and branded link styling.
      - src: /projects/understandingfafsa/modular-related.png
        alt: Related reading section with news icon and orange link accents.
      - src: /projects/understandingfafsa/modular-reading.png
        alt: Scholarship and college cost content block with structured bullet points.
      - src: /projects/understandingfafsa/modular-guides.png
        alt: Guide cards section linking to downloadable resources.
      - src: /projects/understandingfafsa/modular-closer.png
        alt: Footer block with subscribe CTA, social links, and The New School branding.

  - title: Figma to Mailchimp
    body: |
      The hierarchy, spacing, modular rhythm all lived in Figma, but the live template had to be rebuilt in Mailchimp so the founder could edit without touching HTML. Matching Figma spacing inside the builder was a dead end; every container and wrapper added bloat. I reframed hierarchy so section headers and body read clearly in email, not on a static artboard.

      Gmail's **102KB HTML ceiling** and clipping created a rigid constraint. Early weight came from custom section icons and themed dividers exported from Figma. The fix arrived through test sends, stripping redundant wrappers and dividers, merging sections where it still scanned, and compressing PNGs through an external tool. For dark-mode-friendly dividers, I removed backgrounds in Photoshop so assets stayed lighter without muddying on phone.

      Compression wasn't one recipe. The weekly kit leaned on fewer custom assets and more Mailchimp-native structure. The counselor toolkit needed more image work and tighter file discipline for its duotone icons. What I wouldn't trade for a few kilobytes: typography tuned to the closest Mailchimp sans to the site's Saans typeface, and the full brand palette—even when trying to maintain the founder's appetite for vibrancy.

      We tested as the template evolved: the founder could tell async whether she could maintain it. Figma-forward or HTML-line-by-line workflows wouldn't have stuck; Mailchimp modules did.
    images:
      - src: /projects/understandingfafsa/figma-design.jpg
        alt: Figma design showing the content section layout and typography before Mailchimp translation.
      - src: /projects/understandingfafsa/shipped-mailchimp.jpg
        alt: Shipped Mailchimp template with emoji section headers, branded CTA, and wave dividers.

  - title: Results
    body: |
      What's out in the open: master template, modular blocks, explicit locked-vs-swappable rules, and three template variants on the same design vocabulary.

      First redesigned send **November 4, 2025**. Open rates moved from **~30% to ~52.6%** (Mailchimp reporting with MPP excluded), with clicks, bounces, and unsubscribes still in a healthy band.

      The counselor-focused toolkit—extending the same system for a more professional audience—is nearly complete and shipping soon.

      The Mailchimp template set the structure for what non-web asset creation could look like.
---

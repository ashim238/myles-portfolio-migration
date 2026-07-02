import type { Metadata } from "next";
import { ExpandableImage } from "@/components/expandable-image";
import { ProjectCover } from "@/components/project-cover";
import { TransitionLink } from "@/components/transition-link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import {
  ArchitectureDiagram,
  DaylightLegend,
  PhoneFrame,
  SignalSwatches,
} from "@/components/fresh-greens";
import { Device3D } from "@/components/device-3d";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getPublishedProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Fresh Greens",
  description:
    "A graduate thesis: a routing problem that asks whose safety knowledge counts. Community observations flow through the same pipeline as OpenStreetMap, DOT-511, OSRM, and SunCalc, weighted the same way.",
  openGraph: {
    title: "Fresh Greens",
    description:
      "A graduate thesis: a routing problem that asks whose safety knowledge counts.",
    type: "article",
  },
};

function Shot({ name, alt }: { name: string; alt: string }) {
  return (
    <ExpandableImage
      src={`/projects/fresh-greens/v2/${name}.png`}
      alt={alt}
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

export default async function FreshGreensPage() {
  const allProjects = await getPublishedProjects();

  return (
    <main
      className="page-shell project-page fg-page"
      id="main-content"
      data-project-slug="fresh-greens"
    >
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <TransitionLink href="/#work">
          <span aria-hidden="true">← </span>
          Selected work
        </TransitionLink>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero project-hero fg-hero" aria-labelledby="fg-title">
        <p className="fg-eyebrow">Graduate thesis · 2026</p>
        <h1 id="fg-title" className="project-hero-title fg-title">
          Fresh Greens
        </h1>
        <p className="project-hero-lede fg-lede">
          A wayfinding app for Black drivers in America, built solo as a
          graduate thesis. The argument is narrower than &quot;an app for
          safety&quot;:{" "}
          <mark className="case-highlight">whose safety knowledge counts when the route is computed?</mark>{" "}
          Fresh Greens answers by running community observations through the
          same pipeline as OpenStreetMap, DOT-511, OSRM, and SunCalc,
          weighted the same way. Six driver interviews shaped the routing
          signals.
        </p>
      </section>

      {/* ── Section 2: The argument ──────────────────── */}
      <section className="project-section fg-section" aria-labelledby="fg-argument">
        <h2 id="fg-argument">Whose knowledge counts.</h2>
        <div className="project-section-body">
          <p>
            The Green Book guided Black travelers across mid-century America
            by cataloguing the homes, restaurants, and stops where they&apos;d
            be received in safety. It was a routing system built on community
            knowledge because no institutional one existed.
          </p>
          <p>
            Fresh Greens returns to that question with today&apos;s data
            stack. Community observations don&apos;t sit next to public data
            as an editorial layer. They flow through the same adapter, the
            same scoring, and the same audit trail.
          </p>
        </div>
      </section>

      <ProjectCover
        src="/projects/fresh-greens/cover.png"
        alt="Fresh Greens cover: a route preview map showing a daylight-graded path from Brooklyn to southern New Jersey"
        priority
      />

      {/* ── Project meta ─────────────────────────────── */}
      <dl className="project-meta fg-meta" aria-label="Project details">
        <div className="project-meta-field">
          <dt>Role</dt>
          <dd>Solo · design + engineering</dd>
        </div>
        <div className="project-meta-field">
          <dt>Stack</dt>
          <dd>React Native · Expo · TypeScript · Supabase</dd>
        </div>
        <div className="project-meta-field">
          <dt>Timeline</dt>
          <dd>Sep 2025 – Jun 2026</dd>
        </div>
      </dl>

      <ProjectToc
        sections={[
          { title: "Whose knowledge counts", id: "fg-argument" },
          { title: "The pipeline is the answer", id: "fg-pipeline" },
          { title: "The Held-Question Rule", id: "fg-held-question" },
          { title: "The material of calm", id: "fg-material" },
          { title: "Reserved color that holds", id: "fg-color" },
          { title: "Where the argument gets tested", id: "fg-moderation" },
          { title: "Six interviews, four markers", id: "fg-interviews" },
          { title: "Honest scope", id: "fg-scope" },
        ]}
      />

      {/* ── Section 3: The pipeline is the answer ────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-pipeline"
      >
        <h2 id="fg-pipeline">The pipeline is the answer.</h2>
        <div className="project-section-body">
          <p>
            Every route in Fresh Greens is scored against four markers that
            surfaced in the driver interviews: light (SunCalc daylight
            gradient), police presence, wildlife crossings (OpenStreetMap),
            and road conditions (DOT-511, OSRM). Community reports feed the
            same four markers.
          </p>
          <p>
            They&apos;re not a separate feed with their own view. They pass
            through <mark className="case-highlight">the same adapter, the same scoring function</mark>, and land on
            the same route-preview strip that OpenStreetMap does. Weighted
            the same way. Attributable the same way. Both paths carry the
            source of the score, so the driver can see whether a segment
            scored low because SunCalc says so or because someone in the
            community reported something.
          </p>
        </div>

        <ArchitectureDiagram />

        <div className="project-section-body">
          <p>
            The en-route screen is where the pipeline shows up at once: a
            turn card with the maneuver and any hazard glyph, a 3D map, and
            the safety column down the right edge. All inside thumb reach.
            Drag the phone to turn it.
          </p>
        </div>
        <Device3D
          screen="/projects/fresh-greens/v2/en-route.png"
          alt="Fresh Greens en-route screen running on an iPhone: a turn card reading 'Head out on Spencer Street,' a 3D map, and a side column for Guide, SOS, Safety, Report, and Recenter."
        />
      </section>

      {/* ── Section 4: The Held-Question Rule ────────── */}
      <section
        className="project-section fg-section"
        aria-labelledby="fg-held-question"
      >
        <h2 id="fg-held-question">The Held-Question Rule.</h2>
        <div className="project-section-body">
          <p>
            <mark className="case-highlight">Every in-modal prompt in Fresh Greens is set in Libre Franklin
            Regular. Not Bold.</mark> The safety modal asks &quot;What&apos;s going
            on?&quot; The share-location sheet asks &quot;What&apos;s the
            situation?&quot; The Lifeline modal says &quot;You&apos;re not
            alone.&quot;
          </p>
          <p>
            Regular weight is a held register. A driver who just got pulled
            over doesn&apos;t need an app displaying &quot;REPORT
            INCIDENT&quot; at them in a heavier weight than the ambient text.
            Franklin Regular puts the prompt in the same weight as the
            driver&apos;s own thinking.
          </p>
          <p>
            The rule came out of the driver interviews. Respondents described
            the moments where the app would matter most as high-pressure
            situations that needed something closer to a companion than a
            control interface. Regular-weight prompts hold that register.
            Bold shows up only on the numbers the app is confident about
            (mileage, ETA, the <code>/emergency</code> countdown), and
            nowhere else in the safety flow.
          </p>
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="safety-toolkit"
              alt="The /safety toolkit modal opening with 'What's going on?' set in Libre Franklin Regular over a 2x2 grid of Pulled-over, Roadside, Unfamiliar area, and Share location"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            The Held-Question Rule in situ. <code>/safety</code> opens with
            the driver&apos;s question, not the app&apos;s command.
          </figcaption>
        </figure>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="pulled-over-guidance"
              alt="The /pulled-over guidance state with ACLU-sourced rights in plain language, a Read-aloud toggle, and a live recording indicator"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            <code>/pulled-over</code> carries the ACLU rights guidance in
            plain language, in Regular weight. The recording indicator is
            the one exception red is allowed to make.
          </figcaption>
        </figure>

        <div className="project-section-body">
          <p>
            The other four safety surfaces (<code>/roadside</code>,{" "}
            <code>/unfamiliar</code>, <code>/share-location</code>, and{" "}
            <code>/emergency</code>) follow the same voice. Each is a
            first-class route with its own state machine. None depend on a
            live network connection.
          </p>
        </div>
      </section>

      {/* ── Section 5: The material of calm ──────────── */}
      <section
        className="project-section fg-section"
        aria-labelledby="fg-material"
      >
        <h2 id="fg-material">The material of calm.</h2>
        <div className="project-section-body">
          <p>
            Fresh Greens replaces iOS&apos;s default cool grays with{" "}
            <mark className="case-highlight">five warm surfaces, all derived in OKLCH at 0.008 to 0.012 chroma on
            the brand-green hue</mark>. Page, card, sheet, elevated, and tinted.
            The neutrals across the whole app share a single tonal source
            instead of tracking the platform&apos;s default gray ramp.
          </p>
          <p>
            Type does the same work. Libre Franklin carries the whole
            hierarchy from display through caption. DM Serif Display appears
            in six places: the emergency reassurance line, the{" "}
            <code>/trip-summary</code> &quot;Thanks for sharing,&quot; the
            sign-out farewell, and three other moments of similar emotional
            weight. Reserving the serif for those six lines is what keeps
            them visible against Franklin&apos;s rhythm elsewhere.
          </p>
          <p>
            The two disciplines combine into an emotional arc that runs the
            whole session. Calm entry at auth. Warm onboarding. Steady
            cruising on home and search. Heightened attention en-route.
            Crisis response through the safety toolkit. Resolution on{" "}
            <code>/trip-summary</code>, where DM Serif returns. The arc is
            planned as six discrete phases so the type and the color both
            have specific work to do at each one.
          </p>
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="emergency"
              alt="The /emergency screen with a Franklin Bold countdown numeral, the largest type in the app, and DM Serif reassurance text"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            The <code>/emergency</code> countdown is the largest type in the
            app. Bold is reserved for the number the driver needs to read at
            a glance.
          </figcaption>
        </figure>
      </section>

      {/* ── Section 6: Reserved color that holds ─────── */}
      <section
        className="project-section fg-section fg-craft"
        aria-labelledby="fg-color"
      >
        <h2 id="fg-color">Reserved color that holds.</h2>

        <div className="project-section-body">
          <p>
            The brand greens carry every CTA, every link, every interactive
            affordance. Red, orange, yellow, and navy are reserved for safety
            signals only, each tied to one specific meaning. Because those
            four colors are reserved, a red dot or an orange chip in the app
            points to something specific. Across 20+ screens and hundreds of
            accessibility attributes, <mark className="case-highlight">the rule holds without exception</mark>.
          </p>
        </div>

        <SignalSwatches />

        <div className="project-section-body">
          <p>
            Where color IS the signal, a second channel rides alongside it.
            On <code>/report</code>, severity pairs a filled WarningDiamond
            glyph with the color, so the cue survives for anyone who
            can&apos;t lean on hue alone (WCAG 1.4.1).
          </p>
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="report-detail"
              alt="A report detail card showing severity chips for Threatened, Followed, Harassed, Uncomfortable, and Uneasy vibe, pairing a filled warning-diamond glyph with color"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            Severity rides two channels: color plus the filled
            WarningDiamond glyph. The rule survives even without hue.
          </figcaption>
        </figure>

        <div className="project-section-body">
          <p>The exceptions are worth naming, because each one is defended by contrast math.</p>
          <p>
            Error text on light surfaces uses a darker error red
            (severityCritical, roughly 5.6:1 against white) instead of the
            iOS default #FF3B30 (roughly 3.5:1, which fails AA for body
            copy). Same color role, different token, chosen because the
            contrast math forced it. Error signals (the dot, the pill) still
            use the iOS red because they&apos;re not body copy. On the dark
            auth screens the AA argument inverts, so error text there stays
            iOS red, with in-code annotations naming the split.
          </p>
          <p>
            The recording indicator on <code>/pulled-over</code> pulses red
            because a live audio-capture state is exactly what red is
            reserved for. Destructive-action labels use red for the same
            reason.
          </p>
        </div>

        <DaylightLegend />
      </section>

      {/* ── Section 7: Where the argument gets tested ── */}
      <section
        className="project-section fg-section"
        aria-labelledby="fg-moderation"
      >
        <h2 id="fg-moderation">Where the argument gets tested.</h2>
        <div className="project-section-body">
          <p>
            The pipeline&apos;s claim is that community reports get scored
            the same way as public data. What tests that claim is the queue
            where bad-faith reports, mistaken reports, and reports about
            someone else&apos;s identity have to be handled without
            collapsing back into &quot;we don&apos;t trust community
            data.&quot; That queue is <code>/moderation</code>.
          </p>
          <p>
            Moderator role is gated. Every report enters the queue with an
            investigation panel: source device fingerprint, prior reports at
            the same coordinates, nearby reports via haversine distance,
            coordination detection for IP and device-duplicate patterns, and
            timestamps that show whether a report is retaliation for
            another. Bulk-select handles spam with per-request{" "}
            <code>Promise.allSettled</code> inspection. Destructive actions
            require a hold-to-remove gesture. Nothing gets published without
            a human decision, and the audit trail follows every publish and
            every unpublish.
          </p>
          <p>
            <mark className="case-highlight">
              /moderation is where &quot;whose knowledge counts&quot; gets
              renegotiated
            </mark>{" "}
            with real reports and real stakes. A v2 transparency page will
            publish moderation outcomes so the queue&apos;s work is auditable
            outside the queue.
          </p>
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="moderation"
              alt="A /moderation queue item expanded to show the investigation panel with submitter history, nearby reports, and coordination-detection flags"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            An expanded queue item, showing the investigation panel each
            report enters with.
          </figcaption>
        </figure>
      </section>

      {/* ── Section 8: Six interviews, four markers ──── */}
      <section
        className="project-section fg-section"
        aria-labelledby="fg-interviews"
      >
        <h2 id="fg-interviews">Six interviews, four markers.</h2>
        <div className="project-section-body">
          <p>
            Six semi-structured interviews with Black drivers across the
            Southern US grounded the whole project. The four traces below
            carry the most weight in the shipped app.
          </p>
        </div>

        <figure className="fg-pullquote">
          <blockquote>
            Moments of joy and fear have a lasting effect on how Black drivers
            interpret the spaces they inhabit. They stick.
          </blockquote>
          <figcaption>Thesis · Fresh Greens, 2026</figcaption>
        </figure>

        <div className="project-section-body">
          <h3 className="fg-h3">Daylight as a first-class input.</h3>
          <p>
            Factoring light into a routing decision came up in almost every
            conversation. Drivers described leaving before sunrise on long
            trips so there&apos;d be daylight at the destination, and
            choosing gas stations with lit cashier windows over darker
            options. One respondent named daylight explicitly as a factor
            they routed against. That became the SunCalc gradient: a
            per-segment daylight score baked into scoring, not a night-mode
            toggle. SunCalc&apos;s model shifts with latitude, which matters
            because the drivers who mentioned it were routing across states.
          </p>

          <h3 className="fg-h3">
            The voice at <code>/pulled-over</code>.
          </h3>
          <p>
            Respondents talked about being wary and cautious around law
            enforcement, and named the behaviors they&apos;d been taught by
            family and community to stay safe. Drivers described those
            moments as high-pressure and named what they wanted from any
            tool present: a voice that felt human, not a UI they had to
            operate. That&apos;s the observation that produced the
            Held-Question Rule, and it&apos;s why the ACLU-sourced{" "}
            <code>/pulled-over</code> language sits in Libre Franklin Regular
            rather than a bold warning banner.
          </p>

          <h3 className="fg-h3">Community as the authority.</h3>
          <p>
            The six report categories exist because the interviews kept
            surfacing two overlapping habits:{" "}
            <mark className="case-highlight">
              skepticism of the authorities and reliance on community members
            </mark>{" "}
            for the ground truth of a place. Drivers already asked around before entering an unfamiliar
            area. The report picker turns that habit into a first-class
            input. &quot;Felt welcome&quot; and &quot;Black-owned&quot; sit
            next to &quot;Incident&quot; and &quot;Hazard&quot; because a
            positive signal is data the next driver can use, and because a
            category system that only allows negative reports fails to
            capture the community knowledge that was actually described.
          </p>

          <h3 className="fg-h3">Where I had to step back.</h3>
          <p>
            My first instinct after the interviews was to load the interface
            with as many safety layers as possible: zone-entry stroke
            variants on the route line, warning chips stacked across every
            screen, ambient alerts. What the interviews also said, quietly,
            was that driving already takes focus, and a safety app that
            stacks alerts on top of that is asking the driver to hold more
            than they can. I scaled back. The safety toolkit stays hidden
            until a driver reaches for it. The route preview shows the
            daylight strip and the zone chips and nothing more.
          </p>
        </div>
      </section>

      {/* ── Section 9: Honest scope ──────────────────── */}
      <section className="project-section fg-section fg-scope" aria-labelledby="fg-scope">
        <h2 id="fg-scope">Honest scope.</h2>
        <div className="project-section-body">
          <p>
            Naming what isn&apos;t done is part of the thesis stance. Honesty
            of disclosure applies to the case study, not only the product.
          </p>
        </div>

        <div className="fg-scope-grid">
          <div className="fg-scope-col">
            <p className="fg-scope-label">Shipped</p>
            <ul className="fg-scope-list" role="list">
              <li>
                Equal-weighting routing pipeline across OpenStreetMap,
                DOT-511 network incidents, OSRM, SunCalc, and community
                reports
              </li>
              <li>Daylight-graded route polyline with a WCAG dash pattern</li>
              <li>
                Community-first discovery and the six-category report picker
              </li>
              <li>
                Six-surface safety toolkit, with <code>/pulled-over</code>{" "}
                carrying ACLU-sourced guidance and on-device audio capture
              </li>
              <li>
                Mapbox turn-by-turn navigation with a four-layer fallback
                chain: Mapbox → OSRM public demo → local route cache →
                mocked response. The cache is the real offline layer, which
                matters where signal is patchy
              </li>
              <li>
                Two-font system: Libre Franklin across the hierarchy, DM
                Serif Display reserved for six emotional-payoff moments
              </li>
              <li>
                Warm surface ramp (5 OKLCH surfaces at 0.008 to 0.012 chroma
                on the brand-green hue) applied across 26+ screens
              </li>
              <li>
                Reserved-color discipline holding across 300+ accessibility
                attributes, with documented WCAG-math carve-outs
              </li>
              <li>
                Departure-reminder local notifications with permission asked
                in-context, not eagerly at onboarding
              </li>
              <li>
                Delight layer: arrival-moment animation,
                community-confirmation micro-interaction, sign-out
                illustration, context-specific loading copy
              </li>
              <li>
                Supabase community cloud with anonymous device-UUID auth and
                Postgres row-level security
              </li>
              <li>
                <code>/moderation</code> queue with per-report investigation
                panels (submitter history, nearby reports via haversine
                distance, coordination detection for IP and device-duplicate
                patterns), bulk-select with per-request{" "}
                <code>Promise.allSettled</code> inspection, and hold-to-remove
                destructive gestures
              </li>
              <li>
                Design system published as a Figma library: 62 variables in a
                one-mode Color collection with 1:1 parity to{" "}
                <code>theme/colors.ts</code>, scoped per token role, WEB +
                iOS code syntax
              </li>
            </ul>
          </div>
          <div className="fg-scope-col">
            <p className="fg-scope-label">Next, v2</p>
            <ul className="fg-scope-list" role="list">
              <li>
                Moderator-role bootstrap automation (currently a manual SQL
                insert in prod)
              </li>
              <li>
                Push notifications for new moderator-queue items (local
                notifications ship today, remote push doesn&apos;t yet)
              </li>
              <li>
                Public transparency page for <code>/moderation</code>{" "}
                activity
              </li>
              <li>Broader on-device test matrix beyond iPhone</li>
            </ul>
          </div>
        </div>

        <div className="project-section-body" style={{ marginTop: "2.4rem" }}>
          <p>
            <mark className="case-highlight">Typography took three tries.</mark>{" "}
            Jost first, then Space Grotesk, then Libre Franklin with DM
            Serif Display reserved for the six emotional beats. Franklin
            held the register the earlier two couldn&apos;t.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

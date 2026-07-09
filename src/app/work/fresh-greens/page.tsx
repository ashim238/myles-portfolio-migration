import type { Metadata } from "next";
import { ExpandableImage } from "@/components/expandable-image";
import { LeadMedia } from "@/components/lead-media";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import {
  ArchitectureDiagram,
  PhoneFrame,
  ReservedPalette,
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

      <LeadMedia
        cover="/projects/fresh-greens/cover.png"
        alt="Fresh Greens cover"
      />
      <RecruiterCut
        problem="Routing engines optimize for time and distance, not for whose safety knowledge counts."
        role="Solo, design and engineering"
        timeline="Sep 2025 – Jun 2026"
        stack="React Native, Expo, TypeScript, Supabase"
        outcomeValue="62"
        outcomeLabel="design tokens shipped as a Figma library, 1:1 with the app's theme"
        moves={[
          "Ran community safety reports through the same pipeline as OpenStreetMap, DOT-511, OSRM, and SunCalc, weighted the same way.",
          "Built the en-route screen around one-thumb reach: turn card, 3D map, and a safety column.",
          "Held the reserved-color rule across 26+ screens and 300+ accessibility attributes.",
          "Shaped the routing signals from six driver interviews.",
        ]}
      />

      <ProjectToc
        sections={[
          { title: "The problem I set out to solve", id: "fg-problem" },
          { title: "Listening to six drivers", id: "fg-research" },
          { title: "How routes get scored", id: "fg-scoring" },
          { title: "Designing for the pulled-over moment", id: "fg-pulled-over" },
          { title: "Type and color", id: "fg-typecolor" },
          { title: "The reserved color system", id: "fg-color" },
          { title: "Keeping community reports trustworthy", id: "fg-trust" },
          { title: "What shipped, and what didn't", id: "fg-scope" },
        ]}
      />

      <div className="case-tier-divider"><span>The full breakdown ↓</span></div>

      {/* ── Section 1: The problem I set out to solve ── */}
      <section className="project-section fg-section" aria-labelledby="fg-problem">
        <h2 id="fg-problem">The problem I set out to solve.</h2>
        <blockquote className="case-pullquote">The Green Book was a routing system built on community knowledge, because no institutional one existed.</blockquote>
        <div className="project-section-body">
          <p>
            The Green Book guided Black travelers across mid-century America
            by cataloguing the homes, restaurants, and stops where they&apos;d
            be received in safety.
          </p>
          <p>
            Fresh Greens returns to that question with today&apos;s data
            stack. Community observations don&apos;t sit next to public data
            as an editorial layer. They flow through the same adapter, the
            same scoring, and the same audit trail.
          </p>
        </div>
      </section>

      {/* ── Section 2: Listening to six drivers ──────── */}
      <section
        className="project-section fg-section"
        aria-labelledby="fg-research"
      >
        <h2 id="fg-research">Listening to six drivers.</h2>
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
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="route-preview"
              alt="A Fresh Greens route preview to Vineland Flea Market showing the daylight-graded route line and a sunrise-to-night gradient strip marking how much of the drive falls in daylight"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            The daylight gradient made visible: the route strip grades from
            sunrise to night, so a driver can see how much of a drive falls in
            daylight before choosing it.
          </figcaption>
        </figure>

        <div className="project-section-body">
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
            surfacing two overlapping habits: skepticism of the authorities
            and reliance on community members for the ground truth of a
            place. Drivers already asked around before entering an unfamiliar
            area. The report picker turns that habit into a first-class
            input. &quot;Felt welcome&quot; and &quot;Black-owned&quot; sit
            next to &quot;Incident&quot; and &quot;Hazard&quot; because a
            positive signal is data the next driver can use, and because a
            category system that only allows negative reports fails to
            capture the community knowledge that was actually described.
          </p>
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="report-picker"
              alt="The Fresh Greens report picker: a grid of six categories (Incident, Felt unsafe, Lighting, Hazard, Felt welcome, and Black-owned) placing positive community signals next to hazards"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            &quot;Felt welcome&quot; and &quot;Black-owned&quot; sit in the same
            grid as &quot;Incident&quot; and &quot;Hazard.&quot; A positive
            signal is data the next driver can use.
          </figcaption>
        </figure>

        <div className="project-section-body">
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

      {/* ── Section 3: How routes get scored ─────────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-scoring"
      >
        <h2 id="fg-scoring">How routes get scored.</h2>
        <p className="case-section-lead">
          Community reports and public data share one adapter, one scoring function, and one audit trail.
        </p>
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
        aria-labelledby="fg-pulled-over"
      >
        <h2 id="fg-pulled-over">Designing for the pulled-over moment.</h2>
        <p className="case-section-lead">
          The interface asks before it assumes, so a driver stays in control under pressure.
        </p>
        <div className="project-section-body">
          <p>
            Every in-modal prompt in Fresh Greens is set in{" "}
            <mark className="case-highlight">Libre Franklin Regular. Not Bold.</mark>{" "}
            The safety modal asks &quot;What&apos;s going
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
        aria-labelledby="fg-typecolor"
      >
        <h2 id="fg-typecolor">Type and color.</h2>
        <p className="case-section-lead">
          Warm OKLCH surfaces and a reserved serif give the type and color specific work to do at each phase of a trip.
        </p>
        <div className="project-section-body">
          <p>
            Fresh Greens replaces iOS&apos;s default cool grays with five
            warm surfaces, all derived in OKLCH at 0.008 to 0.012 chroma on
            the brand-green hue. Page, card, sheet, elevated, and tinted.
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

      </section>

      {/* ── Section 6: Reserved color that holds ─────── */}
      <section
        className="project-section fg-section fg-craft"
        aria-labelledby="fg-color"
      >
        <h2 id="fg-color">The reserved color system.</h2>
        <p className="case-section-lead">
          Four colors and the daylight gradient are held to safety signals, with documented carve-outs.
        </p>

        <div className="project-section-body">
          <p>
            The brand greens carry every CTA, every link, every interactive
            affordance. Red, orange, yellow, and navy are reserved for safety
            signals only, each tied to one specific meaning. Because those
            four colors are reserved, a red dot or an orange chip in the app
            points to something specific. Across 26+ screens and 300+
            accessibility attributes, <mark className="case-highlight">the rule holds, with documented carve-outs</mark>.
          </p>
        </div>

        <ReservedPalette />

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="en-route"
              alt="The Fresh Greens en-route screen: a navy safety Shield, hazard markers, and the daylight-graded route line, the reserved colors holding together on one real screen"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            The reserved palette holding on a real screen: navy for the safety
            Shield, the daylight gradient on the route, hazard markers in their
            reserved hues, and nothing else non-green.
          </figcaption>
        </figure>

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

      </section>

      {/* ── Section 7: Where the argument gets tested ── */}
      <section
        className="project-section fg-section"
        aria-labelledby="fg-trust"
      >
        <h2 id="fg-trust">Keeping community reports trustworthy.</h2>
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
            <code>/moderation</code> is where &quot;whose knowledge
            counts&quot; gets renegotiated with real reports and real stakes. A v2 transparency page will
            publish moderation outcomes so the queue&apos;s work is auditable
            outside the queue.
          </p>
        </div>

      </section>

      {/* ── Section 8: What shipped, and what didn't ─── */}
      <section className="project-section fg-section fg-scope" aria-labelledby="fg-scope">
        <h2 id="fg-scope">What shipped, and what didn't.</h2>
        <p className="case-section-lead">
          Naming what isn&apos;t done yet is part of the thesis stance, so here&apos;s what shipped and what&apos;s next.
        </p>
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
                DOT-511, OSRM, SunCalc, and community reports
              </li>
              <li>
                Six-surface safety toolkit, with <code>/pulled-over</code>{" "}
                carrying ACLU-sourced guidance, on-device audio capture, and
                the Held-Question voice
              </li>
              <li>
                Warm surface ramp and reserved-color discipline holding
                across 26+ screens and 300+ accessibility attributes
              </li>
              <li>
                <code>/moderation</code> queue with per-report investigation
                panels, coordination detection for IP and device duplicates,
                and a hold-to-remove destructive gesture
              </li>
              <li>
                Design system published as a Figma library: 62 variables at
                1:1 parity with <code>theme/colors.ts</code>, scoped per
                token role
              </li>
            </ul>
            <p className="fg-scope-also-label">Also on the list:</p>
            <ul className="fg-scope-also-list" role="list">
              <li>Daylight-graded route polyline with a WCAG dash pattern</li>
              <li>Six-category report picker</li>
              <li>
                Four-layer Mapbox fallback chain (Mapbox → OSRM → cache →
                mock)
              </li>
              <li>
                Two-font Franklin plus reserved DM Serif Display
              </li>
              <li>Departure-reminder local notifications</li>
              <li>
                Delight layer of arrival and community-confirmation moments
              </li>
              <li>
                Supabase community cloud with anonymous device-UUID auth and
                Postgres row-level security
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

        <div className="project-section-body fg-scope-closer">
          <p>
            Typography took three tries. Jost first, then Space Grotesk, then
            Libre Franklin with DM Serif Display reserved for the six emotional
            beats.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

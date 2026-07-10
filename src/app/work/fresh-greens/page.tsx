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
import { ResearchSynthesis } from "@/components/fresh-greens/research-synthesis";
import { TokenExhibit } from "@/components/fresh-greens/token-exhibit";
import { PivotJourney } from "@/components/fresh-greens/pivot-journey";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getPublishedProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Fresh Greens",
  description:
    "A wayfinding app for Black drivers in America, built solo for a grad thesis. It weighs what drivers know about a road's safety as seriously as the official map data.",
  openGraph: {
    title: "Fresh Greens",
    description:
      "A wayfinding app for Black drivers in America, weighing safety knowledge from drivers alongside the official map data.",
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
          A wayfinding app for Black drivers in America, built solo for my grad
          thesis. Most navigation weighs time and distance. Fresh Greens weighs
          safety too, and it treats{" "}
          <mark className="case-highlight">what a driver knows about a road as seriously as the official map data</mark>.
          Six interviews shaped what it looks for.
        </p>
      </section>

      <LeadMedia
        cover="/projects/fresh-greens/cover.png"
        alt="Fresh Greens cover"
      />
      <RecruiterCut
        problem="Navigation weighs time and distance, not what a driver knows about a road's safety."
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
            For a Black driver, a route isn&apos;t only time and distance.
            It&apos;s whether the roads are lit, whether a town feels safe to
            stop in, where police tend to sit. Nav apps don&apos;t weigh any of
            that. Fresh Greens brings that kind of knowledge back into the
            route.
          </p>
        </div>
      </section>

      {/* ── Section 2: Listening to six drivers ──────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-research"
      >
        <h2 id="fg-research">Listening to six drivers.</h2>
        <p className="case-section-lead">
          Six interviews with Black drivers across the Southern US. The timeline
          was tight, so the synthesis stayed lean: I pulled the recurring trends
          into four routing markers.
        </p>

        <figure className="fg-pullquote">
          <blockquote>
            Moments of joy and fear have a lasting effect on how Black drivers
            interpret the spaces they inhabit. They stick.
          </blockquote>
          <figcaption>Thesis · Fresh Greens, 2026</figcaption>
        </figure>

        <ResearchSynthesis />

        <figure className="fg-lofi">
          <ExpandableImage
            src="/projects/fresh-greens/process/lofi-board.png"
            alt="Hand-drawn lo-fi wireframes of Fresh Greens: route selection, the zone flow, active navigation, and the hold-to-call emergency flow"
            width={2400}
            height={1350}
            sizes="(max-width: 768px) 92vw, 900px"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <figcaption className="fg-safety-visual-caption">
            The last lo-fi pass, done by hand. That layered route stroke marking
            a zone got simplified once it had to read on a small screen at a
            glance.
          </figcaption>
        </figure>

        <div className="project-section-body">
          <p>
            My first instinct was to stack every safety layer onto the screen.
            But the interviews also said driving already takes focus, so I
            pulled most of it back. The safety toolkit stays hidden until a
            driver reaches for it.
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
          Community reports and public data share one adapter and one scoring function, with a single audit trail behind both.
        </p>
        <div className="project-section-body">
          <p>
            Every route is scored on four things the interviews kept raising:
            light, police presence, wildlife, and road conditions. A community
            report feeds those same four markers. It&apos;s{" "}
            <mark className="case-highlight">weighted exactly like the data from OpenStreetMap or SunCalc</mark>{" "}
            and runs through the same pipeline as everything else. Each score
            carries its source, so a driver can see whether a segment scored low
            from the sun angle or from a report.
          </p>
        </div>

        <ArchitectureDiagram />

        <div className="project-section-body">
          <p>
            The en-route screen is where it all lands: a turn card, a 3D map
            you can drag, and a safety column within thumb&apos;s reach.
          </p>
        </div>
        <Device3D
          screen="/projects/fresh-greens/v2/en-route.png"
          alt="Fresh Greens en-route screen running on an iPhone: a turn card reading 'Head out on Spencer Street,' a 3D map, and a side column for Guide, SOS, Safety, Report, and Recenter."
        />
      </section>

      {/* ── Section 4: The Held-Question Rule ────────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-pulled-over"
      >
        <h2 id="fg-pulled-over">Designing for the pulled-over moment.</h2>
        <p className="case-section-lead">
          The interface asks before it assumes, so a driver stays in control under pressure.
        </p>
        <div className="project-section-body">
          <p>
            Every prompt in a safety moment is set in{" "}
            <mark className="case-highlight">Libre Franklin Regular, not Bold</mark>. The
            safety modal asks &quot;What&apos;s going on?&quot; The share sheet
            asks &quot;What&apos;s the situation?&quot; A driver who just got
            pulled over doesn&apos;t need &quot;REPORT INCIDENT&quot; shouted at
            them in a heavier weight than their own thoughts.
          </p>
          <p>
            That came from the interviews too. People said the moments the app
            matters most call for a companion. So
            Bold appears only on facts the app is sure of, like ETA and the{" "}
            <code>/emergency</code> countdown.
          </p>
        </div>

        <div className="fg-safety-pair">
          <figure className="fg-safety-visual">
            <PhoneFrame variant="screenshot">
              <Shot
                name="safety-toolkit"
                alt="The /safety toolkit modal opening with 'What's going on?' set in Libre Franklin Regular over a 2x2 grid of Pulled-over, Roadside, Unfamiliar area, and Share location"
              />
            </PhoneFrame>
            <figcaption className="fg-safety-visual-caption">
              The Held-Question Rule in situ. <code>/safety</code>{" "}
              opens on the driver&apos;s own question.
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
        </div>

        <div className="project-section-body">
          <p>
            The other safety surfaces (<code>/roadside</code>,{" "}
            <code>/unfamiliar</code>, <code>/share-location</code>,{" "}
            <code>/emergency</code>) use the same voice, each a first-class
            route that works with no signal.
          </p>
        </div>
      </section>

      {/* ── Section 5: The material of calm ──────────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-typecolor"
      >
        <h2 id="fg-typecolor">Type and color.</h2>
        <p className="case-section-lead">
          Warm surfaces and a reserved serif give type and color a job at each phase of a trip.
        </p>
        <div className="project-section-body">
          <p>
            The look didn&apos;t start distinct. I first imagined Fresh Greens
            as a feature inside Google Maps, so v1 wore Google&apos;s own chrome.
            Rebuilding it as a standalone app is what forced a type and color
            system of its own.
          </p>
        </div>

        <PivotJourney />

        <figure className="fg-illustrations">
          <ExpandableImage
            src="/projects/fresh-greens/process/onboarding-illustrations.svg"
            alt="Four hand-drawn onboarding illustrations: a figure soaring as a map pin over green hills at sunrise, a pensive thinker, the navy safety shield, and a figure at ease with speech bubbles."
            width={1920}
            height={1080}
            sizes="(max-width: 768px) 92vw, 640px"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <figcaption className="fg-safety-visual-caption">
            The onboarding illustrations, drawn by hand. They set the warm,
            human register the app opens on, before a single safety signal
            appears.
          </figcaption>
        </figure>

        <div className="project-section-body">
          <p>
            I swapped iOS&apos;s cool grays for five warm surfaces, all built
            in OKLCH on the brand-green hue, so the whole app shares one tonal
            source.
          </p>
          <p>
            Type took three tries. Jost first, then Space Grotesk, then Libre
            Franklin, which carries the whole hierarchy now. DM Serif Display
            shows up in exactly six emotional moments, like the emergency
            reassurance line and the &quot;Thanks for sharing&quot; on{" "}
            <code>/trip-summary</code>. Reserving it for those six is what
            keeps them landing. Type and color both shift across the session,
            calm at entry, heightened en-route, resolved at the trip summary.
          </p>
        </div>

        <figure className="fg-token-figure">
          <TokenExhibit />
          <figcaption className="fg-safety-visual-caption">
            The tokens themselves, pulled straight from{" "}
            <code>theme/colors.ts</code> and <code>theme/spacing.ts</code>. The
            spacing scale started implicit and drifted to stragglers at 5, 6,
            13, and 18. Making the 4pt ramp explicit is what made that drift
            easy to catch.
          </figcaption>
        </figure>

      </section>

      {/* ── Section 6: Reserved color that holds ─────── */}
      <section
        className="project-section fg-section fg-section--wide fg-craft"
        aria-labelledby="fg-color"
      >
        <h2 id="fg-color">The reserved color system.</h2>
        <p className="case-section-lead">
          Four colors and the daylight gradient are held to safety signals, with documented carve-outs.
        </p>

        <div className="project-section-body">
          <p>
            Green carries every button and link. Red, orange, yellow, and navy
            are reserved for safety signals, each tied to one meaning, so a red
            dot always points to something specific. Across 26+ screens,{" "}
            <mark className="case-highlight">the rule holds, with documented carve-outs</mark>.
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
            reserved hues, and green everywhere else.
          </figcaption>
        </figure>

        <div className="project-section-body">
          <p>
            Where color is the signal, a second channel rides with it. On{" "}
            <code>/report</code>, severity pairs a filled warning glyph with
            the color, so the cue survives for anyone who can&apos;t rely on
            hue (WCAG 1.4.1).
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
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-trust"
      >
        <h2 id="fg-trust">Keeping community reports trustworthy.</h2>
        <div className="project-section-body">
          <p>
            The pipeline only works if community reports can be trusted like
            public data. Bad-faith and mistaken reports have to be caught
            without falling back to distrusting community data. That&apos;s
            what <code>/moderation</code> is for.
          </p>
          <p>
            Every report enters a queue with an investigation panel: the source
            device, prior and nearby reports, and coordination checks for
            duplicate IPs and devices. Nothing publishes without a human
            decision, and every publish and unpublish is logged.
          </p>
        </div>

        <div
          className="fg-moderation"
          aria-label="How a report moves through moderation"
        >
          <div className="fg-mod-flow">
            <div className="fg-mod-stage">
              <p className="fg-mod-stage-label">Enters</p>
              <p className="fg-mod-stage-text">A report joins the queue</p>
            </div>
            <span className="fg-mod-arrow" aria-hidden="true">
              →
            </span>
            <div className="fg-mod-stage fg-mod-stage--panel">
              <p className="fg-mod-stage-label">Investigation panel</p>
              <ul className="fg-mod-checks" role="list">
                <li>Source device</li>
                <li>Prior reports at the same spot</li>
                <li>Nearby reports</li>
                <li>Coordination: duplicate IPs and devices</li>
              </ul>
            </div>
            <span className="fg-mod-arrow" aria-hidden="true">
              →
            </span>
            <div className="fg-mod-stage">
              <p className="fg-mod-stage-label">Human decision</p>
              <p className="fg-mod-stage-text">
                Published or held, every action logged
              </p>
            </div>
          </div>
        </div>

        <div className="project-section-body">
          <p>
            It&apos;s where the trust question gets settled with real stakes. A
            planned transparency page will publish the outcomes so the queue is
            auditable from outside.
          </p>
        </div>

      </section>

      {/* ── Section 8: What shipped, and what didn't ─── */}
      <section className="project-section fg-section fg-scope" aria-labelledby="fg-scope">
        <h2 id="fg-scope">What shipped, and what didn't.</h2>
        <p className="case-section-lead">
          What shipped, and what&apos;s still on the list.
        </p>
        <div className="project-section-body">
          <p>
            Naming what isn&apos;t done yet matters as much as what is. So
            here&apos;s the honest split.
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
            What comes next is mostly about accountability. The transparency
            page is the one I care about most.
            It puts the <code>/moderation</code>{" "}
            queue&apos;s decisions in public, so the trust the whole system
            runs on can be checked from outside.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

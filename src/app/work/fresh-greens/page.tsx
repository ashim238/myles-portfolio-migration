import type { Metadata } from "next";
import { ExpandableImage } from "@/components/expandable-image";
import { LeadMedia } from "@/components/lead-media";
import { LeadVideo } from "@/components/lead-video";
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
import { ResearchSynthesis } from "@/components/fresh-greens/research-synthesis";
import { TokenExhibit } from "@/components/fresh-greens/token-exhibit";
import { PivotJourney } from "@/components/fresh-greens/pivot-journey";
import { PulledOverJourney } from "@/components/fresh-greens/pulled-over-journey";
import { OnboardingIllustrationSequence } from "@/components/fresh-greens/onboarding-illustration-sequence";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getPublishedProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Fresh Greens",
  description:
    "A wayfinding app for Black drivers that brings community safety knowledge into route planning alongside public map data.",
  openGraph: {
    title: "Fresh Greens",
    description:
      "A wayfinding app for Black drivers that brings community safety knowledge into route planning alongside public map data.",
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
        <p className="fg-eyebrow">Product design + engineering · 2025–2026</p>
        <h1 id="fg-title" className="project-hero-title fg-title">
          Fresh Greens
        </h1>
        <p className="project-hero-lede fg-lede">
          Fresh Greens brings community safety knowledge into route planning
          for Black drivers. I designed and built a working React Native
          prototype after six interviews, scoring{" "}
          <mark className="case-highlight">daylight, police presence, wildlife, road conditions, and community reports alongside public map data</mark>.
        </p>
      </section>

      <LeadMedia
        cover="/projects/fresh-greens/cover.png"
        alt="Fresh Greens welcome screen on a phone, with an illustrated Black driver at sunrise."
      />
      <RecruiterCut
        problem="Navigation weighs time and distance, not what a driver knows about a road's safety."
        role="Solo, design and engineering"
        timeline="Sep 2025 – Jun 2026"
        stack="React Native, Expo, TypeScript, Supabase"
        outcomeValue="Working"
        outcomeLabel="React Native prototype across 26+ screens"
        moves={[
          "Brought community reports into the same route-scoring pipeline as public map and daylight data, then surfaced the evidence through safety chips and source detail cards.",
          "Built the en-route screen around one-thumb reach: turn card, 3D map, and a safety column.",
          "Shaped the routing signals from six driver interviews.",
        ]}
      />

      <ProjectToc
        sections={[
          { title: "Problem", id: "fg-problem" },
          { title: "Research and route scoring", id: "fg-research" },
          { title: "Safety interaction", id: "fg-pulled-over" },
          { title: "Visual system, trust, and scope", id: "fg-pivot" },
        ]}
      />

      {/* ── Section 1: The problem I set out to solve ── */}
      <section className="project-section fg-section" aria-labelledby="fg-problem">
        <h2 id="fg-problem">Why time and distance were not enough</h2>
        <blockquote className="case-pullquote">
          The Green Book collected community knowledge about where Black
          travelers could safely stop.
        </blockquote>
        <div className="project-section-body">
          <p>
            In interviews, Black drivers described routes in terms of more than
            time and distance: whether roads are lit, whether a town feels safe
            to stop in, and where police tend to sit. Navigation apps don&apos;t
            account for those signals. Fresh Greens brings them into route
            selection.
          </p>
        </div>
      </section>

      {/* ── Section 2: Listening to six drivers ──────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-research"
      >
        <h2 id="fg-research">What six interviews changed</h2>
        <p className="case-section-lead">
          Six interviews with Black drivers across the Southern US, anonymized
          in synthesis and led with joy and fear before any product questions.
          The timeline was tight, so the synthesis stayed lean: I pulled the
          recurring trends into four routing markers.
        </p>

        <figure className="fg-pullquote">
          <blockquote>
            Moments of joy and fear have a lasting effect on how Black drivers
            interpret the spaces they inhabit. They stick.
          </blockquote>
          <figcaption>Thesis · Fresh Greens, 2026</figcaption>
        </figure>

        <ResearchSynthesis />

        <div
          className="fg-evidence-boundaries"
          aria-label="Fresh Greens evidence boundaries"
        >
          <div className="fg-evidence-boundary">
            <p className="fg-evidence-label">Interview-supported</p>
            <p>
              Six Black drivers raised daylight, police presence, wildlife,
              and road conditions as route-planning signals.
            </p>
          </div>
          <div className="fg-evidence-boundary">
            <p className="fg-evidence-label">Built in the prototype</p>
            <p>
              A working React Native build scores those four signals, shows
              route chips, and uses detail cards to explain where a signal came
              from.
            </p>
          </div>
          <div className="fg-evidence-boundary">
            <p className="fg-evidence-label">Not yet proven</p>
            <p>
              Whether the recommendations improve safety still needs broader
              route testing and moderation data.
            </p>
          </div>
        </div>

        <figure className="fg-lofi">
          <ExpandableImage
            src="/projects/fresh-greens/process/thesis-zone-flow.png"
            alt="Hand-drawn thesis storyboard of the zone flow across four panels: baseline navigation, one mile out from a zone, actively entering a zone, and in the zone, with annotations about tooltip timing and route stroke behavior."
            width={2675}
            height={1407}
            sizes="(max-width: 768px) 92vw, 900px"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <figcaption className="fg-safety-visual-caption">
            The zone-flow storyboard, done by hand. The layered route stroke
            marking a wildlife zone in the last panel was too dense to read at
            a glance, so it got simplified into the daylight gradient the app
            uses now.
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
        <h2 id="fg-scoring">How each route gets scored</h2>
        <div className="project-section-body">
          <p>
            Every route is scored on four things the interviews kept raising:
            light, police presence, wildlife, and road conditions. A community
            report feeds those same four markers through the same scoring
            pipeline as public data. I treated community reports as a{" "}
            <mark className="case-highlight">first-class route input</mark>.
            The preview shows visible evidence as safety chips, while detail
            cards explain whether a signal comes from public map data, daylight
            calculations, traffic incidents, or community reports. That&apos;s
            how the working prototype behaves, not evidence that its
            recommendation is safer.
          </p>
        </div>

        <ArchitectureDiagram />

        <div className="project-section-body">
          <p>
            The en-route screen is where it all lands: a turn card, a 3D map
            that drags with the drive, and a safety column within thumb&apos;s
            reach.
          </p>
        </div>

        <figure className="fg-en-route-video">
          <LeadVideo
            clip="/projects/fresh-greens/process/active-nav.mp4"
            poster="/projects/fresh-greens/v2/en-route.png"
            alt="Fresh Greens running turn-by-turn navigation on a simulated public route in Harlem: the turn card says to head out on West 127th Street now, the 3D map moves with the car, the speed reads 34 mph, and the bottom sheet shows a 4:24 daylight arrival for a 13.9 mi, 31 min trip."
          />
          <figcaption className="fg-safety-visual-caption">
            The current en-route prototype in motion on a simulated public
            route through Harlem.
          </figcaption>
        </figure>
      </section>

      {/* ── Section 4: The Held-Question Rule ────────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-pulled-over"
      >
        <h2 id="fg-pulled-over">A calmer interface for a traffic stop</h2>
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

        <PulledOverJourney />

        <div className="project-section-body">
          <p>
            The other safety surfaces (<code>/roadside</code>,{" "}
            <code>/unfamiliar</code>, <code>/share-location</code>,{" "}
            <code>/emergency</code>) use the same voice, each a first-class
            route that works with no signal.
          </p>
        </div>
      </section>

      {/* ── Section 5: The design pivot ───────────────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-pivot"
      >
        <h2 id="fg-pivot">The Google Maps feature I moved away from</h2>

        <PivotJourney />
      </section>

      {/* ── Section 6: Type and color ─────────────────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-typecolor"
      >
        <h2 id="fg-typecolor">Type and color across a trip</h2>

        <OnboardingIllustrationSequence />

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
        <h2 id="fg-color">Four colors stay reserved for safety</h2>

        <div className="project-section-body">
          <p>
            Green carries every button and link. Red, orange, yellow, and navy
            are reserved for safety signals, each tied to one meaning, so a red
            dot always points to something specific. Across 26+ screens,{" "}
            <mark className="case-highlight">exceptions are documented as carve-outs</mark>.
          </p>
        </div>

        <div className="fg-color-pair">
          <ReservedPalette />

          <figure className="fg-safety-visual">
            <PhoneFrame variant="screenshot">
              <Shot
                name="en-route"
                alt="The current Fresh Greens en-route screen on a simulated public route in Harlem: a green turn card says to head out on West 127th Street now, the map shows 34 mph, the right-side safety column uses red, navy, and orange controls, and the bottom sheet shows a 4:24 daylight arrival for a 13.9 mi, 31 min trip."
              />
            </PhoneFrame>
            <figcaption className="fg-safety-visual-caption">
              The reserved palette on the current en-route screen: navy for
              the safety Shield, red on the alert, orange on the hazard, a sun
              glyph for the daylight arrival, and green everywhere else.
            </figcaption>
          </figure>
        </div>

        <div className="project-section-body">
          <p>
            The daylight gradient sits outside those four reserved safety
            colors. On <code>/route-preview</code>, a sun-to-moon dashed band
            traces what the light will do along the route.
          </p>
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="route-preview"
              alt="The current Fresh Greens route preview for Weeksville Heritage Center: a map at top with recenter and hazard controls, a bottom sheet showing a 30 min trip arriving at 3:15 PM over 13.6 mi, an All clear chip, a daylight indicator, and a green Go button."
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            The daylight indicator, held to one job: telling the driver what
            light they can expect, from now until arrival.
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

      </section>

      {/* ── Section 7: Where the argument gets tested ── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-trust"
      >
        <h2 id="fg-trust">Moderating community reports</h2>
        <div className="project-section-body">
          <p>
            Community reports have to earn trust without being treated as less
            useful by default. Bad-faith and mistaken reports still need to be
            caught. That&apos;s what <code>/moderation</code> is for.
          </p>
          <p>
            When the Supabase path is configured, reports flow into a
            moderation view with an investigation panel: the source device,
            prior and nearby reports, and coordination checks for duplicate IPs
            and devices. Moderators can review, hide, restore, or remove
            reports, and those actions are recorded in an audit log.
          </p>
        </div>

        <div className="fg-color-pair">
          <figure className="fg-safety-visual">
            <PhoneFrame variant="screenshot">
              <Shot
                name="report-picker"
                alt="The Fresh Greens report picker over a muted map, showing six categories: Incident, Felt unsafe, Lighting, Hazard, Felt welcome, and Black-owned."
              />
            </PhoneFrame>
            <figcaption className="fg-safety-visual-caption">
              The report picker lets drivers contribute context without
              pretending every report is already verified.
            </figcaption>
          </figure>

          <figure className="fg-safety-visual">
            <PhoneFrame variant="screenshot">
              <Shot
                name="report-detail"
                alt="The Fresh Greens Felt welcome contribution form over the en-route map, with place-type chips, welcoming-reason chips, an optional experience field, and a green Share your experience button with black text."
              />
            </PhoneFrame>
            <figcaption className="fg-safety-visual-caption">
              The form separates structured place and welcome tags from the
              driver&apos;s optional written experience.
            </figcaption>
          </figure>
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
                Reviewed, hidden, restored, or removed
              </p>
            </div>
          </div>
        </div>

        <div className="project-section-body">
          <p>
            A planned transparency page will publish moderation outcomes so
            the queue is auditable from outside.
          </p>
        </div>

      </section>

      {/* ── Section 8: What was built, and what still needs proof ─── */}
      <section className="project-section fg-section fg-scope" aria-labelledby="fg-scope">
        <h2 id="fg-scope">What I built and what still needs proof</h2>

        <div className="fg-scope-grid">
          <div className="fg-scope-col">
            <p className="fg-scope-label">Built in the working prototype</p>
            <ul className="fg-scope-list" role="list">
              <li>
                Route scoring that combines OpenStreetMap zones, DOT-511 where
                available, Mapbox/OSRM route geometry, SunCalc daylight data,
                and community reports, with route chips and source-detail
                explanations
              </li>
              <li>
                Six-surface safety toolkit, with <code>/pulled-over</code>{" "}
                carrying ACLU-sourced guidance, on-device audio capture, and
                the Held-Question voice
              </li>
              <li>
                Reserved-color system and warm surface ramp across 26+ screens,
                with 300+ accessibility attributes and 62 Figma variables
              </li>
              <li>
                <code>/moderation</code> queue with per-report investigation
                panels, coordination detection for IP and device duplicates,
                Supabase-backed review actions when configured, and a
                hold-to-remove destructive gesture
              </li>
            </ul>
          </div>
          <div className="fg-scope-col">
            <p className="fg-scope-label">Still needs proof</p>
            <ul className="fg-scope-list" role="list">
              <li>
                Route-quality testing with more Black drivers across regions
              </li>
              <li>
                Live shared-report testing across configured Supabase builds,
                plus failure-mode testing for mistaken reports, coordinated
                abuse, and moderation outcomes
              </li>
              <li>
                A public transparency page for <code>/moderation</code>{" "}
                activity and broader device testing beyond iPhone
              </li>
            </ul>
          </div>
        </div>

        <div className="project-section-body fg-scope-closer">
          <p>
            Building the working app made the gap between a plausible safety
            feature and a trustworthy one much clearer. I&apos;m confident in
            the interaction choices I could trace back to interviews,
            especially the Held-Question rule, route chips, and source detail
            cards. I&apos;d want broader route testing with Black drivers,
            moderation outcomes, and failure cases before calling any route
            safer.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

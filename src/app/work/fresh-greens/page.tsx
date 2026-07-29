import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpandableImage } from "@/components/expandable-image";
import { LeadMedia } from "@/components/lead-media";
import { LeadVideo } from "@/components/lead-video";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectChapter } from "@/components/project-chapter";
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
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { createRouteMetadata } from "@/lib/site-config";

const chapters = CASE_STUDY_CHAPTERS["fresh-greens"];

export const metadata: Metadata = createRouteMetadata({
  title: "Fresh Greens",
  description:
    "A wayfinding app for Black drivers that brings community safety knowledge into route planning alongside public map data.",
  path: "/work/fresh-greens",
  image: "/projects/fresh-greens/cover.png",
  type: "article",
});

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
  const project = await getProjectBySlug("fresh-greens");
  if (!project || project.status !== "published") {
    notFound();
  }

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
          Fresh Greens is a working React Native prototype that brings community
          safety knowledge into route planning for Black drivers. After six
          interviews, I combined{" "}
          <mark className="case-highlight">daylight, police presence, wildlife, road conditions, and community reports alongside public map data</mark>.
        </p>
      </section>

      <LeadMedia
        cover="/projects/fresh-greens/cover.png"
        alt="Fresh Greens welcome screen on a phone, with an illustrated Black driver at sunrise."
        width={2560}
        height={1862}
        presentation="fresh-greens"
      />
      <RecruiterCut
        role="Solo, design and engineering"
        timeline="Sep 2025 – Jun 2026"
        stackLabel="Tools"
        stack="Figma, Illustrator, Claude, React Native, Expo, TypeScript, Supabase"
        evidence={{
          type: "Working mobile prototype",
          cta: "Try the safety-flow reconstruction",
          href: "#fg-pulled-over",
        }}
        outcomeValue="Working"
        outcomeLabel="React Native prototype across 26+ screens"
        moves={[
          "Put community reports and public signals through one route-scoring pipeline, then explained results with safety chips and source cards.",
          "Kept turn guidance, the top-down map, and safety controls within one-thumb reach.",
          "Translated six driver interviews into four routing signals.",
        ]}
      />

      <ProjectToc
        sections={chapters}
        readingEndId="fg-scope"
      />

      {/* ── Section 1: The problem I set out to solve ── */}
      <ProjectChapter
        entry={chapters[0]}
        index={1}
        total={chapters.length}
        variant="fresh-greens"
      >
        <div className="project-section fg-section">
          <blockquote className="case-pullquote">
            The Green Book collected community knowledge about where Black
            travelers could safely stop.
          </blockquote>
          <div className="project-section-body">
            <p>
              I wanted to use modern navigation technology to help Black drivers
              make more informed decisions on the road. Interviews showed that
              time and distance were only part of that decision. Daylight, road
              conditions, police presence, wildlife, and advice from people they
              trusted mattered too.
            </p>
          </div>
        </div>
      </ProjectChapter>

      {/* ── Section 2: Listening to six drivers ──────── */}
      <ProjectChapter
        entry={chapters[1]}
        index={2}
        total={chapters.length}
        variant="fresh-greens"
      >
        <div className="project-section fg-section fg-section--wide">
          <p className="case-section-lead">
            I interviewed six Black drivers across the Southern US, starting
            with joy and fear before discussing products. Four recurring
            signals shaped the route model.
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
                The interviews surfaced daylight, police presence, wildlife,
                and road conditions.
              </p>
            </div>
            <div className="fg-evidence-boundary">
              <p className="fg-evidence-label">Built in the prototype</p>
              <p>
                The React Native prototype scores those signals and explains
                route chips through source cards.
              </p>
            </div>
            <div className="fg-evidence-boundary">
              <p className="fg-evidence-label">Not yet proven</p>
              <p>
                Broader route testing and moderation data are still needed
                before calling a recommendation safer.
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
              I dropped the storyboard&apos;s layered wildlife-zone stroke after
              it proved too dense, replacing it with the current daylight
              gradient.
            </figcaption>
          </figure>

          <div className="project-section-body">
            <p>
              Because driving already takes focus, most safety tools stay hidden
              until requested.
            </p>
          </div>
        </div>
      </ProjectChapter>

      {/* ── Section 3: How routes get scored ─────────── */}
      <ProjectChapter
        entry={chapters[2]}
        index={3}
        total={chapters.length}
        variant="fresh-greens"
      >
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-scoring"
      >
        <h3 className="project-evidence-heading" id="fg-scoring">
          How each route gets scored
        </h3>
        <div className="project-section-body">
          <p>
            Public and community data enter the same four-signal scoring
            pipeline. I treated community reports as a{" "}
            <mark className="case-highlight">first-class route input</mark>.
            Safety chips show the result, while source cards identify public map
            data, daylight calculations, traffic incidents, or community
            reports. This describes prototype behavior, not proof that a
            recommendation is safer.
          </p>
        </div>

        <ArchitectureDiagram />

        <figure className="fg-en-route-video">
          <LeadVideo
            clip="/projects/fresh-greens/process/active-nav-flat-route.mp4"
            poster="/projects/fresh-greens/v2/en-route.png"
            width={1290}
            height={2796}
            alt="Fresh Greens running turn-by-turn navigation on a simulated downtown San Francisco route: the green current-location marker follows the orange route line on a flat map, the turn card guides the next turn, the right-side safety column stays within thumb reach, and the bottom sheet keeps the daylight arrival in view."
          />
          <figcaption className="fg-safety-visual-caption">
            The current en-route prototype in motion on a simulated downtown
            San Francisco route.
          </figcaption>
        </figure>
      </section>

      {/* ── Section 4: The Held-Question Rule ────────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-pulled-over"
      >
        <h3 className="project-evidence-heading" id="fg-pulled-over">
          A calmer interface for a traffic stop
        </h3>
        <div className="project-section-body">
          <p>
            Safety prompts use{" "}
            <mark className="case-highlight">Libre Franklin Regular</mark>.
            Bold is reserved for known facts such as ETA and the{" "}
            <code>/emergency</code> countdown, so questions like
            &quot;What&apos;s going on?&quot; and &quot;Are you armed?&quot;
            don&apos;t read as commands.
          </p>
        </div>

        <PulledOverJourney />

        <div className="project-section-body">
          <p>
            The same voice carries across <code>/roadside</code>,{" "}
            <code>/unfamiliar</code>, <code>/share-location</code>, and{" "}
            <code>/emergency</code>, all available without signal.
          </p>
        </div>
      </section>
      </ProjectChapter>

      {/* ── Section 5: The design pivot ───────────────── */}
      <ProjectChapter
        entry={chapters[3]}
        index={4}
        total={chapters.length}
        variant="fresh-greens"
      >
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-pivot"
      >
        <h3 className="project-evidence-heading" id="fg-pivot">
          The Google Maps feature I moved away from
        </h3>

        <PivotJourney />
      </section>

      {/* ── Section 6: Type and color ─────────────────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-typecolor"
      >
        <h3 className="project-evidence-heading" id="fg-typecolor">
          Type and color across a trip
        </h3>

        <OnboardingIllustrationSequence />

        <div className="project-section-body">
          <p>
            I replaced iOS&apos;s cool grays with five warm surfaces built in
            OKLCH on the brand-green hue, giving the app one tonal source.
          </p>
          <p>
            I designed the flows in Figma, drew the onboarding art in
            Illustrator, and checked the system in React Native. Claude helped
            me critique token names, color roles, and copy rules.
          </p>
          <p>
            After trying Jost and Space Grotesk, I chose Libre Franklin for the
            hierarchy. DM Serif Display appears only in six emotional moments,
            including emergency reassurance and the <code>/trip-summary</code>{" "}
            thank-you.
          </p>
        </div>

        <figure className="fg-token-figure">
          <TokenExhibit />
          <figcaption className="fg-safety-visual-caption">
            These tokens come from{" "}
            <code>theme/colors.ts</code> and <code>theme/spacing.ts</code>.
            A 4pt ramp replaced spacing stragglers at 5, 6, 13, and 18.
          </figcaption>
        </figure>

      </section>

      {/* ── Section 6: Reserved color that holds ─────── */}
      <section
        className="project-section fg-section fg-section--wide fg-craft"
        aria-labelledby="fg-color"
      >
        <h3 className="project-evidence-heading" id="fg-color">
          Four colors stay reserved for safety
        </h3>

        <div className="project-section-body">
          <p>
            Red, orange, yellow, and navy each keep one safety meaning.
            Across 26+ screens,{" "}
            <mark className="case-highlight">exceptions are documented as carve-outs</mark>.
          </p>
        </div>

        <div className="fg-color-pair">
          <ReservedPalette />

          <figure className="fg-safety-visual">
            <PhoneFrame variant="screenshot">
              <Shot
                name="en-route"
                alt="The current Fresh Greens en-route screen on a simulated downtown San Francisco route, with a green turn card, a moving top-down route map, the right-side safety column, a posted speed card, and the daylight arrival kept together in the bottom sheet."
              />
            </PhoneFrame>
            <figcaption className="fg-safety-visual-caption">
              Navy marks safety mode, red alerts, orange hazards, and the sun
              glyph daylight. Green carries the rest.
            </figcaption>
          </figure>
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="route-preview"
              alt="The current Fresh Greens route preview for Weeksville Heritage Center: a map at top with recenter and hazard controls, a bottom sheet showing a 30 min trip arriving at 3:15 PM over 13.6 mi, an All clear chip, a daylight indicator, and a green Go button."
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            Outside the four reserved colors, <code>/route-preview</code> uses
            a dashed sun-to-moon daylight gradient to trace the light along the
            route, from now until arrival.
          </figcaption>
        </figure>

        <div className="project-section-body">
          <p>
            Every color signal has a second channel. <code>/report</code> pairs
            severity with a filled warning glyph (WCAG 1.4.1).
          </p>
        </div>

      </section>
      </ProjectChapter>

      {/* ── Section 7: Where the argument gets tested ── */}
      <ProjectChapter
        entry={chapters[4]}
        index={5}
        total={chapters.length}
        variant="fresh-greens"
      >
        <div className="project-section fg-section fg-section--wide">
        <div className="project-section-body">
          <p>
            Community reports can be useful without being verified. When
            Supabase is configured, <code>/moderation</code> shows the source
            device, prior and nearby reports, duplicate IP or device checks,
            review actions, and an audit log.
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
              Drivers contribute context without claiming verification.
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
              Structured place and welcome tags sit beside an optional written
              experience.
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
            <span className="fg-mod-arrow" aria-hidden="true" />
            <div className="fg-mod-stage fg-mod-stage--panel">
              <p className="fg-mod-stage-label">Investigation panel</p>
              <ul className="fg-mod-checks" role="list">
                <li>Source device</li>
                <li>Prior reports at the same spot</li>
                <li>Nearby reports</li>
                <li>Coordination: duplicate IPs and devices</li>
              </ul>
            </div>
            <span className="fg-mod-arrow" aria-hidden="true" />
            <div className="fg-mod-stage">
              <p className="fg-mod-stage-label">Human decision</p>
              <p className="fg-mod-stage-text">
                Reviewed, hidden, restored, or removed
              </p>
            </div>
          </div>
        </div>

        </div>
      </ProjectChapter>

      {/* ── Section 8: What was built, and what still needs proof ─── */}
      <ProjectChapter
        entry={chapters[5]}
        index={6}
        total={chapters.length}
        variant="fresh-greens"
      >
        <div className="project-section fg-section fg-scope">

        <div className="fg-scope-grid">
          <div className="fg-scope-col">
            <p className="fg-scope-label">Built in the working prototype</p>
            <ul className="fg-scope-list" role="list">
              <li>
                Route scoring from OpenStreetMap, DOT-511, Mapbox/OSRM,
                SunCalc, and community reports, explained through chips and
                source cards
              </li>
              <li>
                Six offline safety surfaces, including ACLU-sourced guidance
                and on-device audio capture in <code>/pulled-over</code>
              </li>
              <li>
                Reserved-color system and warm surface ramp across 26+ screens,
                with 300+ accessibility attributes and 62 Figma variables
              </li>
              <li>
                <code>/moderation</code> investigation panels, coordination
                checks, configured Supabase actions, and hold-to-remove
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
                Shared-report and failure-mode testing across configured
                Supabase builds
              </li>
              <li>
                A public moderation transparency page and device testing beyond
                iPhone
              </li>
            </ul>
          </div>
        </div>

        <div className="project-section-body fg-scope-closer">
          <p>
            The Held-Question rule, route chips, and source cards trace back to
            interviews. I&apos;d still test routes, moderation outcomes, and
            failure cases with more Black drivers before calling any route
            safer.
          </p>
        </div>
        </div>
      </ProjectChapter>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

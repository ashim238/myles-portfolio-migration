import type { Metadata } from "next";
import { Jost, Lato } from "next/font/google";
import Link from "next/link";
import { LeadMedia } from "@/components/lead-media";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import {
  CompositionStrip,
  HeatmapExplorer,
  HeuristicInsightCards,
  NaviAnimReady,
  SurveyStatRings,
} from "@/components/navi";
import { NaviDemoEmbed } from "@/components/navi-demo-embed";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { NAVI_SURVEY_META } from "@/lib/navi-survey-data";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-navi-display",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-navi-ui",
  display: "swap",
});

const NAVI_DESCRIPTION =
  "Connecting visitors to New York City's local heartbeat: a regenerative travel platform concept built on resident research.";

export const metadata: Metadata = {
  title: "Navi",
  description: NAVI_DESCRIPTION,
  openGraph: {
    title: "Navi",
    description: NAVI_DESCRIPTION,
    type: "article",
  },
};

export default async function NaviPage() {
  const project = await getProjectBySlug("navi");
  const allProjects = await getPublishedProjects();

  return (
    <main
      className={`page-shell project-page nv-page ${jost.variable} ${lato.variable}`}
      id="main-content"
      data-project-slug="navi"
    >
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <TransitionLink href="/#work">
          <span aria-hidden="true">← </span>
          Selected work
        </TransitionLink>
      </nav>

      <section className="hero project-hero nv-hero" aria-labelledby="nv-title">
        <p className="nv-eyebrow">Graduate studio · 2025</p>
        <h1 id="nv-title" className="project-hero-title nv-title">
          Navi
        </h1>
        <p className="project-hero-lede nv-lede">
          {project?.summary ??
            "Connecting visitors to New York City's local heartbeat."}
        </p>
      </section>

      <LeadMedia cover="/projects/navi/cover.png" alt="Navi cover" />
      <RecruiterCut
        problem="NYC tourism defaults to top-ten checklists that skip the neighborhoods and people who make the city."
        role="UI/UX Designer"
        timeline="January 2025 – June 2025"
        stack="Figma, research"
        outcomeValue={project?.outcomeMetricValue}
        outcomeLabel={project?.outcomeMetricLabel}
        moves={[
          "Mapped tourist density across Manhattan to find where the checklists cluster.",
          "Ran three user groups and six platforms through one heuristic evaluation.",
          "Turned the research into a neighborhood-participation framework.",
        ]}
      />

      <ProjectToc
        sections={[
          { title: "A regenerative travel platform", id: "nv-intro" },
          { title: "Before the research, a Manhattan heatmap", id: "nv-heatmap" },
          { title: "Three user groups, six platforms", id: "nv-research" },
          { title: "What the data did (and did not) say", id: "nv-insights" },
          { title: "From research to framework", id: "nv-framework" },
          { title: "Building a system", id: "nv-system" },
          { title: "See it in product", id: "nv-screens" },
          { title: "What Navi proved", id: "nv-outcome" },
        ]}
      />

      <div className="case-tier-divider"><span>The full breakdown ↓</span></div>

      <section className="project-section nv-section" aria-labelledby="nv-intro">
        <h2 id="nv-intro">A regenerative travel platform for New York City</h2>
        <p className="case-section-lead">
          Connecting visitors to neighborhood-level experiences returns value to the communities they visit.
        </p>
        <div className="project-section-body">
          <p>
            New York City sees over 60 million visitors each year. Most go to the same ten
            places. Meanwhile, local businesses outside those corridors struggle for visibility,
            and residents absorb the side effects of concentrated foot traffic.
          </p>
          <p>
            Navi was designed to change that dynamic by connecting visitors
            to neighborhood-level experiences that return value to the
            communities they visit.
          </p>
        </div>
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-heatmap">
        <h2 id="nv-heatmap">Before the research, a Manhattan heatmap</h2>
        <p className="case-section-lead">
          Mapping tourist density showed where the checklists cluster and where neighborhoods get skipped.
        </p>
        <div className="project-section-body">
          <p>
            Before any of the user interviews, the first move was visual. Tourists overload a handful of spots, and the patterns are easy to picture: the swaths of people taking photos in front of the Brooklyn Bridge in Dumbo, the perpetual crush around Times Square. If a routing layer could see this imbalance in real time, the thinking went, it could steer visitors toward neighborhoods that get less attention.
          </p>
          <p>
            Select a neighborhood to see how that early concept worked. Regions represent narrative emphasis, not live geo analytics. This is the prototype that would have shipped on day one.{" "}
            <mark className="case-highlight">The research pushed back.</mark>
          </p>
          <p>
            The instinct felt right, and also a little like a bandaid. Routing tourists somewhere quieter still lets them visit that place the same shallow way. So before committing to redirection as the lever, the next step was talking to the people who would actually use the thing.
          </p>
        </div>
        <HeatmapExplorer />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-research">
        <h2 id="nv-research">Three user groups, six platforms, one heuristic evaluation</h2>
        <p className="case-section-lead">
          Auditing six platforms and surveying three groups reframed the problem away from congestion.
        </p>
        <blockquote className="case-pullquote">Residents did not want fewer tourists. They wanted visitors who engage more intentionally.</blockquote>
        <div className="project-section-body">
          <p>
            We audited six travel platforms and ran a heuristic evaluation of Airbnb using
            Nielsen&apos;s ten usability heuristics. Most tools were either transactional or
            editorial, but few connected discovery to community impact.
          </p>
          <p>
            We then surveyed tourism professionals, local business owners, and long-time residents.
            Residents provided the richest dataset and most strongly shaped the personas.
          </p>
          <p>
            Early on, the team considered a heatmap solution to reroute tourists away from
            congestion. The research reframed the problem, and it wasn&apos;t about volume.
          </p>
        </div>
        <HeuristicInsightCards />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-insights">
        <h2 id="nv-insights">What the data did (and did not) say</h2>
        <p className="case-section-lead">
          The research pointed to intentional participation, not more destinations.
        </p>
        <div className="project-section-body">
          <p>
            Residents consistently favored hidden gems over tourist traps and aligned with
            community-driven travel models.
          </p>
          <p>
            Major concerns included overcrowding, rising local costs, and the loss of neighborhood
            authenticity. Participants were open to AI personalization only
            when it remained subtle and transparent.
          </p>
          <p className="nv-survey-note">
            Highlights from {NAVI_SURVEY_META.responseCount} survey responses:{" "}
            {NAVI_SURVEY_META.source}.
          </p>
        </div>
        <SurveyStatRings />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-framework">
        <h2 id="nv-framework">From research to framework</h2>
        <p className="case-section-lead">
          Three personas fed a Learn, Plan, Go structure that journey mapping validated.
        </p>
        <div className="project-section-body">
          <p>
            Three personas emerged: Cain (group planner), Ororo (newcomer needing context), and
            Selina (commuter needing precision filters).
          </p>
          <p>
            Given semester time constraints and no engineering handoff, the team focused on a
            coherent concept with real neighborhoods, realistic pricing, and clear user pathways.
          </p>
          <p>
            The resulting framework was{" "}
            <mark className="case-highlight">Learn, Plan, Go</mark>:
          </p>
          <ul>
            <li>
              <strong>Learn</strong> surfaces local context.
            </li>
            <li>
              <strong>Plan</strong> helps users compare and organize.
            </li>
            <li>
              <strong>Go</strong> converts intent into bookings.
            </li>
          </ul>
          <p>Journey mapping validated the structure across all three personas.</p>
        </div>
      </section>

      <section
        className="project-section nv-section project-section--wide nv-section--wide"
        aria-labelledby="nv-system"
      >
        <h2 id="nv-system">Building a system that reflects the New York state of mind</h2>
        <p className="case-section-lead">
          Every type, color, and spacing choice traces back to a research finding or a persona need.
        </p>
        <div className="project-section-body">
          <p>
            Every design decision linked back to research findings or
            persona needs.
          </p>
          <p>
            Jost was selected for display typography to echo urban wayfinding cues. Orange became
            the primary accent to differentiate Navi from category defaults. Paired with Lato and a
            4px spacing system, the UI remains readable and consistent across breakpoints.
          </p>
          <p>
            The full system lives as a running component library, with the brand
            primitives, the semantic aliases, every interactive variant, and a live
            playground for flipping props. <Link href="/work/navi/system">See the Navi
            design system</Link>. The components are also assembled into a working
            booking flow. <Link href="/work/navi/demo">Open the demo</Link>.
          </p>
        </div>
        <CompositionStrip />
      </section>

      <section className="project-section nv-section project-section--wide nv-section--wide" aria-labelledby="nv-screens">
        <h2 id="nv-screens">See it in product</h2>
        <p className="case-section-lead">
          Every screen in this section is pulled from the running build, not mocked up for the page.
        </p>
        <div className="project-section-body">
          <p>
            The Navi system runs as a real, interactive product, not a
            static screenshot. Browse the feed, search a neighborhood on the map, open
            a host and try a booking. Everything is assembled from the components
            catalogued on the system page, which means the system shows up in the
            product the way it was meant to.
          </p>
        </div>
        <NaviDemoEmbed />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-outcome">
        <h2 id="nv-outcome">What Navi proved and where it goes next</h2>
        <p className="case-section-lead">
          The heatmap solved the symptom. Navi went after the cause, and concept testing backed the shift.
        </p>
        <div className="project-section-body">
          <p>
            What started as a heatmap turned out to be solving the wrong problem. Concentration is the symptom. Disconnection from local culture and economy is the cause, and Navi is the platform that came from chasing the cause.
          </p>
          <p>Next opportunities include deeper neighborhood pages within Learn
            (surfacing history, local voices, and seasonal rhythms), richer
            collaborative planning tools for group travelers, and onboarding
            paths for local hosts and businesses to list their own experiences.
          </p>
          <p>
            In concept testing,{" "}
            <mark className="case-highlight">
              78% preferred neighborhood-led recommendations over generic
              top-ten lists
            </mark>
            . That number is what Navi proved: community-centered travel
            holds up when the recommendations carry local context.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="navi" projects={allProjects} />
      <CaseHighlightObserver />
      <NaviAnimReady />
    </main>
  );
}

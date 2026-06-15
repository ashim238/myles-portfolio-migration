import type { Metadata } from "next";
import { Jost, Lato } from "next/font/google";
import Link from "next/link";
import { ExpandableImage } from "@/components/expandable-image";
import { ProjectCover } from "@/components/project-cover";
import { SiteNav } from "@/components/site-nav";
import { ProjectHighlight } from "@/components/project-highlight";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import {
  CompositionStrip,
  DesignSystemShowroom,
  HeatmapExplorer,
  HeuristicInsightCards,
  SurveyStatRings,
} from "@/components/navi";
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
        <Link href="/#work">
          <span aria-hidden="true">← </span>
          Selected work
        </Link>
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

      <ProjectCover
        src="/projects/navi/cover.png"
        alt="Navi cover: neighborhood-led travel platform for New York City"
        priority
      />

      <dl className="project-meta nv-meta" aria-label="Project details">
        <div className="project-meta-field">
          <dt>Role</dt>
          <dd>{project?.role ?? "UI/UX Designer"}</dd>
        </div>
        <div className="project-meta-field">
          <dt>Timeframe</dt>
          <dd>{project?.timeframe ?? "January 2025 – June 2025"}</dd>
        </div>
        <div className="project-meta-field">
          <dt>Tags</dt>
          <dd>{project?.tags?.join(" · ") ?? "Product Design · Research · Strategy"}</dd>
        </div>
      </dl>

      <ProjectHighlight
        quote={project?.highlightQuote}
        metricValue={project?.outcomeMetricValue}
        metricLabel={project?.outcomeMetricLabel}
      />

      <ProjectToc
        sections={[
          { title: "A regenerative travel platform", id: "nv-intro" },
          { title: "Three user groups, six platforms", id: "nv-research" },
          { title: "What the data did (and did not) say", id: "nv-insights" },
          { title: "From research to framework", id: "nv-framework" },
          { title: "Building a system", id: "nv-system" },
          { title: "What it looks like in product", id: "nv-screens" },
          { title: "Rethinking concentration", id: "nv-heatmap" },
          { title: "What Navi proved", id: "nv-outcome" },
        ]}
      />

      <section className="project-section nv-section" aria-labelledby="nv-intro">
        <h2 id="nv-intro">A regenerative travel platform for New York City</h2>
        <div className="project-section-body">
          <p>
            New York City sees over 60 million visitors each year. Most go to the same ten
            places. Meanwhile, local businesses outside those corridors struggle for visibility,
            and residents absorb the side effects of concentrated foot traffic.
          </p>
          <p>
            Navi was designed to change that dynamic by connecting visitors to neighborhood-level
            experiences that return value to the communities they visit.
          </p>
        </div>
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-research">
        <h2 id="nv-research">Three user groups, six platforms, one heuristic evaluation</h2>
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
            congestion. The research reframed the problem: residents did not want fewer tourists;
            they wanted visitors who engage more intentionally.
          </p>
        </div>
        <HeuristicInsightCards />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-insights">
        <h2 id="nv-insights">What the data did (and did not) say</h2>
        <div className="project-section-body">
          <p>
            Residents consistently favored hidden gems over tourist traps and aligned with
            community-driven travel models.
          </p>
          <p>
            Major concerns included overcrowding, rising local costs, and the loss of neighborhood
            authenticity. Participants were open to AI personalization only when it remained subtle
            and transparent.
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
            The resulting framework was <strong>Learn, Plan, Go</strong>:
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
        <div className="nv-persona-grid">
          <ExpandableImage
            src="/projects/navi/persona-cain.png"
            alt="Cain persona: group planner who coordinates schedules and budgets"
            width={1200}
            height={900}
            sizes="(max-width: 768px) 92vw, 32vw"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
          />
          <ExpandableImage
            src="/projects/navi/persona-ororo.png"
            alt="Ororo persona: newcomer who needs neighborhood context"
            width={1200}
            height={900}
            sizes="(max-width: 768px) 92vw, 32vw"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
          />
          <ExpandableImage
            src="/projects/navi/persona-selina.png"
            alt="Selina persona: commuter who needs precision filters"
            width={1200}
            height={900}
            sizes="(max-width: 768px) 92vw, 32vw"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
          />
        </div>
      </section>

      <section
        className="project-section nv-section project-section--wide nv-section--wide"
        aria-labelledby="nv-system"
      >
        <h2 id="nv-system">Building a system that reflects the New York state of mind</h2>
        <div className="project-section-body">
          <p>
            Every design decision linked back to research findings or persona needs.
          </p>
          <p>
            Jost was selected for display typography to echo urban wayfinding cues. Orange became
            the primary accent to differentiate Navi from category defaults. Paired with Lato and a
            4px spacing system, the UI remains readable and consistent across breakpoints.
          </p>
          <p>
            The homepage emphasized editorial curation over algorithmic volume. Labels such as{" "}
            <em>Locally owned</em> and <em>Nature first</em> gave users trust signals at a glance.
          </p>
        </div>
        <DesignSystemShowroom />
        <CompositionStrip />
      </section>

      <section
        className="project-section nv-section project-section--wide"
        aria-labelledby="nv-screens"
      >
        <h2 id="nv-screens">What it looks like in product</h2>
        <div className="project-section-body">
          <p>
            On the activity flow, Learn-Plan-Go came together through neighborhood context,
            collaborative planning tools, and transit-aware navigation.
          </p>
        </div>
        <div className="nv-screen-grid">
          <ExpandableImage
            src="/projects/navi/desktop-screens.png"
            alt="Navi desktop screens: homepage and neighborhood discovery"
            width={2400}
            height={1400}
            sizes="(max-width: 768px) 92vw, 900px"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
          />
          <ExpandableImage
            src="/projects/navi/interface-composition.png"
            alt="Navi interface composition: editorial cards and trust labels"
            width={2400}
            height={1400}
            sizes="(max-width: 768px) 92vw, 900px"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
          />
          <ExpandableImage
            src="/projects/navi/flow-view-1.png"
            alt="Navi experience flow: Learn neighborhood context"
            width={1200}
            height={900}
            sizes="(max-width: 768px) 92vw, 30vw"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
          />
          <ExpandableImage
            src="/projects/navi/flow-view-2.png"
            alt="Navi experience flow: Plan with collaborators"
            width={1200}
            height={900}
            sizes="(max-width: 768px) 92vw, 30vw"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
          />
          <ExpandableImage
            src="/projects/navi/flow-view-3.png"
            alt="Navi experience flow: Go with transit-aware navigation"
            width={1200}
            height={900}
            sizes="(max-width: 768px) 92vw, 30vw"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
          />
        </div>
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-heatmap">
        <h2 id="nv-heatmap">Rethinking concentration</h2>
        <div className="project-section-body">
          <p>
            <strong>Welcome to Manhattan</strong>, an early concept for how neighborhood context
            could surface before a visitor commits to a destination. This explorer is illustrative:
            regions represent narrative emphasis, not live geo analytics.
          </p>
          <p>
            Select a neighborhood to see how Learn might highlight inclusive history and local
            rhythm instead of defaulting to the same ten stops.
          </p>
        </div>
        <HeatmapExplorer />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-outcome">
        <h2 id="nv-outcome">What Navi proved and where it goes next</h2>
        <div className="project-section-body">
          <p>
            Navi showed that community-centered travel can be both practical and desirable when
            recommendations are curated with local context.
          </p>
          <p>
            The concept validated that intent-rich exploration scales better than algorithmic
            browsing when the goal is meaningful neighborhood engagement.
          </p>
          <p>Next opportunities include:</p>
          <ul>
            <li>
              Deeper neighborhood pages within Learn, surfacing history, local voices, and seasonal
              rhythms.
            </li>
            <li>
              Richer collaborative planning tools for group travelers coordinating across schedules
              and interests.
            </li>
            <li>
              Onboarding paths for local hosts and businesses to list and manage their own
              experiences.
            </li>
          </ul>
        </div>
        <ExpandableImage
          src="/projects/navi/final-mockup.png"
          alt="Final Navi mockup: neighborhood-led travel homepage"
          width={2400}
          height={1600}
          sizes="(max-width: 768px) 92vw, 900px"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
        />
      </section>

      <ProjectWorkJump currentSlug="navi" projects={allProjects} />
    </main>
  );
}

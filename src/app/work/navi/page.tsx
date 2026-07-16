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
import { NaviResearchArtifacts } from "@/components/navi/research-artifacts";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { NAVI_SURVEY_META } from "@/lib/navi-survey-data";
import { createRouteMetadata } from "@/lib/site-config";

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
  "A regenerative travel platform concept for NYC neighborhood experiences, developed in a graduate studio and rebuilt for this portfolio.";

export const metadata: Metadata = createRouteMetadata({
  title: "Navi",
  description: NAVI_DESCRIPTION,
  path: "/work/navi",
  image: "/projects/navi/cover.png",
  type: "article",
});

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
            "A graduate-studio concept for neighborhood travel. I later rebuilt it as a working portfolio demo."}
        </p>
      </section>

      <LeadMedia
        cover="/projects/navi/cover.png"
        alt="Navi neighborhood experience search results and cards on a tablet on a wooden table."
      />
      <RecruiterCut
        problem="NYC tourism defaults to top-ten checklists that skip the neighborhoods and people who make the city."
        role="UI/UX Designer"
        timeline="January 2025 – June 2025"
        stack="Figma, research"
        stackLabel="Tools"
        outcomeValue={project?.outcomeMetricValue}
        outcomeLabel={project?.outcomeMetricLabel}
        moves={[
          "The team explored an early Manhattan redirection concept through a heatmap.",
          "The team audited six travel platforms and evaluated Airbnb with Nielsen's heuristics.",
          "The concept used a 14-response resident survey, three research-informed archetypes, and Learn, Plan, Go.",
        ]}
      />

      <ProjectToc
        sections={[
          { title: "Concentrated tourism as a routing problem", id: "nv-intro" },
          { title: "The first prototype: a Manhattan heatmap", id: "nv-heatmap" },
          {
            title: "Platform audits and resident research",
            id: "nv-research",
          },
          { title: "The resident survey redirected the concept", id: "nv-insights" },
          { title: "Mapping the experience before the build", id: "nv-framework" },
          { title: "Rebuilding Navi as a working system", id: "nv-system" },
          { title: "A working booking flow", id: "nv-screens" },
          { title: "What I would validate next", id: "nv-outcome" },
        ]}
      />

      <section className="project-section nv-section" aria-labelledby="nv-intro">
        <h2 id="nv-intro">Concentrated tourism as a routing problem</h2>
        <p className="case-section-lead">
          The early design premise treated concentrated tourism as a routing problem.
        </p>
        <div className="project-section-body">
          <p>
            That premise came before the resident survey and without a live tourist-density
            dataset. The first concept explored how redirection might distribute attention across
            more Manhattan neighborhoods.
          </p>
          <p>
            The next concept paired neighborhood-level experiences and local context with trip
            planning.
          </p>
        </div>
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-heatmap">
        <h2 id="nv-heatmap">The first prototype: a Manhattan heatmap</h2>
        <p className="case-section-lead">
          A Manhattan heatmap turned the routing premise into an exploratory artifact.
        </p>
        <div className="project-section-body">
          <p>
            Before the survey, the team sketched a routing layer that could redirect a visitor
            from one Manhattan neighborhood to another. It did not claim to measure actual
            tourist density.
          </p>
          <p>
            Select a neighborhood to see how that first artifact worked. Regions represent
            narrative emphasis, not live geo analytics. The current interactive reconstruction
            keeps that same constraint.
          </p>
          <p>
            Even within the premise, sending someone somewhere quieter left the visit itself
            unchanged. Before committing to redirection as the lever, the next step was the
            resident survey.
          </p>
        </div>
        <HeatmapExplorer />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-research">
        <h2 id="nv-research">Platform audits and resident research</h2>
        <div className="project-section-body">
          <p>
            The team audited six travel platforms. I evaluated Airbnb with Kaori Ogawa and Amy
            Zhang against Nielsen&apos;s ten usability heuristics. The evaluation
            surfaced issues with label consistency, family-facing filters, and visual clutter.
          </p>
          <p>
            The resident survey produced 14 responses. That dataset is the source for the two
            survey findings shown below.
          </p>
          <p>
            The next concept direction focused on neighborhood context and participation instead.
          </p>
        </div>
        <HeuristicInsightCards />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-insights">
        <h2 id="nv-insights">The resident survey redirected the concept</h2>
        <p className="case-section-lead">
          Two concerns appeared most often in the 14-response resident survey.
        </p>
        <div className="project-section-body">
          <p>
            Of the 14 responses, 71% were concerned about overcrowding and over-tourism. Another
            50% were concerned about a lack of authentic experiences.
          </p>
          <p className="nv-survey-note">
            Highlights from {NAVI_SURVEY_META.responseCount} survey responses:{" "}
            {NAVI_SURVEY_META.source}.
          </p>
        </div>
        <SurveyStatRings />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-framework">
        <h2 id="nv-framework">Mapping the experience before the build</h2>
        <p className="case-section-lead">
          I created three research-informed archetypes from the survey findings, platform audits,
          and secondary research.
        </p>
        <div className="project-section-body">
          <p>
            Cain framed group planning, Ororo needed neighborhood context, and Selina needed
            precise filters for shorter trips.
          </p>
          <p>
            The graduate-studio project stopped at a concept without an engineering handoff. Its
            journey maps and user flows were internal planning artifacts. They connected
            neighborhood exploration to residents wanting nearby activity without repeatedly
            concentrating visits in tourist-heavy areas.
          </p>
          <p>
            For booking, the Airbnb audit and secondary research pointed to clear cost,
            requirements, and timing. That transparency also mattered for trust when booking with
            lesser-known vendors.
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
        </div>
        <NaviResearchArtifacts />
      </section>

      <section
        className="project-section nv-section project-section--wide nv-section--wide"
        aria-labelledby="nv-system"
      >
        <h2 id="nv-system">Rebuilding Navi as a working system</h2>
        <div className="project-section-body">
          <p>
            For this portfolio case study, I rebuilt the Navi visual system as live React
            components.
          </p>
          <p>
            Jost was selected for display typography to echo urban wayfinding cues. Orange became
            the primary accent to distinguish Navi from the travel platforms in the audit. The
            portfolio rebuild pairs it with Lato and a 4px spacing system.
          </p>
          <p>
            The rebuild includes brand primitives, semantic aliases, interactive variants, and a
            playground for changing component props. <Link href="/work/navi/system">See the Navi
            design system</Link>. Those components are assembled into a working booking flow.{" "}
            <Link href="/work/navi/demo">Open the demo</Link>.
          </p>
        </div>
        <CompositionStrip />
      </section>

      <section className="project-section nv-section project-section--wide nv-section--wide" aria-labelledby="nv-screens">
        <h2 id="nv-screens">A working booking flow</h2>
        <p className="case-section-lead">
          The screens below come from the current React build.
        </p>
        <div className="project-section-body">
          <p>
            The graduate-studio concept did not ship. The current demo is a portfolio rebuild that
            lets you browse the feed, search a neighborhood on the map, open a host, and try the
            booking flow. It uses the same components catalogued on the system page.
          </p>
        </div>
        <NaviDemoEmbed />
      </section>

      <section className="project-section nv-section" aria-labelledby="nv-outcome">
        <h2 id="nv-outcome">What I would validate next</h2>
        <div className="project-section-body">
          <p>
            Deeper neighborhood pages in Learn and onboarding for local hosts and businesses still
            need validation with users.{" "}
            {"Group booking remains a future opportunity and is not wired into the current rebuild."}
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="navi" projects={allProjects} />
      <CaseHighlightObserver />
      <NaviAnimReady />
    </main>
  );
}

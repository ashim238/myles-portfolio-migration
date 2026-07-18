import type { Metadata } from "next";
import { Jost, Lato } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadMedia } from "@/components/lead-media";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
import { SiteNav } from "@/components/site-nav";
import { ProjectChapter } from "@/components/project-chapter";
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
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
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

const chapters = CASE_STUDY_CHAPTERS.navi;

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
  if (!project || project.status !== "published") {
    notFound();
  }

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
        width={2048}
        height={1365}
      />
      <RecruiterCut
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

      <ProjectToc sections={chapters} />

      <ProjectChapter
        entry={chapters[0]}
        index={1}
        total={chapters.length}
        variant="navi"
      >
      <div className="project-section nv-section">
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
      </div>

      <section className="project-section nv-section" aria-labelledby="nv-heatmap">
        <h3 className="project-evidence-heading" id="nv-heatmap">
          The first prototype: a Manhattan heatmap
        </h3>
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
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[1]}
        index={2}
        total={chapters.length}
        variant="navi"
      >
      <section className="project-section nv-section" aria-labelledby="nv-research">
        <h3 className="project-evidence-heading" id="nv-research">
          Platform audits and resident research
        </h3>
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

      <div className="project-section nv-section">
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
      </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[2]}
        index={3}
        total={chapters.length}
        variant="navi"
      >
      <div className="project-section nv-section project-section--wide nv-section--wide">
        <div className="project-section-body">
          <p className="case-section-lead">
            I created three research-informed archetypes from the survey findings, platform audits,
            and secondary research.
          </p>
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
      </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[3]}
        index={4}
        total={chapters.length}
        variant="navi"
      >
      <section
        className="project-section nv-section project-section--wide nv-section--wide"
        aria-labelledby="nv-system"
      >
        <h3 className="project-evidence-heading" id="nv-system">
          Rebuilding Navi as a working system
        </h3>
        <div className="project-section-body">
          <p>
            For this portfolio case study, I translated the Navi visual system into live React
            components.
          </p>
          <p>
            Jost was selected for display typography to echo urban wayfinding cues. Orange became
            the primary accent to distinguish Navi from the travel platforms in the audit. The
            palette pairs it with Lato and a 4px spacing system.
          </p>
          <p>
            The portfolio rebuild includes brand primitives, semantic aliases, interactive
            variants, and a playground for changing component props. <Link href="/work/navi/system">See the Navi
            design system</Link>. Those components are assembled into a working booking flow.{" "}
            <Link href="/work/navi/demo">Open the demo</Link>.
          </p>
        </div>
        <CompositionStrip />
      </section>

      <section
        className="project-section nv-section project-section--wide nv-section--wide"
        aria-labelledby="nv-screens"
      >
        <h3 className="project-evidence-heading" id="nv-screens">
          A working booking flow
        </h3>
        <p className="case-section-lead">
          The screens below come from the current React build.
        </p>
        <div className="project-section-body">
          <p>
            I rebuilt the concept as live React components and connected them to an individual
            booking flow. You can browse the feed, search by neighborhood, open a host, and
            complete a sample reservation with the same components catalogued on the system page.
          </p>
        </div>
        <NaviDemoEmbed />
      </section>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[4]}
        index={5}
        total={chapters.length}
        variant="navi"
      >
      <div className="project-section nv-section nv-closing">
        <p className="case-section-lead">
          The current demo makes the interaction model clickable.
        </p>
        <div className="project-section-body">
          <p>
            I can now inspect the component states and individual booking flow in a browser. I
            still need to test them with residents, travelers, and local hosts before treating
            those choices as settled.
          </p>
        </div>
        <div className="nv-validation-ledger">
          <section aria-labelledby="nv-current-rebuild">
            <h3 id="nv-current-rebuild">Working now</h3>
            <ul>
              <li>Live component system and editable variants</li>
              <li>Neighborhood exploration and filters</li>
              <li>Working individual booking flow</li>
            </ul>
          </section>
          <section aria-labelledby="nv-next-research">
            <h3 id="nv-next-research">Next research</h3>
            <ul>
              <li>Deeper Learn pages</li>
              <li>Local host and business onboarding</li>
              <li>
                {"Group booking remains a future opportunity and is not wired into this demo."}
              </li>
            </ul>
          </section>
        </div>
        <div className="nv-closing-links" aria-label="Explore the working Navi demo">
          <Link href="/work/navi/demo">Open the demo</Link>
          <Link href="/work/navi/system">View the design system</Link>
        </div>
      </div>
      </ProjectChapter>

      <ProjectWorkJump currentSlug="navi" projects={allProjects} />
      <CaseHighlightObserver />
      <NaviAnimReady />
    </main>
  );
}

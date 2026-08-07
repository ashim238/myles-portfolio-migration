import type { Metadata } from "next";
import { Jost, Lato } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadMedia } from "@/components/lead-media";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
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
import {
  NAVI_SURVEY_META,
  NAVI_SURVEY_STATS,
} from "@/lib/navi-survey-data";
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
const [overcrowdingStat, authenticExperienceStat] = NAVI_SURVEY_STATS;

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
    <ReaderShell
      slug="navi"
      title="Navi"
      className={`nv-page ${jost.variable} ${lato.variable}`}
    >
      <nav className="project-topbar" aria-label="Breadcrumb">
        <TransitionLink href="/#work">
          <span aria-hidden="true">←</span>
          Selected work
        </TransitionLink>
      </nav>

      <section className="hero project-hero nv-hero" aria-labelledby="nv-title">
        <p className="nv-eyebrow">Graduate studio · 2025</p>
        <h1 id="nv-title" className="project-hero-title nv-title">Navi</h1>
        <p className="project-hero-lede nv-lede">
          I collected 14 resident and stakeholder responses, including two local
          businesses, for a graduate-studio travel concept. What I learned redirected
          the team&apos;s early Manhattan heatmap toward neighborhood context.
          The next concept focused on helping people learn, plan, and book after
          choosing a place.
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
        stack="Figma, FigJam, React, TypeScript"
        stackLabel="Tools"
        evidence={{
          type: "Working product demo",
          cta: "Try the booking flow",
          href: "/work/navi/demo",
        }}
        outcomeValue={project?.outcomeMetricValue}
        outcomeLabel={project?.outcomeMetricLabel}
        moves={[
          "Graduate studio: the team tested an early Manhattan redirection concept and audited six travel platforms.",
          "My contribution: I collected and synthesized 14 resident and stakeholder responses, including two local businesses, then created archetypes, journeys, opportunity areas, and flows.",
          "Solo rebuild: I turned Learn, Plan, Go into a React component system and working individual booking flow.",
        ]}
      />

      <ProjectToc sections={chapters} />

      <ProjectChapter entry={chapters[0]} index={1} total={chapters.length} variant="navi">
        <div className="project-section nv-section">
          <p className="case-section-lead">
            The early team concept could move a visitor to another neighborhood,
            but it didn&apos;t change how they engaged after arriving.
          </p>
          <div className="project-section-body">
            <p>
              The team used a Manhattan heatmap as an exploratory hypothesis to
              test whether redirecting visitors could distribute attention across
              more neighborhoods.
            </p>
            <p>
              That first artifact made movement on the map the outcome. The survey
              became the next step.
            </p>
          </div>
        </div>

        <section className="project-section nv-section" aria-labelledby="nv-heatmap">
          <h3 className="project-evidence-heading" id="nv-heatmap">
            The first prototype: a Manhattan heatmap
          </h3>
          <p className="case-section-lead">Select a neighborhood to see how the first artifact worked.</p>
          <div className="project-section-body">
            <p>
              The colored regions show where the early concept placed emphasis. They do not
              represent actual tourist density or live geo analytics, and this interactive
              reconstruction keeps the same constraint.
            </p>
          </div>
          <HeatmapExplorer />
        </section>
      </ProjectChapter>

      <ProjectChapter entry={chapters[1]} index={2} total={chapters.length} variant="navi">
        <section className="project-section nv-section" aria-labelledby="nv-research">
          <h3 className="project-evidence-heading" id="nv-research">Platform audits and resident research</h3>
          <div className="project-section-body">
            <p>
              I collected 14 resident and stakeholder responses, including two
              local businesses. The sample informed this concept. It doesn&apos;t
              stand in for all NYC residents.
            </p>
            <p>
              The team audited six travel platforms. I evaluated Airbnb with Kaori Ogawa and Amy Zhang
              against Nielsen&apos;s ten usability heuristics.
              The evaluation surfaced issues with label consistency, family-facing
              filters, and visual clutter.
            </p>
          </div>
          <HeuristicInsightCards />
        </section>

        <div className="project-section nv-section">
          <p className="case-section-lead">Two concerns appeared most often in the resident and stakeholder survey.</p>
          <div className="project-section-body">
            <p>
              {overcrowdingStat.count} of {NAVI_SURVEY_META.responseCount} responses (
              {overcrowdingStat.label}) named overcrowding and over-tourism.{" "}
              {authenticExperienceStat.count} of {NAVI_SURVEY_META.responseCount} (
              {authenticExperienceStat.label}) named a lack of authentic
              experiences.
            </p>
            <p className="nv-survey-note">
              Highlights from {NAVI_SURVEY_META.responseCount} responses,
              including {NAVI_SURVEY_META.localBusinessCount} local businesses:{" "}
              {NAVI_SURVEY_META.source}.
            </p>
          </div>
          <SurveyStatRings />
        </div>
      </ProjectChapter>

      <ProjectChapter entry={chapters[2]} index={3} total={chapters.length} variant="navi">
        <div className="project-section nv-section project-section--wide nv-section--wide">
          <div className="project-section-body">
            <p className="case-section-lead">
              I created three research-informed archetypes from the survey, platform audits, and
              secondary research.
            </p>
            <p>
              The graduate-studio project ended as a concept without an engineering handoff, so the
              journey maps and user flows remained internal planning artifacts.
            </p>
            <p>
              I used the archetypes, journey map, opportunity areas, and flows to
              connect the survey findings with neighborhood exploration.
            </p>
            <p>
              The Airbnb audit and secondary research shaped the individual booking flow. Cost,
              requirements, and timing stayed visible at key decisions, especially when a lesser-known
              vendor needed to earn trust.
            </p>
            <p>
              The research changed the product question. Instead of treating
              movement on the map as the outcome, I organized the next concept
              around <mark className="case-highlight">Learn, Plan, Go</mark>:
            </p>
            <ul>
              <li><strong>Learn</strong> surfaces local context.</li>
              <li><strong>Plan</strong> helps users compare and organize.</li>
              <li><strong>Go</strong> converts intent into bookings.</li>
            </ul>
          </div>
          <NaviResearchArtifacts />
        </div>
      </ProjectChapter>

      <ProjectChapter entry={chapters[3]} index={4} total={chapters.length} variant="navi">
        <section
          className="project-section nv-section project-section--wide nv-section--wide"
          aria-labelledby="nv-system"
        >
          <h3 className="project-evidence-heading" id="nv-system">Rebuilding Navi as a working system</h3>
          <div className="project-section-body">
            <p>
              The graduate-studio project ended as a Figma concept. Later, working alone,
              I rebuilt the concept by turning Learn, Plan, Go into a React
              and TypeScript component system and a working individual booking
              flow.
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
          <h3 className="project-evidence-heading" id="nv-screens">A working booking flow</h3>
          <p className="case-section-lead">The screens below come from the current React build.</p>
          <div className="project-section-body">
            <p>
              In the current build, you can browse the feed, search by
              neighborhood, open a host, and complete a sample individual
              reservation with the same components catalogued on the system page.
            </p>
          </div>
          <NaviDemoEmbed />
        </section>
      </ProjectChapter>

      <ProjectChapter entry={chapters[4]} index={5} total={chapters.length} variant="navi">
        <div className="project-section nv-section nv-closing">
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
                <li>{"Group booking remains a future opportunity and is not wired into this demo."}</li>
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
    </ReaderShell>
  );
}

import type { Metadata } from "next";
import { Jost, Lato } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadMedia } from "@/components/lead-media";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";
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
const naviProof = {
  label: "Try the booking flow",
  href: "/work/navi/demo",
};
const [overcrowdingStat, authenticExperienceStat] = NAVI_SURVEY_STATS;

const NAVI_DESCRIPTION =
  "A regenerative travel platform concept for NYC neighborhood experiences, developed in a graduate studio and rebuilt for this portfolio.";

export const metadata: Metadata = createRouteMetadata({
  title: "Navi",
  description: NAVI_DESCRIPTION,
  path: "/work/navi",
  image: "/og/navi",
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
          Work Stuff
        </TransitionLink>
      </nav>

      <section className="hero project-hero nv-hero" aria-labelledby="nv-title">
        <p className="nv-eyebrow">Graduate studio · 2025</p>
        <h1 id="nv-title" className="project-hero-title nv-title">Navi</h1>
        <p className="project-hero-lede nv-lede">
          The heatmap could show people where to go, but not what to do when
          they got there. Learn, Plan, Go grew out of that gap.
        </p>
      </section>

      <ProjectOpeningFacts
        role="UI/UX Designer"
        scope="I synthesized 14 resident and stakeholder responses, including two Manhattan businesses, adjusted the information architecture, and created the design system."
        outcome="A functional team Figma prototype, followed by my solo React portfolio demo."
        proof={naviProof}
      />
      <LeadMedia
        cover="/projects/navi/cover.png"
        alt="Navi neighborhood experience search results and cards on a tablet on a wooden table."
        width={2048}
        height={1365}
      />
      <RecruiterCut
        timeline="January 2025 – June 2025"
        tools="Figma, FigJam, React, TypeScript"
        moves={[
          "Tested: Other design students reviewed the homepage and search. We aligned card heights and cut copy and tags.",
          "Untested: The semester ended before Learn, Plan, Go or booking could be tested.",
          "Current demo: Plan's full cost breakdown and Go's routing are not built.",
        ]}
      />

      <ProjectToc sections={chapters} />

      <ProjectChapter entry={chapters[0]} index={1} total={chapters.length} variant="navi">
        <div className="project-section nv-section">
          <div className="project-section-body">
            <p>
              The brief asked how regenerative tourism could be participatory
              and contributive for visitors, local businesses and artisans,
              and longtime residents. The Manhattan heatmap was our first idea,
              not live tourist-density data.
            </p>
          </div>
        </div>

        <section className="project-section nv-section" aria-labelledby="nv-heatmap">
          <h3 className="project-evidence-heading" id="nv-heatmap">
            The first prototype: a Manhattan heatmap
          </h3>
          <div className="project-section-body">
            <p>
              The regions reflect early emphasis. We had no live
              tourist-density or geo-analytics data.
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
              Interviews were hard to recruit, so surveys became the primary
              method. I collected 14 resident and stakeholder responses,
              including two Manhattan businesses, and spoke with NYC Tourism.
              The sample included longtime residents and many college-aged
              people, so it doesn&apos;t stand in for all NYC residents.
            </p>
            <p>
              The team audited six travel platforms. I evaluated Airbnb with
              Kaori Ogawa and Amy Zhang against Nielsen&apos;s ten heuristics.
            </p>
          </div>
          <HeuristicInsightCards />
        </section>

        <div className="project-section nv-section">
          <p className="case-section-lead">Two survey concerns appeared most often.</p>
          <div className="project-section-body">
            <p>
              {overcrowdingStat.count} of {NAVI_SURVEY_META.responseCount} responses (
              {overcrowdingStat.label}) named overcrowding and over-tourism.{" "}
              {authenticExperienceStat.count} of {NAVI_SURVEY_META.responseCount} (
              {authenticExperienceStat.label}) named a lack of authentic
              experiences.
            </p>
            <p>
              Survey responses also raised rising costs, local-business
              displacement, repeat visitor relationships, and discovery outside
              traditional social platforms. Tourism professionals described
              regenerative work already happening citywide. From what I
              remember, people wanted deeper engagement with a neighborhood and
              its offerings.
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
              I grouped responses into three archetypes: digital nomads,
              ethical travelers, and visitors already contributing to
              communities. These were early audience hypotheses, not validated
              market segments.
            </p>
            <p>
              I used{" "}
              <mark className="case-highlight">Learn, Plan, Go</mark> to bridge
              customers and businesses:
            </p>
            <ul>
              <li>
                <strong>Learn</strong> covers the neighborhood, activity, and
                host so someone can try something new without feeling like a
                fish out of water.
              </li>
              <li>
                <strong>Plan</strong> is supposed to help someone, well, plan.
                It shows activity requirements and a small-business cost
                breakdown.
              </li>
              <li>
                <strong>Go</strong>{" "}shows eco-friendly ways to reach the event
                from the visitor&apos;s current location.
              </li>
            </ul>
            <p>
              In the prototype, visitors could choose a date and book directly
              with a partner in a separate module beside those stages.
            </p>
            <p>
              Cost, location, and event type were non-negotiable.
              Time-sensitive statuses came first. Going Fast reflected remaining
              availability. Popular was meant to compare tickets booked within
              a set window against other events. I didn&apos;t wire that logic into
              React. In another course, my team noticed Airbnb used Featured
              so often that it lost value. I kept that in mind here.
            </p>
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
              We didn&apos;t have engineering resources or a budget, so the
              project stayed in Figma. My teammate proposed the original
              information architecture. I tweaked it to match the personas and
              journey maps. The team had trouble working together. Our
              experience with design tools and schedules didn&apos;t line up. I
              created the design system from head to toe, saving time on
              aesthetic decisions and refocusing us on resident and
              business-owner insights. The journeys and flows were internal
              planning artifacts with no engineering handoff.
            </p>
            <p>
              The homepage was sort of a first pass at whether the system held
              up. Other design students tested the homepage and search, so it
              makes sense that feedback centered on layout. We matched heights,
              then cut tags and copy to lessen visual load.
            </p>
            <p>
              By the time the semester ended, we didn&apos;t have an opportunity to
              test Learn, Plan, Go or the booking flow. The functional Figma
              prototype included events that felt native to each neighborhood,
              a booking widget, and a profile of the event host. I had plans for
              group event coordination, but I was comfortable with that as a V1.
            </p>
            <p>
              After the semester, I rebuilt the system in React and TypeScript
              on my own. The current version covers the individual booking flow.
              Plan doesn&apos;t show the full cost breakdown yet. Go lists public
              transit, walking, and bike options for each activity, but it
              doesn&apos;t calculate a route from the visitor&apos;s current location yet.
            </p>
            <p className="nv-system-proof-links">
              The <Link href="/work/navi/system">system page</Link> and{" "}
              <Link href="/work/navi/demo">booking demo</Link> share components.
            </p>
          </div>
          <CompositionStrip />
        </section>

        <section
          className="project-section nv-section project-section--wide nv-section--wide"
          aria-labelledby="nv-screens"
        >
          <h3 className="project-evidence-heading" id="nv-screens">A working booking flow</h3>
          <NaviDemoEmbed />
        </section>
      </ProjectChapter>

      <ProjectChapter entry={chapters[4]} index={5} total={chapters.length} variant="navi">
        <div className="project-section nv-section nv-closing">
          <div className="project-section-body">
            <p>
              I could see NYC Tourism as a future partner, but that partnership
              hasn&apos;t happened. The browser demo supports the individual flow. I
              still need to test it with residents, travelers, and local hosts.
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

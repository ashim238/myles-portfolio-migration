import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpandableImage } from "@/components/expandable-image";
import { LeadMedia } from "@/components/lead-media";
import { LeadVideo } from "@/components/lead-video";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
import { ProjectToc } from "@/components/project-toc";
import { ProjectChapter } from "@/components/project-chapter";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { ArchitectureDiagram, PhoneFrame } from "@/components/fresh-greens";
import { DepartureReminderEvidence } from "@/components/fresh-greens/departure-reminder-evidence";
import { PivotJourney } from "@/components/fresh-greens/pivot-journey";
import { PulledOverJourney } from "@/components/fresh-greens/pulled-over-journey";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { createRouteMetadata } from "@/lib/site-config";

const chapters = CASE_STUDY_CHAPTERS["fresh-greens"];
const freshGreensProof = {
  label: "Try the safety-flow reconstruction",
  href: "#fg-pulled-over",
};

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
    <ReaderShell slug="fresh-greens" title="Fresh Greens" className="fg-page">
      <nav className="project-topbar" aria-label="Breadcrumb">
        <TransitionLink href="/#work">
          <span aria-hidden="true">←</span>
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
          Fresh Greens brings the safety knowledge Black drivers already use into
          route planning.
        </p>
      </section>

      <ProjectOpeningFacts
        role="Solo, design and engineering"
        scope="Six interviews shaped route comparison, reminders, stress support, reporting, and moderation."
        outcome="Working React Native prototype across 26+ screens."
        proof={freshGreensProof}
      />
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
          cta: freshGreensProof.label,
          href: freshGreensProof.href,
        }}
        outcomeValue="Working"
        outcomeLabel="Route planning, reminders, stress support, reporting, and moderation"
        moves={[]}
      />

      <ProjectToc sections={chapters} readingEndId="fg-scope" />

      <ProjectChapter entry={chapters[0]} index={1} total={chapters.length} variant="fresh-greens">
        <div className="project-section fg-section">
          <div className="project-section-body">
            <p>
              I grew up in Brooklyn and moved to rural South Jersey around age
              ten. Confederate flags on front lawns made night driving feel
              exposing. I worried about a police stop or car trouble in a place
              where asking for help might not feel safe.
            </p>
            <p>
              I still used Google Maps or Apple Maps, but at night I avoided
              backroads, drove comfortably below the speed limit, and kept my wallet
              within reach. That experience gave
              me a hypothesis, not proof. I interviewed six Black drivers.
            </p>
            <p>
              The Green Book helped Black travelers find places that would serve
              them. I use that as design lineage, not evidence that Fresh Greens
              is its digital successor. I wanted to explore what that principle
              could look like inside navigation.{" "}
              <a href="https://nmaahc.si.edu/explore/stories/traveling-through-jim-crow-america" rel="noreferrer" target="_blank">
                Source: Smithsonian National Museum of African American History
                and Culture
              </a>
              .
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter entry={chapters[1]} index={2} total={chapters.length} variant="fresh-greens">
        <div className="project-section fg-section fg-section--wide">
          <p className="case-section-lead">
            Participants described three problems with planning, stress, and
            trust.
          </p>
          <div className="fg-evidence-boundaries" aria-label="Three Fresh Greens product problems">
            <div className="fg-evidence-boundary">
              <p className="fg-evidence-label">Plan</p>
              <p>Drivers couldn&apos;t inspect conditions on each route before choosing. 6 of 6 connected trip timing to daylight, 5 of 6 raised road conditions, 5 of 6 raised police presence, and 3 of 6 raised wildlife.</p>
            </div>
            <div className="fg-evidence-boundary">
              <p className="fg-evidence-label">Respond</p>
              <p>Participants described preparing for police encounters and keeping help close when unexpected problems raised stress.</p>
            </div>
            <div className="fg-evidence-boundary">
              <p className="fg-evidence-label">Trust</p>
              <p>Useful community knowledge lived outside navigation and depended on reaching the right person. 5 of 6 asked family or friends before trusting an unfamiliar place.</p>
            </div>
          </div>
          <div className="project-section-body">
            <p>These interviews widened my hypothesis. Six interviews don&apos;t represent every Black driver.</p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter entry={chapters[2]} index={3} total={chapters.length} variant="fresh-greens">
        <section className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>Participants timed trips around daylight and compared clues outside maps that optimize time and distance. I moved from a Google Maps feature to a standalone route preview. Then I turned public and community inputs into inspectable route chips and source cards. They explain a route preference without proving it safer.</p>
          </div>
          <PivotJourney />
          <DepartureReminderEvidence />
          <ArchitectureDiagram />
        </section>
      </ProjectChapter>

      <ProjectChapter entry={chapters[3]} index={4} total={chapters.length} variant="fresh-greens">
        <section className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>High stress is the wrong time to search navigation. I hid four support paths behind one thumb-reachable control until requested.</p>
          </div>
          <PulledOverJourney />
          <div className="project-section-body">
            <p>The flow starts recording, puts reassurance first, and leaves trusted-contact actions visible. Roadside help, location sharing, guidance, and emergency steps work offline. That is built behavior, not evidence of a better encounter.</p>
          </div>
        </section>
      </ProjectChapter>

      <ProjectChapter entry={chapters[4]} index={5} total={chapters.length} variant="fresh-greens">
        <div className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>Public datasets are useful because their sources can be checked, but they can&apos;t describe how a place felt to the person who moved through it. I wanted each report to remain one person&apos;s account. Human review could hide or remove it only when it broke contribution rules.</p>
            <p>Separate reports from different community contributors would carry more weight over time, while a time-sensitive hazard could appear sooner. Where coverage was thin, Fresh Greens would show uncertainty instead of reading silence as safety.</p>
            <p><strong>Current prototype limit:</strong> one report maps to one scored zone, so it can affect route ranking on its own. Corroboration-weighted ranking is still an intended safeguard, not a built feature. Contributor provenance and trust levels aren&apos;t visible yet.</p>
          </div>
          <figure className="fg-safety-visual">
            <PhoneFrame variant="screenshot">
              <Shot name="report-detail" alt="The Fresh Greens Felt welcome contribution form over the en-route map, with place-type chips, welcoming-reason chips, an optional experience field, and a green Share your experience button with black text." />
            </PhoneFrame>
            <figcaption className="fg-safety-visual-caption">Structured tags keep each account specific while leaving room for context.</figcaption>
          </figure>
          <div className="fg-moderation" aria-label="How a report moves through moderation">
            <div className="fg-mod-flow">
              <div className="fg-mod-stage">
                <p className="fg-mod-stage-label">Enters</p>
                <p className="fg-mod-stage-text">A report joins the queue</p>
              </div>
              <span className="fg-mod-arrow" aria-hidden="true" />
              <div className="fg-mod-stage fg-mod-stage--panel">
                <p className="fg-mod-stage-label">Investigation panel</p>
                <ul className="fg-mod-checks" role="list">
                  <li>Source device</li><li>Prior reports at the same spot</li><li>Nearby reports</li><li>Coordination: duplicate IPs and devices</li>
                </ul>
              </div>
              <span className="fg-mod-arrow" aria-hidden="true" />
              <div className="fg-mod-stage">
                <p className="fg-mod-stage-label">Human decision</p>
                <p className="fg-mod-stage-text">Reviewed, hidden, restored, or removed</p>
              </div>
            </div>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter entry={chapters[5]} index={6} total={chapters.length} variant="fresh-greens">
        <div className="project-section fg-section fg-scope">
          <div className="project-section-body">
            <p>I turned six interviews into a working React Native prototype across more than 26 screens: route comparison, reminders, en-route guidance, stress support, reporting, and moderation. It can explain why it prefers one route without proving it safer. Testing with more Black drivers comes next.</p>
          </div>
          <div className="fg-scope-grid">
            <div className="fg-scope-col">
              <p className="fg-scope-label">Built now</p>
              <ul className="fg-scope-list" role="list">
                <li>Plan: route comparison explained through chips and source cards, plus local departure and refuel reminders</li>
                <li>Respond: one-thumb, offline support across five stress states</li>
                <li>Trust: contribution and moderation flows that keep reports reviewable</li>
              </ul>
            </div>
            <div className="fg-scope-col">
              <p className="fg-scope-label">What remains</p>
              <ul className="fg-scope-list" role="list">
                <li>Plan: route-quality testing with more Black drivers across regions before making any claim that a preferred route is safer</li>
                <li>Respond: stress-state and failure-mode testing on real devices and configured builds</li>
                <li>Trust: weighted ranking, visible provenance, trust levels, and public moderation transparency</li>
              </ul>
            </div>
          </div>
          <figure
            className="fg-en-route-video"
            data-evidence-proof="fresh-greens-en-route-video"
            data-evidence-role="supporting"
            data-evidence-kind="interaction"
            data-evidence-chapter="fg-scope"
          >
            <LeadVideo
              clip="/projects/fresh-greens/process/active-nav-flat-route.mp4"
              poster="/projects/fresh-greens/v2/en-route.png"
              width={1290}
              height={2796}
              alt="Fresh Greens running turn-by-turn navigation on a simulated downtown San Francisco route, with a turn card, moving route map, safety controls, current speed, and daylight arrival visible."
            />
            <figcaption className="fg-safety-visual-caption">
              En-route prototype on a simulated route.
            </figcaption>
          </figure>
        </div>
      </ProjectChapter>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
      <CaseHighlightObserver />
    </ReaderShell>
  );
}

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
    "Fresh Greens is a working React Native navigation prototype for Black drivers, based on interviews with six Black drivers across the South.",
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
          A navigation tool for Black drivers at different stages of a drive.
        </p>
      </section>

      <ProjectOpeningFacts
        role="Solo, design and engineering"
        scope="Six interviews helped me frame three problems: Plan, Respond, and Trust."
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
        timeline="Sep 2025 – Jun 2026"
        tools="Figma, Illustrator, Claude, React Native, Expo, TypeScript, Supabase"
        moves={[]}
      />

      <ProjectToc sections={chapters} readingEndId="fg-scope" />

      <ProjectChapter entry={chapters[0]} index={1} total={chapters.length} variant="fresh-greens">
        <div className="project-section fg-section">
          <div className="project-section-body">
            <p>
              I moved there from Brooklyn as a kid. Driving was the only
              practical way to get around, but I didn&apos;t know New Jersey like the
              back of my hand.
            </p>
            <p>
              Whether I was dropping my mom at the bus station early or driving
              back from Cape May late, there were stretches that made me
              uncomfortable. The roads would start to break down a bit.
              Confederate flags would appear. Reception would become unreliable.
              All of the spooky pieces started falling into place.
            </p>
            <p>
              I&apos;d slow down, avoid backroads, and keep my wallet and phone close.
              Then I&apos;d wonder what would happen if the car broke down right
              there. I didn&apos;t know whether that discomfort was mine alone, so I
              spoke with six Black drivers across the South, ages 19 to 34.
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter entry={chapters[1]} index={2} total={chapters.length} variant="fresh-greens">
        <div className="project-section fg-section fg-section--wide">
          <p className="case-section-lead">
            Qualitative interviews were new to me, but I tried to navigate them
            like everyday conversations. Unfortunately, I wasn&apos;t the only
            person getting the heebie-jeebies during a drive.
          </p>
          <div className="project-section-body">
            <p>
              Drivers already relied on tools like Google Maps.
            </p>
          </div>
          <div className="fg-evidence-boundaries" aria-label="Three Fresh Greens product problems">
            <div className="fg-evidence-boundary">
              <p className="fg-evidence-label">Plan</p>
              <p>Drivers couldn&apos;t compare the conditions they cared about across routes before choosing. All six mentioned daylight, five mentioned road conditions, five mentioned police presence, and three mentioned wildlife.</p>
            </div>
            <div className="fg-evidence-boundary">
              <p className="fg-evidence-label">Respond</p>
              <p>Drivers talked about police encounters and keeping help close when something went wrong.</p>
            </div>
            <div className="fg-evidence-boundary">
              <p className="fg-evidence-label">Trust</p>
              <p>Five of six asked family or friends before trusting an unfamiliar place.</p>
            </div>
          </div>
          <div className="project-section-body">
            <p>
              Six interviews can&apos;t represent every Black driver.
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter entry={chapters[2]} index={3} total={chapters.length} variant="fresh-greens">
        <section className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>
              I knew Fresh Greens had some utility. Begrudgingly, my first idea was a Google Maps
              plug-in. I showed it to my thesis advisor. He was content, not
              impressed. The thesis was getting lost inside Google&apos;s framework.
              I was about a month from delivering it, so I kept the information
              architecture and started over visually.
            </p>
            <p>
              I returned to the Green Book for the visual system. Its palette
              became a reference, not a claim that Fresh Greens is its digital
              successor. {" "}
              <a href="https://nmaahc.si.edu/explore/stories/traveling-through-jim-crow-america" rel="noreferrer" target="_blank">
                Source: Smithsonian National Museum of African American History
                and Culture
              </a>
              .
            </p>
            <p>
              On a trip from Chicago to rural Georgia, the driver needs to see
              where natural light fades, where
              artificial light picks up the slack, and what unknowns to account
              for. The driver isn&apos;t expecting perfection, but they are
              expecting the clarity and autonomy to choose a route that they can
              feel adequately prepared for.
            </p>
            <p>
              The current build still labels the top option &quot;Safest
              route,&quot; ahead of the research. It needs to explain the tradeoff
              and leave the choice with the driver.
            </p>
          </div>
          <PivotJourney />
          <DepartureReminderEvidence />
          <ArchitectureDiagram />
        </section>
      </ProjectChapter>

      <ProjectChapter entry={chapters[3]} index={4} total={chapters.length} variant="fresh-greens">
        <section className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>
              Worst comes to worst, a Black driver needs to be informed. A police
              encounter can be a lot to juggle. One tap opens four support paths,
              including the pulled-over flow.
            </p>
          </div>
          <PulledOverJourney />
          <div className="project-section-body">
            <p>
              I haven&apos;t tested this flow with drivers yet, let alone during a
              real encounter.
            </p>
          </div>
        </section>
      </ProjectChapter>

      <ProjectChapter entry={chapters[4]} index={5} total={chapters.length} variant="fresh-greens">
        <div className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>
              People just need transparency into how the app is doing what it
              claims it does. Route chips and cards show public sources and
              community-report influence. The full score and its weights aren&apos;t
              exposed yet.
            </p>
            <p>
              Reports stay on the device first. With Supabase configured, they enter moderation.
            </p>
            <p>
              <strong>Current prototype limit:</strong> One report
              creates a scored zone and can affect route ranking. I haven&apos;t added
              corroboration weighting, visible contributor provenance, or
              route-level trust tiers yet.
            </p>
          </div>
          <figure className="fg-safety-visual">
            <PhoneFrame variant="screenshot">
              <Shot name="report-detail" alt="The Fresh Greens Felt welcome contribution form over the en-route map, with place-type chips, welcoming-reason chips, an optional experience field, and a green Share your experience button with black text." />
            </PhoneFrame>
            <figcaption className="fg-safety-visual-caption">
              Contributors can optionally describe the experience.
            </figcaption>
          </figure>
          <div className="fg-moderation" aria-label="How a report moves through moderation">
            <div className="fg-mod-flow">
              <div className="fg-mod-stage">
                <p className="fg-mod-stage-label">Configured cloud</p>
                <p className="fg-mod-stage-text">Queued</p>
              </div>
              <span className="fg-mod-arrow" aria-hidden="true" />
              <div className="fg-mod-stage fg-mod-stage--panel">
                <p className="fg-mod-stage-label">Investigation</p>
                <ul className="fg-mod-checks" role="list">
                  <li>Source device</li><li>Same-spot reports</li><li>Nearby reports</li><li>Duplicate IPs and devices</li>
                </ul>
              </div>
              <span className="fg-mod-arrow" aria-hidden="true" />
              <div className="fg-mod-stage">
                <p className="fg-mod-stage-label">Decision</p>
                <p className="fg-mod-stage-text">Reviewed, hidden, restored, or removed</p>
              </div>
            </div>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter entry={chapters[5]} index={6} total={chapters.length} variant="fresh-greens">
        <div className="project-section fg-section fg-scope">
          <div className="project-section-body">
            <p>
              I used Figma to set the initial rules, then built them in code. A
              spacing problem became a shared theme rule.
            </p>
            <p>
              Search broke first. My own address was sitting in Recent, so a
              places-only search looked functional. I added street addresses
              and separated Recent from live results.
            </p>
            <p>
              The prototype still hasn&apos;t shown that a route is safer, its
              explanations earn trust, or its support flow holds up under stress.
            </p>
            <p>
              Next, I&apos;d learn from Black drivers 55 and older by watching where
              Fresh Greens fits, where it asks for too much, and what I need to
              change.
            </p>
          </div>
          <div className="fg-scope-grid">
            <div className="fg-scope-col">
              <p className="fg-scope-label">Built now</p>
              <ul className="fg-scope-list" role="list">
                <li>Plan: route comparison, source cards, departure and refuel reminders</li>
                <li>Respond: four support paths, on-device recording when available, and user-controlled contact handoffs</li>
                <li>Trust: local-first reports and configured moderation</li>
              </ul>
            </div>
            <div className="fg-scope-col">
              <p className="fg-scope-label">What remains</p>
              <ul className="fg-scope-list" role="list">
                <li>Plan: broader route-quality testing before any safety claim</li>
                <li>Respond: real-device stress-state and failure-mode testing in configured builds</li>
                <li>Trust: route-level corroboration by distinct contributors, provenance, trust levels, and moderation transparency</li>
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

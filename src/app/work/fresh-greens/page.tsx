import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpandableImage } from "@/components/expandable-image";
import { LeadMedia } from "@/components/lead-media";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
import { ProjectToc } from "@/components/project-toc";
import { ProjectChapter } from "@/components/project-chapter";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { PhoneFrame } from "@/components/fresh-greens";
import { DepartureReminderEvidence } from "@/components/fresh-greens/departure-reminder-evidence";
import { PivotJourney } from "@/components/fresh-greens/pivot-journey";
import { PulledOverJourney } from "@/components/fresh-greens/pulled-over-journey";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { createRouteMetadata } from "@/lib/site-config";

const chapters = CASE_STUDY_CHAPTERS["fresh-greens"];

export const metadata: Metadata = createRouteMetadata({
  title: "Fresh Greens",
  description:
    "A wayfinding prototype for Black drivers that brings daylight, road conditions, police presence, wildlife, and community knowledge into the route decision.",
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
        <TransitionLink href="/#selected-work">
          <span aria-hidden="true">←</span>
          Selected work
        </TransitionLink>
      </nav>

      <section className="hero project-hero fg-hero" aria-labelledby="fg-title">
        <p className="fg-eyebrow">Product design + engineering · 2025–2026</p>
        <h1 id="fg-title" className="project-hero-title fg-title">
          Fresh Greens
        </h1>
        <p className="project-hero-lede fg-lede">
          Fresh Greens is a wayfinding app for Black drivers. It brings daylight,
          road conditions, police presence, wildlife, and community knowledge
          into the route decision, near or far.
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
        stack="Figma, Illustrator, React Native, Expo, TypeScript, Supabase"
        evidence={{
          type: "Working mobile prototype",
          cta: "See the pulled-over flow",
          href: "#fg-pulled-over",
        }}
        outcomeValue="Working"
        outcomeLabel="Students entered their own addresses and generated Fresh Greens routes on thesis day"
        moves={[]}
      />

      <ProjectToc sections={chapters} readingEndId="fg-scope" />

      <ProjectChapter
        entry={chapters[0]}
        index={1}
        total={chapters.length}
        variant="fresh-greens"
      >
        <div className="project-section fg-section">
          <div className="project-section-body">
            <p>
              Fresh Greens started out of a personal need. I grew up in Brooklyn
              and moved to rural South Jersey around ten, where Confederate flags
              on front lawns made night driving as a Black resident uncomfortable.
              I wondered whether I could avoid those backroads and have a drive
              that felt more centered on me.
            </p>
            <p>
              Maps found the fastest route; I still had to plan around daylight,
              stops, unfamiliar roads, police interaction, and car trouble.
            </p>
            <p>
              Because this was my thesis, I interviewed six Black drivers to see
              what extended beyond my own town.
            </p>
            <p>
              The Green Book showed how travel knowledge could be shared when
              mainstream systems excluded Black travelers. I treated that as
              lineage, not proof of a direct successor.{" "}
              <a
                href="https://nmaahc.si.edu/explore/stories/traveling-through-jim-crow-america"
                rel="noreferrer"
                target="_blank"
              >
                Source: Smithsonian National Museum of African American History
                and Culture
              </a>
              .
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[1]}
        index={2}
        total={chapters.length}
        variant="fresh-greens"
      >
        <div className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>
              The conversations moved from simple route choices into how people
              decoded the places around them. Wayfinding was shared knowledge and
              inherited behavior, not just point A to B.
            </p>
            <p>
              All six tied timing to daylight; five raised road conditions; five
              police presence; three wildlife; and five asked family or friends
              before trusting an unfamiliar place.
            </p>
            <p>
              The interviews revealed two customer problems: useful safety
              knowledge lived outside navigation, and routes hid who or what
              shaped them.
            </p>
          </div>

          <div
            className="fg-story-brief"
            aria-label="Fresh Greens problem, opportunity, and goal"
          >
            <article>
              <p className="fg-story-brief-label">Problem</p>
              <strong>Safety planning lived outside the map.</strong>
              <p>
                People carried it in memory, family advice, and habits that
                navigation never showed.
              </p>
            </article>
            <article>
              <p className="fg-story-brief-label">Opportunity</p>
              <strong>Bring those signals into the route decision.</strong>
              <p>
                Show the conditions drivers already watch before they start
                moving.
              </p>
            </article>
            <article>
              <p className="fg-story-brief-label">Goal</p>
              <strong>Help people feel more secure on the road.</strong>
              <p>
                Support planning, unexpected moments, and trust without pretending
                certainty.
              </p>
            </article>
          </div>

          <div className="project-section-body">
            <p>Six interviews shaped the thesis. They don&apos;t represent every Black driver.</p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[2]}
        index={3}
        total={chapters.length}
        variant="fresh-greens"
      >
        <section className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>
              My first high-fidelity direction was a Google Maps add-on. My
              advisors said the thesis wasn&apos;t coming through, and they were right:
              it looked like a reskinned Maps feature.
            </p>
            <p>
              I was building on a product that was never designed around this
              audience. Maps does routing at scale; Fresh Greens needed to own the
              context it was missing.
            </p>
          </div>

          <PivotJourney />

          <div className="project-section-body">
            <p>
              The standalone preview explains why routes score differently, shows
              the source behind a warning, and keeps daylight visible before the
              driver chooses. It makes the decision less opaque, not proven safer.
            </p>
            <p>
              The interviews also changed how I thought about time. The reminder
              takes one thing off the driver&apos;s plate after Fresh Greens finds a
              better daylight window.
            </p>
          </div>

          <DepartureReminderEvidence />
        </section>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[3]}
        index={4}
        total={chapters.length}
        variant="fresh-greens"
      >
        <section className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>
              The pulled-over feature is the decision I&apos;m proudest to explain.
              It&apos;s situational, but it holds so much weight.
            </p>
            <p>
              I tweaked it a bunch to demand as little as possible under stress.
              One thumb reveals the tools, recording can start quickly, and ACLU
              guidance changes with the situation.
            </p>
          </div>

          <PulledOverJourney />

          <div className="project-section-body">
            <p>
              It earns its place when it—and hopefully never—kicks in. I haven&apos;t
              tested it in a real encounter.
            </p>
          </div>
        </section>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[4]}
        index={5}
        total={chapters.length}
        variant="fresh-greens"
      >
        <div className="project-section fg-section fg-section--wide">
          <div className="project-section-body">
            <p>
              Community input mattered, but one report couldn&apos;t become an
              official-looking safety fact. Each account stays specific.
            </p>
            <p>
              Similar reports should gain influence over time, urgent hazards can
              surface sooner, and sparse coverage stays uncertain.
            </p>
          </div>

          <figure className="fg-safety-visual">
            <PhoneFrame variant="screenshot">
              <Shot
                name="report-detail"
                alt="The Fresh Greens Felt welcome contribution form over the en-route map, with place-type chips, welcoming-reason chips, an optional experience field, and a green Share your experience button with black text."
              />
            </PhoneFrame>
            <figcaption className="fg-safety-visual-caption">
              One account stays one account.
            </figcaption>
          </figure>

          <div className="project-section-body">
            <p>
              The current prototype is simpler: one report can affect one scored
              zone, while visible provenance, trust levels, weighted corroboration,
              and public moderation transparency still need work.
            </p>
          </div>

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
                  <li>Source device</li>
                  <li>Prior reports at the same spot</li>
                  <li>Nearby reports</li>
                  <li>Coordination: duplicate IPs and devices</li>
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

      <ProjectChapter
        entry={chapters[5]}
        index={6}
        total={chapters.length}
        variant="fresh-greens"
      >
        <div className="project-section fg-section fg-validation-story">
          <div className="project-section-body">
            <p>
              I tested the early Figma flows with classmates. They weren&apos;t the
              audience Fresh Greens was designed for, so I used those sessions to
              catch basic usability issues rather than validate the product itself.
            </p>
          </div>

          <div className="fg-thesis-demo">
            <strong>Basic functionality achieved!</strong>
            <span>
              On thesis presentation day, a few students entered their own
              addresses and got Fresh Greens routes back, daylight gradient and
              all.
            </span>
          </div>

          <div className="project-section-body">
            <p>
              Moving into React Native tested the design against real phone sizes,
              safe areas, Dynamic Type, tap targets, and offline behavior.
            </p>
          </div>

          <div className="fg-validation-grid">
            <section>
              <p className="fg-validation-label">What I could test</p>
              <ul>
                <li>Six interviews shaped the route criteria.</li>
                <li>Classmates navigated the Figma prototype.</li>
                <li>Real addresses generated routes on thesis day.</li>
              </ul>
            </section>
            <section>
              <p className="fg-validation-label">What still needs testing</p>
              <ul>
                <li>Route quality and trust with Black drivers across regions.</li>
                <li>The pulled-over flow under stress and device failure.</li>
                <li>Provenance, corroboration, and moderation transparency.</li>
              </ul>
            </section>
          </div>

          <div className="project-section-body fg-scope-closer">
            <p>
              Fresh Greens started with me trying to feel more comfortable driving
              home at night. Getting it into other people&apos;s hands will show me
              which parts actually help and what needs to change once it leaves
              Figma and my own phone.
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
      <CaseHighlightObserver />
    </ReaderShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadMedia } from "@/components/lead-media";
import { LeadVideo } from "@/components/lead-video";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { FreshGreensCaptureViewer } from "@/components/myles-97/project-sample-viewer";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
import { ProjectToc } from "@/components/project-toc";
import { ProjectChapter } from "@/components/project-chapter";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { ProjectEvidenceDisclosure } from "@/components/project-evidence-disclosure";
import { ArchitectureDiagram } from "@/components/fresh-greens";
import { DepartureReminderEvidence } from "@/components/fresh-greens/departure-reminder-evidence";
import { WelcomeIllustrationMotion } from "@/components/fresh-greens/welcome-illustration-motion";
import { EarlyProductWalkthrough } from "@/components/fresh-greens/early-product-walkthrough";
import { GreenBookPalette, OnboardingGallery } from "@/components/fresh-greens/visual-origins";
import origins from "@/components/fresh-greens/visual-origins.module.css";
import { PivotJourney } from "@/components/fresh-greens/pivot-journey";
import { PulledOverJourney } from "@/components/fresh-greens/pulled-over-journey";
import {
  ReportRouteInfluenceEvidence,
  RouteComparisonEvidence,
} from "@/components/fresh-greens/route-decision-evidence";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { createRouteMetadata } from "@/lib/site-config";

const chapters = CASE_STUDY_CHAPTERS["fresh-greens"];
const freshGreensProof = {
  label: "Try a drive in Fresh Greens",
  href: "#fg-app-walkthrough",
};

export const metadata: Metadata = createRouteMetadata({
  title: "Fresh Greens",
  description:
    "Fresh Greens is a working React Native navigation prototype for Black drivers, based on interviews with six Black drivers across the South.",
  path: "/work/fresh-greens",
  image: "/og/fresh-greens",
  type: "article",
});

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
          Projects
        </TransitionLink>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="case-frontispiece">
        <section className="hero project-hero fg-hero" aria-labelledby="fg-title">
          <p className="fg-eyebrow">Product design + engineering · 2025–2026</p>
          <h1 id="fg-title" className="project-hero-title fg-title">
            Fresh Greens
          </h1>
          <p className="project-hero-lede fg-lede">
            Inspired by the Green Book, I built a navigation app for Black drivers. You can see how much daylight a route has left and what other drivers have reported before you leave.
          </p>
        </section>
        <LeadMedia
          cover="/projects/fresh-greens/opening-1280.webp"
          smallCover="/projects/fresh-greens/opening-640.webp"
          alt="Fresh Greens welcome screen on a phone, with an illustrated Black driver at sunrise."
          width={1280}
          height={1005}
          presentation="fresh-greens"
        >
          <WelcomeIllustrationMotion />
        </LeadMedia>
        <ProjectOpeningFacts
          role="Solo, design and engineering"
          goal="Help Black drivers compare route conditions and find support when something goes wrong."
          outcome="Working React Native prototype across 26+ screens."
          proof={freshGreensProof}
        />
      </div>
      <RecruiterCut
        timeline="Sep 2025 – Jun 2026"
        tools="Figma, Illustrator, Claude, React Native, Expo, TypeScript, Supabase"
        moves={[]}
      />

      <div className="case-book">
        <aside className="book-index" aria-label="Chapter index">
          <ProjectToc sections={chapters} readingEndId="fg-scope" />
        </aside>
        <div className="book-pages">
          <ProjectChapter
            entry={chapters[0]}
            index={1}
            total={chapters.length}
            variant="fresh-greens"
          >
            <div className="project-section fg-section fg-section--wide">
              <div className="project-section-body">
                <p>
                  In 1936, Victor H. Green published <a className="case-source-link" href="https://www.loc.gov/item/2016298176/" aria-label="The Negro Motorist Green Book, 1946 edition at the Library of Congress"><cite>The Negro Motorist Green Book</cite></a>.
                  Under Jim Crow, Black travelers used it to find places where they
                  could eat, get gas, or stay the night. What stayed with me was how
                  much it mattered to know those things{" "}<strong>before setting out.</strong>
                </p>
                <p>
                  I moved from Brooklyn to South Jersey as a kid. On late drives home from Cape May, some backroads had Confederate flags and patchy reception. I’d slow down and wonder where
                  I could go if the car broke down. My map could tell me when I’d get
                  home. I wanted to know what the drive home would be like.
                </p>
              </div>
              <EarlyProductWalkthrough />
            </div>
          </ProjectChapter>

          <ProjectChapter
            entry={chapters[1]}
            index={2}
            total={chapters.length}
            variant="fresh-greens"
          >
            <div className="project-section fg-section fg-section--wide">
              <dl className={origins.participants} aria-label="Interview participants">
                <div><dt>Who I spoke with</dt><dd>Six Black drivers of different genders</dd></div>
                <div><dt>Where they drove</dt><dd>Across the South</dd></div>
                <div><dt>Age range</dt><dd>19 to 34</dd></div>
              </dl>
              <div className="project-section-body">
                <p>
                  I asked each person to walk me through a drive
                  they knew well. Drivers already relied on tools like Google Maps.
                  I wanted to hear what the directions left out.
                </p>
              </div>
              <figure className={origins.quote}>
                <blockquote>“If they showed the gradient of light, like it’s bright where you are and dark where you arrive.”</blockquote>
                <figcaption>Driver interviewed for Fresh Greens</figcaption>
              </figure>
              <div className="project-section-body">
                <p>I carried that suggestion into the route preview. You can see sunset along the route while there’s still time to leave earlier or choose another way home.</p>
              </div>
              <div className="fg-evidence-boundaries" aria-label="Three Fresh Greens product problems">
                <div className="fg-evidence-boundary">
                  <p className="fg-evidence-label">Plan</p>
                  <p>Drivers couldn&apos;t compare the conditions they cared about across routes before choosing.{" "}<strong>All six mentioned daylight</strong>, five mentioned road conditions, five mentioned police presence, and three mentioned wildlife.</p>
                </div>
                <div className="fg-evidence-boundary">
                  <p className="fg-evidence-label">Respond</p>
                  <p>Drivers talked about <strong>police encounters</strong> and keeping help close when something went wrong.</p>
                </div>
                <div className="fg-evidence-boundary">
                  <p className="fg-evidence-label">Trust</p>
                  <p><strong>Five of six asked family or friends</strong>{" "}before trusting an unfamiliar place.</p>
                </div>
              </div>
              <div className="project-section-body">
                <p>
                  Six interviews can&apos;t represent every Black driver.
                </p>
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
                  My first pass put a daylight overlay inside Google Maps. When I
                  showed it to my thesis advisor, Google’s suggested route still
                  dominated the screen. I kept the information architecture and
                  designed a standalone app so drivers could{" "}<strong>compare the light
                  on each route before choosing one.</strong>
                </p>
              </div>
              <GreenBookPalette />
              <OnboardingGallery />
              <div className="project-section-body">
                <p>
                  For a drive from Chicago to rural Georgia, six minutes saved might
                  matter less than getting off an unfamiliar backroad before dark.
                  An earlier prototype called one option “Safest route.” I couldn’t
                  back that up. The comparison below uses a neutral label and lets
                  you weigh the conditions yourself.
                </p>
              </div>
              <RouteComparisonEvidence />
              <ProjectEvidenceDisclosure summary="See arrival light on the original app screens">
                <FreshGreensCaptureViewer />
              </ProjectEvidenceDisclosure>
              <ProjectEvidenceDisclosure summary="See the first Google Maps design and the departure reminder">
                <PivotJourney />
                <DepartureReminderEvidence />
              </ProjectEvidenceDisclosure>
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
                  In the pulled-over flow,{" "}<strong>I ask “Are you armed?” first.</strong>{" "}Which guidance
                  applies depends on the driver&apos;s answer and the state they&apos;re in.
                  I didn&apos;t want someone scrolling during a stop to find what applied.
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

          <ProjectChapter
            entry={chapters[4]}
            index={5}
            total={chapters.length}
            variant="fresh-greens"
          >
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
                  <span className="fg-prototype-limit-label">Current prototype limit:</span>{" "}<strong>One report creates a scored zone</strong>{" "}and can affect route ranking. I haven&apos;t added
                  corroboration weighting, visible contributor provenance, or
                  route-level trust tiers yet.
                </p>
              </div>
              <ReportRouteInfluenceEvidence />
              <ProjectEvidenceDisclosure summary="View the moderation path">
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
              </ProjectEvidenceDisclosure>
            </div>
          </ProjectChapter>

          <ProjectChapter
            entry={chapters[5]}
            index={6}
            total={chapters.length}
            variant="fresh-greens"
          >
            <div className="project-section fg-section fg-scope">
              <div className="project-section-body">
                <p>
                  I used Figma to set the initial rules, then built them in code. A
                  spacing problem became a shared theme rule.
                </p>
                <p>
                  Search was the first thing to break. My own address was sitting in Recent, so a
                  places-only search looked functional.{" "}<strong>I added street addresses</strong>{" "}
                  and separated Recent from live results.
                </p>
                <p>
                  The prototype still hasn&apos;t shown that a route is safer, its
                  explanations earn trust, or its support flow holds up under stress.
                </p>
                <p>
                  Next, I&apos;d learn from{" "}<strong>Black drivers 55 and older</strong>{" "}by watching where
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
              <ProjectEvidenceDisclosure summary="See how the data reaches route scoring">
                <ArchitectureDiagram />
              </ProjectEvidenceDisclosure>
              <figure
                className="fg-en-route-video"
                data-evidence-proof="fresh-greens-en-route-video"
                data-evidence-role="supporting"
                data-evidence-kind="interaction"
                data-evidence-chapter="fg-scope"
              >
                <LeadVideo
                  clip="/projects/fresh-greens/daylight-key/weeksville-drive.mp4"
                  poster="/projects/fresh-greens/daylight-key/weeksville-drive.webp"
                  width={1290}
                  height={2796}
                  alt="Simulated drive to Weeksville Heritage Center. The map follows the car along Utica Avenue. The map key opens and closes, and After dark stays beside the arrival time."
                />
                <figcaption className="fg-safety-visual-caption">
                  Map key during a simulated Weeksville drive.
                </figcaption>
              </figure>
            </div>
          </ProjectChapter>
        </div>
      </div>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
    </ReaderShell>
  );
}

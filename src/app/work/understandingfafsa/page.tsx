import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountUp } from "@/components/count-up";
import { LeadMedia } from "@/components/lead-media";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectChapter } from "@/components/project-chapter";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import {
  BeforeAfterPhones,
  FigmaMailchimpPair,
  NewsletterComposerDemo,
} from "@/components/understandingfafsa";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { createRouteMetadata } from "@/lib/site-config";

const UF_DESCRIPTION =
  "Built a modular newsletter system for a site rebrand. The first redesigned send had an observed ~52.6% open rate with Mailchimp Privacy Protection excluded. This was not a controlled attribution test.";
const chapters = CASE_STUDY_CHAPTERS.understandingfafsa;

export const metadata: Metadata = createRouteMetadata({
  title: "UnderstandingFAFSA",
  description: UF_DESCRIPTION,
  path: "/work/understandingfafsa",
  image: "/projects/understandingfafsa/cover.png",
  type: "article",
});

export default async function UnderstandingFafsaPage() {
  const project = await getProjectBySlug("understandingfafsa");
  if (!project || project.status !== "published") {
    notFound();
  }

  const allProjects = await getPublishedProjects();

  return (
    <ReaderShell
      slug="understandingfafsa"
      title="UnderstandingFAFSA"
      className="uf-page"
    >
      <nav className="project-topbar" aria-label="Breadcrumb">
        <TransitionLink href="/#selected-work">
          <span aria-hidden="true">←</span>
          Selected work
        </TransitionLink>
      </nav>

      <section className="hero project-hero uf-hero" aria-labelledby="uf-title">
        <p className="uf-eyebrow">Product design · 2025–present</p>
        <h1 id="uf-title" className="project-hero-title uf-title">
          Understanding<wbr />FAFSA
        </h1>
        <p className="project-hero-lede uf-lede">
          {project?.summary ?? UF_DESCRIPTION}
        </p>
      </section>

      <LeadMedia
        cover="/projects/understandingfafsa/cover.png"
        alt="Two phone mockups showing blue and orange UnderstandingFAFSA newsletter templates."
        width={4000}
        height={3000}
      />
      <RecruiterCut
        role="Product Designer"
        timeline="February 2025 – Ongoing"
        stack="Figma, Mailchimp"
        stackLabel="Tools"
        evidence={{
          type: "Working newsletter system",
          cta: "Build a sample send",
          href: "#uf-locked",
        }}
        outcomeValue={project?.outcomeMetricValue}
        outcomeLabel={project?.outcomeMetricLabel}
        moves={[]}
      />

      <ProjectToc sections={chapters} />

      <ProjectChapter
        entry={chapters[0]}
        index={1}
        total={chapters.length}
        variant="understandingfafsa"
      >
        <div className="project-section uf-section">
          <div className="project-section-body">
            <p>
              UnderstandingFAFSA helps students, parents, and counselors work
              through financial-aid deadlines. The website had just been
              rebranded, but the newsletter still had long stretches of text,
              uneven calls to action, weak section breaks, and a mobile layout
              that was hard to scan.
            </p>
            <p>
              The scope was email only, and the founder assembled every issue.
              The redesign had to improve the reading experience without turning
              weekly production into an HTML project.
            </p>
          </div>
          <BeforeAfterPhones />
        </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[1]}
        index={2}
        total={chapters.length}
        variant="understandingfafsa"
      >
        <div className="project-section uf-section uf-section--wide">
          <div className="project-section-body">
            <p>
              One collaborator and I compiled and reviewed more than 120
              newsletters for scanning, tone, hierarchy, and brand consistency.
              I used that audit to define what should stay fixed and what needed
              to change from one send to the next.
            </p>
          </div>

          <div
            className="uf-story-brief"
            aria-label="UnderstandingFAFSA problem, opportunity, and goal"
          >
            <article>
              <p className="uf-story-brief-label">Problem</p>
              <strong>Important guidance was hard to scan.</strong>
              <p>
                Long sends, uneven hierarchy, and weak mobile structure made
                deadline-driven information harder to move through.
              </p>
            </article>
            <article>
              <p className="uf-story-brief-label">Opportunity</p>
              <strong>Lock the system, not the weekly content.</strong>
              <p>
                Keep the order, spacing, type, and dividers consistent while copy
                and imagery remain swappable.
              </p>
            </article>
            <article>
              <p className="uf-story-brief-label">Goal</p>
              <strong>Make the kit work inside Mailchimp.</strong>
              <p>
                Give the founder a system they can assemble without HTML and keep
                the email under Gmail&apos;s clipping limit.
              </p>
            </article>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[2]}
        index={3}
        total={chapters.length}
        variant="understandingfafsa"
      >
        <section className="project-section uf-section project-section--wide uf-section--wide">
          <div className="project-section-body">
            <p>
              The audit led to three send types: welcome, weekly, and a shorter
              event format. They share a fixed header, footer, section order,
              spacing, type, and dividers. The founder can swap the stories,
              links, and imagery in the middle without changing that structure.
            </p>
            <p>
              The editor below is a case-study reconstruction of those rules,
              using the actual newsletter modules.
            </p>
          </div>
          <NewsletterComposerDemo />
        </section>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[3]}
        index={4}
        total={chapters.length}
        variant="understandingfafsa"
      >
        <div className="project-section uf-section">
          <div className="project-section-body">
            <p>
              I rebuilt the system in Mailchimp so the founder could use it
              without touching HTML. The first Figma version relied on more
              containers and wrappers than the email could afford.
            </p>
            <p>
              <mark className="case-highlight">
                Gmail&apos;s 102 KB HTML clipping threshold set a rigid constraint.
              </mark>{" "}
              To reduce the source Gmail measures, I flattened the hierarchy,
              removed unnecessary wrappers, and used Mailchimp-native blocks
              where they could replace custom markup. Image compression helped
              download weight, but it did not change that HTML limit.
            </p>
          </div>
          <FigmaMailchimpPair />
        </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[4]}
        index={5}
        total={chapters.length}
        variant="understandingfafsa"
      >
        <div className="project-section uf-section">
          <div className="project-section-body">
            <p>
              I shipped a master template, reusable modules, and three send
              formats. The founder now assembles each issue from the
              Mailchimp-native kit without editing HTML.
            </p>
            <p>
              The first redesigned send went out November 4, 2025. Mailchimp
              reported an observed <CountUp value="~52.6%" />{" "}open rate with
              MPP excluded, while earlier sends were around 30%. That result is
              supporting context, not a controlled attribution test. I don&apos;t
              claim the redesign caused the change.
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectWorkJump currentSlug="understandingfafsa" projects={allProjects} />
      <CaseHighlightObserver />
    </ReaderShell>
  );
}

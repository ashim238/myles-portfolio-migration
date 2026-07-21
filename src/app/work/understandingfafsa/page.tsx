import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColorPalette } from "@/components/color-palette";
import { CountUp } from "@/components/count-up";
import { LeadMedia } from "@/components/lead-media";
import { ProjectChapter } from "@/components/project-chapter";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import {
  BeforeAfterPhones,
  FigmaMailchimpPair,
  LockedSwappableView,
  NewsletterComposerDemo,
  TemplateSwitcher,
} from "@/components/understandingfafsa";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { createRouteMetadata } from "@/lib/site-config";

const UF_DESCRIPTION =
  "Built a modular newsletter system for a site rebrand. The first redesigned send had an observed ~52.6% open rate with Mailchimp Privacy Protection excluded. This was not a controlled attribution test.";
const chapters = CASE_STUDY_CHAPTERS.understandingfafsa;

const UF_COLORS = [
  "#be5abf",
  "#164f73",
  "#82c5fb",
  "#f2b544",
  "#f26938",
  "#2fac38",
  "#6d2161",
  "#2788c1",
  "#48d1c7",
  "#004aad",
  "#e572e4",
  "#7100bf",
];

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
    <main
      className="page-shell project-page uf-page"
      id="main-content"
      data-project-slug="understandingfafsa"
    >
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <TransitionLink href="/#work">
          <span aria-hidden="true">← </span>
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
          type: "Interactive case-study explanation",
          cta: "Build a sample send",
          href: "#uf-locked",
        }}
        outcomeValue={project?.outcomeMetricValue}
        outcomeLabel={project?.outcomeMetricLabel}
        moves={[
          "Compiled and evaluated 120+ newsletters with one collaborator.",
          "Built a modular template system with locked layers and swappable parts.",
          "Matched the newsletter type and palette to the rebranded site.",
        ]}
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
              UnderstandingFAFSA helps students, parents, and counselors navigate
              the Free Application for Federal Student Aid (FAFSA). The
              newsletter carries guidance for all three groups. The website had
              already adopted Saans and a refreshed palette. The scope was
              email-only, and the founder assembles every issue.
            </p>
          </div>
        </div>

        <section className="project-section uf-section" aria-labelledby="uf-problem">
          <h3 className="project-evidence-heading" id="uf-problem">
            Where the old template broke down
          </h3>
          <div className="project-section-body">
            <p>
              The newsletter covers deadline-driven guidance at key checkpoints:
              FAFSA filing windows, scholarship deadlines, and policy changes.
              The old template had uneven CTAs, long stretches of text, weak
              section breaks, and a layout that wasn&apos;t optimized for mobile.
              Its muted palette also came from the site&apos;s previous visual system.
            </p>
          </div>
          <BeforeAfterPhones />
        </section>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[1]}
        index={2}
        total={chapters.length}
        variant="understandingfafsa"
      >
        <div className="project-section uf-section">
          <div className="project-section-body">
            <p>
              Before touching the templates, I worked with one collaborator to
              compile over 120 newsletter examples. We evaluated them for
              clarity, personalization, and tone of voice. A fourth criterion
              paired visual appeal with branding consistency.
            </p>
            <p>
              We looked most closely at Revenews, The 74, Next by Jeff Selingo,
              Medium, and Folderly. They used different mixes of structure,
              tone, and branding. The rest helped me compare layout and
              hierarchy, including how they used color.
            </p>
            <p>A few details stood out:</p>
            <ul>
              <li>
                Revenews used <strong>selective bolding</strong>, emoji section
                headers, and concise intros.
              </li>
              <li>
                Folderly carried <strong>brand color</strong> into its bullet
                styles.
              </li>
              <li>
                Several references used{" "}
                <strong>action-focused section titles</strong> to divide long
                sends.
              </li>
              <li>
                The 74 used a <strong>more formal register</strong> than
                student-facing references that used emojis and GIFs.
              </li>
              <li>
                Next used <strong>if/then link framing</strong>, author photos,
                and brief bios.
              </li>
            </ul>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[2]}
        index={3}
        total={chapters.length}
        variant="understandingfafsa"
      >
        <section
          className="project-section uf-section project-section--wide uf-section--wide"
          aria-labelledby="uf-templates"
        >
          <h3 className="project-evidence-heading" id="uf-templates">
            Three send types from the audit
          </h3>
          <div className="project-section-body">
            <p>
              The audit led to three templates: a welcome email, the weekly
              newsletter, and a shorter version for event invites and recaps.
              A counselor toolkit is still in progress.
            </p>
            <p>
              The welcome email sets expectations in a fixed order: a banner,
              a thank-you, what to expect, a short history and current mission,
              a CTA, suggested reading, and social links. It also introduces
              the updated type and palette.
            </p>
          </div>

          <TemplateSwitcher />

          <NewsletterComposerDemo />
        </section>

        <div className="project-section uf-section project-section--wide uf-section--wide">
          <div className="project-section-body">
            <p>
              Spacing, dividers, type, and the structural skeleton stay locked.
              Editors swap body copy and emoji-style section images. The founder
              drafts each week&apos;s copy and works within those fixed rules.
            </p>
          </div>

          <LockedSwappableView />

          <ColorPalette colors={UF_COLORS} />
        </div>
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
              The Figma file defined the spacing, type, and reusable sections. I
              rebuilt the live template in Mailchimp so the founder could edit
              it without touching HTML. Matching the Figma spacing in the builder
              added too many containers and wrappers, so I flattened the
              section-header and body hierarchy.
            </p>
            <p>
              <mark className="case-highlight">
                Gmail&apos;s 102KB HTML ceiling and clipping created a rigid
                constraint.
              </mark>{" "}
              Early weight came from custom section icons and themed dividers
              exported from Figma. Test sends showed which wrappers and dividers
              could go. I merged sections where they still scanned and compressed
              PNGs through an external tool. For dark-mode-friendly dividers, I
              removed backgrounds in Photoshop. That lowered their file weight
              and kept them from looking muddy on phones.
            </p>
            <p>
              The weekly kit used fewer custom assets and more Mailchimp-native
              structure. The counselor toolkit needed more image work and tighter
              file discipline for its duotone icons. I kept the closest Mailchimp
              sans to Saans and the full brand palette. Those choices kept the
              email close to the site and reflected the founder&apos;s preference
              for vibrant color.
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
              <mark className="case-highlight">
                This was my first time designing a system someone else
                assembles every week.
              </mark>
            </p>
            <p>
              I shipped a master template, modular blocks, explicit
              locked-vs-swappable rules, and three template variants built from
              the same locked sections and swappable blocks. The first redesigned
              send went out November 4, 2025.
            </p>
            <p>
              Mailchimp reported an observed <CountUp value="~52.6%" />{" "}open rate
              with MPP excluded, compared with earlier sends around 30%. That
              result is encouraging, but it&apos;s not a controlled attribution
              test. I don&apos;t claim the redesign caused the change.
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectWorkJump currentSlug="understandingfafsa" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

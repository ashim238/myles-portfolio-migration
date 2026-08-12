import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColorPalette } from "@/components/color-palette";
import { CountUp } from "@/components/count-up";
import { LeadMedia } from "@/components/lead-media";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectChapter } from "@/components/project-chapter";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";
import { RecruiterCut } from "@/components/recruiter-cut";
import { TransitionLink } from "@/components/transition-link";
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
import { UNDERSTANDING_FAFSA_AUDIT_RULES } from "@/lib/understandingfafsa-audit-rules";

const UF_DESCRIPTION =
  "Built a modular newsletter system for a site rebrand. The first redesigned send had an observed ~52.6% open rate with Mailchimp Privacy Protection excluded. This was not a controlled attribution test.";
const chapters = CASE_STUDY_CHAPTERS.understandingfafsa;
const understandingFafsaProof = {
  label: "Build a sample send",
  href: "#uf-locked",
};

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
    <ReaderShell
      slug="understandingfafsa"
      title="UnderstandingFAFSA"
      className="uf-page"
    >
      <nav className="project-topbar" aria-label="Breadcrumb">
        <TransitionLink href="/#work">
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

      <ProjectOpeningFacts
        role="Product Designer"
        scope="I designed the modular rules and rebuilt the live system in Mailchimp."
        outcome="A Mailchimp-native kit the founder uses for weekly sends and ICYMI without editing HTML."
        proof={understandingFafsaProof}
      />
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
          cta: understandingFafsaProof.label,
          href: understandingFafsaProof.href,
        }}
        outcomeValue={project?.outcomeMetricValue}
        outcomeLabel={project?.outcomeMetricLabel}
        moves={[
          "Outcome: I designed and rebuilt a Mailchimp-native kit the founder uses for weekly sends and ICYMI without editing HTML.",
          "Rules: I defined the fixed and swappable parts across three send types.",
          "Feasibility: I tested the Figma direction through Mailchimp practice sends.",
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
              the Free Application for Federal Student Aid (FAFSA). During the
              rebrand, I built a newsletter system the founder can run
              independently in Mailchimp. She handles weekly sends and ICYMI,
              swapping content, copy, and module order. I come back in when the
              work needs to scale, like a specialized college-counselor toolkit.
              The website had already adopted Saans and a refreshed palette. The
              scope was email-only.
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
              To decide what the system needed to lock, one collaborator and I
              reviewed more than 120 newsletters. We looked at how each one
              handled clarity, personalization, tone, visual appeal, and brand
              consistency. Revenews, The 74, Next by Jeff Selingo, Medium, and
              Folderly became the main references for scanning, hierarchy, tone,
              and brand structure.
            </p>
            <ol aria-label="Audit findings and system rules">
              {UNDERSTANDING_FAFSA_AUDIT_RULES.map((rule) => (
                <li key={rule.id}>
                  <p><strong>Finding:</strong> {rule.finding}.</p>
                  <p><strong>System rule:</strong> {rule.response}.</p>
                </li>
              ))}
            </ol>
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
              newsletter, and a shorter ICYMI version for event invites and
              recaps. A counselor toolkit is still in progress.
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
              I locked the visual rules that needed to hold: spacing, type, and
              dividers. The founder can swap content and copy, then rearrange
              middle modules for weekly sends and ICYMI without touching HTML.
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
              I moved the design from Figma into Mailchimp for feasibility checks
              and practice sends, then built a version ready for user testing.
              That was where I learned what the medium would actually allow.
              Figma&apos;s spacing quickly turned into too many Mailchimp containers
              and wrappers, so I rebuilt the live system in Mailchimp with
              simpler native blocks the founder could edit without touching
              HTML. Test sends showed which wrappers and dividers could go.
            </p>
            <p>
              <mark className="case-highlight">
                Gmail&apos;s 102 KB HTML clipping threshold set a rigid constraint.
              </mark>{" "}
              To reduce the HTML Gmail measures, I flattened the hierarchy,
              removed wrappers and blocks that didn&apos;t need to ship, and used
              Mailchimp-native structure where it replaced custom markup.
            </p>
            <p>
              I handled the image files separately. Compressing the PNGs through
              an external tool lowered their download weight. It didn&apos;t
              reduce the HTML source Gmail measures. For dark-mode-friendly
              dividers, I removed backgrounds in Photoshop so they wouldn&apos;t
              look muddy on phones.
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
              I shipped a master template, modular blocks,
              locked-versus-swappable rules, three template variants, and a
              Mailchimp-native kit. The founder now handles weekly sends and
              ICYMI in Mailchimp, swapping content, copy, and module order
              without editing HTML. I come back in when the work needs to scale,
              like a specialized college-counselor toolkit.
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

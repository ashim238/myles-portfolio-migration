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
import { ProjectEvidenceDisclosure } from "@/components/project-evidence-disclosure";
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
import {
  UNDERSTANDING_FAFSA_AUDIT_ACTIONS,
  UNDERSTANDING_FAFSA_AUDIT_RULES,
} from "@/lib/understandingfafsa-audit-rules";
import styles from "./understandingfafsa.module.css";

const UF_DESCRIPTION =
  "UnderstandingFAFSA's newsletter no longer matched its redesigned website. I designed and built a set of templates with three different color themes so the founder could put each issue together herself using Mailchimp, which she already knew.";
const chapters = CASE_STUDY_CHAPTERS.understandingfafsa;
const understandingFafsaProof = {
  label: "Try the newsletter templates",
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
  image: "/og/understandingfafsa",
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
          Work Stuff
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
        scope="I owned the final visual design and Mailchimp build. Another designer, the founder, and I shaped the copy and base structure."
        outcome="A three-theme kit the founder edits herself. She has launched roughly 20 sends since the redesign."
        proof={understandingFafsaProof}
      />
      <LeadMedia
        cover="/projects/understandingfafsa/cover.png"
        alt="Two phone mockups showing blue and orange UnderstandingFAFSA newsletter templates."
        width={4000}
        height={3000}
      />
      <RecruiterCut
        timeline="February 2025 – Ongoing"
        tools="Figma, Mailchimp"
        moves={[
          "Problem: Open rates were down, and the newsletter no longer matched the redesigned website.",
          "Constraint: The founder needed a Mailchimp-native system she could edit without Figma or HTML.",
          "Validation: Practice sends on mobile and desktop exposed Gmail clipping and dark-mode inversion.",
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
            <div className={styles.auditContext}>
              <p>
                The founder, Kim, was concerned about falling open rates and how
                the newsletter&apos;s design deviated from the website&apos;s fresh
                new look. My initial audit noted super lengthy stretches of text,
                inconsistent CTAs, and hierarchy that made emails difficult to scan.
              </p>
              <aside className={styles.audienceNote} aria-label="Audience context">
                The audience was mobile-heavy, which made scanability especially
                important.
              </aside>
            </div>
            <p>
              Between sourcing content and editor corrections, Kim had a short
              window to get newsletter materials buttoned up for weekly publishing.
              She was a Mailchimp pro, but had limited experience with Figma or
              frontend web dev work. The templates needed to fit the workflow
              rather than make new responsibilities for her.
            </p>
          </div>
        </div>

        <section className="project-section uf-section" aria-labelledby="uf-problem">
          <h3 className="project-evidence-heading" id="uf-problem">
            What the redesign had to account for
          </h3>
          <div className="project-section-body">
            <p>
              The UnderstandingFAFSA site had plenty of resources to help people
              fill out the FAFSA. Each newsletter could highlight filing windows,
              deadlines, policy changes, and resources that brought readers back
              to the site. Kim needed a base to work from, with the leeway to
              rearrange stories depending on the priorities for the week.
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
              A collaborator and I reviewed more than 120 newsletters. We looked
              at clarity, personalization, tone, visual appeal, and brand
              consistency.
              Revenews, The 74, Next by Jeff Selingo, Medium, and Folderly gave
              us a broad comparison set. I kept coming back to Snacks because its
              copy felt lively and it used color to make scanning easier. HubSpot
              gave me the idea for livelier dividers.
            </p>
            <p>
              I owned the final visual design. Another designer, the founder, and
              I worked together on the copy and base structure. The required
              sections, colors, typefaces, and final say stayed with the founder.
              Her critique was short: <q>Add some pizzazz.</q> Over time, I felt
              more comfortable deviating from the standing layout when a send
              needed something different.
            </p>
            <ol
              className="uf-audit-actions"
              aria-label="Design changes from the newsletter audit"
            >
              {UNDERSTANDING_FAFSA_AUDIT_RULES.map((rule) => (
                <li key={rule.id}>
                  <p>{UNDERSTANDING_FAFSA_AUDIT_ACTIONS[rule.id]}</p>
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
            Building a kit inside Mailchimp
          </h3>
          <div className="project-section-body">
            <p>
              The world of email marketing was somewhat foreign to me. I hoped
              whatever I designed in Figma could be ported straight into
              Mailchimp. That was not the case.
            </p>
            <p>
              I made a welcome email, the weekly newsletter, and a shorter ICYMI
              version for event invites and recaps. I also left the founder with
              three email themes inspired by the brand palette.
            </p>
          </div>
          <TemplateSwitcher />
        </section>

        <div className="project-section uf-section project-section--wide uf-section--wide">
          <div className="project-section-body">
            <p>
              Within the founder&apos;s type choices, I locked spacing, type
              hierarchy, and dividers. The founder can swap content and copy,
              then rearrange middle modules without touching HTML.
            </p>
          </div>
        </div>
        <NewsletterComposerDemo />
        <ProjectEvidenceDisclosure summary="Open the supporting system details">
          <LockedSwappableView />
          <ColorPalette colors={UF_COLORS} />
        </ProjectEvidenceDisclosure>
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
              Practice sends went to me, the other designer, the editor, and the
              founder. Usually, at least one person opened a practice send on
              mobile and another on desktop. Those sends exposed Gmail&apos;s 102 KB
              HTML clipping limit and dark-mode color inversion.
            </p>
            <p>
              <mark className="case-highlight">
                Gmail clips emails once the HTML source crosses 102 KB.
              </mark>{" "}
              Figma&apos;s spacing created too many Mailchimp containers and
              wrappers. I rebuilt the live system with simpler native blocks,
              flattened the hierarchy, and removed what didn&apos;t need to ship.
            </p>
            <p>
              HubSpot gave me the idea for livelier dividers. That ended up
              working against me because each custom illustration was data-heavy
              and hard to reproduce natively in Mailchimp. Compressing the PNGs
              lowered their download weight, but it didn&apos;t reduce the HTML
              source Gmail measures.
            </p>
            <p>
              Dark mode inverted some colors. The white backgrounds of the custom
              illustrations had to go so they could align with a viewer&apos;s phone
              theme. Leaving them in place interrupted the visual rhythm, so I
              removed them in Photoshop.
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
              The founder has launched roughly 20 sends since the redesign and
              edits the template herself each week. She gets in touch when the
              layout needs to adapt for a specific audience or she wants a color
              pairing that isn&apos;t in the original three themes.
            </p>
            <p>
              I still build custom icons, banners, and dividers when a send calls
              for them. I get to see how far I can push the template before an
              email client enacts limits. It&apos;s a constant back and forth.
            </p>
            <p>
              The first newsletter using the new templates went out November 4, 2025. Mailchimp
              reported an observed <CountUp value="~52.6%" />{" "}open rate with
              MPP excluded, while earlier sends were around 30%. Because this
              wasn&apos;t a controlled attribution test, I don&apos;t attribute the
              difference to the redesign.
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectWorkJump currentSlug="understandingfafsa" projects={allProjects} />
      <CaseHighlightObserver />
    </ReaderShell>
  );
}

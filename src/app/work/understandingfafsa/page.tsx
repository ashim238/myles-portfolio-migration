import type { Metadata } from "next";
import { ColorPalette } from "@/components/color-palette";
import { CountUp } from "@/components/count-up";
import { LeadMedia } from "@/components/lead-media";
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
import { createRouteMetadata } from "@/lib/site-config";

const UF_DESCRIPTION =
  "Built a modular newsletter system for a site rebrand. The first redesigned send had an observed ~52.6% open rate with Mailchimp Privacy Protection excluded. This was not a controlled attribution test.";

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
      />
      <RecruiterCut
        role="Product Designer"
        timeline="February 2025 – Ongoing"
        stack="Figma, Mailchimp"
        stackLabel="Tools"
        outcomeValue={project?.outcomeMetricValue}
        outcomeLabel={project?.outcomeMetricLabel}
        moves={[
          "Compiled and evaluated 120+ newsletters with one collaborator.",
          "Built a modular template system with locked layers and swappable parts.",
          "Matched the newsletter type and palette to the rebranded site.",
        ]}
      />

      <ProjectToc
        sections={[
          { title: "A rebrand and a weekly workflow", id: "uf-context" },
          { title: "Where the old template broke down", id: "uf-problem" },
          { title: "What 120 newsletters revealed", id: "uf-audit" },
          { title: "Three send types from the audit", id: "uf-templates" },
          { title: "Rules for fixed and swappable parts", id: "uf-locked" },
          { title: "Rebuilding the system in Mailchimp", id: "uf-figma" },
          { title: "The first redesigned send", id: "uf-results" },
        ]}
      />

      <section className="project-section uf-section" aria-labelledby="uf-context">
        <h2 id="uf-context">A rebrand and a weekly workflow</h2>
        <div className="project-section-body">
          <p>
            UnderstandingFAFSA helps students, parents, and counselors navigate the Free Application
            for Federal Student Aid (FAFSA). The newsletter carries guidance for all three groups.
            The website had already adopted Saans and a refreshed palette. The scope was email-only,
            and the founder assembles every issue.
          </p>
        </div>
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-problem">
        <h2 id="uf-problem">Where the old template broke down</h2>
        <div className="project-section-body">
          <p>
            The newsletter covers deadline-driven guidance at key checkpoints: FAFSA filing windows,
            scholarship deadlines, and policy changes. The old template had uneven CTAs, long
            stretches of text, weak section breaks, and a layout that wasn&apos;t optimized for mobile.
            Its muted palette also came from the site&apos;s previous visual system.
          </p>
        </div>
        <BeforeAfterPhones />
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-audit">
        <h2 id="uf-audit">What 120 newsletters revealed</h2>
        <div className="project-section-body">
          <p>
            Before touching templates, I worked with one collaborator to compile
            over 120 newsletter examples and evaluate them against four criteria:
            clarity, personalization, tone of voice, and visual appeal and branding
            consistency.
          </p>
          <p>
            Five newsletters got the deepest treatment: Revenews, The 74, Next by Jeff Selingo,
            Medium, and Folderly. Each used a different mix of structure, tone, and branding.
          </p>
          <p>
            The rest of the newsletter pool served as lighter references for layout, color, and
            hierarchy patterns.
          </p>
          <p>The deep dive highlights:</p>
          <ul>
            <li>
              Revenews used <strong>selective bolding</strong>, emoji section headers, and concise
              intros.
            </li>
            <li>
              Folderly carried <strong>brand color</strong> into its bullet styles.
            </li>
            <li>
              Several references used <strong>action-focused section titles</strong> to divide long
              sends.
            </li>
            <li>
              The 74 used a <strong>more formal register</strong> than student-facing references that
              used emojis and GIFs.
            </li>
            <li>
              Next used <strong>if/then link framing</strong>, author photos, and brief bios.
            </li>
          </ul>
        </div>
      </section>

      <section
        className="project-section uf-section project-section--wide uf-section--wide"
        aria-labelledby="uf-templates"
      >
        <h2 id="uf-templates">Three send types from the audit</h2>
        <div className="project-section-body">
          <p>
            The shared framework includes a welcome email that sets expectations, the core weekly
            newsletter, and an event-specific variant with fewer blocks for invites and recaps. A
            counselor-focused toolkit extends the same vocabulary (duotone icons, formal register)
            and is in progress.
          </p>
          <p>
            The welcome email follows a deliberate structure shaped by the audit. It includes a
            banner, gratitude, what to expect, a brief history that transitions into the current
            mission, a CTA, suggested reading, and social links. The welcome email introduces the
            redesigned type, palette, and content structure.
          </p>
        </div>

        <TemplateSwitcher />

        <NewsletterComposerDemo />
      </section>

      <section
        className="project-section uf-section project-section--wide uf-section--wide"
        aria-labelledby="uf-locked"
      >
        <h2 id="uf-locked">Rules for fixed and swappable parts</h2>
        <div className="project-section-body">
          <p>
            Spacing, dividers, type, and the structural skeleton stay locked. Editors swap body copy
            and emoji-style section images. The founder drafts each week&apos;s copy and works within
            those fixed rules.
          </p>
        </div>

        <LockedSwappableView />

        <ColorPalette colors={UF_COLORS} />
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-figma">
        <h2 id="uf-figma">Rebuilding the system in Mailchimp</h2>
        <div className="project-section-body">
          <p>
            The hierarchy, spacing, and modular rhythm all lived in Figma, but the live template had to be
            rebuilt in Mailchimp so the founder could edit without touching HTML. Matching Figma
            spacing inside the builder was a dead end. Every container and wrapper added bloat. I
            simplified the section-header and body hierarchy for the Mailchimp build.
          </p>
          <p>
            <mark className="case-highlight">
              Gmail&apos;s 102KB HTML ceiling and clipping created a rigid
              constraint.
            </mark>{" "}
            Early weight came from custom section icons and themed dividers exported from Figma. Test
            sends showed which wrappers and dividers could go. I merged sections where they still
            scanned and compressed PNGs through an external tool. For dark-mode-friendly dividers, I
            removed backgrounds in Photoshop so assets stayed lighter without muddying on phone.
          </p>
          <p>
            Compression wasn&apos;t one recipe. The weekly kit leaned on fewer custom assets and more
            Mailchimp-native structure. The counselor toolkit needed more image work and tighter file
            discipline for its duotone icons. What I wouldn&apos;t trade for a few kilobytes:
            typography tuned to the closest Mailchimp sans to the site&apos;s Saans typeface, and the
            full brand palette, even when trying to maintain the founder&apos;s appetite for vibrancy.
          </p>
        </div>
        <FigmaMailchimpPair />
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-results">
        <h2 id="uf-results">The first redesigned send</h2>
        <div className="project-section-body">
          <p>
            <mark className="case-highlight">
              This was my first time designing a system someone else
              assembles every week.
            </mark>
          </p>
          <p>
            I shipped a master template, modular blocks, explicit locked-vs-swappable rules, and
            three template variants on the same design vocabulary. The first redesigned send went
            out November 4, 2025. Mailchimp reported an observed <CountUp value="~52.6%" /> open
            rate with MPP excluded, compared with earlier sends around 30%. This was not a controlled
            attribution test, so I treat the result as an encouraging first observation rather than
            proof that the redesign caused the change.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="understandingfafsa" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

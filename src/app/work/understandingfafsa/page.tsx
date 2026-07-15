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
  NewsletterComposer,
  TemplateSwitcher,
} from "@/components/understandingfafsa";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";

const UF_DESCRIPTION =
  "Redesigned a newsletter system to match a fresh site rebrand. The first redesigned send opened at ~52.6%, compared with prior sends around 30%.";

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

export const metadata: Metadata = {
  title: "UnderstandingFAFSA",
  description: UF_DESCRIPTION,
  openGraph: {
    title: "UnderstandingFAFSA",
    description: UF_DESCRIPTION,
    type: "article",
    images: [{ url: "/projects/understandingfafsa/cover.png" }],
  },
};

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
        <p className="uf-eyebrow">Product design · 2025</p>
        <h1 id="uf-title" className="project-hero-title uf-title">
          UnderstandingFAFSA
        </h1>
        <p className="project-hero-lede uf-lede">
          {project?.summary ?? UF_DESCRIPTION}
        </p>
      </section>

      <LeadMedia cover="/projects/understandingfafsa/cover.png" alt="UnderstandingFAFSA cover" />
      <RecruiterCut
        problem="A freshly rebranded site left its newsletter looking dated and off-brand."
        role="Product Designer"
        timeline="February 2025 – Ongoing"
        stack="Figma, Mailchimp"
        stackLabel="Tools"
        outcomeValue={project?.outcomeMetricValue}
        outcomeLabel={project?.outcomeMetricLabel}
        moves={[
          "Researched 120+ newsletters against four criteria.",
          "Built a modular template system with locked layers and swappable parts.",
          "Matched the newsletter type and palette to the rebranded site.",
        ]}
      />

      <ProjectToc
        sections={[
          { title: "Context and problem", id: "uf-context" },
          { title: "Newsletter audit", id: "uf-audit" },
          { title: "Template system", id: "uf-templates" },
          { title: "Mailchimp build and results", id: "uf-figma" },
        ]}
      />

      <div className="case-tier-divider"><span>The full breakdown ↓</span></div>

      <section className="project-section uf-section" aria-labelledby="uf-context">
        <h2 id="uf-context">Where it started: a rebranded site, a dated newsletter.</h2>
        <blockquote className="case-pullquote">
          The newsletter still carried the site&apos;s previous visual system.
        </blockquote>
        <div className="project-section-body">
          <p>
            UnderstandingFAFSA helps students, parents, and counselors navigate the Free Application
            for Federal Student Aid (FAFSA). The newsletter carries guidance for all three groups.
            The website had already adopted Saans and a refreshed palette, while the newsletter still
            used the older visual system. The scope was email-only, and the founder assembles every
            issue.
          </p>
        </div>
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-problem">
        <h2 id="uf-problem">Where the old template broke down.</h2>
        <p className="case-section-lead">
          The old template presented long text blocks and weak section breaks on mobile. Prior sends
          opened around 30%.
        </p>
        <div className="project-section-body">
          <p>
            The old template had uneven CTAs, a muted palette that didn&apos;t carry the rebrand, long
            stretches of text, weak section breaks, and a layout that wasn&apos;t optimized for mobile
            users.
          </p>
          <p>
            The newsletter covers deadline-driven guidance at key checkpoints: FAFSA filing windows,
            scholarship deadlines, and policy changes. Its type and palette still came from the
            site&apos;s previous visual system.
          </p>
        </div>
        <BeforeAfterPhones />
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-audit">
        <h2 id="uf-audit">Auditing 120 newsletters against four criteria.</h2>
        <div className="project-section-body">
          <p>
            Before touching templates, we compiled over 120 newsletter
            examples and evaluated them against four criteria: clarity,
            personalization, tone of voice, and visual appeal and branding
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
          <p>
            From there we put our own spin on it, adapting these patterns to UnderstandingFAFSA&apos;s
            voice, the founder&apos;s preference for vibrancy, and the practical constraint that a
            non-designer would assemble every issue.
          </p>
        </div>
      </section>

      <section
        className="project-section uf-section project-section--wide uf-section--wide"
        aria-labelledby="uf-templates"
      >
        <h2 id="uf-templates">Designing one skeleton for three kinds of sends.</h2>
        <p className="case-section-lead">
          One modular framework covers the welcome email, the weekly newsletter, and lighter event sends.
        </p>
        <div className="project-section-body">
          <p>
            The system ships through a shared modular framework: a welcome
            email that sets expectations, the core weekly
            newsletter, and an event-specific variant with fewer blocks for invites and recaps. A
            counselor-focused toolkit extends
            the same vocabulary (duotone icons, formal register) and is in progress.
          </p>
          <p>
            The welcome email follows a deliberate structure shaped by the audit. It includes a
            banner, gratitude, what to expect, a brief history that transitions into the current
            mission, a CTA, suggested reading, and social links. The welcome email introduces the
            redesigned type, palette, and content structure.
          </p>
        </div>

        <TemplateSwitcher />

        <NewsletterComposer />
      </section>

      <section
        className="project-section uf-section project-section--wide uf-section--wide"
        aria-labelledby="uf-locked"
      >
        <h2 id="uf-locked">The core decision: locked layers, swappable parts.</h2>
        <p className="case-section-lead">
          The founder can edit copy and images within fixed spacing, type, and divider rules.
        </p>
        <div className="project-section-body">
          <p>
            <mark className="case-highlight">
              The locked-vs-swappable distinction was the core design
              decision.
            </mark>{" "}
            Spacing, dividers, type, and the structural skeleton stay locked. Editors swap body copy
            and emoji-style section images. The founder drafts each week&apos;s copy for editorial.
          </p>
          <p>
            The color variants draw from UnderstandingFAFSA&apos;s design system. The founder edits copy
            and images inside those fixed rules.
          </p>
        </div>

        <LockedSwappableView />

        <ColorPalette colors={UF_COLORS} />
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-figma">
        <h2 id="uf-figma">Rebuilding it in Mailchimp.</h2>
        <p className="case-section-lead">
          The Mailchimp build had to fit Gmail&apos;s 102KB clip limit while carrying the site&apos;s type
          and palette.
        </p>
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
            </mark>
            Early weight came from custom section icons and themed dividers exported from Figma. The
            fix arrived through test sends, stripping redundant wrappers and dividers, merging sections
            where it still scanned, and compressing PNGs through an external tool. For dark-mode-friendly
            dividers, I removed backgrounds in Photoshop so assets stayed lighter without muddying on
            phone.
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
        <h2 id="uf-results">The results: open rates after the first send.</h2>
        <p className="case-section-lead">
          The first redesigned send opened at about 52.6% on November 4, 2025, compared with prior
          sends around 30%.
        </p>
        <div className="project-section-body">
          <p>
            <mark className="case-highlight">
              This was my first time designing a system someone else
              assembles every week.
            </mark>{" "}
            No designer reviews each send before it goes out. The founder edits copy and images
            within the fixed spacing, type, and divider rules.
          </p>
          <p>
            The first redesigned send went out November 4, 2025. Mailchimp reported{" "}
            <CountUp value="~52.6%" /> for the first redesigned send with MPP excluded. Earlier sends
            opened around 30%. What shipped: a master template, modular blocks, explicit
            locked-vs-swappable rules, and three template variants on the same design vocabulary.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="understandingfafsa" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

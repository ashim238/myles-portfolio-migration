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
          "Matched the newsletter to the rebranded site so subscribers see one brand.",
        ]}
      />

      <ProjectToc
        sections={[
          { title: "Where it started: a rebranded site, a dated newsletter.", id: "uf-context" },
          { title: "Where the old template broke down.", id: "uf-problem" },
          { title: "Auditing 120 newsletters against four criteria.", id: "uf-audit" },
          { title: "Designing one skeleton for three kinds of sends.", id: "uf-templates" },
          { title: "The core decision: locked layers, swappable parts.", id: "uf-locked" },
          { title: "Rebuilding it in Mailchimp.", id: "uf-figma" },
          { title: "The results: open rates after the first send.", id: "uf-results" },
        ]}
      />

      <div className="case-tier-divider"><span>The full breakdown ↓</span></div>

      <section className="project-section uf-section" aria-labelledby="uf-context">
        <h2 id="uf-context">Where it started: a rebranded site, a dated newsletter.</h2>
        <blockquote className="case-pullquote">Subscribers were seeing two different brands.</blockquote>
        <div className="project-section-body">
          <p>
            UnderstandingFAFSA helps students, parents, and counselors navigate the Free Application
            for Federal Student Aid (FAFSA). The newsletter is a primary touchpoint. The website had
            already moved to a calmer, modern visual language (Saans typeface, refreshed palette),
            but the newsletter still carried an older system. The scope was email-only. The founder assembles every issue, so{" "}
            <mark className="case-highlight">
              the system had to maintain the brand&apos;s identity regardless
              of who was building it
            </mark>
            .
          </p>
        </div>
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-problem">
        <h2 id="uf-problem">Where the old template broke down.</h2>
        <p className="case-section-lead">
          The old template was difficult to scan on mobile. Prior sends opened around 30%.
        </p>
        <div className="project-section-body">
          <p>
            The old template had uneven CTAs, a muted palette that didn&apos;t carry the rebrand, long
            stretches of text, weak section breaks, and a layout that wasn&apos;t optimized for mobile
            users.
          </p>
          <p>
            The newsletter covers deadline-driven guidance at key checkpoints: FAFSA filing windows,
            scholarship deadlines, and policy changes. The channel needed the same credibility the
            site had worked to develop.
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
            Medium, and Folderly. Each newsletter adopted a different approach to the same problem:
            making a recurring email feel worth opening.
          </p>
          <p>
            The rest of the newsletter pool served as lighter references for layout, color, and
            hierarchy patterns.
          </p>
          <p>The deep dive highlights:</p>
          <ul>
            <li>
              <strong>Selective bolding</strong> created visual entry points without adding imagery.
              Revenews paired this with emoji section headers and concise intros.
            </li>
            <li>
              <strong>Bespoke bullet styles</strong> reinforced brand identity in the smallest
              details, like Folderly&apos;s use of brand-colored accents.
            </li>
            <li>
              <strong>Action-focused section titles</strong> turned bulk information into content
              readers could parse in a single scroll.
            </li>
            <li>
              <strong>Tone calibration by audience</strong>: student-facing emails could carry
              emojis and GIFs, while counselor-facing emails needed the more earnest, formal
              register we saw in The 74.
            </li>
            <li>
              <strong>Personalization through structure</strong>: Next&apos;s if/then link framing
              (&quot;if you&apos;re looking for help with X, then read this&quot;) gave readers
              agency, and author photos with brief bios made the sender feel human.
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
            newsletter, and an event-specific variant with fewer blocks and
            faster assembly for invites and recaps. A counselor-focused toolkit extends
            the same vocabulary (duotone icons, formal register) and is in progress.
          </p>
          <p>
            The welcome email follows a deliberate structure shaped by the audit. It includes a
            banner, gratitude, what to expect, a brief history that transitions into the current
            mission, a CTA, suggested reading, and social links. It&apos;s the subscriber&apos;s
            first impression of the redesigned brand.
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
          Structure and type stay locked, so a non-designer can swap copy and images without breaking the brand.
        </p>
        <div className="project-section-body">
          <p>
            <mark className="case-highlight">
              The locked-vs-swappable distinction was the core design
              decision.
            </mark>{" "}
            Spacing, dividers, type, and the structural skeleton stay locked
            so swaps don&apos;t quietly undo the brand.
            Editors swap body copy and emoji-style section images. The founder drafts each
            week&apos;s copy for editorial.
          </p>
          <p>
            Color variants were chosen to stay in harmony with UnderstandingFAFSA&apos;s design
            system. The founder can assemble an issue quickly without any single swap
            pulling the send off-brand.
          </p>
        </div>

        <LockedSwappableView />

        <ColorPalette colors={UF_COLORS} />
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-figma">
        <h2 id="uf-figma">Rebuilding it in Mailchimp.</h2>
        <p className="case-section-lead">
          Rebuilding the design in Mailchimp meant fighting Gmail&apos;s 102KB clip limit without losing the brand.
        </p>
        <div className="project-section-body">
          <p>
            The hierarchy, spacing, and modular rhythm all lived in Figma, but the live template had to be
            rebuilt in Mailchimp so the founder could edit without touching HTML. Matching Figma
            spacing inside the builder was a dead end. Every container and wrapper added bloat. I
            reframed hierarchy so section headers and body read clearly in email, not on a static
            artboard.
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
            No designer looks at a send before it goes out. The founder swaps
            copy and images herself, which means the locked layers carry the
            review a designer would normally do.
          </p>
          <p>
            The first redesigned send went out November 4, 2025. It opened at{" "}
            <CountUp value="~52.6%" />, compared with prior sends around 30%
            (Mailchimp reporting with MPP excluded), with clicks, bounces, and
            unsubscribes still in a healthy band. What shipped: a master
            template, modular blocks, explicit locked-vs-swappable rules,
            and three template variants on the same design vocabulary.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="understandingfafsa" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

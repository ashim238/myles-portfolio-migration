import type { Metadata } from "next";
import { ColorPalette } from "@/components/color-palette";
import { CountUp } from "@/components/count-up";
import { ProjectCover } from "@/components/project-cover";
import { TransitionLink } from "@/components/transition-link";
import { SiteNav } from "@/components/site-nav";
import { ProjectHighlight } from "@/components/project-highlight";
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
  "Redesigned a newsletter system to match a fresh site rebrand. Modular templates, competitive research across 120+ examples, and a 75% lift in open rates.";

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

      <ProjectCover
        src="/projects/understandingfafsa/cover.png"
        alt="UnderstandingFAFSA cover: newsletter system redesign"
        priority
      />

      <dl className="project-meta uf-meta" aria-label="Project details">
        <div className="project-meta-field">
          <dt>Role</dt>
          <dd>{project?.role ?? "Product Designer"}</dd>
        </div>
        <div className="project-meta-field">
          <dt>Timeframe</dt>
          <dd>{project?.timeframe ?? "February 2025 – Ongoing"}</dd>
        </div>
        <div className="project-meta-field">
          <dt>Tags</dt>
          <dd>{project?.tags?.join(" · ") ?? "Product Design · Content Design · Email Design"}</dd>
        </div>
      </dl>

      <ProjectHighlight
        quote={project?.highlightQuote}
        metricValue={project?.outcomeMetricValue}
        metricLabel={project?.outcomeMetricLabel}
      />

      <ProjectToc
        sections={[
          { title: "Two brands, one subscriber.", id: "uf-context" },
          { title: "Scannable or skipped.", id: "uf-problem" },
          { title: "120 newsletters, four criteria.", id: "uf-audit" },
          { title: "One skeleton, multiple fills.", id: "uf-templates" },
          { title: "Locked layers, swappable parts.", id: "uf-locked" },
          { title: "Figma fidelity, Mailchimp reality.", id: "uf-figma" },
          { title: "Open rates told the story.", id: "uf-results" },
        ]}
      />

      <section className="project-section uf-section" aria-labelledby="uf-context">
        <h2 id="uf-context">Two brands, one subscriber.</h2>
        <div className="project-section-body">
          <p>
            UnderstandingFAFSA helps students, parents, and counselors navigate the Free Application
            for Federal Student Aid (FAFSA). The newsletter is a primary touchpoint. The website had
            already moved to a calmer, modern visual language (Saans typeface, refreshed palette),
            but the newsletter still carried an older system. Subscribers were seeing two different
            brands. The scope was email-only. The founder assembles every issue, so{" "}
            <mark className="case-highlight">
              the system had to maintain the brand&apos;s identity regardless
              of who was building it
            </mark>
            .
          </p>
        </div>
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-problem">
        <h2 id="uf-problem">Scannable or skipped.</h2>
        <div className="project-section-body">
          <p>
            The old template failed where busy readers notice first: uneven CTAs, a muted palette that
            didn&apos;t carry the rebrand, long unscannable stretches of text, weak section breaks, and
            a layout that wasn&apos;t optimized for mobile users.{" "}
            <mark className="case-highlight">Open rates sat around ~30%</mark>.
          </p>
          <p>
            If email stayed weak, people would miss deadline-driven guidance at key checkpoints:
            FAFSA filing windows, scholarship deadlines, policy changes. The channel needed the same
            credibility the site had worked to develop.
          </p>
        </div>
        <BeforeAfterPhones />
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-audit">
        <h2 id="uf-audit">120 newsletters, four criteria.</h2>
        <div className="project-section-body">
          <p>
            Before touching templates, we compiled over{" "}
            <mark className="case-highlight">120 newsletter examples</mark>{" "}
            and evaluated them against four criteria: clarity,
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
        <h2 id="uf-templates">One skeleton, multiple fills.</h2>
        <div className="project-section-body">
          <p>
            The system ships through a{" "}
            <mark className="case-highlight">shared modular framework</mark>:
            a welcome email that sets expectations, the core weekly
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
        <h2 id="uf-locked">Locked layers, swappable parts.</h2>
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
            system. Enough flexibility for the founder to move fast, enough rigidity that no send
            drifts off-brand.
          </p>
        </div>

        <LockedSwappableView />

        <ColorPalette colors={UF_COLORS} />
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-figma">
        <h2 id="uf-figma">Figma fidelity, Mailchimp reality.</h2>
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
          <p>
            The same students block in Figma and Mailchimp: layout guides and spacing rails in design,
            editable modules in the builder.
          </p>
        </div>
        <FigmaMailchimpPair />
      </section>

      <section className="project-section uf-section" aria-labelledby="uf-results">
        <h2 id="uf-results">Open rates told the story.</h2>
        <div className="project-section-body">
          <p>
            <mark className="case-highlight">
              This was my first time designing a system someone else
              assembles every week.
            </mark>{" "}
            If the founder can break the brand by dragging a block, the
            template failed. If she can move fast and stay on-brand, it
            worked. That constraint changed how I think about fidelity
            in anything that ships without a designer in the room.
          </p>
        </div>
        <div className="project-section-body">
          <p>
            The first redesigned send went out November 4, 2025. Open rates
            moved from around 30% to <CountUp value="~52.6%" /> (Mailchimp
            reporting with MPP excluded), with clicks, bounces, and
            unsubscribes still in a healthy band. What shipped: a master template, modular blocks,
            explicit locked-vs-swappable rules, and three template variants
            on the same design vocabulary.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="understandingfafsa" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

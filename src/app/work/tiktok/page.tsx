import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { RecruiterCut } from "@/components/recruiter-cut";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { AESTHETICS } from "@/lib/tiktok-data";
import {
  AestheticShowcaseCard,
  ConsoleHello,
  HeroThreePhones,
  LineageTimeline,
  OutcomeCard,
  SystemOverviewBand,
  TemplateAnatomy,
  TikTokCoverBlobs,
  TikTokLogo,
} from "@/components/tiktok-dsa";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";

const TIKTOK_DESCRIPTION =
  "An internship-era template system for TikTok's Dynamic Showcase Ads, designed around the platform's subculture density and adopted by American Eagle.";

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProjectBySlug("tiktok");
  const isPublic = project?.status === "published";

  return {
    title: "TikTok Dynamic Showcase Ads",
    description: TIKTOK_DESCRIPTION,
    robots: isPublic
      ? undefined
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      title: "TikTok Dynamic Showcase Ads",
      description: TIKTOK_DESCRIPTION,
      type: "article",
    },
  };
}

export default async function TikTokPage() {
  const project = await getProjectBySlug("tiktok");
  if (!project || project.status !== "published") {
    notFound();
  }

  const allProjects = await getPublishedProjects();

  return (
    <main
      className="page-shell project-page tt-page"
      id="main-content"
      data-project-slug="tiktok"
    >
      <ConsoleHello />
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/#work">
          <span aria-hidden="true">← </span>
          Selected work
        </Link>
      </nav>

      <header className="tt-cover" data-project-enter-cover>
        <TikTokCoverBlobs />
        <div className="tt-cover-inner">
          <p className="tt-eyebrow">
            <TikTokLogo />
            <span>Internship · 2021</span>
          </p>
          <h1 id="tt-title" className="project-hero-title tt-title">
            TikTok Dynamic Showcase Ads
          </h1>
          <p className="project-hero-lede tt-lede">
            A modular template system built for TikTok&apos;s Dynamic Showcase
            Ads, designed around the platform&apos;s subculture density so the
            ads could read as in-feed, not at-feed. American Eagle adopted one
            of the three.
          </p>
        </div>
      </header>

      <RecruiterCut
        problem="On TikTok, recycled product creative does not land. One ad treatment for every subculture flattens what people are there to find."
        role="Visual Designer, Brand Studio"
        timeline="May – August 2021"
        stack="Illustrator, Photoshop"
        stackLabel="Tools"
        outcomeValue="1"
        outcomeLabel="of 3 templates shipped, adopted by American Eagle"
        moves={[
          "Mapped TikTok's subcultures down to three aesthetic systems a brand could see itself in.",
          "Designed one slot-map skeleton with three subculture fills, so a catalog stays native to each audience.",
          "Shipped the Light Academia template. American Eagle adopted it.",
        ]}
      />

      <ProjectToc
        sections={[
          { title: "The brief", id: "tt-brief" },
          { title: "Reading the platform", id: "tt-research" },
          { title: "The system", id: "tt-system" },
          { title: "Three aesthetics", id: "tt-aesthetics" },
          { title: "What shipped", id: "tt-shipped" },
          { title: "Honest scope", id: "tt-scope" },
          { title: "Retrospective", id: "tt-retro" },
        ]}
      />

      <div className="case-tier-divider"><span>The full breakdown ↓</span></div>

      {/* ── Section 01 — The brief ─────────────────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-brief">
        <h2 id="tt-brief">A template format, built for a platform of niches.</h2>
        <p className="case-section-lead">
          Dynamic Showcase Ads had to feel native to a platform built on subcultures, not just push a catalog into the feed.
        </p>
        <div className="tt-hero-device">
          <HeroThreePhones />
        </div>
        <div className="project-section-body">
          <p>
            Dynamic Showcase Ads were TikTok&apos;s answer to a partner
            ask: an affordable, evergreen way to push a product catalog
            into the feed using pre-built templates. TikTok shipped 30+
            of them.
          </p>
          <p>
            What sharpened the brief was the platform itself. TikTok&apos;s
            value sits in its subcultures (Y2K, Maximalism, Dark Academia,
            Cottagecore, WitchTok), and a single ad treatment for all of
            them flattens what people are there to find. The bet I went in
            with:{" "}
            <mark className="case-highlight">
              catalog templates designed against subcultures, not against the
              platform as a whole
            </mark>
            .
          </p>
        </div>

        <SystemOverviewBand />
      </section>

      {/* ── Section 02 — Reading the platform ──────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-research">
        <h2 id="tt-research">Five subcultures. Three buckets.</h2>
        <p className="case-section-lead">
          I mapped how TikTok&apos;s users actually browse, then narrowed five subcultures to three a brand could build against.
        </p>
        <div className="project-section-body">
          <p>
            Desk research first. Scrolling the way TikTok&apos;s users
            actually do, mapping the aesthetic worlds that organize how
            content and shopping find their audience. Five surfaced
            cleanly: Y2K, Maximalism, Dark Academia, Cottagecore, WitchTok.
          </p>
          <p>
            Five was too many to build templates against. I narrowed to
            three groupings (high-saturation joy, edge and texture, quiet
            and considered), broad enough that{" "}
            <mark className="case-highlight">
              a brand could see itself in one without per-brand customization
            </mark>
            .
          </p>
        </div>

        <blockquote className="case-pullquote">
          An in-feed ad either feels native or it doesn&apos;t. Subcultures are
          how TikTok&apos;s audience tells the difference.
        </blockquote>
      </section>

      {/* ── Section 03 — The system ────────────────────── */}
      <section className="project-section tt-section tt-section--wide" aria-labelledby="tt-system">
        <h2 id="tt-system">One skeleton. Three fills.</h2>
        <p className="case-section-lead">
          One slot map holds the structure, so only the fill changes from one aesthetic to the next.
        </p>
        <div className="project-section-body">
          <p>
            The constraints only resolve if the variability lives in
            defined places. I drew the template against a slot map: title
            zone, catalog grid, supplementary graphics, CTA. Each slot
            held the same role across every aesthetic. What changed was
            the fill: typography, palette, ornament, image treatment.
          </p>
        </div>

        <TemplateAnatomy />
      </section>

      {/* ── Section 04 — Three aesthetics ──────────────── */}
      <section className="tt-aesthetics-section" aria-labelledby="tt-aesthetics">
        <h2 id="tt-aesthetics" className="tt-aesthetics-heading">Three aesthetics.</h2>
        <p className="tt-aesthetics-lede">
          Internal working names while I built. Each card: the sketch I
          worked from, the finished template, the palette, and the
          feedback I got in review.
        </p>

        <AestheticShowcaseCard
          name={AESTHETICS[0].name}
          internalLabel={AESTHETICS[0].internalLabel}
          accentHex="#FF5576"
          palette={AESTHETICS[0].palette}
          anchorText="70s psychedelia: fluid forms, bold patterning, color treated as content."
          feedback="Continue incorporating TikTok's brand guidelines and brand copy."
          process={{
            src: "/projects/tiktok/lofi-dopamine.png",
            alt: "Hand-drawn lo-fi sketch for #DopamineDressing with notes: 'play with brand colors', 'broader abstract pattern', copy candidates '#OOTD', '#Daily fit', 'Dress for dopamine', 'The Fit'.",
          }}
          feature={{
            src: "/projects/tiktok/template-dopamine.png",
            alt: "Finished #DopamineDressing template. A denim shirt on a hanger with 'FIT CHECK' title over a blue and teal psychedelic-swirl background.",
            caption: "Finished template.",
          }}
        />

        <AestheticShowcaseCard
          name={AESTHETICS[1].name}
          internalLabel={AESTHETICS[1].internalLabel}
          accentHex="#313539"
          reverse
          palette={AESTHETICS[1].palette}
          anchorText="Grungy punk magazine: texture, distress, dimension. The challenge was carrying it without abandoning TikTok's upbeat register."
          feedback="Continue working on the design, but note that the aesthetic deviates from what TikTok is known for. Use dimension and texture to elevate it."
          process={{
            src: "/projects/tiktok/lofi-eboy.png",
            alt: "Hand-drawn lo-fi sketch for #e-Boy/#e-Girl with notes: 'may stray too far from guidelines', 'build it out more', 'if no color find a way to make it appealing', 'wear and tear', 'magazine spine', 'title overcrowded'.",
          }}
          feature={{
            src: "/projects/tiktok/template-eboy.png",
            alt: "Finished #e-Boy/#e-Girl template. Denim shirt on a torn-paper-edge dark background with distressed magazine-spine texture.",
            caption: "Finished template.",
          }}
        />

        <AestheticShowcaseCard
          name={AESTHETICS[2].name}
          internalLabel={AESTHETICS[2].internalLabel}
          accentHex="#EDC4AC"
          palette={AESTHETICS[2].palette}
          anchorText="Acne Studios pastels: clean, restrained, anchored. The hardest of the three because simplicity reads as missing when it's just under-built."
          feedback="Lean into TikTok's upbeat tone. Consider how simplicity can strengthen a design."
          process={{
            src: "/projects/tiktok/lofi-light-academia.png",
            alt: "Hand-drawn lo-fi sketch for #LightAcademia with notes: 'scale down font, light academia is too subtle', 'rethink placement bug', 'gestalt, calming color palette', 'barcode generator'.",
          }}
          feature={{
            src: "/projects/tiktok/template-light-academia.png",
            alt: "Finished #LightAcademia template. Denim shirt centered on a peach background with 'THE STYLE ZINE' editorial title.",
            caption: "Finished template. The one American Eagle adopted.",
          }}
        />
      </section>

      {/* ── Section 05 — What shipped ─────────────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-shipped">
        <h2 id="tt-shipped">What ended up on TikTok.</h2>
        <p className="case-section-lead">
          One of the three shipped, and American Eagle put it in market.
        </p>
        <OutcomeCard />
      </section>

      {/* ── Section 06 — Honest scope ──────────────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-scope">
        <h2 id="tt-scope">Where the work went.</h2>
        <p className="case-section-lead">
          TikTok retired DSA in 2023, but the mechanic it introduced kept shipping under new names.
        </p>
        <div className="project-section-body">
          <p>
            TikTok deprecated DSA on April 3, 2023, folding the mechanics
            into Video Shopping Ads. That lineage continues as Smart+
            Catalog Ads. Template-from-catalog still ships, under a new
            name and a newer optimization layer.
          </p>
          <p>
            My contribution sits in the launch generation. I designed three
            templates, one per aesthetic, part of the roughly ten the studio
            built for launch.{" "}
            <mark className="case-highlight">
              The Light Academia one shipped, and American Eagle adopted it.
            </mark>{" "}
            The mechanic outlived the product that
            introduced it.
          </p>
        </div>

        <LineageTimeline />
      </section>

      {/* ── Section 07 — Retrospective ────────────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-retro">
        <h2 id="tt-retro">What it actually taught me.</h2>
        <p className="case-section-lead">
          What looked like an ad-template brief was really my first product work.
        </p>
        <div className="project-section-body">
          <p>
            The brief said &quot;design three ad templates.&quot; What I
            spent the summer doing was{" "}
            <mark className="case-highlight">closer to product work</mark>:
            researching
            an audience I didn&apos;t belong to, narrowing scope so the
            system could hold, building a reusable structure around
            constraints I couldn&apos;t change. I was 21 and didn&apos;t
            have the vocabulary for it yet.
          </p>
          <p>
            The templates were the deliverable. The subculture mapping,
            the slot system, the constraint absorption: that was the
            thinking. First place I did product-level work, even if I
            didn&apos;t call it that until years later.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}

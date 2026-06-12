import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { AESTHETICS } from "@/lib/tiktok-data";
import {
  AestheticShowcaseCard,
  HeroThreePhones,
  LineageTimeline,
  OutcomeCard,
  SystemOverviewBand,
  TemplateAnatomy,
  TikTokLogo,
} from "@/components/tiktok-dsa";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "TikTok Dynamic Showcase Ads",
  description:
    "An internship-era template system for TikTok's Dynamic Showcase Ads — designed around the platform's subculture density and adopted by American Eagle.",
  openGraph: {
    title: "TikTok Dynamic Showcase Ads",
    description:
      "An internship-era template system for TikTok's Dynamic Showcase Ads — designed around the platform's subculture density and adopted by American Eagle.",
    type: "article",
  },
};

export default async function TikTokPage() {
  const allProjects = await getAllProjects();

  return (
    <main className="page-shell project-page tt-page" id="main-content">
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/#work">
          <span aria-hidden="true">← </span>
          Selected work
        </Link>
      </nav>

      <section className="hero project-hero tt-hero" aria-labelledby="tt-title">
        <p className="tt-eyebrow">
          <TikTokLogo />
          <span>Internship · 2021</span>
        </p>
        <h1 id="tt-title" className="project-hero-title tt-title">
          TikTok Dynamic Showcase Ads
        </h1>
        <p className="project-hero-lede tt-lede">
          A modular template system built for TikTok&apos;s Dynamic Showcase
          Ads — designed around the platform&apos;s subculture density so the
          ads could read as in-feed, not at-feed. American Eagle adopted one
          of the three.
        </p>
        <div className="tt-hero-device">
          <HeroThreePhones />
        </div>
      </section>

      <dl className="project-meta tt-meta" aria-label="Project details">
        <div className="project-meta-field">
          <dt>Role</dt>
          <dd>Visual Designer · Brand Studio</dd>
        </div>
        <div className="project-meta-field">
          <dt>Stack</dt>
          <dd>Illustrator · Photoshop</dd>
        </div>
        <div className="project-meta-field">
          <dt>Timeline</dt>
          <dd>May – Aug 2021</dd>
        </div>
      </dl>

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

      {/* ── Section 01 — The brief ─────────────────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-brief">
        <h2 id="tt-brief">A template format, built for a platform of niches.</h2>
        <div className="project-section-body">
          <p>
            TikTok&apos;s Dynamic Showcase Ads were the platform&apos;s
            answer to a specific partner ask: an affordable, evergreen way
            to push a product catalog into the feed. The format used
            pre-built templates so brands didn&apos;t need to commission a
            video every time the catalog turned over. TikTok eventually
            shipped 30+ of them.
          </p>
          <p>
            What made the brief sharper than &quot;design a catalog ad
            template&quot; was the platform itself. TikTok&apos;s value
            sits in its subcultures — Y2K, Maximalism, Dark Academia,
            Cottagecore, WitchTok — and a feed that hands a single ad
            treatment to all of them flattens what people are there to
            find. The bet I went in with was that catalog templates should
            be designed against subcultures, not against the platform as
            a whole.
          </p>
          <p>
            The constraints were the standard pair for in-feed: TikTok&apos;s
            brand guidelines, immutable; the 540×960 ad dimensions,
            immutable; and the subculture aesthetics, variable. The brief
            became designing a system that absorbed the variability without
            breaking the immutable parts.
          </p>
        </div>

        <SystemOverviewBand />
      </section>

      {/* ── Section 02 — Reading the platform ──────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-research">
        <h2 id="tt-research">Five subcultures. Three buckets. A working hypothesis.</h2>
        <div className="project-section-body">
          <p>
            Without a brand to anchor the work, I started with desk
            research — scrolling TikTok the way the platform&apos;s users
            actually do, mapping the recurring aesthetic worlds that
            organize how content (and shopping) finds its audience. Five
            surfaced cleanly: Y2K, Maximalism, Dark Academia, Cottagecore,
            and WitchTok. Each had its own visual register, its own
            creator vocabulary, its own commerce footprint.
          </p>
          <p>
            Five was too many to build templates against. Modularity
            needed buckets broad enough that a brand could see itself in
            one without per-brand customization. I narrowed to three
            categorical groupings — high-saturation joy, edge and
            texture, quiet and considered — and built internal working
            names around them so the team could talk about the work while
            I designed. Vendors who eventually adopted the templates
            likely saw a different label downstream.
          </p>
        </div>

        <figure className="tt-pullquote">
          <blockquote>
            An in-feed ad either feels native or it doesn&apos;t.
            Subcultures are how TikTok&apos;s audience makes that
            distinction.
          </blockquote>
          <figcaption>Working hypothesis · TikTok DSA, 2021</figcaption>
        </figure>

        <div className="project-section-body">
          <p>
            The bet was that designing against subculture buckets would
            absorb the breadth without losing specificity. The system had
            to share a skeleton — same in-feed dimensions, same TikTok
            chrome — and let three aesthetic registers fill it.
          </p>
        </div>
      </section>

      {/* ── Section 03 — The system ────────────────────── */}
      <section className="project-section tt-section tt-section--wide" aria-labelledby="tt-system">
        <h2 id="tt-system">One skeleton. Three fills.</h2>
        <div className="project-section-body">
          <p>
            The constraint stack — TikTok&apos;s brand guidelines, the
            540×960 in-feed dimensions, three subculture aesthetics — only
            resolves cleanly if the variability lives in defined places. I
            drew the template against a slot map: title zone, product
            catalog grid, supplementary graphics, CTA. Each slot held the
            same role across every aesthetic. What changed was the fill —
            typography, palette, ornament, image treatment.
          </p>
          <p>
            The artifact below is the original grid I built against —
            measurements, gutters, slot boundaries — preserved as it lived
            in my working file. The aesthetic showcases that follow show
            how each fill resolved against this same skeleton.
          </p>
        </div>

        <TemplateAnatomy />
      </section>

      {/* ── Section 04 — Three aesthetics ──────────────── */}
      <section className="tt-aesthetics-section" aria-labelledby="tt-aesthetics">
        <h2 id="tt-aesthetics" className="tt-aesthetics-heading">Three aesthetics.</h2>
        <p className="tt-aesthetics-lede">
          These were my internal working names while I built. The team
          used them to talk about the templates day-to-day; vendors who
          adopted the templates likely saw a different label downstream.
          Each card has the lo-fi sketch I worked from, the anchor I
          referenced, the palette, and the literal feedback I got in
          review.
        </p>

        <AestheticShowcaseCard
          name={AESTHETICS[0].name}
          internalLabel={AESTHETICS[0].internalLabel}
          accentHex="#FF5576"
          palette={AESTHETICS[0].palette}
          anchorText="70s psychedelia — fluid forms, bold patterning, chromatic-aberration ornament. Color treated as content, not as decoration."
          feedback="Continue incorporating TikTok's brand guidelines and brand copy."
          process={{
            src: "/projects/tiktok/lofi-dopamine.png",
            alt: "Hand-drawn lo-fi sketch for #DopamineDressing with notes — 'play with brand colors', 'broader abstract pattern', copy candidates '#OOTD', '#Daily fit', 'Dress for dopamine', 'The Fit'.",
          }}
          feature={{
            src: "/projects/tiktok/dopamine-ornament-rings.png",
            alt: "Chromatic-aberration ring ornament — one of the supplementary graphics built for the #DopamineDressing template.",
            caption: "One of the supplementary ornaments built into the template.",
          }}
        />

        <AestheticShowcaseCard
          name={AESTHETICS[1].name}
          internalLabel={AESTHETICS[1].internalLabel}
          accentHex="#313539"
          reverse
          palette={AESTHETICS[1].palette}
          anchorText="Grungy punk magazine — texture, distress, dimension. The challenge was carrying the aesthetic without abandoning TikTok's upbeat brand register."
          feedback="Continue working on the design, but note that the aesthetic deviates from what TikTok is known for. Use dimension and texture to elevate it."
          process={{
            src: "/projects/tiktok/lofi-eboy.png",
            alt: "Hand-drawn lo-fi sketch for #e-Boy/#e-Girl with notes — 'may stray too far from guidelines', 'build it out more', 'if no color find a way to make it appealing', 'wear and tear', 'magazine spine', 'title overcrowded'.",
          }}
        />

        <AestheticShowcaseCard
          name={AESTHETICS[2].name}
          internalLabel={AESTHETICS[2].internalLabel}
          accentHex="#EDC4AC"
          palette={AESTHETICS[2].palette}
          anchorText="Acne Studios pastels — clean, restrained, anchored. The hardest brief of the three because simplicity reads as missing when it's just under-built."
          feedback="Lean into TikTok's upbeat tone. Consider how simplicity can strengthen a design."
          process={{
            src: "/projects/tiktok/lofi-light-academia.png",
            alt: "Hand-drawn lo-fi sketch for #LightAcademia with notes — 'scale down font, light academia is too subtle', 'rethink placement bug', 'gestalt, calming color palette', 'barcode generator'.",
          }}
          feature={{
            src: "/projects/tiktok/feed-ref-light-academia.png",
            alt: "TikTok in-feed reference for Light Academia — a model in cream turtleneck and beige coat, '@LightAcademia / Just Light Academia things'.",
            caption: "The aesthetic reference, in the wild.",
          }}
        />
      </section>

      {/* ── Section 05 — What shipped ─────────────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-shipped">
        <h2 id="tt-shipped">What ended up on TikTok.</h2>
        <OutcomeCard />
      </section>

      {/* ── Section 06 — Honest scope ──────────────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-scope">
        <h2 id="tt-scope">Where the work went.</h2>
        <div className="project-section-body">
          <p>
            TikTok deprecated the original Dynamic Showcase Ads format on
            April 3, 2023, folding the underlying mechanics into Video
            Shopping Ads. That lineage continues today as Smart+ Catalog
            Ads — the modular template-from-catalog logic still ships,
            under a different product name and a newer optimization layer.
          </p>
          <p>
            My contribution sits in the launch generation: three of the
            30+ templates that shipped when the format went live. I
            don&apos;t know how long the specific designs persisted in
            rotation, and I have no visibility into performance data. What
            I can confirm is the mechanic — catalog in, template-wrapped
            ad out — outlived the product that introduced it.
          </p>
        </div>

        <LineageTimeline />
      </section>

      {/* ── Section 07 — Retrospective ────────────────── */}
      <section className="project-section tt-section" aria-labelledby="tt-retro">
        <h2 id="tt-retro">What it actually taught me.</h2>
        <div className="project-section-body">
          <p>
            The brief said &quot;design three ad templates.&quot; I treated
            it that way at first — pick aesthetics, fill slots, ship
            deliverables. But what I actually spent the summer doing was
            closer to product work: researching an audience I didn&apos;t
            belong to, narrowing scope so the system could hold, and
            building a reusable structure around constraints I
            couldn&apos;t change. I was 21, and I didn&apos;t have the
            vocabulary yet to describe what I was doing as anything other
            than &quot;visual design.&quot;
          </p>
          <p>
            I see it now. The templates were the deliverable, but the
            subculture mapping, the slot system, the constraint
            absorption — that was the thinking. This project is the first
            place I did product-level work, even if I didn&apos;t call it
            that until years later.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
    </main>
  );
}

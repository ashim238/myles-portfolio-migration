import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { HeroThreePhones, TikTokLogo } from "@/components/tiktok-dsa";
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
      </section>

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
    </main>
  );
}

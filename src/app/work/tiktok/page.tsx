import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
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

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
    </main>
  );
}

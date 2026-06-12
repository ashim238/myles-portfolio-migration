import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ProjectWorkJump } from "@/components/project-work-jump";
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
        <p className="tt-eyebrow">Internship · 2021</p>
        <h1 id="tt-title" className="project-hero-title tt-title">
          TikTok Dynamic Showcase Ads
        </h1>
        <p className="project-hero-lede tt-lede">
          Scaffolding — replace in Task 4.
        </p>
      </section>

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
    </main>
  );
}

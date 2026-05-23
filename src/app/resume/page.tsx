import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `Resume | ${siteConfig.name}`,
  description: `Resume and contact information for ${siteConfig.name}.`,
};

export default function ResumePage() {
  return (
    <main className="page-shell project-page" id="main-content">
      <SiteNav />
      <div className="project-topbar">
        <Link href="/">← Back</Link>
      </div>

      <section className="hero project-hero" aria-labelledby="resume-title">
        <h1 id="resume-title" className="project-hero-title">
          Resume
        </h1>
        <p className="project-hero-lede">
          A PDF resume will live here. Until then, reach out by email and I will send the latest
          version.
        </p>
        <p>
          <Link href={`mailto:${siteConfig.email}?subject=Resume%20request`}>
            Request resume via email
          </Link>
        </p>
      </section>
    </main>
  );
}

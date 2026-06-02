import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteConfig } from "@/lib/site-config";

const RESUME_PATH = "/myles-ashitey-cv.pdf";
const RESUME_UPDATED = "June 2026";

export const metadata = {
  title: `Résumé | ${siteConfig.name}`,
  description: `Résumé and contact information for ${siteConfig.name}.`,
};

export default function ResumePage() {
  return (
    <main className="page-shell project-page" id="main-content">
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/">
          <span aria-hidden="true">← </span>
          Home
        </Link>
      </nav>

      <section className="resume-layout" aria-labelledby="resume-title">
        <div className="resume-primary">
          <p className="resume-label">Résumé · updated {RESUME_UPDATED}</p>
          <h1 id="resume-title" className="resume-heading">
            {siteConfig.name}
          </h1>
          <p className="resume-body">
            Product designer focused on strategy, interaction detail, and
            clear storytelling through digital products.
          </p>
          <div className="resume-actions">
            <a
              href={RESUME_PATH}
              download="Myles-Ashitey-Resume.pdf"
              className="resume-cta"
            >
              Download PDF
              <span aria-hidden="true"> ↓</span>
            </a>
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener"
              className="about-action"
            >
              View in browser
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>

        <aside className="resume-aside" aria-label="Quick details">
          <dl className="resume-details">
            <div className="resume-detail">
              <dt>Focus</dt>
              <dd>Product Design</dd>
            </div>
            <div className="resume-detail">
              <dt>Location</dt>
              <dd>Brooklyn, NY</dd>
            </div>
            <div className="resume-detail">
              <dt>Contact</dt>
              <dd>
                <Link href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </Link>
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}

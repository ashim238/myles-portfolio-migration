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

      <section className="resume-layout" aria-labelledby="resume-title">
        <div className="resume-primary">
          <p className="resume-label">Resume</p>
          <h1 id="resume-title" className="resume-heading">
            Available on request
          </h1>
          <p className="resume-body">
            A formatted PDF is in progress. In the meantime, send an email and
            I will share the latest version directly.
          </p>
          <Link
            href={`mailto:${siteConfig.email}?subject=Resume%20request`}
            className="resume-cta"
          >
            Request via email
          </Link>
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

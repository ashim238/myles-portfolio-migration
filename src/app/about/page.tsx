import Link from "next/link";
import { SystemDocumentShell } from "@/components/myles-97/system-document-shell";
import { createRouteMetadata, siteConfig } from "@/lib/site-config";

export const metadata = createRouteMetadata({
  title: "About",
  description: `About ${siteConfig.name}: product designer based in Brooklyn.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <SystemDocumentShell program="about" title="About Myles">
      <section className="about-layout" aria-labelledby="about-title">
        <div className="about-primary">
          <p className="about-kicker">About</p>
          <h1 id="about-title" className="about-heading">
            {siteConfig.name}
          </h1>

          <div className="about-actions about-page-actions">
            <Link className="about-action" href="/#selected-work">
              See the work
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="about-action" href="/resume">
              Read the résumé
              <span aria-hidden="true">→</span>
            </Link>
            <a className="about-action" href={`mailto:${siteConfig.email}`}>
              Get in touch
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="about-body">
            <p>
              I came to product design through creative strategy at TikTok
              and Universal Music Group. I liked the work, but I wanted to
              spend more time making things myself. That led me to an MFA in
              Design and Technology at Parsons, which I completed in 2026.
            </p>
            <p>
              My thesis became Fresh Greens, a navigation prototype for Black
              drivers. I&apos;ve also built reusable newsletter templates for
              UnderstandingFAFSA and designed fashion ad templates at TikTok.
            </p>
            <p>
              Outside of work, I&apos;m a huge comic fan. Highly recommend
              Absolute Batman and, if you&apos;re a fantasy nerd, Absolute Wonder
              Woman as well. I&apos;ve also been trying to hike more, as much as
              the city and my allergies allow. If you want to talk product
              design, RPGs, or a bit of both, my email is below.
            </p>
          </div>
        </div>

        <section className="about-aside" aria-labelledby="about-details-title">
          <h2 className="sr-only" id="about-details-title">
            Quick details
          </h2>
          <dl className="about-details">
            <div className="about-detail">
              <dt>Based in</dt>
              <dd>Brooklyn, NY</dd>
            </div>
            <div className="about-detail">
              <dt>Education</dt>
              <dd className="about-detail-education">
                <span className="about-detail-education-line">
                  MFA · Design and Technology
                </span>
                <span className="about-detail-education-line">
                  Parsons · 2026
                </span>
              </dd>
            </div>
            <div className="about-detail">
              <dt>Tools</dt>
              <dd>
                <ul className="about-tools">
                  <li>Figma</li>
                  <li>Adobe Suite</li>
                  <li>React Native</li>
                  <li>TypeScript</li>
                </ul>
              </dd>
            </div>
            <div className="about-detail">
              <dt>Contact</dt>
              <dd>
                <a href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </section>
    </SystemDocumentShell>
  );
}

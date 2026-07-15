import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "About",
  description: `About ${siteConfig.name}: product designer based in Brooklyn.`,
};

export default function AboutPage() {
  return (
    <main className="page-shell project-page" id="main-content">
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/">
          <span aria-hidden="true">← </span>
          Home
        </Link>
      </nav>

      <section className="about-layout" aria-labelledby="about-title">
        <div className="about-primary">
          <p className="about-kicker">About</p>
          <h1 id="about-title" className="about-heading">
            {siteConfig.name}
          </h1>
          <div className="about-body">
            <p>
              I came to product design through creative strategy at TikTok
              and Universal Music Group. I learned how brands talk to people,
              then realized I wanted to build rather than just shape. That led
              me to an MFA in Design and Technology at Parsons, which I
              completed in 2026.
            </p>
            <p>
              My thesis was a solo-built React Native wayfinding app for Black
              travelers in America, with VoiceOver labels, dynamic type, and a
              WCAG dash pattern for the daylight cue built in from the start.
              For a financial-aid nonprofit, I rebuilt the newsletter as
              modular templates a non-designer could run without breaking the
              brand. Open rates went from about 30% to 52.6%. At TikTok I
              designed catalog ad templates around the platform&apos;s
              subcultures, and American Eagle adopted one.
            </p>
            <p>
              Outside of work, I&apos;m a huge comic fan. The work Daniel
              Mora&apos;s been doing on World&apos;s Finest is
              &ldquo;chef&apos;s kiss.&rdquo; I&apos;ve also been trying to hike
              more, as much as the city and my allergies allow. If you want to
              talk product design, RPGs, or a bit of both, my email is below.
            </p>
          </div>

          <div className="about-actions about-page-actions">
            <Link
              className="about-action"
              href="/#work"
            >
              See the work
              <span aria-hidden="true"> →</span>
            </Link>
            <Link className="about-action" href="/resume">
              Read the résumé
              <span aria-hidden="true"> →</span>
            </Link>
            <a
              className="about-action"
              href={`mailto:${siteConfig.email}`}
            >
              Get in touch
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>

        <aside className="about-aside" aria-label="Quick details">
          <dl className="about-details">
            <div className="about-detail">
              <dt>Based in</dt>
              <dd>Brooklyn, NY</dd>
            </div>
            <div className="about-detail">
              <dt>Education</dt>
              <dd>MFA · Design and Technology, Parsons · 2026</dd>
            </div>
            <div className="about-detail">
              <dt>Tools</dt>
              <dd>Figma · Adobe Suite · React Native · TypeScript</dd>
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
        </aside>
      </section>
    </main>
  );
}

import Link from "next/link";
import { HomeBrowserIntro } from "@/components/home-browser-intro";
import { HomeEntrance } from "@/components/home-entrance";
import { HomeIntroFocusGuard } from "@/components/home-intro-focus-guard";
import { HomeIntroGuard } from "@/components/home-intro-guard";
import { HeroInterestTyper } from "@/components/hero-interest-typer";
import { SiteNav } from "@/components/site-nav";
import { WorkShowcase } from "@/components/work-showcase";
import { getDraftProjects, getPublishedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export default async function Home() {
  const projects = await getPublishedProjects();
  const draftProjects = await getDraftProjects();

  return (
    <>
      <HomeIntroGuard />
      <HomeBrowserIntro siteName={siteConfig.name} />
      <main className="page-shell home-page" id="main-content">
        <HomeIntroFocusGuard />
        <HomeEntrance />
        <SiteNav />

      <section className="hero" aria-labelledby="hero-name">
        <h1 id="hero-name" className="hero-name">{siteConfig.name}</h1>
        <HeroInterestTyper awaitHomeEntrance />
        <p className="hero-tagline">Product designer working where interaction craft meets social responsibility — and I build past the prototype.</p>
        <p className="hero-credentials">Previously TikTok, UMG. MFA at Parsons.</p>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <h2 id="work-title">Selected Work</h2>
        <p className="work-lede">
          Each of these starts from the same question — who does the product
          leave out? Black travelers on the road, students decoding financial
          aid, visitors who want a neighborhood instead of a checklist.
        </p>
        <WorkShowcase projects={projects} />
      </section>

      {draftProjects.length > 0 ? (
        <section className="work work-drafts">
          <h2>In Progress</h2>
          <ul className="work-list" role="list">
            {draftProjects.map((project) => (
              <li key={project.slug} className="work-item">
                <Link href={`/work/${project.slug}`}>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <span className="draft-badge">Draft</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="about" id="about" aria-labelledby="about-title">
        <h2 id="about-title">About</h2>
        <p>
          Strategy, design, and code, and I ship past the prototype. Ask me
          how a nonprofit newsletter went from 30% to 52.6% open rates, or why
          the Navi daylight cue is a WCAG dash pattern.
        </p>
        <p className="about-actions">
          <Link className="about-action" href="/about">
            More about
            <span aria-hidden="true"> →</span>
          </Link>
          <Link className="about-action" href="/resume">
            Read the résumé
            <span aria-hidden="true"> →</span>
          </Link>
          <a className="about-action" href={`mailto:${siteConfig.email}`}>
            Get in touch
            <span aria-hidden="true"> ↗</span>
          </a>
        </p>
      </section>

      </main>

      <footer className="footer">
        <nav className="footer-nav" aria-label="Footer">
          <Link href="/#work">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/play">Play</Link>
          <Link href="/resume">Résumé</Link>
          <a href={`mailto:${siteConfig.email}`}>Email</a>
        </nav>
        <p className="footer-meta">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </footer>
    </>
  );
}

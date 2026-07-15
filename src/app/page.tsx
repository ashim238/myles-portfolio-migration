import Link from "next/link";
import { HeroInterestTyper } from "@/components/hero-interest-typer";
import { SiteNav } from "@/components/site-nav";
import { WorkGallery } from "@/components/work-gallery";
import { getDraftProjects, getPublishedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export default async function Home() {
  const projects = await getPublishedProjects();
  const draftProjects = await getDraftProjects();

  return (
    <>
      <main className="page-shell home-page" id="main-content">
        <SiteNav />

      <section className="hero" aria-labelledby="hero-name">
        <p className="hero-role">Product Designer</p>
        <h1 id="hero-name" className="hero-name">{siteConfig.name}</h1>
        <p className="hero-tagline">
          I design digital products and stay close through the build.
        </p>
        <p className="hero-credentials">
          Previously TikTok and UMG. My latest project is Fresh Greens.
        </p>
        <HeroInterestTyper />
        <p className="hero-actions">
          <Link className="about-action" href="/#work">
            View selected work
            <span aria-hidden="true"> ↓</span>
          </Link>
        </p>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <h2 id="work-title">Selected Work</h2>
        <WorkGallery projects={projects} />
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
          I came to product design through creative strategy at TikTok and UMG.
          The longer version includes comics, hiking, and why I ended up building
          my thesis in React Native.
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

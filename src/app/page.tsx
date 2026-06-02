import Image from "next/image";
import Link from "next/link";
import { HomeBrowserIntro } from "@/components/home-browser-intro";
import { HomeEntrance } from "@/components/home-entrance";
import { HomeIntroFocusGuard } from "@/components/home-intro-focus-guard";
import { HomeIntroGuard } from "@/components/home-intro-guard";
import { HeroInterestTyper } from "@/components/hero-interest-typer";
import { SiteNav } from "@/components/site-nav";
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

      <section className="hero">
        <h1 className="hero-name">{siteConfig.name}</h1>
        <HeroInterestTyper awaitHomeEntrance />
        <p className="hero-tagline">Focused on the balance between interaction design & social responsibility.</p>
      </section>

      <section className="work" id="work">
        <h2>Selected Work</h2>
        <ul className="work-list" role="list">
          {projects.length === 0 ? (
            <li className="work-item">
              <p>No published projects yet. Keep building.</p>
            </li>
          ) : (
            projects.map((project) => (
              <li key={project.slug} className="work-item">
                <Link href={`/work/${project.slug}`}>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  {project.coverImage ? (
                    <Image
                      className="work-item-image"
                      src={project.coverImage}
                      alt={`${project.title} preview`}
                      width={1400}
                      height={900}
                      sizes="(max-width: 768px) 100vw, 1090px"
                    />
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
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

      <section className="about" id="about">
        <h2>About</h2>
        <p>
          Brooklyn-based product designer focused on strategy, interaction detail,
          and clear storytelling through digital products.
        </p>
        <p className="about-actions">
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

      <footer className="footer">
        <nav className="footer-nav" aria-label="Footer">
          <Link href="/#work">Work</Link>
          <Link href="/#about">About</Link>
          <Link href="/play">Play</Link>
          <Link href="/resume">Résumé</Link>
          <a href={`mailto:${siteConfig.email}`}>Email</a>
        </nav>
        <p className="footer-meta">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </footer>
      </main>
    </>
  );
}

import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { playEntries } from "@/lib/content";

export default function PlayPage() {
  return (
    <main className="page-shell project-page" id="main-content">
      <SiteNav />
      <div className="project-topbar">
        <Link href="/">← Back</Link>
      </div>

      <section className="hero project-hero" aria-labelledby="play-title">
        <h1 id="play-title" className="project-hero-title">
          Play
        </h1>
        <p className="project-hero-lede">
          Recreational experiments, game sketches, and generative studies.
        </p>
      </section>

      <section className="work play-work">
        <h2>Experiments</h2>
        <ul className="work-list" role="list">
          {playEntries.map((entry) => (
            <li key={entry.slug} className="work-item play-item">
              <h3>{entry.title}</h3>
              <p className="play-hook">{entry.hook}</p>
              <p>{entry.exploration}</p>
              {entry.embedPath ? (
                <div className="play-embed-wrap">
                  <iframe
                    className="play-embed"
                    src={entry.embedPath}
                    title={`${entry.title} interactive preview`}
                    loading="lazy"
                  />
                </div>
              ) : null}
              <p className="play-meta">
                {entry.context} · {entry.year}
              </p>
              <ul className="play-tags" role="list" aria-label={`${entry.title} tags`}>
                {entry.tags.map((tag) => (
                  <li key={tag} className="play-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

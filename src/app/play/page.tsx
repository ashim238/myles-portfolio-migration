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

      <section className="hero project-hero play-hero" aria-labelledby="play-title">
        <h1 id="play-title" className="project-hero-title">
          Play
        </h1>
        <p className="project-hero-lede play-lede">
          Recreational experiments, game sketches, and generative studies.
        </p>
      </section>

      <section className="play-section" aria-label="Experiments">
        <p className="play-section-label">Experiments</p>

        <ol className="play-entries" role="list">
          {playEntries.map((entry, index) => (
            <li key={entry.slug} className="play-entry">
              <div className="play-entry-header">
                <span className="play-entry-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="play-entry-title">{entry.title}</h2>
              </div>

              <p className="play-entry-hook">{entry.hook}</p>

              <div className="play-entry-body">
                <p className="play-entry-exploration">{entry.exploration}</p>

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
              </div>

              <footer className="play-entry-footer">
                <p className="play-entry-meta">
                  {entry.context} &middot; {entry.year}
                </p>
                <ul
                  className="play-entry-tags"
                  role="list"
                  aria-label={`${entry.title} tags`}
                >
                  {entry.tags.map((tag) => (
                    <li key={tag} className="play-entry-tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </footer>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

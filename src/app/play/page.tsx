import { ExpandableImage } from "@/components/expandable-image";
import { LoomEmbed } from "@/components/loom-embed";
import { SystemDocumentShell } from "@/components/myles-97/system-document-shell";
import { PortfolioEndcap } from "@/components/portfolio-endcap";
import { SpecimenCard } from "@/components/specimen-card";
import { playEntries, type PlayState } from "@/lib/content";
import { createRouteMetadata } from "@/lib/site-config";
import styles from "./play.module.css";

const PLAY_STATE_LABELS: Record<PlayState, string> = {
  live: "Live",
  testing: "Testing",
  complete: "Complete",
  archived: "Archived",
};

export const metadata = createRouteMetadata({
  title: "Loose Parts",
  description:
    "A running lab for interaction studies, material tests, and small builds.",
  path: "/play",
});

export default function PlayPage() {
  return (
    <SystemDocumentShell program="loose-parts" title="Loose Parts">
      <section className="hero project-hero play-hero" aria-labelledby="play-title">
        <h1 id="play-title" className="project-hero-title play-title">
          Loose Parts
        </h1>
        <p className="project-hero-lede play-lede">
          I use this page as a running lab for interaction studies, material
          tests, and small builds. I&apos;ll keep adding work as I test it.
        </p>
      </section>

      <section className="play-section" aria-label="In the lab">
        <p className="play-section-label">In the lab</p>

        <ol className="play-entries" role="list">
          {playEntries.map((entry, index) => (
            <li key={entry.slug} id={entry.slug} className="play-entry">
              <div className="play-entry-header">
                <span className="play-entry-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="play-entry-title">{entry.title}</h2>
              </div>

              <p className="play-entry-hook">{entry.hook}</p>

              <div className="play-entry-body">
                {entry.exploration ? (
                  <p className="play-entry-exploration">{entry.exploration}</p>
                ) : null}

                <dl className={styles.experimentNotes}>
                  <div>
                    <dt>Question</dt>
                    <dd>{entry.question}</dd>
                  </div>
                  <div>
                    <dt>Medium</dt>
                    <dd>{entry.medium}</dd>
                  </div>
                  <div>
                    <dt>State</dt>
                    <dd>{PLAY_STATE_LABELS[entry.state]}</dd>
                  </div>
                  <div>
                    <dt>What changed</dt>
                    <dd>{entry.whatChanged}</dd>
                  </div>
                  {entry.next ? (
                    <div>
                      <dt>Next if real</dt>
                      <dd>{entry.next}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Updated</dt>
                    <dd>{entry.updated}</dd>
                  </div>
                </dl>

                {entry.process ? (
                  <ol
                    className={styles.process}
                    aria-label={`${entry.title} process`}
                  >
                    {entry.process.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                ) : null}

                {entry.embedPath ? (
                  <LoomEmbed src={entry.embedPath} title={entry.title} />
                ) : null}

                {entry.specimen && entry.images ? (
                  <SpecimenCard
                    designation={entry.specimen.designation}
                    classification={entry.specimen.classification}
                    material={entry.specimen.material}
                    status={entry.specimen.status}
                    images={entry.images}
                    priority={index === 0}
                  />
                ) : entry.images && entry.images.length > 0 ? (
                  <div
                    className={`play-images play-images--${entry.images.length}`}
                  >
                    {entry.images.map((image) => (
                      <ExpandableImage
                        key={image.src}
                        src={image.src}
                        alt={image.alt}
                        width={1200}
                        height={1600}
                        sizes="(max-width: 900px) 92vw, 720px"
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="play-entry-footer">
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
              </div>
            </li>
          ))}
        </ol>
      </section>
      <PortfolioEndcap context="play" />
    </SystemDocumentShell>
  );
}

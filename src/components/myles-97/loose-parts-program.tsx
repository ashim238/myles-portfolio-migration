export type LoosePartSummary = {
  slug: string;
  title: string;
  medium: string;
  state: "live" | "testing" | "complete" | "archived";
};

const PLAY_STATE_LABELS: Record<LoosePartSummary["state"], string> = {
  live: "Live",
  testing: "Testing",
  complete: "Complete",
  archived: "Archived",
};

export function LoosePartsProgram({
  entries,
}: {
  entries: readonly LoosePartSummary[];
}) {
  if (entries.length === 0) {
    return (
      <div className="myles97-secondary-empty">
        <h2>Loose Parts</h2>
        <p>No experiments are in the lab right now.</p>
        <a className="myles97-primary-button" href="/#work">
          Return to work
        </a>
      </div>
    );
  }

  return (
    <div className="myles97-loose-parts-program">
      <header>
        <p className="myles97-eyebrow">Running lab</p>
        <h2>Loose Parts</h2>
        <p>Small builds, material tests, and interaction studies already living on the Play page.</p>
      </header>
      <ol className="myles97-loose-parts-list" role="list">
        {entries.map((entry, index) => (
          <li key={entry.slug}>
            <span className="myles97-loose-parts-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <strong>{entry.title}</strong>
              <span>{entry.medium}</span>
              <span className="myles97-evidence-badge">
                {PLAY_STATE_LABELS[entry.state]}
              </span>
            </div>
            <a href={`/play#${entry.slug}`} aria-label={`Open ${entry.title} in Loose Parts`}>
              Open <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

import Link from "next/link";
import { CommandIcon } from "./command-icon";
import type { LoosePartSummary } from "./loose-parts-program";

const samples = new Set(["igor", "sukunas-finger", "loom", "myles-is-stressed"]);

export function LoosePartShelf({ entries, inLab = false }: {
  entries: readonly LoosePartSummary[];
  inLab?: boolean;
}) {
  return (
    <ol className="parts-shelf" role="list">
      {entries.map((entry) => (
        <li key={entry.slug}>
          <Link href={`${inLab ? "" : "/play"}#${entry.slug}`}
            aria-label={inLab ? entry.title : `Open ${entry.title} in Loose Parts`}
            className="parts-file" data-sample={entry.slug}>
            {samples.has(entry.slug) && <span className="parts-swatch" aria-hidden="true" />}
            <span className="parts-file-label">
              <strong>{entry.title}</strong>
              <CommandIcon name={inLab ? "down" : "external"} size={16} />
              <span>{entry.medium}</span>
              {!inLab && <small className="parts-file-state">{entry.state}</small>}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

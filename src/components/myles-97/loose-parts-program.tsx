import { LoosePartShelf } from "./loose-part-shelf";
import Link from "next/link";

export type LoosePartSummary = {
  slug: string;
  title: string;
  medium: string;
  state: "live" | "testing" | "complete" | "archived";
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
        <Link className="myles97-primary-button" href="/#selected-work">
          Return to Work Stuff
        </Link>
      </div>
    );
  }

  return (
    <div className="myles97-loose-parts-program">
      <header>
        <p className="myles97-eyebrow">Running lab</p>
        <h2>Loose Parts</h2>
        <p>Small builds, material tests, and interaction studies collected in the full Loose Parts lab.</p>
      </header>
      <LoosePartShelf entries={entries} />
    </div>
  );
}

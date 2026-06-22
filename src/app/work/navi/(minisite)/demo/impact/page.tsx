import Link from "next/link";
import { ImpactThemeSection } from "@/components/navi/demo/ImpactThemeSection";
import { getImpactSummary } from "@/lib/navi/impact";

// Default export is the route. ImpactView is exported separately so tests can
// render the view directly without the route wrapper.
export default function ImpactPage() {
  return <ImpactView />;
}

export function ImpactView() {
  const summary = getImpactSummary();
  return (
    <article className="nv-impact-page">
      <p className="nv-impact-back">
        <Link href="/work/navi/demo">← Back to exploring</Link>
      </p>
      <header className="nv-impact-intro">
        <h1>Where bookings go</h1>
        <p>
          Every Navi experience commits to one regenerative outcome. This ledger
          groups those commitments by theme so you can see where bookings
          concentrate. A few honest caveats: the counts here are experiences, not
          dollars, and there are no revenue figures in this view. Each theme
          reflects what a host says a booking supports, not an audited result.
          The point is to show the pattern, not to sell it.
        </p>
      </header>
      {summary.map((section) => (
        <ImpactThemeSection key={section.id} section={section} />
      ))}
      <footer className="nv-impact-method">
        <h2>How we count this</h2>
        <p>
          Themes are assigned by reading each host&apos;s stated commitment and
          matching it to the closest category. No experience appears in more than
          one theme, and we don&apos;t invent themes to fill a section.
        </p>
      </footer>
      <nav className="nv-impact-cta" aria-label="Keep exploring">
        <Link className="nv-btn nv-btn--primary nv-btn--md" href="/work/navi/demo">
          Browse experiences
        </Link>
        <Link className="nv-btn nv-btn--outline nv-btn--md" href="/work/navi/demo/host">
          Host an event
        </Link>
      </nav>
    </article>
  );
}

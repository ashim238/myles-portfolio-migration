import Link from "next/link";
import { ImpactThemeSection } from "@/components/navi/demo/ImpactThemeSection";
import { getImpactSummary } from "@/lib/navi/impact";

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
          concentrate. The counts here are experiences, not dollars. This demo
          has no revenue figures. Each theme reflects the sample claim attached
          to a listing, not an audited result.
        </p>
      </header>
      {summary.map((section) => (
        <ImpactThemeSection key={section.id} section={section} />
      ))}
      <footer className="nv-impact-method">
        <h2>How we count this</h2>
        <p>
          Each listing&apos;s sample commitment is assigned to the closest theme.
          Each experience appears once.
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

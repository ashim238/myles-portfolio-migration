import Link from "next/link";

export function NaviHeader() {
  return (
    <header className="nv-header" role="banner">
      <p className="nv-concept-disclosure">Portfolio concept · sample content</p>
      <div className="nv-header-main">
        <div className="nv-header-lead">
          <Link href="/work/navi/demo" className="nv-wordmark" aria-label="Navi home">
            Navi
          </Link>
        </div>
        <nav className="nv-nav" aria-label="Navi project navigation">
          <Link
            href="/work/navi"
            className="nv-nav-back"
            aria-label="Return to case study"
          >
            <span className="nv-nav-back-wide" aria-hidden="true">
              Return to case study
            </span>
            <span className="nv-nav-back-short" aria-hidden="true">
              Case study
            </span>
          </Link>
          <Link href="/work/navi/demo">Explore</Link>
          <Link href="/work/navi/demo/impact">Impact</Link>
          <Link href="/work/navi/system">System</Link>
          <Link href="/work/navi/demo/host" className="nv-nav-host">
            Host an event
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

export function NaviHeader() {
  return (
    <header className="nv-header" role="banner">
      {/* TODO(plan-2): point to /work/navi/demo once the demo ships */}
      <Link href="/work/navi/system" className="nv-wordmark" aria-label="Navi home">
        Navi
      </Link>
      <nav className="nv-nav" aria-label="Primary">
        {/* TODO(plan-2): point to /work/navi/demo once the demo ships */}
        <Link href="/work/navi/system">Explore</Link>
        <Link href="/work/navi/system">System</Link>
        <Link href="/work/navi" className="nv-nav-host">
          Host an event
        </Link>
      </nav>
    </header>
  );
}

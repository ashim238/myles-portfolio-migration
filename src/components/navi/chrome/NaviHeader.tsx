import Link from "next/link";

export function NaviHeader() {
  return (
    <header className="nv-header" role="banner">
      <Link href="/work/navi/demo" className="nv-wordmark" aria-label="Navi home">
        Navi
      </Link>
      <nav className="nv-nav" aria-label="Primary">
        <Link href="/work/navi/demo">Explore</Link>
        <Link href="/work/navi/system">System</Link>
        <Link href="/work/navi/demo/host" className="nv-nav-host">
          Host an event
        </Link>
      </nav>
    </header>
  );
}

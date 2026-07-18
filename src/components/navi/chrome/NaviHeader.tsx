"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRODUCT_LINKS = [
  { href: "/work/navi/demo", label: "Explore" },
  { href: "/work/navi/demo/impact", label: "Impact" },
  { href: "/work/navi/system", label: "System" },
  { href: "/work/navi/demo/host", label: "Host an event", className: "nv-nav-host" },
] as const;

function currentProductPath(pathname: string): string | undefined {
  return [...PRODUCT_LINKS]
    .sort((a, b) => b.href.length - a.href.length)
    .find(({ href }) => pathname === href || pathname.startsWith(`${href}/`))?.href;
}

export function NaviHeader() {
  const pathname = usePathname();
  const currentPath = currentProductPath(pathname);

  return (
    <header className="nv-header" role="banner">
      <p className="nv-concept-disclosure">
        Portfolio concept. Hosts, reviews, prices, and impact claims are sample content.
      </p>
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
          {PRODUCT_LINKS.map(({ href, label, ...item }) => (
            <Link
              key={href}
              href={href}
              className={"className" in item ? item.className : undefined}
              aria-current={currentPath === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

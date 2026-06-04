import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { navItems, siteConfig } from "@/lib/site-config";

export function SiteNav() {
  return (
    <header className="site-header">
      <div className="site-header-left">
        <Link
          href="/"
          className="site-logo"
          aria-label={`${siteConfig.name} — Home`}
        >
          <Image
            src="/logomark.svg"
            alt=""
            width={378}
            height={235}
            priority
          />
        </Link>
        <ThemeToggle />
      </div>
      <nav aria-label="Primary">
        <ul className="site-nav-list">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

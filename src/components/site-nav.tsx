import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { navItems, siteConfig } from "@/lib/site-config";

export function SiteNav() {
  return (
    <header className="site-header">
      <div className="site-header-left">
        <Link
          href="/"
          className="site-logo"
          aria-label={`${siteConfig.name}, home`}
        >
          <SiteLogo />
        </Link>
        <ThemeToggle />
      </div>
      <div className="site-header-right">
        <nav aria-label="Primary">
          <ul className="site-nav-list">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { navItems, siteConfig } from "@/lib/site-config";

export function SiteNav() {
  return (
    <header className="site-header">
      <div className="site-header-left">
        <p className="site-kicker">{siteConfig.headerKicker}</p>
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

const items = [
  {
    label: "Work",
    href: "/#work",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="3" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="11" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "About",
    href: "/about",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="7" r="3.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 17.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Play",
    href: "/play",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2.5l2.47 4.56L17.5 8l-3.75 3.37.88 5.13L10 14l-4.63 2.5.88-5.13L2.5 8l5.03-.94L10 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Resume",
    href: "/resume",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="4" y="2" width="12" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="7" y1="6.5" x2="13" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="13.5" x2="10.5" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "E-mail",
    href: `mailto:${siteConfig.email}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 5.5l8 5.5 8-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {items.map((item) => {
        const isActive =
          item.href === "/#work"
            ? pathname === "/"
            : pathname === item.href;
        const isExternal = item.href.startsWith("mailto:");
        const Component = isExternal ? "a" : Link;

        return (
          <Component
            key={item.label}
            href={item.href}
            className={`mobile-nav-item${isActive ? " mobile-nav-item--active" : ""}`}
            {...(isActive && !isExternal ? { "aria-current": "page" as const } : {})}
          >
            {item.icon}
            <span className="mobile-nav-label">{item.label}</span>
          </Component>
        );
      })}
    </nav>
  );
}

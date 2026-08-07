"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isWorkPath } from "@/lib/navigation-state";
import { navItems } from "@/lib/site-config";

export function SiteNavList() {
  const pathname = usePathname();

  return (
    <ul className="site-nav-list">
      {navItems.map((item) => {
        const isExternal = item.href.startsWith("mailto:");
        const isActive = isExternal
          ? false
          : item.href === "/#selected-work"
            ? isWorkPath(pathname)
            : pathname === item.href;

        return (
          <li key={item.label} className={isActive ? "site-nav-list-item--active" : undefined}>
            <Link
              href={item.href}
              {...(isActive ? { "aria-current": "page" as const } : {})}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

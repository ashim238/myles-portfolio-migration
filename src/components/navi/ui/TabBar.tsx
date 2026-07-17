import Link from "next/link";
import type { ReactNode } from "react";

type Item = { id: string; label: string; icon: ReactNode; href: string };

export function TabBar({ items, active }: { items: Item[]; active: string }) {
  return (
    <nav className="nv-tabbar" aria-label="Navi demo sections">
      {items.map((it) => {
        const selected = it.id === active;
        return (
          <Link
            key={it.id}
            href={it.href}
            aria-current={selected ? "page" : undefined}
            className={`nv-tabbar-item${selected ? " nv-tabbar-item--active" : ""}`}
          >
            <span className="nv-tabbar-icon" aria-hidden="true">
              {it.icon}
            </span>
            <span className="nv-tabbar-label">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

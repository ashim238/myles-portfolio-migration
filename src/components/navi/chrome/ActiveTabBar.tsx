"use client";

import { usePathname } from "next/navigation";
import { TabBar } from "@/components/navi/ui";

const ITEMS = [
  { id: "explore", label: "Explore", icon: <span>⌕</span>, href: "/work/navi/demo" },
  { id: "search", label: "Search", icon: <span>○</span>, href: "/work/navi/demo/search" },
  { id: "system", label: "System", icon: <span>▤</span>, href: "/work/navi/system" },
];

export function ActiveTabBar() {
  const path = usePathname() ?? "";
  // Exact match wins. Otherwise pick the longest href prefix so that nested
  // routes (e.g. /work/navi/demo/search) prefer the more specific item.
  const exact = ITEMS.find((i) => path === i.href);
  const prefix = ITEMS.filter((i) => path.startsWith(i.href + "/")).sort(
    (a, b) => b.href.length - a.href.length,
  )[0];
  const active = exact?.id ?? prefix?.id ?? "explore";
  return <TabBar items={ITEMS} active={active} />;
}

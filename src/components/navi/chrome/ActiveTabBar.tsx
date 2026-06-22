"use client";

import { usePathname } from "next/navigation";
import { TabBar } from "@/components/navi/ui";

const svgProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

const CompassIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5" fill="currentColor" stroke="none" />
  </svg>
);
const SearchIcon = () => (
  <svg {...svgProps}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const LayersIcon = () => (
  <svg {...svgProps}>
    <polygon points="12 3 21 8 12 13 3 8 12 3" />
    <polyline points="3 16 12 21 21 16" />
  </svg>
);
const ImpactIcon = () => (
  <svg {...svgProps}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const ITEMS = [
  { id: "explore", label: "Explore", icon: <CompassIcon />, href: "/work/navi/demo" },
  { id: "search", label: "Search", icon: <SearchIcon />, href: "/work/navi/demo/search" },
  { id: "impact", label: "Impact", icon: <ImpactIcon />, href: "/work/navi/demo/impact" },
  { id: "system", label: "System", icon: <LayersIcon />, href: "/work/navi/system" },
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

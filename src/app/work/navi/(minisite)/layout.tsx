import type { ReactNode } from "react";
import { naviDisplay, naviBody } from "@/lib/navi/fonts";
import { NaviHeader } from "@/components/navi/chrome/NaviHeader";
import { NaviFooter } from "@/components/navi/chrome/NaviFooter";
import { TabBar } from "@/components/navi/ui";

const TAB_ITEMS = [
  { id: "explore", label: "Explore", icon: <span>⌕</span>, href: "/work/navi/demo" },
  { id: "search", label: "Search", icon: <span>○</span>, href: "/work/navi/demo/search" },
  { id: "system", label: "System", icon: <span>▤</span>, href: "/work/navi/system" },
];

export default function NaviMinisiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`nv-ui ${naviDisplay.variable} ${naviBody.variable}`}>
      <NaviHeader />
      <main id="main-content">{children}</main>
      <NaviFooter />
      <TabBar items={TAB_ITEMS} active="explore" />
    </div>
  );
}

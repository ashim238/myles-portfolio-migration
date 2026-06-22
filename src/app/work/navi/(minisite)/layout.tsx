import type { ReactNode } from "react";
import { naviDisplay, naviBody } from "@/lib/navi/fonts";
import { NaviHeader } from "@/components/navi/chrome/NaviHeader";
import { NaviFooter } from "@/components/navi/chrome/NaviFooter";
import { ActiveTabBar } from "@/components/navi/chrome/ActiveTabBar";

export default function NaviMinisiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`nv-ui ${naviDisplay.variable} ${naviBody.variable}`}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <NaviHeader />
      <main id="main-content">{children}</main>
      <NaviFooter />
      <ActiveTabBar />
    </div>
  );
}

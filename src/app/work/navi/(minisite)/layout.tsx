import type { ReactNode } from "react";
import { naviDisplay, naviBody } from "@/lib/navi/fonts";
import { NaviHeader } from "@/components/navi/chrome/NaviHeader";
import { NaviFooter } from "@/components/navi/chrome/NaviFooter";

export default function NaviMinisiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`nv-ui ${naviDisplay.variable} ${naviBody.variable}`}>
      <NaviHeader />
      <main id="main-content">{children}</main>
      <NaviFooter />
    </div>
  );
}

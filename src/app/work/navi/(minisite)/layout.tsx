import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import "../../../styles/navi-minisite.css";
import { naviDisplay, naviBody } from "@/lib/navi/fonts";
import { NaviHeader } from "@/components/navi/chrome/NaviHeader";
import { NaviFooter } from "@/components/navi/chrome/NaviFooter";
import { ActiveTabBar } from "@/components/navi/chrome/ActiveTabBar";
import { getProjectBySlug } from "@/lib/content";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function NaviMinisiteLayout({ children }: { children: ReactNode }) {
  const project = await getProjectBySlug("navi");
  if (!project || project.status !== "published") {
    notFound();
  }

  return (
    <div className={`nv-ui ${naviDisplay.variable} ${naviBody.variable}`}>
      <NaviHeader />
      <main id="main-content">{children}</main>
      <NaviFooter />
      <ActiveTabBar />
    </div>
  );
}

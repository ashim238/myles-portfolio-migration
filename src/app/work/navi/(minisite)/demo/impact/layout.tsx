import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Impact · Navi",
};

export default function ImpactLayout({ children }: { children: ReactNode }) {
  return children;
}

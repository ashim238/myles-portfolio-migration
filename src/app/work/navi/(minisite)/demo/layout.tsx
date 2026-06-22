import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Explore · Navi",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}

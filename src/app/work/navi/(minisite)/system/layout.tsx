import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Design system · Navi",
};

export default function SystemLayout({ children }: { children: ReactNode }) {
  return children;
}

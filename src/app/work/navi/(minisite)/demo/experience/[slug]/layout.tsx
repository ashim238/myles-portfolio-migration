import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getExperienceBySlug } from "@/lib/navi/demo-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = getExperienceBySlug(slug);
  return { title: e ? `${e.title} · Navi` : "Navi" };
}

export default function ExperienceLayout({ children }: { children: ReactNode }) {
  return children;
}

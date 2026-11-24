import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/content";
import { createRouteMetadata } from "@/lib/site-config";
import { JuliusReader } from "../julius-reader";
import { systemStudy } from "./study";

export const metadata = createRouteMetadata({
  title: systemStudy.title,
  description: systemStudy.summary,
  path: "/work/julius-design-system",
  image: "/projects/preview-art/julius/system-cover.webp",
  type: "article",
});

export default async function JuliusDesignSystemPage() {
  const project = await getProjectBySlug(systemStudy.slug);
  if (project?.status !== "published") notFound();
  return <JuliusReader study={systemStudy} />;
}

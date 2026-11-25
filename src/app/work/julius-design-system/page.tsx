import { cookies } from "next/headers";
import { hasJuliusAccess, JULIUS_COOKIE, JULIUS_UNLOCK_PATH } from "@/lib/julius-access";
import { redirect, notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/content";
import { createRouteMetadata } from "@/lib/site-config";
import { JuliusReader } from "../julius-reader";
import { systemStudy } from "./study";

export const metadata = { ...createRouteMetadata({
  title: systemStudy.title,
  description: systemStudy.summary,
  path: "/work/julius-design-system",
  image: "/projects/preview-art/julius/system-cover.webp",
  type: "article",
}), robots: { index: false, follow: false } };

export default async function JuliusDesignSystemPage() {
  if (!hasJuliusAccess((await cookies()).get(JULIUS_COOKIE)?.value)) redirect(JULIUS_UNLOCK_PATH);
  const project = await getProjectBySlug(systemStudy.slug);
  if (project?.status !== "published") notFound();
  return <JuliusReader study={systemStudy} />;
}

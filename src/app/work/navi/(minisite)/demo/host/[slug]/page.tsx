import { notFound } from "next/navigation";
import { use } from "react";
import { getHostBySlug } from "@/lib/navi/hosts";
import { HostView } from "./HostView";

export default function HostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const host = getHostBySlug(slug);
  if (!host) notFound();
  return <HostView host={host} />;
}

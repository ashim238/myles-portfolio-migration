"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { getNeighborhoodBySlug } from "@/lib/navi/neighborhoods";
import { NeighborhoodView } from "./NeighborhoodView";

export default function NeighborhoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const neighborhood = getNeighborhoodBySlug(slug);
  if (!neighborhood) notFound();
  return <NeighborhoodView neighborhood={neighborhood} />;
}

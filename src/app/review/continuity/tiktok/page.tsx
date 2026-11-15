import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { TikTokOpening } from "@/components/tiktok-opening";
import "../../../styles/portfolio-surfaces.css";

export const metadata = { title: "TikTok opening comparison", robots: { index: false, follow: false } };

export default async function OpeningComparison({ searchParams }: {
  searchParams: Promise<{ variant?: string }>;
}) {
  if (process.env.VERCEL_ENV === "production") notFound();
  const { variant } = await searchParams;
  return <ReaderShell slug="tiktok" title="TikTok Dynamic Showcase Ads" className="tt-page tt-preview-page">
    <TikTokOpening legacy={variant === "legacy"} />
  </ReaderShell>;
}

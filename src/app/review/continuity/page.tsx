import { notFound, redirect } from "next/navigation";
import Home from "@/app/page";
import styles from "./study.module.css";

export const metadata = { title: "Portfolio continuity review", robots: { index: false, follow: false } };

export default async function ContinuityReview({ searchParams }: {
  searchParams: Promise<{ view?: string; variant?: string; wallpaper?: string; controls?: string; preview?: string; screen?: string }>;
}) {
  if (process.env.VERCEL_ENV === "production") notFound();
  const params = await searchParams;
  if (params.view === "tiktok") redirect(`/review/continuity/tiktok${params.variant === "legacy" ? "?variant=legacy" : ""}`);
  if (params.view === "frames") {
    const routes: Record<string, string> = { home: "/", tiktok: "/work/tiktok", chapter: "/work/tiktok#tt-system", navi: "/work/navi", fafsa: "/work/understandingfafsa", fresh: "/work/fresh-greens" };
    const path = routes[params.screen ?? "home"] ?? "/";
    return <main className={styles.frames}>
      <h1>Portrait layout comparison</h1>
      <p>Actual application routes at 320, 390 and 430 CSS px. Frames do not emulate physical touch or pixel density.</p>
      <nav><a href="?view=frames&screen=home">Home</a> · <a href="?view=frames&screen=tiktok">TikTok</a> · <a href="?view=frames&screen=chapter">Direct chapter</a> · <a href="?view=frames&screen=fafsa">FAFSA</a></nav>
      <div>{[320,390,430].map(width=><figure key={width}><figcaption>{width} × 844</figcaption><iframe title={`${width}px ${params.screen ?? "home"}`} src={path} width={width} height={844} /></figure>)}</div>
    </main>;
  }
  return <div className={styles.study} data-wallpaper={params.wallpaper} data-controls={params.controls} data-preview={params.preview}>
    <Home />
  </div>;
}

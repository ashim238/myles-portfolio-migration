import { notFound } from "next/navigation";
import { getExperienceBySlug } from "@/lib/navi/demo-data";
import { getUpcomingSessions, formatRelativeMonth } from "@/lib/navi/calendar";
import { ExperienceView } from "./ExperienceView";

// Compute booking presets and review dates from the current request time, so
// the demo never surfaces a date in the past. force-dynamic keeps every visit
// fresh rather than serving a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getExperienceBySlug(slug);
  if (!e) notFound();

  const now = new Date();
  const dates = getUpcomingSessions(e.sessions, e.upcomingCount, now);
  const reviewDates = e.reviewsList.map((r) => formatRelativeMonth(r.monthsAgo, now));

  return <ExperienceView experience={e} dates={dates} reviewDates={reviewDates} />;
}

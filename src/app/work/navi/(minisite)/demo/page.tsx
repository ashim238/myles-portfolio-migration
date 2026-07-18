import { FeedView } from "./FeedView";
import { CATEGORIES, EXPERIENCES } from "@/lib/navi/demo-data";
import { toExperienceSummary } from "@/lib/navi/experience-summary";

export default function FeedPage() {
  return (
    <FeedView
      experiences={EXPERIENCES.map(toExperienceSummary)}
      categories={[...CATEGORIES]}
    />
  );
}

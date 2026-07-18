import { SearchView } from "./SearchView";
import { EXPERIENCES } from "@/lib/navi/demo-data";
import { toExperienceSummary } from "@/lib/navi/experience-summary";

export default function SearchPage() {
  return <SearchView experiences={EXPERIENCES.map(toExperienceSummary)} />;
}

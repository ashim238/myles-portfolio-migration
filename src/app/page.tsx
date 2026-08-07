import { Myles97Shell } from "@/components/myles-97/myles-97-shell";
import { getPublishedProjects, playEntries } from "@/lib/content";
import { buildProgramRegistry } from "@/lib/myles-97/programs";

export default async function Home() {
  const projects = await getPublishedProjects();
  const looseParts = playEntries.map(({ slug, title, medium, state }) => ({
    slug,
    title,
    medium,
    state,
  }));

  return (
    <Myles97Shell
      programs={buildProgramRegistry(projects)}
      looseParts={looseParts}
    />
  );
}

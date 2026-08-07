import { Myles97Shell } from "@/components/myles-97/myles-97-shell";
import { getPublishedProjects } from "@/lib/content";
import { buildProgramRegistry } from "@/lib/myles-97/programs";

export default async function Home() {
  const projects = await getPublishedProjects();
  return <Myles97Shell programs={buildProgramRegistry(projects)} />;
}

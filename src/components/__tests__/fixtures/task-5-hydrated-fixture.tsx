import { useEffect } from "react";
import { Myles97Shell } from "@/components/myles-97/myles-97-shell";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectToc } from "@/components/project-toc";
import type { ProgramDefinition } from "@/lib/myles-97/programs";

export const TASK5_CHAPTERS = [
  { id: "frame", stage: "Frame", title: "The routing problem" },
  { id: "research", stage: "Research", title: "What drivers changed" },
  { id: "design", stage: "Design", title: "Safer route decisions" },
  { id: "refine", stage: "Refine", title: "The interaction language" },
  { id: "trust", stage: "Trust", title: "Community reports" },
  { id: "validate", stage: "Validate", title: "What still needs proof" },
] as const;

export type Task5FixtureKind = "pocket" | "reader";

type Task5HydratedFixtureProps = {
  fixture: Task5FixtureKind;
  programs: readonly ProgramDefinition[];
};

export function Task5HydratedFixture({
  fixture,
  programs,
}: Task5HydratedFixtureProps) {
  useEffect(() => {
    document.documentElement.dataset.task5Hydrated = fixture;
    return () => {
      delete document.documentElement.dataset.task5Hydrated;
    };
  }, [fixture]);

  if (fixture === "pocket") {
    return <Myles97Shell programs={programs} looseParts={[]} />;
  }

  return (
    <ReaderShell slug="fresh-greens" title="Fresh Greens" className="fg-page">
      <article>
        <h1>Fresh Greens</h1>
        <ProjectToc sections={TASK5_CHAPTERS} />
        {TASK5_CHAPTERS.map((chapter) => (
          <section className="project-section" key={chapter.id}>
            <h2 id={chapter.id}>{chapter.title}</h2>
            <p>{`${chapter.title} `.repeat(80)}</p>
          </section>
        ))}
      </article>
    </ReaderShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectCover } from "@/components/project-cover";
import { TransitionLink } from "@/components/transition-link";
import { ProjectHighlight } from "@/components/project-highlight";
import { ProjectSectionCard } from "@/components/project-section-card";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { getAllProjects, getProjectBySlug, getPublishedProjects } from "@/lib/content";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Params = { slug: string };

const dedicatedProjectSlugs = new Set<string>([
  "fresh-greens",
  "understandingfafsa",
  "navi",
  "tiktok",
]);

export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getAllProjects();
  return projects
    .filter(
      (project) =>
        project.status !== "hidden" && !dedicatedProjectSlugs.has(project.slug),
    )
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.status === "hidden") return {};

  return {
    title: project.title,
    ...(project.status === "draft" ? { robots: { index: false, follow: false } } : {}),
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      ...(project.coverImage ? { images: [{ url: project.coverImage }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
  ]);

  if (!project || project.status === "hidden") {
    notFound();
  }

  const usedIds = new Set<string>();
  const entries = project.sections.map((section, index) => {
    const base = `section-${slugify(section.title) || index + 1}`;
    let id = base;
    for (let suffix = 2; usedIds.has(id); suffix++) id = `${base}-${suffix}`;
    usedIds.add(id);
    return { id, title: section.title };
  });

  return (
    <ReaderShell slug={slug} title={project.title} className="document-study">
      <nav className="project-topbar" aria-label="Breadcrumb">
        <TransitionLink href="/#work">
          <span aria-hidden="true">←</span>
          Work Stuff
        </TransitionLink>
      </nav>

      <div className="case-frontispiece">
        <section className="hero project-hero" aria-labelledby="project-title">
          <h1 id="project-title" className="project-hero-title">
            {project.title}
          </h1>
          <p className="project-hero-lede">{project.summary}</p>
        </section>

        {project.coverImage ? (
          <ProjectCover
            src={project.coverImage}
            alt={project.coverAlt ?? `${project.title} cover`}
            priority
          />
        ) : null}

        <dl className="project-meta" aria-label="Project details">
          <div className="project-meta-field">
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div className="project-meta-field">
            <dt>Timeframe</dt>
            <dd>{project.timeframe}</dd>
          </div>
          {project.tags.length > 0 ? (
            <div className="project-meta-field project-meta-field--tags">
              <dt>Tags</dt>
              <dd>{project.tags.join(" · ")}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <ProjectHighlight
        quote={project.highlightQuote}
        metricLabel={project.outcomeMetricLabel}
        metricValue={project.outcomeMetricValue}
      />

      {project.sections.length > 0 ? (
        <div className="case-book">
          <aside className="book-index" aria-label="Chapter index">
            <ProjectToc sections={entries} />
          </aside>
          <div className="book-pages">
            {project.sections.map((section, index) => (
              <ProjectSectionCard
                key={entries[index].id}
                section={section}
                projectTitle={project.title}
                id={entries[index].id}
                position={{ index: index + 1, total: entries.length }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {project.bodyHtml.trim() ? (
        <article
          className="project-content"
          dangerouslySetInnerHTML={{ __html: project.bodyHtml }}
        />
      ) : null}

      <ProjectWorkJump currentSlug={project.slug} projects={allProjects} />
    </ReaderShell>
  );
}

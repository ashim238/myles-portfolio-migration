import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCover } from "@/components/project-cover";
import { SiteNav } from "@/components/site-nav";
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

export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
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
  const [project, allProjects] = await Promise.all([getProjectBySlug(slug), getPublishedProjects()]);

  if (!project) {
    notFound();
  }

  return (
    <main className="page-shell project-page" id="main-content" data-project-slug={slug}>
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/#work">
          <span aria-hidden="true">← </span>
          Selected work
        </Link>
      </nav>

      <section className="hero project-hero" aria-labelledby="project-title">
        <h1 id="project-title" className="project-hero-title">
          {project.title}
        </h1>
        <p className="project-hero-lede">{project.summary}</p>
      </section>

      {project.coverImage ? (
        <ProjectCover
          src={project.coverImage}
          alt={`${project.title} cover`}
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

      <ProjectHighlight
        quote={project.highlightQuote}
        metricLabel={project.outcomeMetricLabel}
        metricValue={project.outcomeMetricValue}
      />

      {project.sections.length > 0 ? (
        <>
          <ProjectToc
            sections={project.sections.map((s) => ({
              title: s.title,
              id: `section-${slugify(s.title)}`,
            }))}
          />
          <section className="project-sections">
            {project.sections.map((section) => (
              <ProjectSectionCard
                key={section.title}
                section={section}
                projectTitle={project.title}
                id={`section-${slugify(section.title)}`}
              />
            ))}
          </section>
        </>
      ) : null}

      {project.bodyHtml.trim() ? (
        <article
          className="project-content"
          dangerouslySetInnerHTML={{ __html: project.bodyHtml }}
        />
      ) : null}

      <ProjectWorkJump currentSlug={project.slug} projects={allProjects} />
    </main>
  );
}

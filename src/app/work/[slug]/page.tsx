import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { ProjectHighlight } from "@/components/project-highlight";
import { ProjectSectionCard } from "@/components/project-section-card";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

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
  const [project, allProjects] = await Promise.all([getProjectBySlug(slug), getAllProjects()]);

  if (!project) {
    notFound();
  }

  return (
    <main className="page-shell project-page" id="main-content">
      <SiteNav />
      <div className="project-topbar">
        <Link href="/">← Back</Link>
      </div>

      <section className="hero project-hero" aria-labelledby="project-title">
        <h1 id="project-title" className="project-hero-title">
          {project.title}
        </h1>
        <p className="project-hero-lede">{project.summary}</p>
      </section>

      {project.coverImage ? (
        <div className="project-cover">
          <Image
            className="project-cover-image"
            src={project.coverImage}
            alt={`${project.title} cover`}
            width={1400}
            height={900}
            priority
            sizes="(max-width: 768px) 100vw, 1090px"
          />
        </div>
      ) : null}

      <section className="project-meta">
        <p>
          <strong>Role:</strong> {project.role}
        </p>
        <p>
          <strong>Timeframe:</strong> {project.timeframe}
        </p>
        <p>
          <strong>Status:</strong> {project.status}
        </p>
        {project.tags.length > 0 ? (
          <p>
            <strong>Tags:</strong> {project.tags.join(" • ")}
          </p>
        ) : null}
      </section>

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

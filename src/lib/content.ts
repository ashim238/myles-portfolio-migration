import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type ProjectStatus = "published" | "draft";

export type ProjectSection = {
  title: string;
  bodyHtml: string;
  images: Array<{
    src: string;
    alt?: string;
  }>;
  colors?: string[];
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  timeframe: string;
  status: ProjectStatus;
  order: number;
  tags: string[];
  coverImage?: string;
  highlightQuote?: string;
  outcomeMetricLabel?: string;
  outcomeMetricValue?: string;
  sections: ProjectSection[];
  bodyHtml: string;
};

const projectsDirectory = path.join(process.cwd(), "content", "projects");

type ProjectFrontmatter = Omit<Project, "bodyHtml">;

function parseProjectSections(data: Record<string, unknown>): ProjectSection[] {
  if (!Array.isArray(data.sections)) {
    return [];
  }

  const sections: ProjectSection[] = [];

  for (const section of data.sections) {
    if (!section || typeof section !== "object") {
      continue;
    }

    const record = section as Record<string, unknown>;
    const title = String(record.title ?? "").trim();
    const body = String(record.body ?? "").trim();

    if (!title || !body) {
      continue;
    }

    const images: Array<{ src: string; alt?: string }> = [];
    const sectionImages = record.images;
    if (Array.isArray(sectionImages)) {
      for (const image of sectionImages) {
        if (typeof image === "string" && image.trim()) {
          images.push({ src: image.trim() });
          continue;
        }
        if (image && typeof image === "object") {
          const imageRecord = image as Record<string, unknown>;
          const src = String(imageRecord.src ?? "").trim();
          if (src) {
            images.push({
              src,
              alt: imageRecord.alt ? String(imageRecord.alt) : undefined,
            });
          }
        }
      }
    }

    if (record.image && typeof record.image === "string") {
      const src = record.image.trim();
      if (src) {
        images.push({
          src,
          alt: record.imageAlt ? String(record.imageAlt) : undefined,
        });
      }
    }

    const colors: string[] = [];
    if (Array.isArray(record.colors)) {
      for (const c of record.colors) {
        const hex = String(c).trim();
        if (hex) colors.push(hex);
      }
    }

    sections.push({
      title,
      bodyHtml: marked.parse(body) as string,
      images,
      ...(colors.length > 0 ? { colors } : {}),
    });
  }

  return sections;
}

function parseProjectFrontmatter(data: Record<string, unknown>): ProjectFrontmatter {
  const status: ProjectStatus = data.status === "draft" ? "draft" : "published";

  const project = {
    slug: String(data.slug ?? ""),
    title: String(data.title ?? ""),
    summary: String(data.summary ?? ""),
    role: String(data.role ?? ""),
    timeframe: String(data.timeframe ?? ""),
    status,
    order: Number(data.order ?? 999),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    highlightQuote: data.highlightQuote ? String(data.highlightQuote) : undefined,
    outcomeMetricLabel: data.outcomeMetricLabel
      ? String(data.outcomeMetricLabel)
      : undefined,
    outcomeMetricValue: data.outcomeMetricValue
      ? String(data.outcomeMetricValue)
      : undefined,
    sections: parseProjectSections(data),
  };

  if (!project.slug || !project.title || !project.summary) {
    throw new Error("Project frontmatter requires slug, title, and summary.");
  }

  return project;
}

export async function getAllProjects(): Promise<Project[]> {
  const files = await fs.readdir(projectsDirectory);
  const markdownFiles = files.filter(
    (file) => file.endsWith(".md") && !file.startsWith("_"),
  );

  const projects = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const fullPath = path.join(projectsDirectory, fileName);
      const source = await fs.readFile(fullPath, "utf-8");
      const { data, content } = matter(source);
      const frontmatter = parseProjectFrontmatter(data);

      return {
        ...frontmatter,
        bodyHtml: await marked.parse(content),
      };
    }),
  );

  return projects.sort((a, b) => a.order - b.order);
}

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.status === "published");
}

export async function getDraftProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.status === "draft");
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export type PlayEntry = {
  slug: string;
  title: string;
  hook: string;
  /** Optional longer paragraph. Some entries only need the hook. */
  exploration?: string;
  tags: string[];
  year: string;
  context: string;
  /** Interactive embed (iframe). For digital / browser-runnable pieces. */
  embedPath?: string;
  /** Image-based media. For physical / 3D / printed work. */
  images?: Array<{ src: string; alt: string }>;
};

export const playEntries: PlayEntry[] = [
  {
    slug: "sukunas-finger",
    title: "Sukuna's finger",
    hook:
      "A Jujutsu Kaisen fan sculpt, 3D sculpted, printed, and hand-painted. Made for the love of the manga and as an excuse to test how far I could push painting techniques on polylactic acid filament.",
    tags: ["3D Sculpt", "3D Print", "Hand Painted", "Fan Craft", "JJK"],
    year: "2026",
    context: "Personal",
    images: [
      {
        src: "/play/sukunas-finger/01.jpg",
        alt: "Sukuna's finger sculpt resting in a 3D-printed tray with cotton bedding — burgundy skin with green undertones, painted wounds and lesions, layer lines visible on the tray exterior.",
      },
    ],
  },
  {
    slug: "loom",
    title: "Loom",
    hook: "A generative weaving ritual shaped by a personal prompt.",
    exploration:
      "I explored how simple inputs can become evolving visual patterns, turning reflection into a textile-like composition.",
    tags: ["p5.js", "Generative Art", "Interaction"],
    year: "2025",
    context: "Parsons - Narrative & Dynamic Systems",
    embedPath: "/play/loom/index.html",
  }
];

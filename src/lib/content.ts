import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import sharp from "sharp";

export type ProjectStatus = "published" | "draft" | "hidden";

export type ProjectImage = {
  src: string;
  alt?: string;
  width: number;
  height: number;
};

export type ProjectSection = {
  title: string;
  bodyHtml: string;
  images: ProjectImage[];
  colors?: string[];
};

const publicDir = path.join(process.cwd(), "public");
const imageDimensionsCache = new Map<string, { width: number; height: number }>();
const FALLBACK_DIMENSIONS = { width: 1400, height: 900 };

async function readImageDimensions(
  src: string,
): Promise<{ width: number; height: number }> {
  if (!src.startsWith("/")) return FALLBACK_DIMENSIONS;
  const cached = imageDimensionsCache.get(src);
  if (cached) return cached;

  const filePath = path.join(publicDir, src);
  try {
    const meta = await sharp(filePath).metadata();
    const width = meta.width ?? FALLBACK_DIMENSIONS.width;
    const height = meta.height ?? FALLBACK_DIMENSIONS.height;
    const dims = { width, height };
    imageDimensionsCache.set(src, dims);
    return dims;
  } catch (err) {
    console.warn(
      `[content] Could not read image dimensions for ${src}; using fallback. ` +
        `(${err instanceof Error ? err.message : "unknown error"})`,
    );
    imageDimensionsCache.set(src, FALLBACK_DIMENSIONS);
    return FALLBACK_DIMENSIONS;
  }
}

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

async function parseProjectSections(
  data: Record<string, unknown>,
): Promise<ProjectSection[]> {
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

    const rawImages: Array<{ src: string; alt?: string }> = [];
    const sectionImages = record.images;
    if (Array.isArray(sectionImages)) {
      for (const image of sectionImages) {
        if (typeof image === "string" && image.trim()) {
          rawImages.push({ src: image.trim() });
          continue;
        }
        if (image && typeof image === "object") {
          const imageRecord = image as Record<string, unknown>;
          const src = String(imageRecord.src ?? "").trim();
          if (src) {
            rawImages.push({
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
        rawImages.push({
          src,
          alt: record.imageAlt ? String(record.imageAlt) : undefined,
        });
      }
    }

    const images: ProjectImage[] = await Promise.all(
      rawImages.map(async (img) => {
        const { width, height } = await readImageDimensions(img.src);
        return { ...img, width, height };
      }),
    );

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

async function parseProjectFrontmatter(
  data: Record<string, unknown>,
): Promise<ProjectFrontmatter> {
  const rawStatus = String(data.status ?? "").toLowerCase();
  const status: ProjectStatus =
    rawStatus === "hidden" ? "hidden" : rawStatus === "draft" ? "draft" : "published";

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
    sections: await parseProjectSections(data),
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
      const frontmatter = await parseProjectFrontmatter(data);

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
  images?: Array<{ src: string; alt: string; label?: string }>;
  /** Specimen dossier metadata — renders a museum-card treatment. */
  specimen?: {
    designation: string;
    classification: string;
    material: string;
    status: string;
  };
};

export const playEntries: PlayEntry[] = [
  {
    slug: "sukunas-finger",
    title: "Sukuna's finger",
    hook:
      "A Jujutsu Kaisen fan sculpt, 3D sculpted, printed, and hand-painted. Made for the love of the manga and as an excuse to test how far I could push painting techniques on polylactic acid filament.",
    tags: ["3D Sculpt", "3D Print", "Hand Painted", "Fan Craft", "Jujutsu Kaisen"],
    year: "2024",
    context: "Parsons - xFab",
    images: [
      {
        src: "/play/sukunas-finger/01.jpg",
        alt: "Sukuna's finger sculpt resting in a 3D-printed tray with cotton bedding: burgundy skin with green undertones, painted wounds and lesions, layer lines visible on the tray exterior.",
        label: "Full specimen",
      },
      {
        src: "/play/sukunas-finger/02.jpg",
        alt: "Texture detail of the Sukuna's finger sculpt: the painted skin surface, wound finishes, and color variation across the burgundy tones.",
        label: "Surface detail",
      },
    ],
    specimen: {
      designation: "Sukuna's Finger — Ryomen Sukuna",
      classification: "Special Grade Cursed Object",
      material: "PLA filament, acrylic paint, matte varnish",
      status: "SEALED",
    },
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

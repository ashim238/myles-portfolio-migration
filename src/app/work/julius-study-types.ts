import type { ProjectChapterEntry } from "@/lib/project-chapters";

export type ExhibitItem = {
  label: string;
  src: string;
  mobileSrc?: string;
  alt: string;
  caption: string;
};

export type Exhibit =
  | {
      kind: "image";
      title: string;
      src: string;
      mobileSrc?: string;
      alt: string;
      caption: string;
      link?: { label: string; href: string };
    }
  | {
      kind: "compare";
      title: string;
      items: ExhibitItem[];
      phoneItems?: ExhibitItem[];
    }
  | {
      kind: "video";
      title: string;
      src: string;
      poster: string;
      phoneRecording?: { src: string; poster: string };
      caption: string;
      stills?: ExhibitItem[];
    };

export type JuliusChapter = ProjectChapterEntry & {
  paragraphs: string[];
  examples?: { text: string; trial: "fields" | "disabled-buttons" }[];
  exhibits?: Exhibit[];
  after?: string[];
};

export type JuliusStudy = {
  slug: string;
  title: string;
  summary: string;
  background?: string;
  role: string;
  team: string;
  timeframe: string;
  goal: string;
  outcome: string;
  proof: { label: string; href: string };
  cover: Exhibit;
  chapters: JuliusChapter[];
};

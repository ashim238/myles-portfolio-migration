import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";
import { WorkProjectCard } from "@/components/work-project-card";

vi.mock("next/image", () => ({
  default: ({
    priority,
    alt = "",
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    void priority;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

const project: Project = {
  slug: "tiktok",
  title: "TikTok",
  summary: "TikTok summary",
  role: "Creative Strategy",
  timeframe: "2021",
  status: "published",
  order: 4,
  tags: [],
  coverImage: "/projects/tiktok/cover.jpg",
  sections: [],
  bodyHtml: "",
};

describe("WorkProjectCard layout variants", () => {
  it("marks a closing card and describes its narrower desktop image slot", () => {
    const { container } = render(
      <WorkProjectCard project={project} index={3} closing />,
    );

    expect(container.firstElementChild).toHaveClass("work-gallery-closing");
    expect(screen.getByRole("img", { name: "TikTok preview" })).toHaveAttribute(
      "sizes",
      "(max-width: 760px) 100vw, min(72vw, 672px)",
    );
  });
});

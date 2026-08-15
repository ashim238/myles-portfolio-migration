import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";
import { WorkProjectCard } from "@/components/work-project-card";
import {
  PROJECT_ENTER_REQUEST,
  type ProjectEnterRequestDetail,
} from "@/lib/project-enter";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

function declarationBlock(selector: string): string {
  const start = baseStyles.indexOf(`${selector} {`);
  if (start < 0) return "";
  const open = baseStyles.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < baseStyles.length; index += 1) {
    if (baseStyles[index] === "{") depth += 1;
    if (baseStyles[index] === "}") depth -= 1;
    if (depth === 0) return baseStyles.slice(start, index + 1);
  }
  return "";
}

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
  coverImage: "/projects/tiktok/cover-phone-mockup.jpg",
  sections: [],
  bodyHtml: "",
};

describe("WorkProjectCard layout variants", () => {
  it.each([
    ["fresh-greens", "Fresh Greens", "Working prototype"],
    ["navi", "Navi", "Live demo available"],
    [
      "understandingfafsa",
      "UnderstandingFAFSA",
      "Interactive case-study explanation",
    ],
    ["tiktok", "TikTok", "Static launch templates"],
  ])(
    "shows the %s evidence label without adding a second link",
    (slug, title, evidenceLabel) => {
      const { container } = render(
        <WorkProjectCard project={{ ...project, slug, title }} index={0} />,
      );

      const evidence = screen.getByText(evidenceLabel);
      expect(evidence).toHaveClass("work-card-evidence");
      expect(evidence.tagName).not.toBe("A");
      expect(container.querySelectorAll("a")).toHaveLength(1);
      expect(screen.getByRole("link")).toHaveAttribute("href", `/work/${slug}`);

      const caption = evidence.closest(".work-cap");
      const titleElement = screen.getByRole("heading", { name: title });
      const outcome = container.querySelector(".work-out");
      expect(caption).not.toBeNull();
      expect(outcome).not.toBeNull();
      const captionChildren = Array.from(caption?.children ?? []);
      expect(captionChildren.indexOf(titleElement)).toBeLessThan(
        captionChildren.indexOf(evidence),
      );
      expect(captionChildren.indexOf(outcome as Element)).toBeLessThan(
        captionChildren.indexOf(evidence),
      );
    },
  );

  it("uses the shared equal-grid image slot for every image-backed card", () => {
    const imageProject = { ...project, slug: "navi", title: "Navi" };
    const { container } = render(<WorkProjectCard project={imageProject} index={3} />);

    expect(container.firstElementChild).toHaveClass("work-gallery-cell");
    expect(screen.getByRole("img", { name: "Navi preview" })).toHaveAttribute(
      "sizes",
      "(max-width: 767px) 100vw, min(46vw, 524px)",
    );
  });

  it("uses the approved phone mockup as the TikTok project cover", () => {
    render(<WorkProjectCard project={project} index={3} />);

    expect(screen.getByRole("img", { name: "TikTok preview" })).toHaveAttribute(
      "src",
      "/projects/tiktok/cover-phone-mockup.jpg",
    );
  });

  it.each([
    [
      { ...project, slug: "navi", title: "Navi" },
      { type: "image", src: "/projects/tiktok/cover-phone-mockup.jpg" },
    ],
    [project, { type: "image", src: "/projects/tiktok/cover-phone-mockup.jpg" }],
  ] as const)(
    "requests the matching shared visual when opening %s",
    (projectUnderTest, expectedVisual) => {
      const requests: ProjectEnterRequestDetail[] = [];
      const onRequest = (event: Event) => {
        event.preventDefault();
        requests.push((event as CustomEvent<ProjectEnterRequestDetail>).detail);
      };
      window.addEventListener(PROJECT_ENTER_REQUEST, onRequest);

      try {
        render(<WorkProjectCard project={projectUnderTest} index={0} />);
        fireEvent.click(screen.getByRole("link"));

        expect(requests).toHaveLength(1);
        expect(requests[0]).toMatchObject({
          slug: projectUnderTest.slug,
          href: `/work/${projectUnderTest.slug}`,
          visual: expectedVisual,
        });
      } finally {
        window.removeEventListener(PROJECT_ENTER_REQUEST, onRequest);
      }
    },
  );

  it("keeps project-cover images contained by the shared media frame", () => {
    const image = declarationBlock(".work-thumb > img");

    expect(image).toContain("width: 100%");
    expect(image).toContain("height: 100%");
  });
});

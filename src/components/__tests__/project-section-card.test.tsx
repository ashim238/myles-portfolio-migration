import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectSectionCard } from "@/components/project-section-card";

vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: ({ alt }: { alt: string }) => (
    <span role="img" aria-label={alt} />
  ),
}));

describe("ProjectSectionCard", () => {
  it("names and focuses a scrollable tall-image preview", () => {
    render(
      <ProjectSectionCard
        projectTitle="UnderstandingFAFSA"
        section={{
          title: "Email preview",
          bodyHtml: "<p>Preview copy.</p>",
          images: [
            {
              src: "/newsletter.png",
              alt: "A full newsletter preview",
              width: 600,
              height: 3000,
            },
          ],
        }}
      />,
    );

    const scroller = screen.getByRole("region", {
      name: "Scrollable preview: A full newsletter preview. Click image to expand.",
    });
    expect(scroller).toHaveAttribute("tabindex", "0");
    expect(scroller).toContainElement(
      screen.getByRole("img", { name: "A full newsletter preview" }),
    );
  });
});

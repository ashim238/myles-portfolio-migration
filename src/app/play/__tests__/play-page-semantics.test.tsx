import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PlayPage from "@/app/play/page";

vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("@/components/site-nav", () => ({
  SiteNav: () => null,
}));

vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: () => null,
}));

vi.mock("@/components/specimen-card", () => ({
  SpecimenCard: () => null,
}));

vi.mock("@/lib/content", () => ({
  playEntries: [
    {
      slug: "test-entry",
      title: "Test entry",
      hook: "A compact experiment.",
      tags: ["Prototype"],
      year: "2026",
      context: "Studio",
    },
  ],
}));

describe("PlayPage semantics", () => {
  it("uses a neutral metadata container for each experiment", () => {
    const { container } = render(<PlayPage />);

    expect(container.querySelector("footer.play-entry-footer")).toBeNull();
    expect(container.querySelector("div.play-entry-footer")).toHaveTextContent(
      "Studio · 2026",
    );
  });
});

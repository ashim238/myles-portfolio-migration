import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PlayPage from "@/app/play/page";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
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
  SpecimenCard: ({ designation, priority }: { designation: string; priority?: boolean }) => (
    <div data-testid="specimen-card" data-designation={designation} data-priority={String(Boolean(priority))} />
  ),
}));

vi.mock("@/lib/content", () => ({
  playEntries: [
    {
      slug: "first-specimen",
      title: "First specimen",
      hook: "First",
      question: "What can the first specimen show?",
      medium: "PLA",
      state: "complete",
      whatChanged: "The first specimen established the finish.",
      next: "Compare another material.",
      updated: "July 2026",
      tags: [],
      year: "2024",
      context: "Studio",
      images: [{ src: "/first.jpg", alt: "First specimen" }],
      specimen: {
        designation: "First specimen",
        classification: "Study",
        material: "PLA",
        status: "SEALED",
      },
    },
    {
      slug: "later-specimen",
      title: "Later specimen",
      hook: "Later",
      question: "What changes in the later specimen?",
      medium: "PLA",
      state: "testing",
      whatChanged: "The later specimen changed the surface.",
      next: "Test a second finish.",
      updated: "July 2026",
      tags: [],
      year: "2024",
      context: "Studio",
      images: [{ src: "/later.jpg", alt: "Later specimen" }],
      specimen: {
        designation: "Later specimen",
        classification: "Study",
        material: "PLA",
        status: "SEALED",
      },
    },
  ],
}));

describe("PlayPage specimen media priority", () => {
  it("prioritizes only the first entry's specimen card", () => {
    render(<PlayPage />);

    const [firstSpecimen, laterSpecimen] = screen.getAllByTestId("specimen-card");

    expect(firstSpecimen).toHaveAttribute("data-priority", "true");
    expect(laterSpecimen).toHaveAttribute("data-priority", "false");
  });
});

import { render, screen, within } from "@testing-library/react";
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
      question: "What survives the change in medium?",
      medium: "PLA, acrylic paint",
      state: "testing",
      whatChanged: "The surface moved from a digital model to a painted object.",
      next: "Compare a second finish.",
      updated: "July 2026",
      process: [
        "Digital sculpt",
        "fabrication constraints",
        "printed object",
        "painted surface",
      ],
      tags: ["Prototype"],
      year: "2026",
      context: "Studio",
    },
    {
      slug: "test-without-next",
      title: "Test without next",
      hook: "A paused material test.",
      question: "What remains useful after the first pass?",
      medium: "Paper and ink",
      state: "archived",
      whatChanged: "The first pass established the useful proportions.",
      updated: "July 2026",
      tags: ["Study"],
      year: "2026",
      context: "Studio",
    },
  ],
}));

describe("PlayPage semantics", () => {
  it("presents each experiment as a semantic set of quiet working notes", () => {
    const { container } = render(<PlayPage />);

    expect(
      screen.getByText(
        "I use this page as a running lab for interaction studies, material tests, and small builds. I'll keep adding work as I test it.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("In the lab")).toBeInTheDocument();

    const entry = screen.getByRole("heading", { name: "Test entry" }).closest("li");
    const notes = entry?.querySelector("dl");
    expect(notes).not.toBeNull();
    expect(
      Array.from(notes!.querySelectorAll("dt"), (node) => node.textContent),
    ).toEqual([
      "Question",
      "Medium",
      "State",
      "What changed",
      "Next if real",
      "Updated",
    ]);
    expect(notes).toHaveTextContent("Testing");
    expect(notes).toHaveTextContent("Compare a second finish.");

    const process = within(entry as HTMLElement).getByRole("list", {
      name: "Test entry process",
    });
    expect(
      within(process)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual([
      "Digital sculpt",
      "fabrication constraints",
      "printed object",
      "painted surface",
    ]);

    const entryWithoutNext = screen
      .getByRole("heading", { name: "Test without next" })
      .closest("li");
    const notesWithoutNext = entryWithoutNext?.querySelector("dl");
    expect(notesWithoutNext).not.toBeNull();
    expect(
      Array.from(
        notesWithoutNext!.querySelectorAll("dt"),
        (node) => node.textContent,
      ),
    ).toEqual(["Question", "Medium", "State", "What changed", "Updated"]);
    expect(container.querySelector("footer.play-entry-footer")).toBeNull();
  });
});

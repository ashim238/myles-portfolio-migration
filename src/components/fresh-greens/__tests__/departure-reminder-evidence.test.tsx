import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { DepartureReminderEvidence } from "@/components/fresh-greens/departure-reminder-evidence";
import { getChapterEvidence } from "@/lib/reader-evidence";

vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: ({
    alt,
    src,
    className,
  }: {
    alt: string;
    src: string;
    className?: string;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} className={className} />;
  },
}));

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

describe("Fresh Greens departure reminder evidence", () => {
  it("connects the interview insight to the implemented reminder decision", () => {
    render(<DepartureReminderEvidence />);

    expect(
      screen.getByRole("heading", {
        name: "A daylight departure reminder.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/daylight came up in all six interviews/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/built the reminder around that pattern/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Time to head out")).toBeInTheDocument();
    expect(
      screen.getByText("Leaving now gives you more daylight."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Notification access comes after Schedule."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/asking up front felt deceptive/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/portfolio reconstruction of the implemented schedule/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/hasn't shown that people leave then/i),
    ).toBeInTheDocument();
  });

  it("shows the schedule, permission, and delivered-notification states without repeating the route preview", () => {
    const { container } = render(<DepartureReminderEvidence />);

    expect(screen.getByText("Schedule")).toBeInTheDocument();
    expect(screen.getByText("Allow notifications?")).toBeInTheDocument();
    expect(screen.getByText("Time to head out")).toBeInTheDocument();
    expect(container.querySelector('img[src*="route-preview"]')).toBeNull();
  });

  it("matches the supporting proof declared in the Reader evidence map", () => {
    const { container } = render(<DepartureReminderEvidence />);
    const surface = container.querySelector(".fg-reminder-evidence");
    const proof = getChapterEvidence("fresh-greens", "fg-design")
      .supportingProofs
      ?.find(({ id }) => id === "fg-departure-reminder");

    expect(proof).toMatchObject({
      id: "fg-departure-reminder",
      label: "Implemented daylight departure reminder",
      kind: "interaction",
    });
    expect(surface).toHaveAttribute("data-evidence-proof", proof?.id);
    expect(surface).toHaveAttribute("data-evidence-role", "supporting");
    expect(surface).toHaveAttribute("data-evidence-kind", proof?.kind);
    expect(surface).toHaveAttribute("data-evidence-chapter", "fg-design");
  });

  it("stacks the reminder states on phones", () => {
    expect(styles).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?\.fg-page \.fg-reminder-layout[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/,
    );
    expect(styles).toMatch(/\.fg-reminder-state-strip\s*\{/);
  });
});

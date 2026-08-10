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
        name: "Bring the daylight plan back at the right time.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/every participant connected timing and safety with daylight/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/participants described leaving in the morning and avoiding night driving/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Time to head out")).toBeInTheDocument();
    expect(
      screen.getByText("Leaving now gives you more daylight."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("I waited to ask for notification access."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/asking for every permission up front felt deceptive/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/it doesn't show that people leave at that time/i),
    ).toBeInTheDocument();
  });

  it("uses the existing route-preview capture as inspectable media", () => {
    render(<DepartureReminderEvidence />);

    expect(
      screen.getByRole("img", {
        name: /route preview showing route conditions, daylight timing/i,
      }),
    ).toHaveAttribute("src", "/projects/fresh-greens/v2/route-preview.png");
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

  it("stacks the evidence on phones without shrinking the route capture", () => {
    expect(styles).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?\.fg-page \.fg-reminder-layout[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?--phone-w:\s*min\(68vw, 250px\);/,
    );
  });
});

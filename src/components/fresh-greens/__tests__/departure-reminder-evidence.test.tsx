import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { DepartureReminderEvidence } from "@/components/fresh-greens/departure-reminder-evidence";
import {
  FRESH_GREENS_REMINDER_EVIDENCE_SURFACE,
  PROJECT_EVIDENCE_MAP,
} from "@/lib/project-evidence";

vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: ({
    alt,
    src,
    className,
  }: {
    alt: string;
    src: string;
    className?: string;
  }) => <img alt={alt} src={src} className={className} />,
}));

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/fresh-greens-case-refinement.css"),
  "utf8",
);

describe("Fresh Greens departure reminder evidence", () => {
  it("shows the implemented route-to-reminder sequence without claiming an outcome", () => {
    render(<DepartureReminderEvidence />);

    expect(
      screen.getByRole("heading", {
        name: "The route should still be useful after the app closes.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "How the departure reminder works" }),
    ).toHaveTextContent(
      "Find a useful windowChoose ScheduleLeave the app",
    );
    expect(screen.getByText("Time to head out")).toBeInTheDocument();
    expect(
      screen.getByText("Leaving now gives you more daylight on your route."),
    ).toBeInTheDocument();
    expect(screen.getByText(/does not prove that a reminder changes behavior/i)).toBeInTheDocument();
  });

  it("uses the existing route-preview capture as inspectable media", () => {
    render(<DepartureReminderEvidence />);

    expect(
      screen.getByRole("img", {
        name: /route preview showing route conditions, daylight timing/i,
      }),
    ).toHaveAttribute(
      "src",
      "/projects/fresh-greens/v2/route-preview.png",
    );
  });

  it("matches the supporting proof declared in the typed evidence map", () => {
    const { container } = render(<DepartureReminderEvidence />);
    const surface = container.querySelector(".fg-reminder-evidence");
    const proof = PROJECT_EVIDENCE_MAP["fresh-greens"]
      .flatMap(({ proofs }) => proofs)
      .find(
        ({ id }) => id === FRESH_GREENS_REMINDER_EVIDENCE_SURFACE.proofId,
      );

    expect(proof).toMatchObject({
      id: FRESH_GREENS_REMINDER_EVIDENCE_SURFACE.proofId,
      role: FRESH_GREENS_REMINDER_EVIDENCE_SURFACE.role,
      kind: FRESH_GREENS_REMINDER_EVIDENCE_SURFACE.kind,
      surfaceChapterId: FRESH_GREENS_REMINDER_EVIDENCE_SURFACE.chapterId,
    });
    expect(surface).toHaveAttribute(
      "data-evidence-proof",
      FRESH_GREENS_REMINDER_EVIDENCE_SURFACE.proofId,
    );
    expect(surface).toHaveAttribute("data-evidence-role", "supporting");
    expect(surface).toHaveAttribute("data-evidence-chapter", "fg-design");
  });

  it("stacks the evidence on phones without shrinking the route capture", () => {
    expect(styles).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?\.fg-page \.fg-reminder-layout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?--phone-w:\s*min\(68vw, 250px\);/,
    );
  });
});

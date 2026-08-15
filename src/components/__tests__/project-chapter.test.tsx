import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectChapter } from "@/components/project-chapter";

const entry = {
  id: "nv-framework",
  stage: "Define",
  title: "Mapping the experience",
};

describe("ProjectChapter", () => {
  it("renders a named semantic region with the chapter hierarchy", () => {
    const { container } = render(
      <ProjectChapter entry={entry} index={3} total={5} variant="navi">
        <p>Journey map evidence</p>
      </ProjectChapter>,
    );

    expect(
      screen.getByRole("region", { name: "Mapping the experience" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: entry.title }),
    ).toHaveAttribute("id", entry.id);
    expect(screen.getByText("Define")).toBeInTheDocument();
    expect(screen.getByText("3 of 5")).toBeInTheDocument();
    expect(screen.getByText("Journey map evidence")).toBeVisible();
    expect(container.querySelector(".project-chapter-motif")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector(".project-chapter")).toHaveAttribute(
      "data-chapter-variant",
      "navi",
    );
  });

  it("exposes the mapped claim, evidence state, and dominant proof", () => {
    const { container } = render(
      <ProjectChapter entry={entry} index={3} total={5} variant="navi">
        <p>Journey map evidence</p>
      </ProjectChapter>,
    );

    const chapter = container.querySelector(".project-chapter");
    expect(chapter).toHaveAttribute("data-claim-class", "interpretive");
    expect(chapter).toHaveAttribute("data-evidence-state", "proposed");
    expect(chapter).toHaveAttribute(
      "data-dominant-proof",
      "navi-research-artifacts",
    );
    expect(screen.getByText("Proposed")).toBeVisible();
    expect(screen.getByText("Proposed").parentElement).toHaveTextContent(
      "Evidence state: Proposed",
    );
  });

  it("keeps interpretation and its boundary after a featured Navi proof", () => {
    const { container } = render(
      <ProjectChapter entry={entry} index={3} total={5} variant="navi">
        <div data-testid="research-board">Journey map evidence</div>
      </ProjectChapter>,
    );

    const summary = container.querySelector(".reader-evidence-summary");
    expect(summary).toHaveAttribute(
      "id",
      "reader-evidence-navi-research-artifacts-summary",
    );
    expect(summary).toHaveAttribute(
      "data-evidence-for",
      "navi-research-artifacts",
    );
    expect(screen.getByTestId("research-board").nextElementSibling).toBe(summary);
    expect(container.querySelector(".project-chapter")).toHaveAttribute(
      "aria-describedby",
      "reader-evidence-navi-research-artifacts-summary",
    );
    expect(screen.getByText("What this shows")).toBeVisible();
    expect(
      screen.getByText(
        "I used the personas and journey maps to adjust my teammate's original information architecture, then built the Figma design system.",
      ),
    ).toBeVisible();
    expect(screen.getByText("Boundary")).toBeVisible();
    expect(
      screen.getByText(
        "The studio project ended before engineering handoff, and the intended tag-ranking logic was not wired into the later React build.",
      ),
    ).toBeVisible();
  });

  it("places the FAFSA composer summary before supporting rule artifacts", () => {
    const { container } = render(
      <ProjectChapter
        entry={{
          id: "uf-locked",
          stage: "Design",
          title: "Rules for fixed and swappable parts",
        }}
        index={3}
        total={5}
        variant="understandingfafsa"
      >
        <div data-testid="composer-proof">Template switcher and composer</div>
        <div data-testid="supporting-rules">Locked rules and palette</div>
      </ProjectChapter>,
    );

    const summary = container.querySelector(".reader-evidence-summary");
    const composerProof = screen.getByTestId("composer-proof");
    const supportingRules = screen.getByTestId("supporting-rules");

    expect(summary).toHaveAttribute(
      "data-evidence-for",
      "fafsa-composer-demo",
    );
    expect(composerProof.nextElementSibling).toBe(summary);
    expect(summary?.nextElementSibling).toBe(supportingRules);
    expect(
      screen.getByText(
        "Headlines, body copy, imagery, links, and middle-module order can change. Header and footer placement, spacing, type, and dividers stay fixed.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "The interactive switcher shows the weekly and event templates, not the welcome email.",
      ),
    ).toBeVisible();
  });

  it("keeps the Navi booking summary after the demo-bearing child", () => {
    const { container } = render(
      <ProjectChapter
        entry={{
          id: "nv-build",
          stage: "Build",
          title: "I rebuilt the booking flow in React",
        }}
        index={4}
        total={5}
        variant="navi"
      >
        <div data-testid="component-system">Component system</div>
        <div data-testid="booking-demo">Working booking demo</div>
      </ProjectChapter>,
    );

    const summary = container.querySelector(".reader-evidence-summary");
    expect(screen.getByTestId("component-system").nextElementSibling).toBe(
      screen.getByTestId("booking-demo"),
    );
    expect(screen.getByTestId("booking-demo").nextElementSibling).toBe(summary);
    expect(summary).toHaveAttribute("data-evidence-for", "navi-booking-demo");
    expect(summary).toHaveTextContent("Boundary");
    expect(summary).toHaveTextContent(
      "The semester ended before the team could test Learn, Plan, Go or booking.",
    );
  });

  it("does not show Build and Built as adjacent duplicate labels", () => {
    const { container } = render(
      <ProjectChapter
        entry={{
          id: "nv-build",
          stage: "Build",
          title: "I rebuilt the booking flow in React",
        }}
        index={4}
        total={5}
        variant="navi"
      >
        <p>Working booking demo</p>
      </ProjectChapter>,
    );

    expect(screen.getByText("Build")).toBeVisible();
    expect(
      container.querySelector(".project-chapter-evidence-state"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Evidence state: Built")).toHaveClass("sr-only");
    expect(container.querySelector(".project-chapter")).toHaveAttribute(
      "data-evidence-state",
      "built",
    );
  });

  it("applies the same summary grammar to a featured FAFSA comparison", () => {
    const { container } = render(
      <ProjectChapter
        entry={{
          id: "uf-figma",
          stage: "Build",
          title: "Rebuilding the system in Mailchimp",
        }}
        index={4}
        total={5}
        variant="understandingfafsa"
      >
        <p>Implementation comparison</p>
      </ProjectChapter>,
    );

    expect(container.querySelector(".reader-evidence-summary")).toHaveAttribute(
      "data-evidence-for",
      "fafsa-figma-mailchimp",
    );
    expect(
      screen.getByText(
        "I rebuilt the live template with a flatter hierarchy, fewer wrappers, and Mailchimp-native blocks.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Image compression reduced download weight, not the HTML source Gmail measures.",
      ),
    ).toBeVisible();
  });

  it("extends proof-adjacent summaries to Fresh Greens and TikTok", () => {
    const cases = [
      {
        variant: "fresh-greens",
        id: "fg-design",
        proof: "fresh-greens-pivot-journey",
        interpretation:
          "Route cards show some of the reasons behind a recommendation. Fresh Greens waits until someone taps Schedule before asking for notification access.",
        caveat:
          "The prototype does not prove that a preferred route is safer. Its current Safest route label overstates the evidence, and the reminder has not been shown to change behavior.",
      },
      {
        variant: "fresh-greens",
        id: "fg-trust",
        proof: "fresh-greens-report-moderation",
        interpretation:
          "Reports stay on the device first. With Supabase configured, they can enter the moderation path.",
        caveat:
          "One report can affect route ranking now. Corroboration from distinct contributors, visible provenance, and route-level trust tiers are not built yet.",
      },
      {
        variant: "tiktok",
        id: "tt-system",
        proof: "tiktok-template-system",
        interpretation:
          "The slot map stayed constant. Only a few parts could cross between Light Academia and e-Boy/e-Girl.",
        caveat:
          "Limited cross-direction modularity was a proposal made while building the files.",
      },
      {
        variant: "tiktok",
        id: "tt-outcome",
        proof: "tiktok-light-academia-sequence",
        interpretation:
          "The final direction records what changed during internal review. It does not show audience response.",
        caveat:
          "American Eagle selection was learned later through Global Creative Lab. No performance result is claimed.",
      },
    ] as const;

    for (const testCase of cases) {
      const { container, unmount } = render(
        <ProjectChapter
          entry={{ id: testCase.id, stage: "Proof", title: testCase.proof }}
          index={1}
          total={1}
          variant={testCase.variant}
        >
          <div data-testid="featured-proof">Featured proof</div>
        </ProjectChapter>,
      );

      const summary = container.querySelector(".reader-evidence-summary");
      expect(summary).toHaveAttribute("data-evidence-for", testCase.proof);
      expect(screen.getByTestId("featured-proof").nextElementSibling).toBe(
        summary,
      );
      expect(screen.getByText(testCase.interpretation)).toBeVisible();
      expect(screen.getByText(testCase.caveat)).toBeVisible();
      unmount();
    }
  });

  it("does not add a visible summary to a mapped chapter outside the pilot", () => {
    const { container } = render(
      <ProjectChapter
        entry={{
          id: "nv-intro",
          stage: "Frame",
          title: "The first idea moved visitors, not behavior",
        }}
        index={1}
        total={5}
        variant="navi"
      >
        <p>Early concept evidence</p>
      </ProjectChapter>,
    );

    expect(
      container.querySelector(".reader-evidence-summary"),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".project-chapter")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("keeps ad hoc chapter fixtures renderable without false metadata", () => {
    const { container } = render(
      <ProjectChapter
        entry={{ id: "test-only", stage: "Test", title: "Fixture chapter" }}
        index={1}
        total={1}
        variant="navi"
      >
        <p>Fixture evidence</p>
      </ProjectChapter>,
    );

    const chapter = container.querySelector(".project-chapter");
    expect(chapter).not.toHaveAttribute("data-claim-class");
    expect(chapter).not.toHaveAttribute("data-evidence-state");
    expect(chapter).not.toHaveAttribute("data-dominant-proof");
    expect(chapter).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByText(/Evidence state:/)).not.toBeInTheDocument();
    expect(
      container.querySelector(".reader-evidence-summary"),
    ).not.toBeInTheDocument();
  });
});

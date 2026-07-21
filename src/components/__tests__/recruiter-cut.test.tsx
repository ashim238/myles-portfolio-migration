import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecruiterCut } from "@/components/recruiter-cut";

describe("RecruiterCut", () => {
  it("renders an optional interaction-evidence trailhead", () => {
    const { container } = render(
      <RecruiterCut
        role="Solo, design and engineering"
        timeline="Sep 2025 – Jun 2026"
        moves={[]}
        evidence={{
          type: "Working mobile prototype",
          cta: "Try the safety-flow reconstruction",
          href: "#fg-pulled-over",
        }}
      />,
    );

    const evidence = container.querySelector(".case-cut-evidence");
    expect(evidence).not.toBeNull();
    expect(screen.getByText("Working mobile prototype")).toHaveClass(
      "case-cut-evidence-type",
    );
    expect(
      screen.getByRole("link", { name: "Try the safety-flow reconstruction" }),
    ).toHaveClass("case-cut-evidence-cta");
    expect(
      screen.getByRole("link", { name: "Try the safety-flow reconstruction" }),
    ).toHaveAttribute("href", "#fg-pulled-over");
  });

  it("uses sentence-case labels rather than tracked uppercase metadata", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/app/styles/late-polish.css"),
      "utf8",
    );
    const factLabel = styles.match(/\.case-cut-row dt\s*\{([^}]+)\}/)?.[1];
    const movesLabel = styles.match(
      /\.case-cut-moves-label\s*\{([^}]+)\}/,
    )?.[1];

    expect(factLabel).toBeDefined();
    expect(factLabel).not.toMatch(/text-transform:\s*uppercase/);
    expect(factLabel).not.toMatch(/letter-spacing:\s*0\.1em/);
    expect(movesLabel).toBeDefined();
    expect(movesLabel).not.toMatch(/text-transform:\s*uppercase/);
    expect(movesLabel).not.toMatch(/letter-spacing:\s*0\.1em/);
  });

  it("keeps the at-a-glance scan to four project-specific facts", () => {
    const { container } = render(
      <RecruiterCut
        role="Solo, design and engineering"
        contribution="Built the research and product system end to end."
        team="Independent project with five research participants."
        timeline="Sep 2025 – Jun 2026"
        stack="React Native, Supabase"
        outcomeValue="78%"
        outcomeLabel="preferred it"
        moves={["Did the first thing.", "Did the second thing."]}
      />,
    );
    expect(screen.getByText("Team").tagName).toBe("DT");
    expect(screen.getByText("Independent project with five research participants.")).toBeInTheDocument();
    expect(Array.from(container.querySelectorAll(".case-cut-row dt"), (term) => term.textContent))
      .toEqual(["Role", "Team", "Timeline", "Outcome"]);
    expect(container.querySelectorAll(".case-cut-row")).toHaveLength(4);
    expect(screen.queryByText("Problem")).toBeNull();
    expect(screen.queryByText("Contribution")).toBeNull();
    expect(screen.queryByText("Feedback")).toBeNull();
    expect(screen.queryByText("Stack")).toBeNull();
    expect(screen.getByText("Key moves")).toBeInTheDocument();
    expect(screen.getByText("Did the second thing.")).toBeInTheDocument();
  });

  it("omits the outcome row when value/label absent", () => {
    render(
      <RecruiterCut role="r" timeline="t" stack="s" moves={["m"]} />,
    );
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("Stack")).toBeInTheDocument();
    expect(screen.queryByText("Outcome")).toBeNull();
  });

  it("uses contribution when a team is not provided", () => {
    render(
      <RecruiterCut
        role="r"
        contribution="Designed and built the system."
        timeline="t"
        stack="s"
        moves={[]}
      />,
    );

    expect(screen.getByText("Contribution")).toBeInTheDocument();
    expect(screen.getByText("Designed and built the system.")).toBeInTheDocument();
  });
});

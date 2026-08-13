import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecruiterCut } from "@/components/recruiter-cut";

describe("RecruiterCut", () => {
  it("renders only Team, Timeline, and Tools facts when optional facts are provided", () => {
    const { container } = render(
      <RecruiterCut
        team="Two-person product team"
        timeline="September 2025 – June 2026"
        tools="Figma, React Native"
        moves={["Mapped the service flow."]}
      />,
    );

    expect(
      Array.from(
        container.querySelectorAll(".case-cut-row dt"),
        (term) => term.textContent,
      ),
    ).toEqual(["Team", "Timeline", "Tools"]);
    expect(screen.getByText("Two-person product team")).toBeInTheDocument();
    expect(screen.getByText("September 2025 – June 2026")).toBeInTheDocument();
    expect(screen.getByText("Figma, React Native")).toBeInTheDocument();
    expect(screen.queryByText("Role")).not.toBeInTheDocument();
    expect(screen.queryByText("Contribution")).not.toBeInTheDocument();
    expect(screen.queryByText("Outcome")).not.toBeInTheDocument();
    expect(container.querySelector(".case-cut-evidence")).not.toBeInTheDocument();
  });

  it("keeps Timeline as the only required fact", () => {
    const { container } = render(
      <RecruiterCut timeline="May – August 2021" moves={[]} />,
    );

    expect(
      Array.from(
        container.querySelectorAll(".case-cut-row dt"),
        (term) => term.textContent,
      ),
    ).toEqual(["Timeline"]);
    expect(screen.queryByText("Team")).not.toBeInTheDocument();
    expect(screen.queryByText("Tools")).not.toBeInTheDocument();
    expect(screen.queryByText("Key moves")).not.toBeInTheDocument();
  });

  it("preserves Key moves in their authored order", () => {
    render(
      <RecruiterCut
        timeline="January 2025 – June 2025"
        moves={[
          "Graduate studio: tested the first concept.",
          "Solo rebuild: built the booking flow.",
        ]}
      />,
    );

    expect(screen.getByText("Key moves")).toBeInTheDocument();
    expect(
      screen.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual([
      "Graduate studio: tested the first concept.",
      "Solo rebuild: built the booking flow.",
    ]);
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
});

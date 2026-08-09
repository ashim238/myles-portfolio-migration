import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";

describe("ProjectOpeningFacts", () => {
  it("renders a compact, semantic opening scan with a reachable proof link", () => {
    render(
      <ProjectOpeningFacts
        role="Solo, design and engineering"
        scope="Six interviews became a prototype spanning route comparison."
        outcome="Working React Native prototype across 26+ screens."
        proof={{
          label: "Try the safety-flow reconstruction",
          href: "#fg-pulled-over",
        }}
      />,
    );

    const summary = screen.getByRole("region", { name: "Project summary" });
    const labels = Array.from(summary.querySelectorAll("dt"), (term) =>
      term.textContent,
    );

    expect(summary.tagName).toBe("SECTION");
    expect(summary.querySelector("dl")).not.toBeNull();
    expect(summary.querySelectorAll(".project-opening-facts-row")).toHaveLength(4);
    expect(labels).toEqual(["Role", "Scope", "Outcome", "Proof"]);
    expect(labels.every((label) => label === label?.[0]?.toUpperCase() + label?.slice(1))).toBe(true);
    expect(summary.querySelector("[class*='card']")).toBeNull();
    expect(
      screen.getByRole("link", {
        name: "Proof: Try the safety-flow reconstruction",
      }),
    ).toHaveAttribute("href", "#fg-pulled-over");
  });
});

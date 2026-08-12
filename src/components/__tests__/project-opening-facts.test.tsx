import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";

describe("ProjectOpeningFacts", () => {
  it("keeps proof separate from the opening metadata and exposes it as an explicit action", () => {
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
    expect(summary.querySelectorAll(".project-opening-facts-row")).toHaveLength(3);
    expect(labels).toEqual(["Role", "Scope", "Outcome"]);
    expect(labels.every((label) => label === label?.[0]?.toUpperCase() + label?.slice(1))).toBe(true);
    expect(summary.querySelector("[class*='card']")).toBeNull();
    const proofAction = screen.getByRole("link", {
      name: "Open proof: Try the safety-flow reconstruction",
    });

    expect(proofAction).toHaveClass("project-opening-facts-action");
    expect(proofAction).toHaveAttribute("href", "#fg-pulled-over");
    expect(proofAction).toHaveTextContent("Open proof");
    expect(proofAction).toHaveTextContent("Try the safety-flow reconstruction");
    expect(proofAction.querySelector('[aria-hidden="true"]')).toHaveTextContent(
      "→",
    );
  });
});

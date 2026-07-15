import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecruiterCut } from "@/components/recruiter-cut";

describe("RecruiterCut", () => {
  it("renders the at-a-glance facts and key moves", () => {
    const { container } = render(
      <RecruiterCut
        problem="Routing ignores whose safety knowledge counts."
        role="Solo, design and engineering"
        contribution="Built the research and product system end to end."
        team="Independent project with five research participants."
        feedback="Praised for making safety tradeoffs easy to understand."
        timeline="Sep 2025 – Jun 2026"
        stack="React Native, Supabase"
        outcomeValue="78%"
        outcomeLabel="preferred it"
        moves={["Did the first thing.", "Did the second thing."]}
      />,
    );
    expect(screen.getByText("Problem").tagName).toBe("DT");
    expect(screen.getByText("Routing ignores whose safety knowledge counts.")).toBeInTheDocument();
    expect(screen.getByText("Contribution").tagName).toBe("DT");
    expect(screen.getByText("Built the research and product system end to end.")).toBeInTheDocument();
    expect(screen.getByText("Team").tagName).toBe("DT");
    expect(screen.getByText("Independent project with five research participants.")).toBeInTheDocument();
    expect(screen.getByText("Feedback").tagName).toBe("DT");
    expect(screen.getByText("Praised for making safety tradeoffs easy to understand.")).toBeInTheDocument();
    expect(Array.from(container.querySelectorAll(".case-cut-row dt"), (term) => term.textContent))
      .toEqual(["Problem", "Role", "Contribution", "Team", "Feedback", "Timeline", "Stack", "Outcome"]);
    expect(screen.getByText("Key moves")).toBeInTheDocument();
    expect(screen.getByText("Did the second thing.")).toBeInTheDocument();
  });

  it("omits the outcome row when value/label absent", () => {
    render(
      <RecruiterCut problem="p" role="r" timeline="t" stack="s" moves={["m"]} />,
    );
    expect(screen.queryByText("Contribution")).toBeNull();
    expect(screen.queryByText("Team")).toBeNull();
    expect(screen.queryByText("Feedback")).toBeNull();
    expect(screen.queryByText("Outcome")).toBeNull();
  });
});

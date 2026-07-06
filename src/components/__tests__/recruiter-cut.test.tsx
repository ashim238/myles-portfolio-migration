import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecruiterCut } from "@/components/recruiter-cut";

describe("RecruiterCut", () => {
  it("renders the at-a-glance facts and key moves", () => {
    render(
      <RecruiterCut
        problem="Routing ignores whose safety knowledge counts."
        role="Solo, design and engineering"
        timeline="Sep 2025 – Jun 2026"
        stack="React Native, Supabase"
        outcomeValue="78%"
        outcomeLabel="preferred it"
        moves={["Did the first thing.", "Did the second thing."]}
      />,
    );
    expect(screen.getByText("Problem").tagName).toBe("DT");
    expect(screen.getByText("Routing ignores whose safety knowledge counts.")).toBeInTheDocument();
    expect(screen.getByText("Key moves")).toBeInTheDocument();
    expect(screen.getByText("Did the second thing.")).toBeInTheDocument();
  });

  it("omits the outcome row when value/label absent", () => {
    render(
      <RecruiterCut problem="p" role="r" timeline="t" stack="s" moves={["m"]} />,
    );
    expect(screen.queryByText("Outcome")).toBeNull();
  });
});

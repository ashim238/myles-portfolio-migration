import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ResearchSynthesis } from "@/components/fresh-greens/research-synthesis";

describe("Fresh Greens research synthesis", () => {
  it("connects an interview signal to its product response", async () => {
    const user = userEvent.setup();
    render(<ResearchSynthesis />);

    expect(screen.getByRole("tab", { name: /Light, 6 of 6/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("The daylight-graded route")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Police presence, 5 of 6/i }));

    expect(
      screen.getByRole("tab", { name: /Police presence, 5 of 6/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByText("Police presence in the route score"),
    ).toBeInTheDocument();
    expect(screen.queryByText("The daylight-graded route")).toBeNull();
    expect(
      screen.getByText("Raised by 5 of 6 Black drivers"),
    ).toBeInTheDocument();
  });

  it("supports arrow-key movement between interview signals", async () => {
    const user = userEvent.setup();
    render(<ResearchSynthesis />);

    const light = screen.getByRole("tab", { name: /Light, 6 of 6/i });
    light.focus();
    await user.keyboard("{ArrowRight}");

    expect(
      screen.getByRole("tab", { name: /Police presence, 5 of 6/i }),
    ).toHaveFocus();
    expect(
      screen.getByText("Police presence in the route score"),
    ).toBeInTheDocument();
  });
});

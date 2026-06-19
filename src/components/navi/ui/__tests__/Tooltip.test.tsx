import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Tooltip } from "@/components/navi/ui/Tooltip";

describe("Tooltip", () => {
  it("associates the trigger with the tip via aria-describedby", () => {
    render(
      <Tooltip content="Why this pick">
        <button type="button">info</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "info" });
    const tipId = trigger.getAttribute("aria-describedby");
    expect(tipId).toBeTruthy();
    expect(document.getElementById(tipId as string)).toHaveTextContent("Why this pick");
  });

  it("reveals the tip on focus", async () => {
    render(
      <Tooltip content="Why this pick">
        <button type="button">info</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.getByText("Why this pick")).toBeVisible();
  });

  it("dismisses on Escape", async () => {
    render(<Tooltip content="Why this pick"><button type="button">info</button></Tooltip>);
    await userEvent.tab();
    expect(screen.getByText("Why this pick")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    expect(screen.getByText("Why this pick")).not.toBeVisible();
  });
});

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Calendar } from "@/components/navi/ui/Calendar";

function longDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

describe("Calendar keyboard grid", () => {
  it("gives the standalone design-system calendar an accessible name", () => {
    render(<Calendar value={new Date(2027, 0, 15)} onChange={() => {}} />);

    expect(screen.getByRole("grid", { name: "Choose a date" })).toBeInTheDocument();
  });

  it("exposes a labelled grid with exactly one date in the roving tab order", () => {
    const selected = new Date(2027, 0, 15);
    render(
      <>
        <h2 id="date-label">Choose a date</h2>
        <Calendar value={selected} onChange={() => {}} labelledBy="date-label" />
      </>,
    );

    expect(screen.getByRole("grid", { name: "Choose a date" })).toBeInTheDocument();
    const dates = screen.getAllByRole("gridcell").filter((cell) => cell.tagName === "BUTTON");
    expect(dates.filter((cell) => cell.getAttribute("tabindex") === "0")).toHaveLength(1);
    expect(screen.getByRole("gridcell", { name: longDate(selected) })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("moves focus with Arrow, Home, End, and Page keys", async () => {
    const onChange = vi.fn();
    const selected = new Date(2027, 0, 15);
    render(<Calendar value={selected} onChange={onChange} />);
    const start = screen.getByRole("gridcell", { name: longDate(selected) });
    act(() => start.focus());

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("gridcell", { name: longDate(new Date(2027, 0, 16)) })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("gridcell", { name: longDate(new Date(2027, 0, 10)) })).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("gridcell", { name: longDate(new Date(2027, 0, 16)) })).toHaveFocus();
    await userEvent.keyboard("{PageDown}");
    expect(screen.getByRole("gridcell", { name: longDate(new Date(2027, 1, 16)) })).toHaveFocus();
    await userEvent.keyboard("{PageUp}");
    expect(screen.getByRole("gridcell", { name: longDate(new Date(2027, 0, 16)) })).toHaveFocus();
  });

  it("synchronizes the displayed month and roving date when the controlled value resets", () => {
    const february = new Date(2027, 1, 16);
    const january = new Date(2027, 0, 15);
    const { rerender } = render(<Calendar value={february} onChange={() => {}} />);

    expect(screen.getByText("February 2027")).toBeInTheDocument();

    rerender(<Calendar value={january} onChange={() => {}} />);

    expect(screen.getByText("January 2027")).toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: longDate(january) })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });
});

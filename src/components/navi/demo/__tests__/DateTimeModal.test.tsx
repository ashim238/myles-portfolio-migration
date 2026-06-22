import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DateTimeModal } from "@/components/navi/demo/DateTimeModal";

const times = ["10:00 AM", "1:00 PM", "4:30 PM"];

function nextMonthDay(day: number) {
  const today = new Date();
  const target = new Date(today.getFullYear(), today.getMonth() + 1, day);
  return target.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

describe("DateTimeModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <DateTimeModal
        open={false}
        times={times}
        initialDate={null}
        initialTime={null}
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("confirms a chosen date and time", async () => {
    const onConfirm = vi.fn();
    render(
      <DateTimeModal
        open
        times={times}
        initialDate={null}
        initialTime={null}
        onConfirm={onConfirm}
        onClose={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /next month/i }));
    const longDate = nextMonthDay(12);
    await userEvent.click(screen.getByRole("button", { name: longDate }));
    await userEvent.click(screen.getByRole("button", { name: "1:00 PM" }));
    await userEvent.click(screen.getByRole("button", { name: /confirm date/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    const arg = onConfirm.mock.calls[0][0];
    expect(arg.time).toBe("1:00 PM");
    expect(arg.date).toBeInstanceOf(Date);
    expect(arg.date.getDate()).toBe(12);
  });

  it("disables Confirm until a day is picked", async () => {
    render(
      <DateTimeModal
        open
        times={times}
        initialDate={null}
        initialTime={null}
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /confirm date/i })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: /next month/i }));
    await userEvent.click(screen.getByRole("button", { name: nextMonthDay(9) }));
    expect(screen.getByRole("button", { name: /confirm date/i })).toBeEnabled();
  });

  it("closes on Escape and on Cancel", async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <DateTimeModal
        open
        times={times}
        initialDate={null}
        initialTime={null}
        onConfirm={() => {}}
        onClose={onClose}
      />,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(
      <DateTimeModal
        open
        times={times}
        initialDate={null}
        initialTime={null}
        onConfirm={() => {}}
        onClose={onClose}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("pre-selects the incoming time", () => {
    render(
      <DateTimeModal
        open
        times={times}
        initialDate={null}
        initialTime="4:30 PM"
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "4:30 PM" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

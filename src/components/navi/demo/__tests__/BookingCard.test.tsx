import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BookingCard } from "@/components/navi/demo/BookingCard";

const dates = [
  { date: "Monday, March 23", time: "12:00 pm" },
  { date: "Tuesday, March 24", time: "12:00 pm" },
  { date: "Thursday, March 26", time: "12:00 pm" },
];

describe("BookingCard", () => {
  it("renders the price, dates, and Reserve / Contact actions", () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    expect(screen.getByText("From $48")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /contact organizer/i })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(dates.length);
  });

  it("the first date is selected by default", () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    expect(screen.getByRole("radio", { name: /Monday, March 23/i })).toBeChecked();
  });

  it("selecting another date updates state", async () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("radio", { name: /Tuesday, March 24/i }));
    expect(screen.getByRole("radio", { name: /Tuesday, March 24/i })).toBeChecked();
  });

  it("Reserve fires onReserve with the selected date and shows confirmation", async () => {
    const onReserve = vi.fn();
    render(<BookingCard priceFrom={48} dates={dates} onReserve={onReserve} />);
    await userEvent.click(screen.getByRole("button", { name: "Reserve now" }));
    expect(onReserve).toHaveBeenCalledWith(dates[0]);
    expect(screen.getByText(/reserved/i)).toBeInTheDocument();
  });

  it("renders the impact phrase as a link to the given impact href", () => {
    render(
      <BookingCard
        priceFrom={48}
        dates={dates}
        impact="Keeps a neighborhood tradition alive"
        impactHref="/work/navi/demo/impact#heritage"
        onReserve={() => {}}
      />,
    );
    const link = screen.getByRole("link", { name: /neighborhood tradition/i });
    expect(link).toHaveAttribute("href", "/work/navi/demo/impact#heritage");
  });

  it("omits the impact note when no impact prop is given", () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("lets you pick a specific date and time via the modal and reserves it", async () => {
    const onReserve = vi.fn();
    render(<BookingCard priceFrom={48} dates={dates} onReserve={onReserve} />);

    // Open the date + time modal from the "pick another date" trigger.
    await userEvent.click(screen.getByRole("button", { name: /pick another date/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Jump to next month so every day is selectable (no past-day disabling),
    // then pick the 15th — a day that always exists in every month.
    await userEvent.click(screen.getByRole("button", { name: /next month/i }));
    const today = new Date();
    const target = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    const longDate = target.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    await userEvent.click(screen.getByRole("button", { name: longDate }));
    // The default time is the experience's first real slot.
    await userEvent.click(screen.getByRole("button", { name: /confirm date/i }));

    // The modal closed and the custom pick deselected the preset slots.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { checked: true })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Reserve now" }));
    expect(onReserve).toHaveBeenCalledWith({ date: longDate, time: "12:00 pm" });
    expect(screen.getByRole("status")).toHaveTextContent(
      new RegExp(`Reserved for ${longDate} at 12:00 pm\\.`),
    );
  });

  it("selecting a new date after Reserve resets the confirmation", async () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Reserve now" }));
    expect(screen.getByRole("status")).toHaveTextContent(/reserved/i);
    await userEvent.click(screen.getByRole("radio", { name: /Tuesday, March 24/i }));
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });
});

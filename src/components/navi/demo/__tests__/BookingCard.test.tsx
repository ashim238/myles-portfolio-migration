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

  it("selecting a new date after Reserve resets the confirmation", async () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Reserve now" }));
    expect(screen.getByRole("status")).toHaveTextContent(/reserved/i);
    await userEvent.click(screen.getByRole("radio", { name: /Tuesday, March 24/i }));
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });
});

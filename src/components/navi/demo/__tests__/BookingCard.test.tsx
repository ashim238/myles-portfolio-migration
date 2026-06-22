import { render, screen, within } from "@testing-library/react";
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
    // The mobile bar repeats the price, so scope to the sidebar panel.
    expect(within(screen.getByRole("complementary")).getByText("From $48")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /contact organizer/i })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(dates.length);
  });

  it("labels the preset dates as the next available slots", () => {
    // A first-timer can read the presets as examples rather than bookable
    // dates. A visible group label names them as the next available slots.
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    expect(screen.queryByRole("group", { name: /next available/i })).toBeInTheDocument();
    expect(screen.getByText("Next available")).not.toHaveClass("nv-sr-only");
  });

  it("names the host in the desktop sidebar so the column ends on a trust note", () => {
    // The sticky sidebar is short and leaves a tall empty column on desktop. A
    // host snippet below the panel fills it with decision-relevant reassurance.
    render(
      <BookingCard
        priceFrom={48}
        dates={dates}
        host={{ name: "Lena Park", slug: "lena-park" }}
        onReserve={() => {}}
      />,
    );
    const aside = screen.getByRole("complementary");
    const hostLink = within(aside).getByRole("link", { name: "Lena Park" });
    expect(hostLink).toHaveAttribute("href", "/work/navi/demo/host/lena-park");
  });

  it("omits the host snippet when no host is given", () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    expect(within(screen.getByRole("complementary")).queryByText(/hosted by/i)).toBeNull();
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
    // Both the sidebar confirmation and the mobile bar say "Reserved"; scope here.
    expect(within(screen.getByRole("complementary")).getByText(/reserved/i)).toBeInTheDocument();
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

  it("reflects the picker's open state via aria-expanded on the trigger", async () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    const trigger = screen.getByRole("button", { name: /pick another date/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("drops the no-charge line when the experience is free", async () => {
    render(<BookingCard priceFrom={0} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Reserve now" }));
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/reserved for/i);
    expect(status).not.toHaveTextContent(/charged/i);
  });

  it("keeps the no-charge reassurance for a paid experience", async () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Reserve now" }));
    expect(screen.getByRole("status")).toHaveTextContent(/nothing was charged in this demo/i);
  });

  it("renders the date picker dialog outside the sticky booking container", async () => {
    // The booking card is position:sticky, which creates a stacking context.
    // The modal must portal out of it, or it paints below the fixed tab bar.
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: /pick another date/i }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.closest(".nv-booking")).toBeNull();
  });

  it("wraps the date picker dialog in the overlay token scope", async () => {
    // Portaled to body, the dialog sits outside the .nv-ui layout element that
    // carries the design tokens and font variables. Without a re-established
    // token scope its surface, text, and fonts resolve to nothing (transparent
    // background, wrong font). The wrapper must restore that scope.
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: /pick another date/i }));
    expect(screen.getByRole("dialog").closest(".nv-overlay-root")).not.toBeNull();
  });

  it("offers a reserve trigger in the mobile booking bar", () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    const barBtn = screen.getByRole("button", { name: "Reserve" });
    expect(barBtn).toHaveAttribute("aria-haspopup", "dialog");
    expect(barBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the booking sheet with the full form from the mobile bar", async () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    expect(
      screen.queryByRole("dialog", { name: /book this experience/i }),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
    const sheet = screen.getByRole("dialog", { name: /book this experience/i });
    expect(within(sheet).getAllByRole("radio")).toHaveLength(dates.length);
    expect(within(sheet).getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });

  it("wraps the booking sheet in the overlay token scope", async () => {
    // Same portal-to-body concern as the date modal: the sheet must restore the
    // .nv-ui token scope, or it renders transparent and unstyled over the page.
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
    const sheet = screen.getByRole("dialog", { name: /book this experience/i });
    expect(sheet.closest(".nv-overlay-root")).not.toBeNull();
  });

  it("reflects a reservation made in the sheet back on the mobile bar", async () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
    const sheet = screen.getByRole("dialog", { name: /book this experience/i });
    await userEvent.click(within(sheet).getByRole("button", { name: "Reserve now" }));
    // Shared state: the bar now points to the booking instead of offering to make one.
    expect(screen.getByRole("button", { name: /view booking/i })).toBeInTheDocument();
  });
});

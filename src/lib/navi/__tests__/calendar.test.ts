import { describe, it, expect } from "vitest";
import {
  buildMonthGrid,
  formatMonthYear,
  formatLongDate,
  isSameDay,
  isBeforeDay,
  startOfMonth,
  addMonths,
  getUpcomingSessions,
  formatRelativeMonth,
} from "@/lib/navi/calendar";

describe("buildMonthGrid", () => {
  it("places September 2025 with the 1st under Monday", () => {
    const weeks = buildMonthGrid(2025, 8); // month index 8 = September
    expect(weeks[0][0]).toBeNull(); // Sunday is blank
    expect(weeks[0][1]?.day).toBe(1); // Monday holds the 1st
    expect(weeks[0][6]?.day).toBe(6); // Saturday holds the 6th
  });

  it("includes every day of the month exactly once, in order", () => {
    const days = buildMonthGrid(2025, 8)
      .flat()
      .filter((c): c is { day: number; date: Date } => c !== null)
      .map((c) => c.day);
    expect(days).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });

  it("keeps every row at length 7", () => {
    for (const week of buildMonthGrid(2025, 8)) expect(week).toHaveLength(7);
  });

  it("handles February in a leap year (29 days)", () => {
    const days = buildMonthGrid(2024, 1)
      .flat()
      .filter((c): c is { day: number; date: Date } => c !== null)
      .map((c) => c.day);
    expect(days[days.length - 1]).toBe(29);
  });
});

describe("formatMonthYear", () => {
  it("formats the month name and full year", () => {
    expect(formatMonthYear(new Date(2025, 8, 1))).toBe("September 2025");
  });
});

describe("formatLongDate", () => {
  it("formats weekday, month, and day", () => {
    expect(formatLongDate(new Date(2025, 8, 8))).toBe("Monday, September 8");
  });
});

describe("isSameDay", () => {
  it("is true for the same calendar day at different times", () => {
    expect(isSameDay(new Date(2025, 8, 8, 9), new Date(2025, 8, 8, 23))).toBe(true);
  });

  it("is false for different days or a null input", () => {
    expect(isSameDay(new Date(2025, 8, 8), new Date(2025, 8, 9))).toBe(false);
    expect(isSameDay(null, new Date(2025, 8, 9))).toBe(false);
  });
});

describe("isBeforeDay", () => {
  it("ignores time-of-day", () => {
    expect(isBeforeDay(new Date(2025, 8, 7, 23), new Date(2025, 8, 8, 0))).toBe(true);
    expect(isBeforeDay(new Date(2025, 8, 8, 0), new Date(2025, 8, 8, 23))).toBe(false);
  });
});

describe("startOfMonth / addMonths", () => {
  it("startOfMonth drops the day and time", () => {
    expect(startOfMonth(new Date(2025, 8, 20, 14))).toEqual(new Date(2025, 8, 1));
  });

  it("addMonths wraps across the year boundary", () => {
    expect(addMonths(new Date(2025, 11, 15), 1)).toEqual(new Date(2026, 0, 1));
  });

  it("addMonths goes backward with a negative count", () => {
    expect(addMonths(new Date(2025, 0, 15), -1)).toEqual(new Date(2024, 11, 1));
  });
});

describe("getUpcomingSessions", () => {
  // June 22 2026 is a Monday; using it as the fixed "from" keeps these
  // deterministic no matter when the suite runs.
  const from = new Date(2026, 5, 22);

  it("returns consecutive weekly dates for a single weekday slot", () => {
    expect(getUpcomingSessions([{ weekday: 0, time: "10:00 am" }], 3, from)).toEqual([
      { date: "Sunday, June 28", time: "10:00 am" },
      { date: "Sunday, July 5", time: "10:00 am" },
      { date: "Sunday, July 12", time: "10:00 am" },
    ]);
  });

  it("interleaves multiple weekday slots in chronological order", () => {
    expect(
      getUpcomingSessions(
        [
          { weekday: 1, time: "12:00 pm" },
          { weekday: 2, time: "12:00 pm" },
          { weekday: 4, time: "12:00 pm" },
        ],
        3,
        from,
      ),
    ).toEqual([
      { date: "Tuesday, June 23", time: "12:00 pm" },
      { date: "Thursday, June 25", time: "12:00 pm" },
      { date: "Monday, June 29", time: "12:00 pm" },
    ]);
  });

  it("keeps cycling slots weekly when count exceeds the slot count", () => {
    expect(
      getUpcomingSessions(
        [
          { weekday: 6, time: "2:00 pm" },
          { weekday: 0, time: "2:00 pm" },
        ],
        4,
        from,
      ),
    ).toEqual([
      { date: "Saturday, June 27", time: "2:00 pm" },
      { date: "Sunday, June 28", time: "2:00 pm" },
      { date: "Saturday, July 4", time: "2:00 pm" },
      { date: "Sunday, July 5", time: "2:00 pm" },
    ]);
  });

  it("never returns the from-day itself, even when the weekday matches", () => {
    // June 28 2026 is a Sunday; the next Sunday slot must be July 5, not today.
    expect(getUpcomingSessions([{ weekday: 0, time: "9:00 am" }], 1, new Date(2026, 5, 28))).toEqual(
      [{ date: "Sunday, July 5", time: "9:00 am" }],
    );
  });

  it("returns an empty array for no slots or a non-positive count", () => {
    expect(getUpcomingSessions([], 3, from)).toEqual([]);
    expect(getUpcomingSessions([{ weekday: 0, time: "9:00 am" }], 0, from)).toEqual([]);
  });
});

describe("formatRelativeMonth", () => {
  const from = new Date(2026, 5, 15); // June 2026

  it("returns the from-month for zero months ago", () => {
    expect(formatRelativeMonth(0, from)).toBe("June 2026");
  });

  it("counts back month by month", () => {
    expect(formatRelativeMonth(1, from)).toBe("May 2026");
    expect(formatRelativeMonth(5, from)).toBe("January 2026");
  });

  it("crosses the year boundary going back", () => {
    expect(formatRelativeMonth(6, from)).toBe("December 2025");
  });
});

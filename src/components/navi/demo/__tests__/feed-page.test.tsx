import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import FeedPage from "@/app/work/navi/(minisite)/demo/page";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Feed page", () => {
  it("renders the first 12 experiences and reveals the next 12 on request", async () => {
    render(<FeedPage />);
    expect(screen.getAllByRole("link")).toHaveLength(12);
    expect(screen.getByRole("status")).toHaveTextContent(
      `Showing 12 of ${EXPERIENCES.length} experiences`,
    );

    await userEvent.click(screen.getByRole("button", { name: /load 12 more experiences/i }));
    expect(screen.getAllByRole("link")).toHaveLength(24);
  });

  it("keeps the final pagination control in place and announces completion", async () => {
    render(<FeedPage />);
    const loadMore = screen.getByRole("button", { name: /load 12 more experiences/i });
    await userEvent.click(loadMore);
    await userEvent.click(loadMore);
    await userEvent.click(screen.getByRole("button", { name: /load 1 more experience/i }));

    expect(screen.getByRole("button", { name: /all 37 experiences shown/i })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Showing 37 of 37 experiences");
  });

  it("keeps the client feed view independent of the full detail dataset", () => {
    const sources = [
      "src/app/work/navi/(minisite)/demo/FeedView.tsx",
      "src/components/navi/demo/ExperienceCard.tsx",
      "src/lib/navi/experience-summary.ts",
    ].map((file) => readFileSync(join(process.cwd(), file), "utf8"));
    expect(sources.join("\n")).not.toMatch(
      /import\s+(?!type\b)[^;]*from ["']@\/lib\/navi\/demo-data["']/,
    );
  });

  it("renders the category taskbar with all categories", () => {
    render(<FeedPage />);
    expect(screen.getByRole("region", { name: /categories/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cooking" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Architecture & design" })).toBeInTheDocument();
  });

  it("uses level-two headings for the top-level result collection", () => {
    render(<FeedPage />);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
  });

  it("filters cards by typed query", async () => {
    render(<FeedPage />);
    const before = screen.getAllByRole("link").length;
    const box = screen.getByRole("searchbox");
    await userEvent.type(box, "prospect");
    const after = screen.getAllByRole("link").length;
    expect(after).toBeLessThan(before);
  });

  it("filters by category button", async () => {
    render(<FeedPage />);
    const before = screen.getAllByRole("link").length;
    await userEvent.click(screen.getByRole("button", { name: "Cooking" }));
    const after = screen.getAllByRole("link").length;
    expect(after).toBeLessThanOrEqual(before);
  });

  it("offers no dead Solo group band", async () => {
    render(<FeedPage />);
    await userEvent.click(screen.getByRole("button", { name: /^Filters$/ }));
    expect(screen.queryByRole("button", { name: "Solo" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Small/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Large/ })).toBeInTheDocument();
  });

  it("keeps open-capacity listings in the Large group band", async () => {
    render(<FeedPage />);
    await userEvent.click(screen.getByRole("button", { name: /^Filters$/ }));
    await userEvent.click(screen.getByRole("button", { name: /^Large/ }));
    await userEvent.click(screen.getByRole("button", { name: /Show .* experiences?/ }));
    // "Sunset Park Night Market" has groupSize "Drop in anytime" (no number),
    // so it must land in Large rather than disappearing from every band.
    expect(
      screen.getByRole("link", { name: /Sunset Park Night Market/i }),
    ).toBeInTheDocument();
  });

  it("filters by price via the slide-over", async () => {
    render(<FeedPage />);
    const before = screen.getAllByRole("link").length;
    await userEvent.click(screen.getByRole("button", { name: /^Filters$/ }));
    await userEvent.click(screen.getByRole("button", { name: "Under $30" }));
    await userEvent.click(screen.getByRole("button", { name: /Show .* experiences?/ }));
    const after = screen.getAllByRole("link").length;
    expect(after).toBeLessThanOrEqual(before);
  });
});

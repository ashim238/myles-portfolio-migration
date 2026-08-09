import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";
import { CarouselArrow } from "@/components/navi/ui/CarouselArrow";
import { PaginationDots } from "@/components/navi/ui/PaginationDots";

const naviStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/navi-minisite.css"),
  "utf8",
);

let styleElement: HTMLStyleElement;

beforeAll(() => {
  styleElement = document.createElement("style");
  styleElement.textContent = naviStyles;
  document.head.append(styleElement);
});

afterAll(() => {
  styleElement.remove();
});

describe("CarouselArrow", () => {
  it("uses a directional accessible label and fires onClick", async () => {
    const onClick = vi.fn();
    render(<CarouselArrow direction="next" label="Next photo" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("PaginationDots", () => {
  it("renders count dots and marks the active one", () => {
    render(<PaginationDots count={4} active={2} onSelect={() => {}} />);
    const dots = screen.getAllByRole("tab");
    expect(dots).toHaveLength(4);
    expect(dots[2]).toHaveAttribute("aria-selected", "true");
  });

  it("selects a dot on click", async () => {
    const onSelect = vi.fn();
    render(<PaginationDots count={3} active={0} onSelect={onSelect} />);
    await userEvent.click(screen.getAllByRole("tab")[1]);
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("uses roving tabindex on dots", () => {
    render(<PaginationDots count={3} active={1} onSelect={() => {}} />);
    const dots = screen.getAllByRole("tab");
    expect(dots[1]).toHaveAttribute("tabindex", "0");
    expect(dots[0]).toHaveAttribute("tabindex", "-1");
  });

  it("uses non-overlapping 44px buttons around 10px visual marks", () => {
    render(<PaginationDots count={3} active={1} onSelect={() => {}} />);

    for (const dot of screen.getAllByRole("tab")) {
      const mark = dot.querySelector<HTMLElement>(".nv-dot-mark");

      expect(dot.parentElement).toHaveClass("nv-dots");
      expect(getComputedStyle(dot).width).toBe("44px");
      expect(getComputedStyle(dot).height).toBe("44px");
      expect(mark).not.toBeNull();
      expect(getComputedStyle(mark as HTMLElement).width).toBe("10px");
      expect(getComputedStyle(mark as HTMLElement).height).toBe("10px");
    }
  });

  it("moves selection and focus with the roving arrow-key behavior", async () => {
    const onSelect = vi.fn();
    render(<PaginationDots count={3} active={0} onSelect={onSelect} />);
    const dots = screen.getAllByRole("tab");

    dots[0].focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(dots[1]).toHaveFocus();
  });
});

describe("CarouselArrow disabled", () => {
  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<CarouselArrow direction="prev" label="Previous" disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

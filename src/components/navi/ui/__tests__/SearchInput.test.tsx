import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";
import { Label } from "@/components/navi/ui/Label";
import { SearchInput } from "@/components/navi/ui/SearchInput";

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

describe("Label", () => {
  it("marks required fields with an accessible required indicator", () => {
    render(<Label htmlFor="x" required>Email</Label>);
    expect(screen.getByText("Email").closest("label")).toHaveAttribute("for", "x");
    expect(screen.getByLabelText("required")).toBeInTheDocument();
  });

  it("shows an optional hint when optional", () => {
    render(<Label htmlFor="y" optional>Phone</Label>);
    expect(screen.getByText(/optional/i)).toBeInTheDocument();
  });
});

describe("SearchInput", () => {
  it("renders a labelled searchbox and reports typed value", async () => {
    const onChange = vi.fn();
    render(<SearchInput label="Search experiences" value="" onChange={onChange} />);
    const box = screen.getByRole("searchbox", { name: "Search experiences" });
    await userEvent.type(box, "park");
    expect(onChange).toHaveBeenCalled();
  });

  it("keeps the searchbox itself at least 44px tall", () => {
    render(<SearchInput label="Search experiences" value="" onChange={() => {}} />);

    const searchbox = screen.getByRole("searchbox", { name: "Search experiences" });

    expect(getComputedStyle(searchbox).minHeight).toBe("44px");
  });
});

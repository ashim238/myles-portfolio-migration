import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Label } from "@/components/navi/ui/Label";
import { SearchInput } from "@/components/navi/ui/SearchInput";

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
});

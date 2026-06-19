import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/navi/ui/Button";

describe("Button", () => {
  it("renders an accessible button with its label", () => {
    render(<Button>Reserve now</Button>);
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });

  it("applies variant and size modifier classes (default primary/md)", () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveClass("nv-btn", "nv-btn--primary", "nv-btn--md");
  });

  it("honors explicit variant + size", () => {
    render(
      <Button variant="outline" size="lg">
        Go
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("nv-btn--outline", "nv-btn--lg");
  });

  it("renders leading/trailing icons as decorative", () => {
    render(
      <Button leadingIcon={<svg data-testid="lead" />} trailingIcon={<svg data-testid="trail" />}>
        Go
      </Button>,
    );
    expect(screen.getByTestId("lead").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("trail").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onClick and respects disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

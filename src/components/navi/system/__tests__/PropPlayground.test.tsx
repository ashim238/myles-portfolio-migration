import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { PropPlayground } from "@/components/navi/system/PropPlayground";
import { Button } from "@/components/navi/ui/Button";

describe("PropPlayground", () => {
  const controls = [
    { name: "variant", options: ["primary", "outline"] },
    { name: "size", options: ["sm", "md", "lg"] },
  ];

  it("renders the live component and a props readout", () => {
    render(
      <PropPlayground
        component="Button"
        controls={controls}
        initial={{ variant: "primary", size: "md" }}
        render={(p) => <Button variant={p.variant as "primary"} size={p.size as "md"}>Go</Button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("nv-btn--primary");
    expect(screen.getByTestId("nv-playground-code")).toHaveTextContent('variant="primary"');
    expect(screen.getByTestId("nv-playground-code")).toHaveTextContent('size="md"');
  });

  it("updates the live component when a control changes", async () => {
    render(
      <PropPlayground
        component="Button"
        controls={controls}
        initial={{ variant: "primary", size: "md" }}
        render={(p) => <Button variant={p.variant as "primary"} size={p.size as "md"}>Go</Button>}
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "outline" }));
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("nv-btn--outline");
    expect(screen.getByTestId("nv-playground-code")).toHaveTextContent('variant="outline"');
  });
});

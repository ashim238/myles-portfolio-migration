import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NaviFooter } from "@/components/navi/chrome/NaviFooter";

describe("NaviFooter", () => {
  it("links only to real portfolio and demo surfaces", () => {
    const { container } = render(<NaviFooter />);

    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(screen.queryByText("contact@navi.com")).toBeNull();
    expect(screen.queryByRole("link", { name: "Careers" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Newsroom" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Privacy policy" })).toBeNull();
    expect(screen.getByRole("link", { name: "Read the case study" })).toHaveAttribute(
      "href",
      "/work/navi",
    );
  });
});

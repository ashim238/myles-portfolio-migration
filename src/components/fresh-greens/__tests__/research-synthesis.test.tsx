import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ResearchSynthesis } from "@/components/fresh-greens/research-synthesis";

function balancedBlock(source: string, marker: string) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return "";

  const openingBrace = source.indexOf("{", markerIndex);
  if (openingBrace === -1) return "";

  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }

  return "";
}

describe("Fresh Greens research synthesis", () => {
  it("connects an interview signal to its product response", async () => {
    const user = userEvent.setup();
    render(<ResearchSynthesis />);

    expect(screen.getByRole("tab", { name: /Light, 6 of 6/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("The daylight-graded route")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Police presence, 5 of 6/i }));

    expect(
      screen.getByRole("tab", { name: /Police presence, 5 of 6/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByText("Police presence in the route score"),
    ).toBeInTheDocument();
    expect(screen.queryByText("The daylight-graded route")).toBeNull();
    expect(
      screen.getByText("Raised by 5 of 6 Black drivers"),
    ).toBeInTheDocument();
  });

  it("supports arrow-key movement between interview signals", async () => {
    const user = userEvent.setup();
    render(<ResearchSynthesis />);

    const light = screen.getByRole("tab", { name: /Light, 6 of 6/i });
    light.focus();
    await user.keyboard("{ArrowRight}");

    expect(
      screen.getByRole("tab", { name: /Police presence, 5 of 6/i }),
    ).toHaveFocus();
    expect(
      screen.getByText("Police presence in the route score"),
    ).toBeInTheDocument();
  });

  it("keeps the mobile synthesis arrows centered between stacked ideas", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    const mobile = balancedBlock(styles, "@media (max-width: 720px)");
    const arrow = balancedBlock(mobile, ".fg-synth-transform-arrow");

    expect(arrow).toMatch(/justify-self:\s*center/);
    expect(arrow).toMatch(/transform:\s*rotate\(90deg\)/);
  });
});

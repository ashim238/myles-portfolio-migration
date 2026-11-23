import { join } from "node:path";
import sharp from "sharp";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EarlyProductWalkthrough } from "../early-product-walkthrough";

describe("Captured iOS route comparison", () => {
  it.each([1, 2])("keeps the blue location dot visible on route %i at inline phone size", async number => {
    const jpg = join(process.cwd(), "public/projects/fresh-greens/route-comparison", "ios-route-" + number + ".jpg");
    const { data, info } = await sharp(jpg).resize({ width: 280 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let blueMapPixels = 0;
    // Inspect the open map between the search bar and the bottom sheet.
    for (let y = 100; y < 300; y++) {
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * info.channels;
        if (data[i] < 55 && data[i + 1] > 80 && data[i + 1] < 165 && data[i + 2] > 210) blueMapPixels++;
      }
    }
    expect(blueMapPixels).toBeGreaterThan(35);
  });

  it("switches the real capture and announces the corresponding route", async () => {
    const user = userEvent.setup();
    render(<EarlyProductWalkthrough />);
    const first = screen.getByRole("img");
    const firstSource = first.getAttribute("src");
    expect(screen.getByRole("status")).toHaveTextContent(/Route 2 of 2. Via Rochester Avenue.*4:33 PM, Dusk/);
    await user.click(screen.getByRole("button", { name: "Previous route" }));
    expect(screen.getByRole("img").getAttribute("src")).not.toEqual(firstSource);
    expect(screen.getByRole("status")).toHaveTextContent(/Route 1 of 2. Via Rochester Avenue.*4:34 PM, After dark/);
    await user.click(screen.getByRole("button", { name: "Next route" }));
    expect(screen.getByRole("img")).toHaveAttribute("src", firstSource);
  });

  it("keeps keyboard focus on the route control when the active arrow moves", async () => {
    const user = userEvent.setup();
    render(<EarlyProductWalkthrough />);
    screen.getByRole("button", { name: "Previous route" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Next route" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Previous route" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Route 1 of 2");
  });
});

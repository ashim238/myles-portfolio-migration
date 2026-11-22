import { existsSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EarlyProductWalkthrough } from "../early-product-walkthrough";

function visit(label: string) {
  fireEvent.click(screen.getByRole("button", { name: label }), { detail: 1 });
}

function expectCapture(filename: string, description: RegExp) {
  const image = screen.getByRole("img", { name: description });
  expect(decodeURIComponent(image.getAttribute("src") ?? "")).toContain(filename);
  expect(existsSync(join(process.cwd(), "public", filename))).toBe(true);
}

const route = "/projects/fresh-greens/daylight-key/2026-11-21/";
const safety = "/projects/fresh-greens/v2/";

describe("Fresh Greens app walkthrough", () => {
  it("uses one recorded trip and preserves its context through the key and toolkit", () => {
    render(<EarlyProductWalkthrough />);
    expect(screen.queryByRole("button", { name: "← Back" })).not.toBeInTheDocument();
    expectCapture(route + "03-brixton-evening-preview.png", /Route preview for Windrush Square/);

    visit("Go, start the drive");
    expectCapture(route + "04-brixton-evening-navigation.png", /Driving view on Sudbourne Road/);
    visit("Open map key");
    expectCapture(route + "05-brixton-navigation-key-reopened.png", /same driving screen with the map key open/);
    visit("Close map key");
    expectCapture(route + "04-brixton-evening-navigation.png", /Driving view/);

    visit("Open map key");
    visit("Open safety toolkit");
    expectCapture(safety + "safety-toolkit.png", /Safety toolkit with four options/);
    visit("Open Pulled-over");
    expectCapture(safety + "pulled-over-armed-organic.png", /first pulled-over question/);
    visit("← Back");
    expectCapture(safety + "safety-toolkit.png", /Safety toolkit/);
    visit("← Back");
    expectCapture(route + "05-brixton-navigation-key-reopened.png", /map key open/);
    visit("Start over");
    expectCapture(route + "03-brixton-evening-preview.png", /Route preview/);
    expect(screen.queryByRole("button", { name: "Start over" })).not.toBeInTheDocument();
  });
});

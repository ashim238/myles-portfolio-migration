import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
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
  it("keeps pre-hydration tab controls hidden after artifact styles load", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/app/styles/late-polish.css"),
      "utf8",
    );

    expect(styles).toMatch(
      /\.fg-synth-tabs\[hidden\],\s*\.fg-pulled-tabs\[hidden\]\s*\{[^}]*display:\s*none;/,
    );
  });

  it("renders every stable evidence panel before hydration", () => {
    const markup = renderToStaticMarkup(<ResearchSynthesis />);
    const container = document.createElement("div");
    container.innerHTML = markup;
    const controls = container.querySelector(".fg-synth-tabs");
    const panels = Array.from(
      container.querySelectorAll<HTMLElement>(".fg-synth-panel"),
    );

    expect(controls).toHaveAttribute("hidden");
    expect(container.querySelectorAll('[role="tablist"], [role="tab"]')).toHaveLength(0);
    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(0);
    expect(panels).toHaveLength(4);
    for (const key of ["light", "police", "wildlife", "road"]) {
      expect(markup).toContain(`id="fg-synth-panel-${key}"`);
    }
    for (const panel of panels) {
      expect(panel).toHaveAttribute("role", "group");
      expect(panel.getAttribute("aria-label")).toBeTruthy();
      expect(panel).not.toHaveAttribute("hidden");
    }
  });

  it("keeps every tab target mounted after progressive enhancement", () => {
    const { container } = render(<ResearchSynthesis />);
    const tabs = screen.getAllByRole("tab");
    const panels = screen.getAllByRole("tabpanel", { hidden: true });

    expect(panels).toHaveLength(4);
    for (const tab of tabs) {
      const panelId = tab.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(container.querySelector(`#${panelId}`)).not.toBeNull();
    }
    expect(panels.filter((panel) => panel.hasAttribute("hidden"))).toHaveLength(3);
  });

  it("hydrates without recoverable errors or changing stable panel IDs", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<ResearchSynthesis />);
    document.body.append(container);
    const idsBefore = Array.from(
      container.querySelectorAll<HTMLElement>(".fg-synth-panel"),
      (panel) => panel.id,
    );
    const recoverableErrors: unknown[] = [];
    let root: Root | undefined;

    await act(async () => {
      root = hydrateRoot(container, <ResearchSynthesis />, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      });
      await Promise.resolve();
    });

    expect(recoverableErrors).toEqual([]);
    expect(
      Array.from(
        container.querySelectorAll<HTMLElement>(".fg-synth-panel"),
        (panel) => panel.id,
      ),
    ).toEqual(idsBefore);
    expect(container.querySelector(".fg-synth")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    expect(container.querySelector(".fg-synth-tabs")).not.toHaveAttribute(
      "hidden",
    );
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(4);
    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(4);
    expect(
      Array.from(container.querySelectorAll('[role="tabpanel"]')).filter(
        (panel) => panel.hasAttribute("hidden"),
      ),
    ).toHaveLength(3);

    await act(async () => root?.unmount());
    container.remove();
  });

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
    expect(screen.getByText("The daylight-graded route")).not.toBeVisible();
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
      resolve(process.cwd(), "src/app/styles/late-polish.css"),
      "utf8",
    );
    const mobile = balancedBlock(styles, "@media (max-width: 720px)");
    const arrow = balancedBlock(mobile, ".fg-synth-transform-arrow");

    expect(arrow).toMatch(/justify-self:\s*center/);
    expect(arrow).toMatch(/transform:\s*rotate\(90deg\)/);
  });
});

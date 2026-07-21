import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, it, expect, vi } from "vitest";
import { NaviColorSpecimen, NaviTypeSpecimen, NaviSpacingSpecimen } from "@/components/navi/system/Foundations";
import { NAVI_PRIMITIVES, NAVI_SEMANTIC, NAVI_SPACING, NAVI_TYPE } from "@/lib/navi/tokens";

const naviStyles = readFileSync(
  join(process.cwd(), "src/app/styles/navi-minisite.css"),
  "utf8",
);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("NaviColorSpecimen", () => {
  it("renders a swatch button for each primitive color", () => {
    render(<NaviColorSpecimen />);
    const primitives = Object.entries(NAVI_PRIMITIVES);
    primitives.forEach(([name, hex]) => {
      expect(
        screen.getByRole("button", { name: `Copy ${name} ${hex}` })
      ).toBeInTheDocument();
    });
  });

  it("renders a swatch button for each semantic alias", () => {
    render(<NaviColorSpecimen />);
    const aliases = Object.entries(NAVI_SEMANTIC);
    aliases.forEach(([name, hex]) => {
      expect(
        screen.getByRole("button", { name: `Copy ${name} ${hex}` })
      ).toBeInTheDocument();
    });
  });

  it("renders both primitive and semantic sections", () => {
    render(<NaviColorSpecimen />);
    expect(screen.getByTestId("nv-color-primitives")).toBeInTheDocument();
    expect(screen.getByTestId("nv-color-semantic")).toBeInTheDocument();
  });

  it("mounts the clipboard status region before an announcement", () => {
    render(<NaviColorSpecimen />);

    expect(
      screen.getByRole("status", { name: "Clipboard feedback" }),
    ).toBeEmptyDOMElement();
  });

  it("shows and announces clipboard success", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const [name, hex] = Object.entries(NAVI_PRIMITIVES)[0];
    render(<NaviColorSpecimen />);

    await user.click(screen.getByRole("button", { name: `Copy ${name} ${hex}` }));

    expect(writeText).toHaveBeenCalledWith(hex);
    const feedback = screen.getByRole("status", { name: "Clipboard feedback" });
    expect(feedback).toBeVisible();
    expect(feedback).toHaveTextContent(`Copied ${hex}.`);
  });

  it("selects a focused manual value after clipboard failure", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockRejectedValue(new Error("Clipboard permission denied"));
    const [name, hex] = Object.entries(NAVI_PRIMITIVES)[0];
    render(<NaviColorSpecimen />);

    await user.click(screen.getByRole("button", { name: `Copy ${name} ${hex}` }));

    expect(writeText).toHaveBeenCalledWith(hex);
    const feedback = await screen.findByRole("status", { name: "Clipboard feedback" });
    expect(feedback).toBeVisible();
    expect(feedback).toHaveAttribute("aria-live", "polite");
    const fallback = screen.getByRole("textbox", {
      name: "Manual hex value",
    }) as HTMLInputElement;
    expect(feedback).toHaveTextContent(
      `Could not copy ${hex}. The hex value is selected for manual copy.`,
    );
    expect(fallback).toBeVisible();
    expect(fallback).toHaveClass("nv-copy-fallback");
    expect(fallback).toHaveAttribute("aria-describedby", feedback.id);
    expect(fallback).toHaveAttribute("readonly");
    expect(fallback).toHaveValue(hex);
    expect(document.activeElement).toBe(fallback);
    expect(fallback.selectionStart).toBe(0);
    expect(fallback.selectionEnd).toBe(hex.length);
  });

  it("keeps the manual-copy fallback inside the Navi design system", () => {
    const fallbackRule = naviStyles.match(/\.nv-copy-fallback\s*\{([^}]*)\}/)?.[1];

    expect(fallbackRule).toBeDefined();
    expect(fallbackRule).toContain("min-height: 44px");
    expect(fallbackRule).toContain("var(--nv-border)");
    expect(fallbackRule).toContain("var(--nv-r-md)");
    expect(fallbackRule).toContain("var(--nv-surface-muted)");
  });

  it("groups clipboard recovery feedback and value at the compact spacing step", () => {
    const recoveryRule = naviStyles.match(
      /\.nv-copy-recovery\[data-active="true"\]\s*\{([^}]*)\}/,
    )?.[1];
    const feedbackRule = naviStyles.match(
      /\.nv-copy-recovery\[data-active="true"\]\s+\.nv-copy-feedback\s*\{([^}]*)\}/,
    )?.[1];

    expect(recoveryRule).toContain("display: grid");
    expect(recoveryRule).toContain("gap: var(--nv-sp-xs)");
    expect(feedbackRule).toContain("margin: 0");
  });
});

describe("NaviTypeSpecimen", () => {
  it("renders a type cell for each ramp entry", () => {
    render(<NaviTypeSpecimen />);
    const roles = Object.keys(NAVI_TYPE) as (keyof typeof NAVI_TYPE)[];
    roles.forEach((role) => {
      const label = screen.getByText(new RegExp(role, "i"));
      expect(label).toBeInTheDocument();
    });
  });

  it("renders the type grid container", () => {
    render(<NaviTypeSpecimen />);
    expect(screen.getByTestId("nv-type-grid")).toBeInTheDocument();
  });
});

describe("NaviSpacingSpecimen", () => {
  it("renders a row for each spacing scale entry", () => {
    render(<NaviSpacingSpecimen />);
    NAVI_SPACING.forEach((row) => {
      expect(screen.getByText(row.token)).toBeInTheDocument();
      expect(screen.getByText(`${row.px}px`)).toBeInTheDocument();
    });
  });

  it("renders the spacing table container with the correct label", () => {
    render(<NaviSpacingSpecimen />);
    expect(
      screen.getByRole("table", { name: /4px spacing scale/i })
    ).toBeInTheDocument();
  });
});

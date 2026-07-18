import { fireEvent, render, screen, within } from "@testing-library/react";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BeforeAfterPhones,
  NewsletterComposer,
  NewsletterComposerDemo,
  TemplateSwitcher,
} from "@/components/understandingfafsa";
import { UF_ASSETS } from "@/lib/understandingfafsa-assets";

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});

describe("UnderstandingFAFSA newsletter composer accessibility", () => {
  it("uses bounded WebP tiles while retaining links to every original tall capture", () => {
    for (const capture of [
      UF_ASSETS.mobileBefore,
      UF_ASSETS.mobileAfter,
      UF_ASSETS.templateWeekly,
    ]) {
      expect(capture).toHaveProperty("originalSrc");
      expect(capture).toHaveProperty("tiles");
      expect(capture.originalSrc).toMatch(/\.(?:jpe?g)$/u);
      expect(capture.tiles.length).toBeGreaterThan(1);
      expect(
        existsSync(resolve(process.cwd(), "public", capture.originalSrc.slice(1))),
      ).toBe(true);

      for (const tile of capture.tiles) {
        expect(tile.src).toMatch(/\.webp$/u);
        expect(tile.width).toBeLessThanOrEqual(1080);
        expect(tile.height).toBeLessThanOrEqual(2048);
        expect(
          existsSync(resolve(process.cwd(), "public", tile.src.slice(1))),
        ).toBe(true);
      }
    }
  });

  it("keeps the interaction optional until the reader opens it", () => {
    render(<NewsletterComposerDemo />);

    const trigger = screen.getByRole("button", { name: "Try the system" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: "Interactive newsletter composer" }),
    ).toBeNull();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("region", { name: "Interactive newsletter composer" }),
    ).toBeInTheDocument();
  });

  it("leaves phone-frame scrolling under the reader's control", () => {
    render(<BeforeAfterPhones />);

    const screenFrame = document.querySelector<HTMLElement>(
      ".uf-phone-screen--scroll",
    );
    expect(screenFrame).not.toBeNull();
    screenFrame!.scrollTop = 37;

    fireEvent.scroll(window);

    expect(screenFrame!.scrollTop).toBe(37);
  });

  it("names each phone frame for keyboard scrolling and keeps the evidence caveat beside it", () => {
    render(<BeforeAfterPhones />);

    const regions = screen.getAllByRole("region", {
      name: /Scrollable full newsletter/,
    });
    expect(regions).toHaveLength(2);
    for (const region of regions) {
      expect(region).toHaveAttribute("tabindex", "0");
    }
    expect(
      screen.getByText(
        "Reported open rates are shown for context. This was not a controlled attribution test.",
      ),
    ).toBeInTheDocument();
    const originalLinks = screen.getAllByRole("link", {
      name: /Open original .* capture/,
    });
    expect(originalLinks).toHaveLength(2);
    for (const link of originalLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }

    for (const region of regions) {
      expect(within(region).getAllByRole("img")).toHaveLength(1);
    }
    const tiledImages = regions.flatMap((region) =>
      Array.from(region.querySelectorAll("img")),
    );
    expect(tiledImages.length).toBeGreaterThan(2);
    for (const image of tiledImages) {
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).toHaveAttribute("alt", "");
    }
  });

  it("exposes the swappable blocks as a valid named list without treating the canvas as a list", () => {
    const { container } = render(<NewsletterComposer />);

    const canvas = container.querySelector(".uf-composer-canvas");
    expect(canvas).not.toHaveAttribute("role", "list");
    expect(canvas).not.toHaveAttribute("aria-live");

    const preview = screen.getByRole("region", { name: "Assembled send" });
    const list = within(preview).getByRole("list", {
      name: "Swappable newsletter blocks",
    });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  it("marks Randomize as the optional small-screen action", () => {
    render(<NewsletterComposer />);

    expect(screen.getByRole("button", { name: "Randomize" })).toHaveClass(
      "uf-composer-btn--randomize",
    );
  });

  it("gives only the tall template a named keyboard-scroll region and accurate note", () => {
    render(<TemplateSwitcher />);

    const weekly = screen.getByRole("region", {
      name: "Scrollable Weekly newsletter template",
    });
    expect(weekly).toHaveAttribute("tabindex", "0");
    expect(
      screen.getByText(
        "Scroll inside the frame to read the full send. Two of the three template types are shown here: weekly and event.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open original Weekly capture" }),
    ).toHaveAttribute("href", UF_ASSETS.templateWeekly.originalSrc);
    expect(within(weekly).getAllByRole("img")).toHaveLength(1);
    const weeklyTiles = weekly.querySelectorAll("img");
    expect(weeklyTiles.length).toBeGreaterThan(1);
    for (const image of weeklyTiles) {
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).toHaveAttribute("alt", "");
    }

    fireEvent.click(screen.getByRole("button", { name: "Event" }));

    expect(
      screen.queryByRole("region", {
        name: "Scrollable Event newsletter template",
      }),
    ).toBeNull();
    expect(
      screen.getByText(
        "Two of the three template types are shown here: weekly and event.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Counselor toolkit ships/)).toBeNull();
  });

  it("renders each composer block name once", () => {
    render(<NewsletterComposer />);

    const preview = screen.getByRole("region", { name: "Assembled send" });
    expect(within(preview).getAllByText("Lead story")).toHaveLength(1);
    expect(within(preview).getAllByText("Guides")).toHaveLength(1);
  });

  it("announces an added block through one concise atomic status region", () => {
    const { container } = render(<NewsletterComposer />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
    expect(status).toBeEmptyDOMElement();
    expect(container.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);

    fireEvent.click(
      screen.getByRole("button", { name: /Add Related reading block/ }),
    );

    expect(status).toHaveTextContent(
      "Added Related reading block to the end of the send.",
    );
    expect(status).not.toHaveTextContent("Newsletter header block");
  });

  it("announces reorder and remove actions without making the composer live", () => {
    render(<NewsletterComposer />);

    fireEvent.click(
      screen.getByRole("button", { name: /Add Related reading block/ }),
    );
    const status = screen.getByRole("status");

    fireEvent.click(
      screen.getByRole("button", { name: "Move Related reading up" }),
    );
    expect(status).toHaveTextContent("Moved Related reading up.");

    fireEvent.click(
      screen.getByRole("button", { name: "Remove Related reading" }),
    );
    expect(status).toHaveTextContent("Removed Related reading block.");
  });
});

import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BeforeAfterPhones,
  NewsletterComposer,
  NewsletterComposerDemo,
} from "@/components/understandingfafsa";

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

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import {
  PROJECT_RETURN_REQUEST,
  saveProjectReturnSnapshot,
  type ProjectReturnSnapshot,
} from "@/lib/project-enter";

const snapshot: ProjectReturnSnapshot = {
  version: 1,
  slug: "fresh-greens",
  rect: { top: 64, left: 160, width: 720, height: 520 },
  borderRadius: "0px",
  visual: {
    type: "program",
    programId: "fresh-greens",
    appName: "Fresh Greens.exe",
    title: "Fresh Greens",
    cover: { type: "image", src: "/projects/fresh-greens/cover.png" },
  },
};

describe("ReaderShell", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders project app chrome around one semantic case-study main", () => {
    render(
      <ReaderShell slug="fresh-greens" title="Fresh Greens" className="fg-page">
        <h1>Fresh Greens</h1>
        <p>Case-study content</p>
      </ReaderShell>,
    );

    expect(screen.getByRole("banner", { name: "Reader controls" })).toHaveTextContent(
      "Fresh Greens.exe",
    );
    expect(screen.getByRole("link", { name: "Return to Desktop" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("main")).toHaveAttribute(
      "data-reader-mode",
      "fresh-greens",
    );
    expect(screen.getByRole("main")).toHaveClass("project-page", "reader-mode", "fg-page");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Fresh Greens");
  });

  it("dispatches the reverse transition only for a matching saved program", () => {
    saveProjectReturnSnapshot(snapshot);
    const onReturn = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_RETURN_REQUEST, onReturn);

    render(
      <ReaderShell slug="fresh-greens" title="Fresh Greens">
        <h1>Fresh Greens</h1>
      </ReaderShell>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Return to Desktop" }));
    expect(onReturn).toHaveBeenCalledTimes(1);
    window.removeEventListener(PROJECT_RETURN_REQUEST, onReturn);
  });

  it("keeps direct and mismatched project visits on native desktop navigation", () => {
    saveProjectReturnSnapshot(snapshot);
    const onReturn = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_RETURN_REQUEST, onReturn);

    render(
      <ReaderShell slug="navi" title="Navi">
        <h1>Navi</h1>
      </ReaderShell>,
    );

    const link = screen.getByRole("link", { name: "Return to Desktop" });
    expect(link).toHaveAttribute("href", "/");
    fireEvent.click(link, { ctrlKey: true });
    expect(onReturn).not.toHaveBeenCalled();
    window.removeEventListener(PROJECT_RETURN_REQUEST, onReturn);
  });
});

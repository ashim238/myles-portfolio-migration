import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SystemDocumentShell } from "@/components/myles-97/system-document-shell";

describe("SystemDocumentShell", () => {
  it("renders a complete Myles 98 application frame around a secondary document", () => {
    render(
      <SystemDocumentShell program="about" title="About Myles">
        <h1>About content</h1>
      </SystemDocumentShell>,
    );

    const header = screen.getByRole("banner", {
      name: "About Myles document controls",
    });
    expect(
      within(header).getByRole("link", { name: "Work Stuff" }),
    ).toHaveAttribute("href", "/#selected-work");
    expect(
      within(header).getByRole("navigation", {
        name: "About Myles document location",
      }),
    ).toHaveTextContent("Desktop/About Myles");
    expect(
      document.querySelector('[data-m98-document-window="about"]'),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute(
      "data-m98-document",
      "about",
    );
    expect(
      screen.getByRole("contentinfo", {
        name: "About Myles document status",
      }),
    ).toHaveTextContent("Ready");
  });
});

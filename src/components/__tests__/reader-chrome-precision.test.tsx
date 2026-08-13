import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProgramWindow } from "@/components/myles-97/program-window";
import { ReaderHeader } from "@/components/myles-97/reader-header";
import { Taskbar } from "@/components/myles-97/taskbar";
import type { ProgramDefinition } from "@/lib/myles-97/programs";

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    src = "/logomark.svg",
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} src={src} />;
  },
}));

const fafsaProgram: ProgramDefinition = {
  id: "understandingfafsa",
  appName: "FAFSA Mail.app",
  applicationType: "Modular mail composer",
  primaryEvidence: "observed",
  title: "UnderstandingFAFSA",
  summary: "A modular mail composer",
  href: "/work/understandingfafsa",
};

function compactFafsaIcon(container: HTMLElement) {
  const icon = container.querySelector<SVGSVGElement>(
    'svg[data-myles97-icon-density="compact"]',
  );

  expect(icon).toBeInTheDocument();
  expect(icon).toHaveAttribute("data-m98-icon", "fafsa");
  expect(icon).toHaveAttribute("data-m98-icon-tier", "chrome");
  expect(icon).toHaveAttribute("data-m98-icon-grid", "16");
  expect(icon).toHaveAttribute("aria-hidden", "true");

  return icon!;
}

function expectCompactMonoFafsaGlyph(container: HTMLElement) {
  const icon = compactFafsaIcon(container);

  expect(icon).toHaveAttribute("data-m98-icon-variant", "mono");
  expect(
    icon.querySelector("image[data-m98-icon-master]"),
  ).not.toBeInTheDocument();
  expect(icon.querySelector(".myles98-icon-fallback")).not.toBeInTheDocument();
  expect(icon.querySelectorAll("path")).toHaveLength(2);
}

function expectCompactColorFafsaMaster(container: HTMLElement) {
  const icon = compactFafsaIcon(container);
  const master = icon.querySelector<SVGImageElement>(
    "image[data-m98-icon-master]",
  );
  const fallback = icon.querySelector<SVGGElement>(
    ".myles98-icon-fallback",
  );

  expect(icon).toHaveAttribute("data-m98-icon-variant", "color");
  expect(master).toHaveAttribute(
    "href",
    "/myles98-icons/understandingfafsa/understandingfafsa-16.svg",
  );
  expect(master).toHaveAttribute(
    "data-m98-icon-master-concept",
    "understandingfafsa",
  );
  expect(master).toHaveAttribute("data-m98-icon-master-grid", "16");
  expect(master).toHaveAttribute("width", "16");
  expect(master).toHaveAttribute("height", "16");
  expect(fallback).toHaveAttribute("aria-hidden", "true");
  expect(fallback?.querySelectorAll("path")).toHaveLength(2);
}

describe("dense Myles 98 chrome", () => {
  it("requests the compact FAFSA icon in the Reader header", () => {
    const { container } = render(
      <ReaderHeader slug="understandingfafsa" title="FAFSA Mail" />,
    );

    expectCompactMonoFafsaGlyph(container);
  });

  it("keeps the Reader return name complete while exposing separate compact visual text", () => {
    render(<ReaderHeader slug="understandingfafsa" title="FAFSA Mail" />);

    const returnLink = screen.getByRole("link", { name: "Return to Desktop" });
    expect(returnLink).toHaveAttribute("href", "/");
    expect(returnLink.querySelector(".reader-return-label--full")).toHaveTextContent(
      "Return to Desktop",
    );
    expect(returnLink.querySelector(".reader-return-label--compact")).toHaveTextContent(
      "Desktop",
    );
  });

  it("renders the audited compact FAFSA master in a program title bar with an inline fallback", () => {
    const { container } = render(
      <ProgramWindow
        id="understandingfafsa"
        title="FAFSA Mail.app"
        geometry={{ x: 40, y: 64, width: 720, height: 520 }}
        focused
        onFocus={vi.fn()}
        onMove={vi.fn()}
        onMinimize={vi.fn()}
        onClose={vi.fn()}
      >
        Composer
      </ProgramWindow>,
    );

    expectCompactColorFafsaMaster(container);
  });

  it("renders the audited compact FAFSA master in a taskbar button with an inline fallback", () => {
    const { container } = render(
      <Taskbar
        programs={[fafsaProgram]}
        openPrograms={["understandingfafsa"]}
        minimizedPrograms={[]}
        focusedProgram="understandingfafsa"
        startOpen={false}
        startButtonRef={createRef<HTMLButtonElement>()}
        onToggleStart={vi.fn()}
        onFocus={vi.fn()}
        onMinimize={vi.fn()}
        onRestore={vi.fn()}
      />,
    );

    expectCompactColorFafsaMaster(container);
  });
});

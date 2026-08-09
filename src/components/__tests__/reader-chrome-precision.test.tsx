import { createRef } from "react";
import { render } from "@testing-library/react";
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

function expectCompactFafsaIcon(container: HTMLElement) {
  expect(
    container.querySelector(
      'svg[data-myles97-icon-density="compact"]',
    ),
  ).toBeInTheDocument();
}

describe("dense Myles 98 chrome", () => {
  it("requests the compact FAFSA icon in the Reader header", () => {
    const { container } = render(
      <ReaderHeader slug="understandingfafsa" title="FAFSA Mail" />,
    );

    expectCompactFafsaIcon(container);
  });

  it("requests the compact FAFSA icon in a program title bar", () => {
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

    expectCompactFafsaIcon(container);
  });

  it("requests the compact FAFSA icon in a taskbar button", () => {
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

    expectCompactFafsaIcon(container);
  });
});

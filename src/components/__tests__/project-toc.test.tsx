import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectToc } from "@/components/project-toc";

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
}

class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
}

const rects = new Map<string, { top: number; bottom: number }>();

const baseStylesheet = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

const chapters = [
  { id: "frame", stage: "Frame", title: "The routing problem" },
  { id: "research", stage: "Research", title: "What drivers changed" },
  { id: "design", stage: "Design", title: "Safer route decisions" },
  { id: "refine", stage: "Refine", title: "The interaction language" },
  { id: "trust", stage: "Trust", title: "Community reports" },
  { id: "validate", stage: "Validate", title: "What still needs proof" },
];

function getCssBlock(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const ruleStart = baseStylesheet.match(
    new RegExp(`(?:^|\\n)${escapedSelector}\\s*\\{`),
  );
  expect(ruleStart, `${selector} CSS rule`).not.toBeNull();

  const blockStart = ruleStart!.index! + ruleStart![0].lastIndexOf("{");

  let depth = 0;
  for (let index = blockStart; index < baseStylesheet.length; index += 1) {
    if (baseStylesheet[index] === "{") depth += 1;
    if (baseStylesheet[index] === "}") depth -= 1;
    if (depth === 0) return baseStylesheet.slice(blockStart + 1, index);
  }

  throw new Error(`Unclosed CSS rule for ${selector}`);
}

function mockRect(top: number, bottom: number) {
  return {
    top: top - window.scrollY,
    bottom: bottom - window.scrollY,
    height: bottom - top,
    left: 0,
    right: 0,
    width: 800,
    x: 0,
    y: top - window.scrollY,
    toJSON: () => ({}),
  };
}

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false })),
  );
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  rects.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ProjectToc", () => {
  it("renders and announces chapter-aware labels", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    const { container } = render(
      <main className="project-page">
        {chapters.map((chapter) => (
          <h2 key={chapter.id} id={chapter.id}>
            {chapter.title}
          </h2>
        ))}
        <ProjectToc sections={chapters} />
      </main>,
    );

    expect(
      screen.getByRole("navigation", { name: "Case study chapters" }),
    ).toBeInTheDocument();

    const research = screen.getByRole("button", {
      name: "Research: What drivers changed",
    });
    expect(research).toBeInTheDocument();
    expect(
      research.querySelector(".project-toc-text > .project-toc-stage"),
    ).toHaveTextContent("Research");
    expect(
      research.querySelector(".project-toc-text > .project-toc-separator")
        ?.textContent,
    ).toBe(": ");
    expect(
      research.querySelector(".project-toc-text > .project-toc-title"),
    ).toHaveTextContent("What drivers changed");

    fireEvent.click(research);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Now reading: Research: What drivers changed",
    );
    expect(
      container.querySelector(
        ".project-toc-active-title .project-toc-stage",
      ),
    ).toHaveTextContent("Research");
    expect(
      container.querySelector(
        ".project-toc-active-title .project-toc-separator",
      )?.textContent,
    ).toBe(": ");
    expect(
      container.querySelector(
        ".project-toc-active-title .project-toc-title",
      ),
    ).toHaveTextContent("What drivers changed");
    expect(screen.getByText(/Arrow keys move between chapters/)).toBeInTheDocument();
  });

  it("keeps a legacy section title as its accessible name", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    render(
      <main className="project-page">
        <h2 id="overview">Overview</h2>
        <ProjectToc sections={[{ title: "Overview", id: "overview" }]} />
      </main>,
    );

    expect(
      screen.getAllByRole("button", { name: "Overview" }),
    ).toHaveLength(1);
  });

  it("moves focus across six chapters and restores it after Escape", async () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    const { container } = render(
      <main className="project-page">
        {chapters.map((chapter) => (
          <h2 key={chapter.id} id={chapter.id}>
            {chapter.title}
          </h2>
        ))}
        <ProjectToc sections={chapters} />
      </main>,
    );

    const chapterButtons = chapters.map((chapter) =>
      screen.getByRole("button", {
        name: `${chapter.stage}: ${chapter.title}`,
      }),
    );
    const toggle = container.querySelector<HTMLButtonElement>(
      ".project-toc-toggle",
    );

    expect(toggle).not.toBeNull();
    expect(chapterButtons).toHaveLength(6);

    chapterButtons[0].focus();
    fireEvent.keyDown(chapterButtons[0], { key: "ArrowDown" });
    expect(chapterButtons[1]).toHaveFocus();
    fireEvent.keyDown(chapterButtons[1], { key: "ArrowRight" });
    expect(chapterButtons[2]).toHaveFocus();
    fireEvent.keyDown(chapterButtons[2], { key: "ArrowUp" });
    expect(chapterButtons[1]).toHaveFocus();
    fireEvent.keyDown(chapterButtons[1], { key: "ArrowLeft" });
    expect(chapterButtons[0]).toHaveFocus();

    fireEvent.keyDown(chapterButtons[0], { key: "End" });
    expect(chapterButtons[5]).toHaveFocus();
    fireEvent.keyDown(chapterButtons[5], { key: "Home" });
    expect(chapterButtons[0]).toHaveFocus();

    fireEvent.click(toggle!);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    chapterButtons[3].focus();
    fireEvent.keyDown(chapterButtons[3], { key: "Escape" });

    await vi.waitFor(() => {
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(toggle).toHaveFocus();
    });
  });

  it("uses the shared project heading offset for anchored headings", () => {
    expect(getCssBlock(".project-page")).toMatch(
      /--project-heading-offset:\s*3\.5rem;/,
    );
    expect(getCssBlock(".project-page h2[id]")).toMatch(
      /scroll-margin-top:\s*var\(--project-heading-offset\);/,
    );
  });

  it("bounds the expanded mobile stage list to the viewport", () => {
    expect(baseStylesheet).toMatch(
      /\.project-toc-list--open\s*\{[^}]*max-height:\s*calc\(100dvh - 7rem - env\(safe-area-inset-bottom\)\);[^}]*overflow-y:\s*auto;/,
    );
  });

  it("wraps the active mobile title for safe ellipsis", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    const { container } = render(
      <main className="project-page">
        <h2 id="long-section">A deliberately long process stage title</h2>
        <ProjectToc
          sections={[
            {
              title: "A deliberately long process stage title",
              id: "long-section",
            },
          ]}
        />
      </main>,
    );

    expect(
      container.querySelector(".project-toc-toggle-label .project-toc-active-title"),
    ).toHaveTextContent("A deliberately long process stage title");
  });

  it("returns focus to the mobile toggle after selecting a section", async () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    render(
      <main className="project-page">
        <h2 id="problem">Problem</h2>
        <ProjectToc sections={[{ title: "Problem", id: "problem" }]} />
      </main>,
    );

    const buttons = screen.getAllByRole("button", { name: /Problem/ });
    const toggle = buttons[0];
    fireEvent.click(toggle);
    const sectionButton = buttons[1];
    sectionButton.focus();
    fireEvent.click(sectionButton);

    await vi.waitFor(() => expect(toggle).toHaveFocus());
  });

  it("can keep grouped navigation while measuring progress through a later section", async () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 1020,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    rects.set("fg-problem", { top: 100, bottom: 120 });
    rects.set("fg-pivot", { top: 600, bottom: 620 });
    rects.set("fg-scope", { top: 1400, bottom: 1420 });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function getBoundingClientRect(this: HTMLElement) {
        if (this.id && rects.has(this.id)) {
          const { top, bottom } = rects.get(this.id)!;
          return mockRect(top, bottom) as DOMRect;
        }

        const heading = this.querySelector?.("h2");
        if (heading?.id && rects.has(heading.id)) {
          const { top, bottom } = rects.get(heading.id)!;
          return mockRect(top, bottom) as DOMRect;
        }

        return mockRect(0, 48) as DOMRect;
      },
    );

    render(
      <main className="project-page">
        <section className="project-section">
          <h2 id="fg-problem">Problem</h2>
        </section>
        <section className="project-section">
          <h2 id="fg-pivot">Visual system, trust, and scope</h2>
        </section>
        <section className="project-section">
          <h2 id="fg-scope">What shipped and what comes next</h2>
        </section>
        <ProjectToc
          sections={[
            { title: "Problem", id: "fg-problem" },
            { title: "Visual system, trust, and scope", id: "fg-pivot" },
          ]}
          readingEndId="fg-scope"
        />
      </main>,
    );

    await vi.waitFor(() => {
      expect(screen.getAllByText(/% · \d+ min left/)).toHaveLength(2);
    });

    expect(screen.queryByText("Finished")).not.toBeInTheDocument();
  });
});

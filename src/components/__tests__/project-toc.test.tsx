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

function getCssBlock(selector: string, source = baseStylesheet) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const ruleStart = source.match(
    new RegExp(`(?:^|\\n)\\s*${escapedSelector}\\s*\\{`),
  );
  expect(ruleStart, `${selector} CSS rule`).not.toBeNull();

  const blockStart = ruleStart!.index! + ruleStart![0].lastIndexOf("{");

  let depth = 0;
  for (let index = blockStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(blockStart + 1, index);
  }

  throw new Error(`Unclosed CSS rule for ${selector}`);
}

function getAtRuleContaining(atRule: string, needle: string) {
  let cursor = 0;

  while (cursor < baseStylesheet.length) {
    const start = baseStylesheet.indexOf(`${atRule} {`, cursor);
    if (start < 0) break;
    const candidate = getCssBlock(atRule, baseStylesheet.slice(start));
    if (candidate.includes(needle)) return candidate;
    cursor = start + atRule.length;
  }

  throw new Error(`${atRule} block containing ${needle} was not found`);
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
  it("reports which edge of an overflowing desktop rail has more chapters", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    render(
      <main className="project-page">
        {chapters.map((chapter) => (
          <h2 key={chapter.id} id={chapter.id}>{chapter.title}</h2>
        ))}
        <ProjectToc sections={chapters} />
      </main>,
    );

    const nav = screen.getByRole("navigation", { name: "Case study chapters" });
    const list = screen.getByRole("list");
    Object.defineProperties(list, {
      clientWidth: { configurable: true, value: 300 },
      scrollWidth: { configurable: true, value: 800 },
      scrollLeft: { configurable: true, writable: true, value: 0 },
    });

    fireEvent(window, new Event("resize"));
    expect(nav).toHaveAttribute("data-toc-overflow", "end");

    list.scrollLeft = 250;
    fireEvent.scroll(list);
    expect(nav).toHaveAttribute("data-toc-overflow", "both");

    list.scrollLeft = 500;
    fireEvent.scroll(list);
    expect(nav).toHaveAttribute("data-toc-overflow", "start");
  });

  it("marks collapsed navigation ready only after hydration", async () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    render(
      <main className="project-page">
        <h2 id="overview">Overview</h2>
        <ProjectToc sections={[{ title: "Overview", id: "overview" }]} />
      </main>,
    );

    await vi.waitFor(() => {
      expect(
        screen.getByRole("navigation", { name: "Case study chapters" }),
      ).toHaveAttribute("data-toc-ready", "true");
    });
  });

  it("keeps the server-rendered chapter links usable without observer enhancement", () => {
    render(
      <main className="project-page">
        <h2 id="overview">Overview</h2>
        <ProjectToc sections={[{ title: "Overview", id: "overview" }]} />
      </main>,
    );

    const nav = screen.getByRole("navigation", {
      name: "Case study chapters",
    });
    expect(nav).not.toHaveAttribute("data-toc-ready");
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "#overview",
    );
  });

  it("does not collapse the chapter links when observer setup fails", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class ThrowingIntersectionObserver {
        constructor() {
          throw new Error("observer construction failed");
        }
      },
    );
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    expect(() =>
      render(
        <main className="project-page">
          <h2 id="overview">Overview</h2>
          <ProjectToc sections={[{ title: "Overview", id: "overview" }]} />
        </main>,
      ),
    ).not.toThrow();

    expect(
      screen.getByRole("navigation", { name: "Case study chapters" }),
    ).not.toHaveAttribute("data-toc-ready");
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "#overview",
    );
  });

  it("does not collapse the chapter links when resize observation is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    render(
      <main className="project-page">
        <h2 id="overview">Overview</h2>
        <ProjectToc sections={[{ title: "Overview", id: "overview" }]} />
      </main>,
    );

    expect(
      screen.getByRole("navigation", { name: "Case study chapters" }),
    ).not.toHaveAttribute("data-toc-ready");
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
  });

  it("reads reduced-motion preference even when resize enhancement is unavailable", async () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );

    render(
      <main className="project-page">
        <h2 id="overview">Overview</h2>
        <ProjectToc sections={[{ title: "Overview", id: "overview" }]} />
      </main>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Overview" }));

    await vi.waitFor(() => {
      expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: "auto" }),
      );
    });
  });

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

    const research = screen.getByRole("link", {
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
      screen.getByRole("button", { name: "Research: What drivers changed" }),
    ).toBeInTheDocument();
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
    const keyboardHelp = screen.getByText(/Arrow keys move between chapters/);
    expect(keyboardHelp).toBeInTheDocument();
    expect(screen.getByRole("list")).toHaveAttribute(
      "aria-describedby",
      keyboardHelp.id,
    );
  });

  it("keeps a numbered action heading readable in the compact ToC", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    const { container } = render(
      <main className="project-page">
        <h2 id="plan">1. Compare route conditions before choosing</h2>
        <ProjectToc
          sections={[
            {
              id: "plan",
              stage: "Plan",
              title: "1. Compare route conditions before choosing",
            },
          ]}
        />
      </main>,
    );

    const chapter = screen.getByRole("link", {
      name: "Plan: 1. Compare route conditions before choosing",
    });
    expect(chapter.querySelector(".project-toc-num")).toHaveTextContent("01.");
    expect(chapter.querySelector(".project-toc-title")).toHaveTextContent(
      "Compare route conditions before choosing",
    );
    expect(
      container.querySelector(".project-toc-active-title .project-toc-title"),
    ).toHaveTextContent("Compare route conditions before choosing");
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
      screen.getAllByRole("link", { name: "Overview" }),
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

    const chapterLinks = chapters.map((chapter) =>
      screen.getByRole("link", {
        name: `${chapter.stage}: ${chapter.title}`,
      }),
    );
    const toggle = container.querySelector<HTMLButtonElement>(
      ".project-toc-toggle",
    );

    expect(toggle).not.toBeNull();
    expect(chapterLinks).toHaveLength(6);

    chapterLinks[0].focus();
    fireEvent.keyDown(chapterLinks[0], { key: "ArrowDown" });
    expect(chapterLinks[1]).toHaveFocus();
    fireEvent.keyDown(chapterLinks[1], { key: "ArrowRight" });
    expect(chapterLinks[2]).toHaveFocus();
    fireEvent.keyDown(chapterLinks[2], { key: "ArrowUp" });
    expect(chapterLinks[1]).toHaveFocus();
    fireEvent.keyDown(chapterLinks[1], { key: "ArrowLeft" });
    expect(chapterLinks[0]).toHaveFocus();

    fireEvent.keyDown(chapterLinks[0], { key: "End" });
    expect(chapterLinks[5]).toHaveFocus();
    fireEvent.keyDown(chapterLinks[5], { key: "Home" });
    expect(chapterLinks[0]).toHaveFocus();

    fireEvent.click(toggle!);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    chapterLinks[3].focus();
    fireEvent.keyDown(chapterLinks[3], { key: "Escape" });

    await vi.waitFor(() => {
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(toggle).toHaveFocus();
    });
  });

  it("uses the shared project heading offset for anchored headings", () => {
    expect(getCssBlock(".project-page")).toMatch(
      /--project-heading-offset:\s*3\.5rem;/,
    );
    expect(
      getCssBlock(
        ".project-page :is(h2[id], .project-evidence-heading[id])",
      ),
    ).toMatch(
      /scroll-margin-top:\s*var\(--project-heading-offset\);/,
    );
  });

  it("bounds the expanded mobile stage list to the viewport", () => {
    expect(baseStylesheet).toMatch(
      /\.project-toc-list--open\s*\{[^}]*max-height:\s*calc\(100dvh - 7rem - env\(safe-area-inset-bottom\)\);[^}]*overflow-y:\s*auto;/,
    );
  });

  it("keeps the mobile chapter list visible until enhancement is ready", () => {
    const mobile = getAtRuleContaining(
      "@media (max-width: 767px)",
      ".project-toc-toggle",
    );

    expect(getCssBlock(".project-toc-toggle", mobile)).toMatch(
      /display:\s*none;/,
    );
    expect(getCssBlock(".project-toc-list", mobile)).toMatch(
      /display:\s*flex;/,
    );
    expect(
      getCssBlock(
        '.project-toc[data-toc-ready="true"] .project-toc-toggle',
        mobile,
      ),
    ).toMatch(/display:\s*flex;/);
    expect(
      getCssBlock(
        '.project-toc[data-toc-ready="true"] .project-toc-list',
        mobile,
      ),
    ).toMatch(/display:\s*none;/);
    expect(
      getCssBlock(
        '.project-toc[data-toc-ready="true"] .project-toc-list--open',
        mobile,
      ),
    ).toMatch(/display:\s*flex;/);
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

    const toggle = screen.getByRole("button", { name: /Problem/ });
    fireEvent.click(toggle);
    const sectionLink = screen.getByRole("link", { name: "Problem" });
    sectionLink.focus();
    fireEvent.click(sectionLink);

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

  it("moves the active chapter backward when the playhead returns to the previous chapter body", async () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    let pageY = 1020;
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      get: () => pageY,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    rects.set("plan", { top: 500, bottom: 520 });
    rects.set("respond", { top: 1000, bottom: 1020 });
    rects.set("trust", { top: 1500, bottom: 1520 });

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function getBoundingClientRect(this: HTMLElement) {
        if (this.id && rects.has(this.id)) {
          const rect = rects.get(this.id)!;
          return mockRect(rect.top, rect.bottom) as DOMRect;
        }

        const heading = this.querySelector?.("h2");
        if (heading?.id && rects.has(heading.id)) {
          const rect = rects.get(heading.id)!;
          return mockRect(rect.top, rect.bottom) as DOMRect;
        }

        return mockRect(0, 48) as DOMRect;
      },
    );
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });

    render(
      <main className="project-page">
        <section className="project-section">
          <h2 id="plan">Plan chapter</h2>
        </section>
        <section className="project-section">
          <h2 id="respond">Respond chapter</h2>
        </section>
        <section className="project-section">
          <h2 id="trust">Trust chapter</h2>
        </section>
        <ProjectToc
          sections={[
            { id: "plan", stage: "Plan", title: "Plan chapter" },
            { id: "respond", stage: "Respond", title: "Respond chapter" },
            { id: "trust", stage: "Trust", title: "Trust chapter" },
          ]}
        />
      </main>,
    );

    const respond = screen.getByRole("link", {
      name: "Respond: Respond chapter",
    });
    fireEvent.click(respond);
    expect(respond).toHaveAttribute("aria-current", "true");

    pageY = 850;
    fireEvent(window, new Event("scrollend"));

    await vi.waitFor(() => {
      expect(
        screen.getByRole("link", { name: "Plan: Plan chapter" }),
      ).toHaveAttribute("aria-current", "true");
    });
  });

  it("activates the final chapter when a fragment jump reaches the document end", async () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 1200,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    rects.set("trust", { top: 900, bottom: 920 });
    rects.set("validate", { top: 1450, bottom: 1470 });

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function getBoundingClientRect(this: HTMLElement) {
        if (this.id && rects.has(this.id)) {
          const rect = rects.get(this.id)!;
          return mockRect(rect.top, rect.bottom) as DOMRect;
        }
        const heading = this.querySelector?.("h2");
        if (heading?.id && rects.has(heading.id)) {
          const rect = rects.get(heading.id)!;
          return mockRect(rect.top, rect.bottom) as DOMRect;
        }
        return mockRect(0, 48) as DOMRect;
      },
    );

    render(
      <main className="project-page">
        <section className="project-section"><h2 id="trust">Trust</h2></section>
        <section className="project-section"><h2 id="validate">Validate</h2></section>
        <ProjectToc sections={[
          { id: "trust", stage: "Trust", title: "Trust" },
          { id: "validate", stage: "Validate", title: "Validate" },
        ]} />
      </main>,
    );

    await vi.waitFor(() => {
      expect(screen.getByRole("link", { name: "Validate: Validate" })).toHaveAttribute(
        "aria-current",
        "true",
      );
    });
  });
});

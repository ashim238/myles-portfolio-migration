import { render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("keeps a sentence highlighted after it leaves the viewport", () => {
  type Entry = Pick<IntersectionObserverEntry, "target" | "isIntersecting">;
  let notify!: (entries: Entry[]) => void;
  const unobserve = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: typeof notify) {
        notify = callback;
      }
      observe = vi.fn();
      unobserve = unobserve;
      disconnect = vi.fn();
    },
  );

  render(
    <main data-project-slug="navi">
      <mark className="case-highlight">A design decision</mark>
      <CaseHighlightObserver />
    </main>,
  );
  const target = screen.getByText("A design decision");
  expect(target).not.toHaveClass("is-revealed");
  notify([{ target, isIntersecting: true }]);
  expect(unobserve).toHaveBeenCalledWith(target);
  notify([{ target, isIntersecting: false }]);
  expect(target).toHaveClass("is-revealed");
});

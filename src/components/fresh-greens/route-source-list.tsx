"use client";

import { useEffect, useRef } from "react";

export function RouteSourceList({ sources }: { sources: readonly { name: string; detail: string }[] }) {
  const disclosure = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const compact = window.matchMedia("(max-width: 700px)");
    function setInitialView() {
      if (disclosure.current) disclosure.current.open = !compact.matches;
    }

    setInitialView();
    compact.addEventListener("change", setInitialView);
    return () => compact.removeEventListener("change", setInitialView);
  }, []);

  return (
    <details className="fg-source-index" ref={disclosure} open>
      <summary>
        <h3>Data sources</h3>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="m2 4 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="fg-source-index-names">{sources.map(({ name }) => name).join(" · ")}</span>
      </summary>
      <dl className="fg-route-scoring-sources">
        {sources.map(({ name, detail }) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

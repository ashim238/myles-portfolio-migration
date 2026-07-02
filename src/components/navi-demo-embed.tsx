"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function NaviDemoEmbed() {
  const [useIframe, setUseIframe] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    setUseIframe(mq.matches);
    const handler = (e: MediaQueryListEvent) => setUseIframe(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const fallbackImage = (
    <div className="nv-demo-embed-fallback">
      <Image
        src="/projects/navi/desktop-screens.png"
        alt="Navi product screens: feed, map search, host detail, and booking flow"
        width={2275}
        height={1517}
        sizes="92vw"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
      <Link href="/work/navi/demo" className="nv-demo-embed-mobile-cta">
        Open the demo
        <span aria-hidden="true"> ↗</span>
      </Link>
    </div>
  );

  return (
    <div className="nv-demo-embed" ref={containerRef}>
      <div className="nv-demo-embed-chrome">
        <div className="nv-demo-embed-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="nv-demo-embed-url">mylesdesignsthings.com/work/navi/demo</p>
      </div>
      <div className="nv-demo-embed-viewport">
        {useIframe && !errored ? (
          <>
            {!loaded && (
              <div className="nv-demo-embed-skeleton" aria-label="Loading demo">
                <div className="nv-demo-embed-skeleton-bar" />
                <div className="nv-demo-embed-skeleton-bar nv-demo-embed-skeleton-bar--short" />
              </div>
            )}
            <iframe
              className="nv-demo-embed-frame"
              src="/work/navi/demo"
              title="Navi interactive demo"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              style={!loaded ? { opacity: 0, position: "absolute" } : undefined}
            />
          </>
        ) : (
          fallbackImage
        )}
      </div>
      <div className="nv-demo-embed-cta">
        <Link href="/work/navi/demo" className="nv-system-cta-link">
          Open full demo in a new tab
          <span aria-hidden="true"> ↗</span>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  evidenceSurfaceData,
  NAVI_DEMO_EVIDENCE_SURFACE,
} from "@/lib/project-evidence";

function subscribeDesktopQuery(callback: () => void) {
  const query = window.matchMedia("(min-width: 900px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  return window.matchMedia("(min-width: 900px)").matches;
}

function getDesktopServerSnapshot() {
  return false;
}

export function NaviDemoEmbed() {
  const useIframe = useSyncExternalStore(
    subscribeDesktopQuery,
    getDesktopSnapshot,
    getDesktopServerSnapshot,
  );
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );

  return (
    <div
      className="nv-demo-embed"
      ref={containerRef}
      {...evidenceSurfaceData(NAVI_DEMO_EVIDENCE_SURFACE)}
    >
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
              <div
                className="nv-demo-embed-skeleton"
                role="status"
                aria-live="polite"
              >
                <span className="sr-only">Loading interactive demo</span>
                <div className="nv-demo-embed-skeleton-bar" />
                <div className="nv-demo-embed-skeleton-bar nv-demo-embed-skeleton-bar--short" />
              </div>
            )}
            <iframe
              className="nv-demo-embed-frame"
              src="/work/navi/demo"
              title="Navi interactive demo"
              loading="lazy"
              tabIndex={loaded ? undefined : -1}
              aria-hidden={loaded ? undefined : true}
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
        <Link
          href="/work/navi/demo"
          className="nv-system-cta-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open full demo in a new tab
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}

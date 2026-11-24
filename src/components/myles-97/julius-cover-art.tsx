"use client";

import { useEffect, useRef } from "react";
import { loadPersistedWorkstation, LOCAL_WORKSTATION_KEY } from "@/lib/myles-97/persistence";
import type { JuliusArtworkId } from "@/lib/myles-97/programs";
import "./julius-cover-art.css";

const artwork = {
  "julius-design-system": {
    file: "system-cover",
    description: "A Julius specimen sheet showing navigation, a dropdown, dialog actions, inputs, selection controls, and progress states.",
    inks: ["base", "letter", "sidebar", "dropdown", "dialog", "fields", "selection", "status"],
  },
} as const;

export function JuliusCoverFace({ project, animated = false }: {
  project: JuliusArtworkId;
  animated?: boolean;
}) {
  const element = useRef<HTMLSpanElement>(null);
  const art = artwork[project];
  const source = "/projects/preview-art/julius/" + art.file;

  useEffect(() => {
    const face = element.current;
    if (!animated || !face || !("IntersectionObserver" in window)) return;
    // Reader routes sit outside the desktop shell that normally carries this setting.
    const syncPreference = () => {
      face.dataset.m97Motion = loadPersistedWorkstation().displayPreferences.reduceMotion ? "reduce" : "full";
    };
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === LOCAL_WORKSTATION_KEY) syncPreference();
    };
    syncPreference();
    window.addEventListener("storage", onStorage);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        face.dataset.entered = "true";
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(face);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", onStorage);
    };
  }, [animated, project]);

  return (
    <span ref={element} className="julius-jacket" data-jacket={project}
      role={animated ? "img" : undefined} aria-label={animated ? art.description : undefined}>
      {/* The same original artwork is used as a static first paint and at rest. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={source + ".webp"} alt="" width="1280" height="720" decoding="async" />
      {animated && (
        <svg className="julius-jacket-inks" viewBox="0 0 1280 720" aria-hidden="true" focusable="false">
          {art.inks.map(ink => <use key={ink} data-ink={ink} href={source + ".svg#" + ink} />)}
        </svg>
      )}
    </span>
  );
}

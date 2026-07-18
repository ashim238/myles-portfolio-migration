"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  TIKTOK_TEMPLATES,
  type TikTokTemplate,
  type TikTokTemplateRegion,
} from "@/lib/tiktok-data";

const TEMPLATE_REGIONS = [
  {
    key: "title",
    label: "Title",
    note: "Typography and placement change with the subculture. Some directions don't use a separate title treatment.",
  },
  {
    key: "catalog",
    label: "Catalog slot",
    note: "Brands add product imagery and catalog details to the fixed slot shown here.",
  },
  {
    key: "supporting",
    label: "Supporting graphics",
    note: "Original frame, texture, and ornament assets appear below when they were available in the source files.",
  },
] as const;

type TemplateRegion = TikTokTemplateRegion;

export function TikTokTemplateSystem() {
  const [selectedKey, setSelectedKey] = useState<
    (typeof TIKTOK_TEMPLATES)[number]["key"]
  >(TIKTOK_TEMPLATES[0].key);
  const [selectedRegion, setSelectedRegion] =
    useState<TemplateRegion>("catalog");
  const selected: TikTokTemplate =
    TIKTOK_TEMPLATES.find((template) => template.key === selectedKey) ??
    TIKTOK_TEMPLATES[0];
  const availableRegions = TEMPLATE_REGIONS.filter(
    ({ key }) =>
      selected.regionOverlays[key] ||
      selected.componentAssets.some((asset) => asset.region === key),
  );
  const activeRegion = availableRegions.some(({ key }) => key === selectedRegion)
    ? selectedRegion
    : "catalog";
  const region =
    TEMPLATE_REGIONS.find((item) => item.key === activeRegion) ??
    TEMPLATE_REGIONS[1];
  const regionOverlay = selected.regionOverlays[activeRegion];
  const originalRegionAssets = selected.componentAssets.filter(
    (asset) => asset.region === activeRegion,
  );

  return (
    <section className="tt-template-system" aria-label="TikTok template system">
      <div
        className="tt-template-contact-sheet"
        role="group"
        aria-label="Choose a template"
      >
        {TIKTOK_TEMPLATES.map((template) => (
          <button
            key={template.key}
            type="button"
            className={`tt-template-choice${
              selected.key === template.key ? " tt-template-choice--selected" : ""
            }`}
            aria-label={`View ${template.name} template${
              template.shipped ? ", shipped" : ""
            }`}
            aria-pressed={selected.key === template.key}
            onClick={() => setSelectedKey(template.key)}
          >
            <span className="tt-template-choice-image" aria-hidden="true">
              <Image
                src={template.fullTemplate}
                alt=""
                width={1080}
                height={1920}
                sizes="(max-width: 720px) 9rem, 20rem"
                loading="lazy"
                fetchPriority="low"
              />
            </span>
            <span className="tt-template-choice-meta">
              <span>{template.name}</span>
              {template.shipped ? (
                <span className="tt-template-shipped">Shipped</span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      <div
        className="tt-template-regions"
        role="group"
        aria-label="Inspect template parts"
      >
        {availableRegions.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={activeRegion === item.key}
            onClick={() => setSelectedRegion(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <figure
        key={selected.key}
        className="tt-template-selected"
        aria-label={`Selected template: ${selected.name}`}
      >
        <div className="tt-template-selected-image">
          <Image
            src={selected.fullTemplate}
            alt={`${selected.name} static Dynamic Showcase Ad template`}
            width={1080}
            height={1920}
            sizes="(max-width: 720px) 17rem, 20rem"
            loading="lazy"
            fetchPriority="low"
          />
          {regionOverlay ? (
            <span
              className="tt-template-region-overlay"
              data-template-region={`${selected.key}-${activeRegion}`}
              style={{
                left: `${regionOverlay.left}%`,
                top: `${regionOverlay.top}%`,
                width: `${regionOverlay.width}%`,
                height: `${regionOverlay.height}%`,
              }}
              aria-hidden="true"
            />
          ) : null}
        </div>
        <figcaption className="tt-template-selected-caption">
          <div>
            <strong>{selected.name}</strong>
            <span>{selected.iterationNote}</span>
          </div>
          <div className="tt-template-region-copy" aria-live="polite">
            <span className="tt-template-region-label">{region.label}</span>
            <p>{region.note}</p>
            {originalRegionAssets.length > 0 ? (
              <div className="tt-template-original-assets">
                {originalRegionAssets.map((asset) => (
                  <figure key={asset.src}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                    <figcaption>{asset.label}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <span className="tt-template-region-source">
                Source-aligned region overlay
              </span>
            )}
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

/* ──────────────────────────────────────────
   Animated TikTok logo
   Cyan/magenta channel separation drift.
   prefers-reduced-motion: static glyph.
   ────────────────────────────────────────── */

const TIKTOK_PATH =
  "M22.5 6.8c-1.6-0.9-2.6-2.5-2.9-4.3h-3.7v15.1c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5c0.4 0 0.7 0.1 1 0.2v-3.8c-0.3-0.04-0.7-0.06-1-0.06-4 0-7.2 3.2-7.2 7.2s3.2 7.2 7.2 7.2 7.2-3.2 7.2-7.2v-7.7c1.4 1 3.2 1.6 5.1 1.6v-3.7c-0.9 0-1.8-0.3-2.2-0.6z";

export function TikTokLogo() {
  return (
    <span className="tt-logo" aria-hidden="true">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g className="tt-logo-cyan">
          <path d={TIKTOK_PATH} />
        </g>
        <g className="tt-logo-magenta">
          <path d={TIKTOK_PATH} />
        </g>
        <g className="tt-logo-ink">
          <path d={TIKTOK_PATH} />
        </g>
      </svg>
    </span>
  );
}

/* ──────────────────────────────────────────
   Cover metaball field
   Rebuilds the gradient cover art as living blobs: each drifts
   and scales on its own loop, merging organically via an SVG goo
   filter. Palette echoes the source PSD. Reduced-motion: the
   blobs hold their base positions (still a full composition).
   ────────────────────────────────────────── */

// Real blobs extracted from the source PSD (visible Layers 27 + 29) by
// connected-component split, so each is the designer's actual crisp art.
// x/y = top-left %, w = width % of the 16:9 art canvas; a = float variant,
// d = loop seconds. Ordered largest-first (paint order = back to front).
const COVER_BLOBS = [
  { f: "b08", x: 42.44, y: 41.15, w: 15.56, a: 1, d: 16 },
  { f: "b14", x: 38.35, y: 34.81, w: 10.52, a: 2, d: 13 },
  { f: "b15", x: 45.81, y: 35.48, w: 9.25, a: 3, d: 18 },
  { f: "b13", x: 49.62, y: 17.74, w: 9.54, a: 4, d: 20 },
  { f: "b05", x: 37.29, y: 37.0, w: 4.9, a: 5, d: 12 },
  { f: "b02", x: 54.52, y: 17.85, w: 5.15, a: 6, d: 15 },
  { f: "b03", x: 48.81, y: 20.22, w: 2.15, a: 2, d: 11 },
  { f: "b04", x: 42.31, y: 32.11, w: 5.08, a: 1, d: 14 },
  { f: "b00", x: 41.77, y: 6.74, w: 3.54, a: 3, d: 10 },
  { f: "b10", x: 69.65, y: 65.0, w: 2.94, a: 4, d: 13 },
  { f: "b06", x: 47.04, y: 37.22, w: 1.71, a: 5, d: 9 },
  { f: "b12", x: 52.0, y: 85.93, w: 1.96, a: 6, d: 12 },
  { f: "b07", x: 29.52, y: 37.67, w: 1.83, a: 1, d: 11 },
  { f: "b01", x: 68.92, y: 15.67, w: 1.71, a: 2, d: 10 },
  { f: "b11", x: 32.21, y: 71.52, w: 1.35, a: 3, d: 13 },
  { f: "b09", x: 63.08, y: 48.56, w: 0.79, a: 4, d: 9 },
] as const;

export function TikTokCoverBlobs(
  _options: { deferUntilVisible?: boolean } = {},
) {
  // Existing cards pass the legacy option. Every instance now defers.
  void _options;
  const fieldRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field || !("IntersectionObserver" in window)) {
      setHasLoaded(true);
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
        if (entry.isIntersecting) setHasLoaded(true);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(field);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setIsDocumentVisible(document.visibilityState !== "hidden");
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const isActive = hasLoaded && isNearViewport && isDocumentVisible;

  return (
    <div
      ref={fieldRef}
      className={`tt-cover-field${isActive ? " tt-cover-field--active" : ""}`}
      aria-hidden="true"
    >
      <div className="tt-cover-cluster">
        {hasLoaded ? COVER_BLOBS.map((b, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={b.f}
            src={`/projects/tiktok/cover-blobs/${b.f}.png`}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className={`tt-cblob tt-cblob--a${b.a}`}
            style={
              {
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.w}%`,
                animationDelay: `${-b.d * 0.5}s`,
                "--d": `${b.d}s`,
                "--tt-preview-delay": `${-(b.d * (0.17 + (index % 7) * 0.11)).toFixed(2)}s`,
                "--tt-preview-x": `${62 + (b.x - 50) * 0.74}%`,
                "--tt-preview-y": `${26 + (b.y - 32) * 0.74}%`,
                "--tt-preview-mobile-x": `${62 + (b.x - 50) * 0.68}%`,
                "--tt-preview-mobile-y": `${24 + (b.y - 32) * 0.7}%`,
              } as CSSProperties
            }
          />
        )) : null}
      </div>
    </div>
  );
}

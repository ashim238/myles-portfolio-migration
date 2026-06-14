"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ExpandableImage } from "@/components/expandable-image";

const BASE = "/projects/understandingfafsa";

type EmailPhoneFrameProps = {
  children: ReactNode;
  tilt?: number;
};

export function EmailPhoneFrame({ children, tilt = 0 }: EmailPhoneFrameProps) {
  return (
    <div
      className="uf-phone"
      style={{ "--uf-phone-tilt": `${tilt}deg` } as React.CSSProperties}
    >
      <div className="uf-phone-bezel">
        <span className="uf-phone-notch" aria-hidden="true" />
        <div className="uf-phone-screen">{children}</div>
      </div>
    </div>
  );
}

const BEFORE_AFTER = [
  {
    src: `${BASE}/mobile-before.jpg`,
    alt: "Old newsletter template on mobile before the redesign.",
    label: "~30% open rate",
    tilt: -2,
  },
  {
    src: `${BASE}/mobile-after.jpg`,
    alt: "Redesigned newsletter on mobile with updated hierarchy and brand system.",
    label: "~52.6% open rate",
    tilt: 2,
  },
] as const;

export function BeforeAfterPhones() {
  return (
    <div className="uf-before-after" aria-label="Newsletter open rate before and after redesign">
      {BEFORE_AFTER.map((item) => (
        <figure key={item.src} className="uf-before-after-item">
          <EmailPhoneFrame tilt={item.tilt}>
            <ExpandableImage
              src={item.src}
              alt={item.alt}
              width={390}
              height={844}
              sizes="(max-width: 768px) 72vw, 220px"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </EmailPhoneFrame>
          <figcaption className="uf-before-after-label">{item.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

const GALLERY_BLOCKS = [
  {
    src: `${BASE}/modular-header.png`,
    alt: "Redesigned newsletter header block with orange brand palette and cap icon.",
    offset: "0%",
    rotate: -0.8,
  },
  {
    src: `${BASE}/modular-students.png`,
    alt: "Student-focused content block with audience segmentation for juniors and seniors.",
    offset: "4%",
    rotate: 0.6,
  },
  {
    src: `${BASE}/modular-best.png`,
    alt: "Curated reading block with trophy icon and branded link styling.",
    offset: "2%",
    rotate: -0.5,
  },
  {
    src: `${BASE}/modular-related.png`,
    alt: "Related reading section with news icon and orange link accents.",
    offset: "5%",
    rotate: 0.9,
  },
  {
    src: `${BASE}/modular-reading.png`,
    alt: "Scholarship and college cost content block with structured bullet points.",
    offset: "1%",
    rotate: -0.4,
  },
  {
    src: `${BASE}/modular-guides.png`,
    alt: "Guide cards section linking to downloadable resources.",
    offset: "3%",
    rotate: 0.7,
  },
  {
    src: `${BASE}/modular-closer.png`,
    alt: "Footer block with subscribe CTA, social links, and The New School branding.",
    offset: "2%",
    rotate: -0.6,
  },
] as const;

export function ModularBlockGallery() {
  return (
    <div className="uf-gallery" aria-label="Modular newsletter block stack">
      {GALLERY_BLOCKS.map((block, index) => (
        <div
          key={block.src}
          className="uf-gallery-card"
          style={
            {
              "--uf-gallery-offset": block.offset,
              "--uf-gallery-rotate": `${block.rotate}deg`,
              "--uf-gallery-index": index,
            } as React.CSSProperties
          }
        >
          <ExpandableImage
            src={block.src}
            alt={block.alt}
            width={600}
            height={400}
            sizes="(max-width: 768px) 92vw, 540px"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
          />
        </div>
      ))}
    </div>
  );
}

type TemplateVariant = "weekly" | "icymi" | "counselor";

const TEMPLATE_VARIANTS: Record<
  TemplateVariant,
  { label: string; image: string; alt: string; descriptor: string }
> = {
  weekly: {
    label: "Weekly",
    image: `${BASE}/shipped-mailchimp.jpg`,
    alt: "Shipped Mailchimp weekly template with full modular kit and emoji section headers.",
    descriptor: "Full modular kit — emoji headers, founder's default send.",
  },
  icymi: {
    label: "ICYMI",
    image: `${BASE}/modular-related.png`,
    alt: "ICYMI variant with fewer blocks for event recaps.",
    descriptor: "Fewer blocks, faster assembly for event recaps.",
  },
  counselor: {
    label: "Counselor",
    image: `${BASE}/modular-students.png`,
    alt: "Counselor toolkit block with duotone icons and formal register.",
    descriptor: "Duotone icons, formal register for counselor audience.",
  },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function TemplateSwitcher() {
  const [variant, setVariant] = useState<TemplateVariant>("weekly");
  const reducedMotion = usePrefersReducedMotion();
  const active = TEMPLATE_VARIANTS[variant];

  return (
    <div className="uf-switcher" aria-label="Newsletter template variants">
      <div className="uf-chip-row" role="group" aria-label="Choose template variant">
        {(Object.keys(TEMPLATE_VARIANTS) as TemplateVariant[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`uf-chip${variant === key ? " uf-chip--active" : ""}`}
            aria-pressed={variant === key}
            onClick={() => setVariant(key)}
          >
            {TEMPLATE_VARIANTS[key].label}
          </button>
        ))}
      </div>
      <div
        className={`uf-switcher-preview${reducedMotion ? " uf-switcher-preview--static" : ""}`}
        key={variant}
      >
        <ExpandableImage
          src={active.image}
          alt={active.alt}
          width={600}
          height={900}
          sizes="(max-width: 768px) 92vw, 540px"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
        />
      </div>
      <p className="uf-switcher-descriptor">{active.descriptor}</p>
    </div>
  );
}

type OverlayMode = "swappable" | "locked";

const SWAPPABLE_ZONES = [
  { top: "14%", left: "62%", width: "28%", height: "14%" },
  { top: "20%", left: "7%", width: "86%", height: "10%" },
  { top: "32%", left: "7%", width: "86%", height: "14%" },
  { top: "48%", left: "7%", width: "86%", height: "20%" },
  { top: "70%", left: "7%", width: "86%", height: "10%" },
  { top: "82%", left: "7%", width: "86%", height: "12%" },
] as const;

const LOCKED_ZONES = [
  { top: "0%", left: "0%", width: "7%", height: "100%" },
  { top: "0%", left: "93%", width: "7%", height: "100%" },
  { top: "0%", left: "0%", width: "100%", height: "11%" },
  { top: "89%", left: "0%", width: "100%", height: "11%" },
  { top: "12%", left: "7%", width: "52%", height: "6%" },
] as const;

export function LockedSwappableToggle() {
  const [mode, setMode] = useState<OverlayMode>("swappable");
  const reducedMotion = usePrefersReducedMotion();
  const zones = mode === "swappable" ? SWAPPABLE_ZONES : LOCKED_ZONES;
  const legend =
    mode === "swappable"
      ? "Founder edits each send — copy, emoji, links."
      : "Structure stays fixed — rails, dividers, type scale, footer skeleton.";

  return (
    <div className="uf-lock-toggle" aria-label="Locked versus swappable module regions">
      <div className="uf-segment-row" role="group" aria-label="Overlay mode">
        {(["swappable", "locked"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={`uf-segment${mode === value ? " uf-segment--active" : ""}`}
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
          >
            {value === "swappable" ? "Swappable" : "Locked"}
          </button>
        ))}
      </div>
      <div
        className={`uf-lock-preview${reducedMotion ? " uf-lock-preview--static" : ""}`}
        data-mode={mode}
      >
        <ExpandableImage
          src={`${BASE}/modular-students.png`}
          alt="Student-focused modular block used to illustrate locked versus swappable regions."
          width={600}
          height={955}
          sizes="(max-width: 768px) 92vw, 540px"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
        />
        <div className="uf-overlay-stack" aria-hidden="true">
          {zones.map((zone, index) => (
            <span
              key={`${mode}-${index}`}
              className="uf-overlay-zone"
              style={{
                top: zone.top,
                left: zone.left,
                width: zone.width,
                height: zone.height,
              }}
            />
          ))}
        </div>
      </div>
      <p className="uf-lock-legend">{legend}</p>
    </div>
  );
}

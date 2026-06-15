"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ExpandableImage } from "@/components/expandable-image";
import { UF_ASSETS } from "@/lib/understandingfafsa-assets";

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

type EmailPhoneFrameProps = {
  children: ReactNode;
  tilt?: number;
  scrollable?: boolean;
};

export function EmailPhoneFrame({
  children,
  tilt = 0,
  scrollable = false,
}: EmailPhoneFrameProps) {
  return (
    <div
      className="uf-phone"
      style={{ "--uf-phone-tilt": `${tilt}deg` } as React.CSSProperties}
    >
      <div className="uf-phone-bezel">
        <span className="uf-phone-notch" aria-hidden="true" />
        <div className={`uf-phone-screen${scrollable ? " uf-phone-screen--scroll" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

const BEFORE_AFTER = [
  {
    asset: UF_ASSETS.mobileBefore,
    alt: "Old newsletter template on mobile before the redesign, full scroll.",
    label: "Before · ~30% open rate",
    tilt: -2,
  },
  {
    asset: UF_ASSETS.mobileAfter,
    alt: "Redesigned newsletter on mobile with updated hierarchy and brand system, full scroll.",
    label: "After · ~52.6% open rate",
    tilt: 2,
  },
] as const;

export function BeforeAfterPhones() {
  return (
    <div className="uf-before-after" aria-label="Newsletter open rate before and after redesign">
      {BEFORE_AFTER.map((item) => (
        <figure key={item.label} className="uf-before-after-item">
          <EmailPhoneFrame tilt={item.tilt} scrollable>
            <ExpandableImage
              src={item.asset.src}
              alt={item.alt}
              width={item.asset.width}
              height={item.asset.height}
              sizes="(max-width: 768px) 72vw, 240px"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </EmailPhoneFrame>
          <figcaption className="uf-before-after-label">{item.label}</figcaption>
          <p className="uf-before-after-hint">Scroll inside the frame to read the full send.</p>
        </figure>
      ))}
    </div>
  );
}

const GALLERY_BLOCKS = [
  {
    asset: UF_ASSETS.modular.header,
    alt: "Newsletter header block with FAFSA banner, wave divider, and brand lockup.",
    offset: "0%",
    rotate: -0.8,
  },
  {
    asset: UF_ASSETS.modular.reading,
    alt: "Lead story block on college costs with emoji header and structured bullets.",
    offset: "3%",
    rotate: 0.5,
  },
  {
    asset: UF_ASSETS.modular.related,
    alt: "Related reading section with news icon and orange link accents.",
    offset: "5%",
    rotate: 0.9,
  },
  {
    asset: UF_ASSETS.modular.best,
    alt: "Curated reading block with trophy icon and branded link styling.",
    offset: "2%",
    rotate: -0.5,
  },
  {
    asset: UF_ASSETS.modular.students,
    alt: "Student-focused content block with audience segmentation for juniors and seniors.",
    offset: "4%",
    rotate: 0.6,
  },
  {
    asset: UF_ASSETS.modular.guides,
    alt: "Guide cards section linking to downloadable resources.",
    offset: "3%",
    rotate: 0.7,
  },
  {
    asset: UF_ASSETS.modular.closer,
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
          key={block.asset.src}
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
            src={block.asset.src}
            alt={block.alt}
            width={block.asset.width}
            height={block.asset.height}
            sizes="(max-width: 768px) 92vw, 540px"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
          />
        </div>
      ))}
    </div>
  );
}

type TemplateVariant = "weekly" | "event";

type TemplateMeta = {
  label: string;
  asset: typeof UF_ASSETS.templateWeekly | typeof UF_ASSETS.templateEvent;
  alt: string;
  descriptor: string;
};

const TEMPLATE_VARIANTS: Record<TemplateVariant, TemplateMeta> = {
  weekly: {
    label: "Weekly",
    asset: UF_ASSETS.templateWeekly,
    alt: "Full weekly newsletter. Modular kit with emoji section headers and color theme variants.",
    descriptor: "Default send. Full modular kit assembled each week.",
  },
  event: {
    label: "Event",
    asset: UF_ASSETS.templateEvent,
    alt: "Event-specific newsletter. Fewer blocks, faster assembly for invites and recaps.",
    descriptor: "Event-specific send. RSVP-focused layout on the same system.",
  },
};

export function TemplateSwitcher() {
  const [variant, setVariant] = useState<TemplateVariant>("weekly");
  const reducedMotion = usePrefersReducedMotion();
  const active = TEMPLATE_VARIANTS[variant];
  const isTall = active.asset.height / active.asset.width >= 3;

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
        className={`uf-switcher-preview${reducedMotion ? " uf-switcher-preview--static" : ""}${isTall ? " uf-switcher-preview--scroll" : ""}`}
        key={variant}
      >
        <ExpandableImage
          src={active.asset.src}
          alt={active.alt}
          width={active.asset.width}
          height={active.asset.height}
          sizes="(max-width: 768px) 92vw, 540px"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
        />
      </div>
      <p className="uf-switcher-descriptor">{active.descriptor}</p>
      <p className="uf-switcher-note">
        {isTall
          ? "Scroll inside the frame to read the full send. Click to expand."
          : "Counselor toolkit ships on the same framework. In progress, not live yet."}
      </p>
    </div>
  );
}

type LockSwapFocus = "both" | "swappable" | "locked";

// Regions in the base-image coordinate system (viewBox 0 0 600 955 =
// modular-students.png at 0.25 scale). Pixel-measured from the PNG: content
// bands by ink density, the locked frame by the content/padding extent.
const LOCK_SWAP_SWAPPABLE = [
  { x: 39, y: 107, w: 517, h: 80 }, // "Listen up!" headline + megaphone
  { x: 38, y: 223, w: 502, h: 116 }, // "Hi there juniors," + body
  { x: 267, y: 366, w: 295, h: 166 }, // juniors link list
  { x: 38, y: 559, w: 441, h: 112 }, // "Seniors," + body
  { x: 267, y: 702, w: 295, h: 129 }, // seniors link list
];
const LOCK_SWAP_FRAME = { x: 6, y: 6, w: 588, h: 943 }; // wave dividers + padding rails

export function LockedSwappableView() {
  const [focus, setFocus] = useState<LockSwapFocus>("both");
  const reducedMotion = usePrefersReducedMotion();
  const base = UF_ASSETS.lockedSwappableBase;

  const swapOpacity = focus === "locked" ? 0.12 : 1;
  const lockOpacity = focus === "swappable" ? 0.12 : 1;
  const layerTransition = reducedMotion ? undefined : "opacity 240ms ease";

  return (
    <div className="uf-lock-toggle" aria-label="Locked structure and swappable content, shown together">
      <div className="uf-segment-row" role="group" aria-label="Annotation focus">
        {(["both", "swappable", "locked"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={`uf-segment${focus === value ? " uf-segment--active" : ""}`}
            aria-pressed={focus === value}
            onClick={() => setFocus(value)}
          >
            {value === "both" ? "Both" : value === "swappable" ? "Swappable" : "Locked"}
          </button>
        ))}
      </div>
      <p className="uf-lock-hint">Pick a layer to isolate it; the other dims back.</p>
      <span className="sr-only" aria-live="polite">
        {focus === "both"
          ? "Showing both layers: swappable content and the locked frame."
          : focus === "swappable"
            ? "Showing swappable content regions only."
            : "Showing the locked structural frame only."}
      </span>

      <div className="uf-lock-stage">
        <ExpandableImage
          src={base.src}
          alt="Students block with the locked structural frame and swappable content regions marked together."
          width={base.width}
          height={base.height}
          sizes="(max-width: 768px) 92vw, 540px"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <svg
          className="uf-lock-overlay"
          viewBox="0 0 600 955"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g style={{ opacity: lockOpacity, transition: layerTransition }}>
            <rect
              x={LOCK_SWAP_FRAME.x}
              y={LOCK_SWAP_FRAME.y}
              width={LOCK_SWAP_FRAME.w}
              height={LOCK_SWAP_FRAME.h}
              rx={10}
              fill="none"
              stroke="#164f73"
              strokeWidth={3}
              strokeDasharray="10 7"
            />
            <g transform="translate(14 14)">
              <rect width={84} height={26} rx={4} fill="#164f73" />
              <text x={42} y={18} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={600}>
                Locked
              </text>
            </g>
          </g>
          <g style={{ opacity: swapOpacity, transition: layerTransition }}>
            {LOCK_SWAP_SWAPPABLE.map((r, i) => (
              <rect
                key={i}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={8}
                fill="rgba(242, 105, 56, 0.10)"
                stroke="#f26938"
                strokeWidth={3}
              />
            ))}
            <g transform="translate(44 392)">
              <rect width={132} height={26} rx={4} fill="#f26938" />
              <text x={66} y={18} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={600}>
                Swappable
              </text>
            </g>
          </g>
        </svg>
      </div>

      <ul className="uf-lock-legend" role="list">
        <li>
          <span className="uf-lock-key uf-lock-key--swap" aria-hidden="true" />
          <span>
            <strong>Swappable</strong>: editors change each send (headlines, body copy, emoji icons,
            article links).
          </span>
        </li>
        <li>
          <span className="uf-lock-key uf-lock-key--lock" aria-hidden="true" />
          <span>
            <strong>Locked</strong>: structure holds every send (wave dividers, padding rails,
            section rhythm, footer skeleton).
          </span>
        </li>
      </ul>
    </div>
  );
}

export function FigmaMailchimpPair() {
  const figma = UF_ASSETS.figmaSection;
  const mailchimp = UF_ASSETS.mailchimpSection;

  return (
    <div className="uf-figma-pair">
      <figure className="uf-figma-figure">
        <ExpandableImage
          src={figma.src}
          alt="Figma: students block with layout guides, spacing rails, and type hierarchy."
          width={figma.width}
          height={figma.height}
          sizes="(max-width: 768px) 92vw, 44vw"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
        />
        <figcaption>Figma: students block (design source)</figcaption>
      </figure>
      <figure className="uf-figma-figure">
        <ExpandableImage
          src={mailchimp.src}
          alt="Mailchimp: same students block after translation into editable modules."
          width={mailchimp.width}
          height={mailchimp.height}
          sizes="(max-width: 768px) 92vw, 44vw"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
        />
        <figcaption>Mailchimp: students block (shipped module)</figcaption>
      </figure>
    </div>
  );
}

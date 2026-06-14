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

/** Prefer `primary` when it loads; otherwise use `fallback`. */
function useResolvedAsset(primary: string, fallback: string) {
  const [src, setSrc] = useState(primary);

  useEffect(() => {
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (!cancelled) setSrc(primary);
    };
    probe.onerror = () => {
      if (!cancelled) setSrc(fallback);
    };
    probe.src = primary;
    return () => {
      cancelled = true;
    };
  }, [primary, fallback]);

  return src;
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
    src: UF_ASSETS.mobileBefore,
    alt: "Old newsletter template on mobile before the redesign — full scroll.",
    label: "Before · ~30% open rate",
    tilt: -2,
    width: 390,
    height: 4200,
  },
  {
    src: UF_ASSETS.mobileAfter,
    alt: "Redesigned newsletter on mobile with updated hierarchy and brand system — full scroll.",
    label: "After · ~52.6% open rate",
    tilt: 2,
    width: 390,
    height: 4200,
  },
] as const;

export function BeforeAfterPhones() {
  return (
    <div className="uf-before-after" aria-label="Newsletter open rate before and after redesign">
      {BEFORE_AFTER.map((item) => (
        <figure key={item.label} className="uf-before-after-item">
          <EmailPhoneFrame tilt={item.tilt} scrollable>
            <ExpandableImage
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 768px) 72vw, 240px"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
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
    src: UF_ASSETS.modular.header,
    alt: "Newsletter header block with FAFSA banner, wave divider, and brand lockup.",
    offset: "0%",
    rotate: -0.8,
  },
  {
    src: UF_ASSETS.modular.reading,
    alt: "Lead story block on college costs with emoji header and structured bullets.",
    offset: "3%",
    rotate: 0.5,
  },
  {
    src: UF_ASSETS.modular.related,
    alt: "Related reading section with news icon and orange link accents.",
    offset: "5%",
    rotate: 0.9,
  },
  {
    src: UF_ASSETS.modular.best,
    alt: "Curated reading block with trophy icon and branded link styling.",
    offset: "2%",
    rotate: -0.5,
  },
  {
    src: UF_ASSETS.modular.students,
    alt: "Student-focused content block with audience segmentation for juniors and seniors.",
    offset: "4%",
    rotate: 0.6,
  },
  {
    src: UF_ASSETS.modular.guides,
    alt: "Guide cards section linking to downloadable resources.",
    offset: "3%",
    rotate: 0.7,
  },
  {
    src: UF_ASSETS.modular.closer,
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

type TemplateVariant = "weekly" | "event";

const TEMPLATE_VARIANTS: Record<
  TemplateVariant,
  { label: string; image: string; alt: string; descriptor: string }
> = {
  weekly: {
    label: "Weekly",
    image: UF_ASSETS.templateWeekly,
    alt: "Full weekly newsletter — modular kit with emoji section headers and color theme variants.",
    descriptor: "Default send — full modular kit assembled each week.",
  },
  event: {
    label: "Event",
    image: UF_ASSETS.templateEvent,
    alt: "Event-specific newsletter — fewer blocks, faster assembly for invites and recaps.",
    descriptor: "Event-specific send — RSVP-focused layout on the same system.",
  },
};

export function TemplateSwitcher() {
  const [variant, setVariant] = useState<TemplateVariant>("weekly");
  const reducedMotion = usePrefersReducedMotion();
  const active = TEMPLATE_VARIANTS[variant];
  const fallback =
    variant === "weekly" ? UF_ASSETS.mobileAfter : UF_ASSETS.templateWeekly;
  const resolvedSrc = useResolvedAsset(active.image, fallback);

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
          src={resolvedSrc}
          alt={active.alt}
          width={390}
          height={4200}
          sizes="(max-width: 768px) 92vw, 540px"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
        />
      </div>
      <p className="uf-switcher-descriptor">{active.descriptor}</p>
      <p className="uf-switcher-note">
        Counselor toolkit ships on the same framework — in progress, not live yet.
      </p>
    </div>
  );
}

type OverlayMode = "swappable" | "locked";

export function LockedSwappableToggle() {
  const [mode, setMode] = useState<OverlayMode>("swappable");
  const reducedMotion = usePrefersReducedMotion();

  const primary =
    mode === "swappable"
      ? UF_ASSETS.lockedSwappableSwappable
      : UF_ASSETS.lockedSwappableLocked;
  const displaySrc = useResolvedAsset(primary, UF_ASSETS.lockedSwappableBase);

  const legend =
    mode === "swappable"
      ? "Founder edits each send — headlines, body copy, emoji icons, and article links."
      : "Structure stays fixed — wave dividers, padding rails, section rhythm, and footer skeleton.";

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
          src={displaySrc}
          alt={`Students block — ${mode} regions highlighted.`}
          width={600}
          height={955}
          sizes="(max-width: 768px) 92vw, 540px"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
        />
      </div>
      <p className="uf-lock-legend">{legend}</p>
    </div>
  );
}

export function FigmaMailchimpPair() {
  const figmaSrc = useResolvedAsset(
    UF_ASSETS.figmaSectionStudents,
    UF_ASSETS.figmaSectionStudents,
  );
  const mailchimpSrc = useResolvedAsset(
    UF_ASSETS.mailchimpSectionStudents,
    UF_ASSETS.modular.students,
  );

  return (
    <div className="uf-figma-pair">
      <figure className="uf-figma-figure">
        <ExpandableImage
          src={figmaSrc}
          alt="Figma — students block with layout guides, spacing rails, and type hierarchy."
          width={600}
          height={955}
          sizes="(max-width: 768px) 92vw, 44vw"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
        />
        <figcaption>Figma — students block (design source)</figcaption>
      </figure>
      <figure className="uf-figma-figure">
        <ExpandableImage
          src={mailchimpSrc}
          alt="Mailchimp — same students block after translation into editable modules."
          width={600}
          height={955}
          sizes="(max-width: 768px) 92vw, 44vw"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
        />
        <figcaption>Mailchimp — students block (shipped module)</figcaption>
      </figure>
    </div>
  );
}

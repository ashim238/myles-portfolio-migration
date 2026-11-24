"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import { CommandIcon } from "@/components/myles-97/command-icon";
import { useLightbox } from "@/components/lightbox-provider";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { Exhibit, ExhibitItem } from "./julius-study-types";
import "./julius-exhibit.css";

type Dimensions = Record<string, { width: number; height: number }>;
type ImageSource = Pick<ExhibitItem, "src" | "mobileSrc" | "alt">;

function ExhibitImage({
  source, dimensions, priority, title,
}: {
  source: ImageSource;
  dimensions: Dimensions;
  priority: boolean;
  title: string;
}) {
  const image = useRef<HTMLImageElement>(null);
  const { openLightbox } = useLightbox();
  const desktopSize = dimensions[source.src];
  const mobileSize = source.mobileSrc ? dimensions[source.mobileSrc] : undefined;

  return (
    <button
      className="julius-picture"
      type="button"
      aria-label={`Enlarge ${title}. ${source.alt}`}
      onClick={(event) => {
        const node = image.current;
        if (!node) return;
        const path = node.currentSrc
          ? new URL(node.currentSrc, window.location.href).pathname
          : source.src;
        const size = dimensions[path] ?? { width: node.naturalWidth, height: node.naturalHeight };
        if (!size.width || !size.height) return;
        // Safari doesn't always focus a button activated by a pointer.
        event.currentTarget.focus({ preventScroll: true });
        openLightbox(path, source.alt, size.width, size.height, { unoptimized: true });
      }}
    >
      <picture>
        {source.mobileSrc && (
          <source
            media="(max-width: 600px)"
            srcSet={source.mobileSrc}
            width={mobileSize?.width}
            height={mobileSize?.height}
          />
        )}
        {/* Keep the archival pixels and let picture select the authored phone crop. */}
        <img
          key={source.src}
          ref={image}
          src={source.src}
          alt={source.alt}
          width={desktopSize?.width}
          height={desktopSize?.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </picture>
      <span className="julius-picture-action" aria-hidden="true">
        <CommandIcon name="enlarge" size={13} /> Enlarge
      </span>
    </button>
  );
}

function Choices({
  label, options, value, onChange, panel, compact = false,
}: {
  label: string;
  options: readonly string[];
  value: number;
  onChange: (index: number) => void;
  panel: string;
  compact?: boolean;
}) {
  return (
    <div
      className={compact ? "julius-options julius-options--compact" : "julius-options"}
      role="group"
      aria-label={label}
    >
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          className="reader-control"
          aria-controls={panel}
          aria-pressed={index === value}
          onClick={() => onChange(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

const phoneQuery = "(max-width: 600px)";
function watchPhoneWidth(onChange: () => void) {
  const media = window.matchMedia(phoneQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function ExhibitRecording({ exhibit, dimensions, captionId }: {
  exhibit: Extract<Exhibit, { kind: "video" }>;
  dimensions: Dimensions;
  captionId: string;
}) {
  const phone = useSyncExternalStore(watchPhoneWidth, () => window.matchMedia(phoneQuery).matches, () => false);
  const recording = phone && exhibit.phoneRecording ? exhibit.phoneRecording : exhibit;
  const size = dimensions[recording.poster];
  return (
    <video
      key={recording.src}
      className="julius-recording"
      src={recording.src}
      poster={recording.poster}
      width={size?.width} height={size?.height}
      controls playsInline preload="none"
      aria-label={exhibit.title} aria-describedby={captionId}
    >
      <a href={recording.src}>Open the recording</a>
    </video>
  );
}

export function JuliusExhibit({
  exhibit, priority = false, dimensions = {},
}: {
  exhibit: Exhibit;
  priority?: boolean;
  dimensions?: Dimensions;
}) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const [phone, setPhone] = useState(false);
  const [motionView, setMotionView] = useState<"recording" | "stills" | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const isVideo = exhibit.kind === "video";
  const phoneItems = exhibit.kind === "compare" ? exhibit.phoneItems : undefined;
  const stills = isVideo ? exhibit.stills : undefined;
  const showStills = Boolean(stills?.length && (motionView === "stills" || (motionView === null && reducedMotion)));

  const options = exhibit.kind === "compare"
    ? ((phone && phoneItems?.length) ? phoneItems : exhibit.items)
    : (showStills ? stills : undefined);
  const index = options?.length ? Math.min(selected, options.length - 1) : 0;
  const item = options?.[index];
  const source = exhibit.kind === "image" ? exhibit : item;
  const caption = item?.caption ?? (exhibit.kind !== "compare" ? exhibit.caption : "");
  const titleId = `${id}-title`;
  const captionId = `${id}-caption`;
  const imagePanelId = `${id}-panel`;

  return (
    <figure className="julius-exhibit" aria-labelledby={titleId} data-exhibit-kind={exhibit.kind}>
      <div className="julius-exhibit-heading">
        <h3 id={titleId}>{exhibit.title}</h3>
        {phoneItems && phoneItems.length > 0 && (
          <Choices
            compact label="Comparison viewport" options={["Desktop", "Phone"]}
            value={phone ? 1 : 0} onChange={(choice) => setPhone(choice === 1)} panel={imagePanelId}
          />
        )}
        {stills && stills.length > 0 && (
          <Choices
            compact label="View the sequence" options={["Recording", "Stills"]}
            value={showStills ? 1 : 0}
            onChange={(choice) => setMotionView(choice === 0 ? "recording" : "stills")}
            panel={imagePanelId}
          />
        )}
      </div>
      {options && options.length > 1 && (
        <Choices
          label={exhibit.title}
          options={options.map((option) => option.label)}
          value={index} onChange={setSelected} panel={imagePanelId}
        />
      )}
      <div id={imagePanelId} className="julius-exhibit-panel" data-dialog-comparison={phoneItems?.length ? true : undefined}>
        {isVideo && !showStills ? (
          <ExhibitRecording exhibit={exhibit} dimensions={dimensions} captionId={captionId} />
        ) : source ? (
          <ExhibitImage
            title={item?.label ?? exhibit.title}
            source={source} dimensions={dimensions} priority={priority}
          />
        ) : null}
      </div>
      <figcaption id={captionId} className={source ? "julius-caption julius-caption--image" : "julius-caption"}>
        <span aria-live={exhibit.kind === "image" ? undefined : "polite"} aria-atomic="true">{caption}</span>
        {exhibit.kind === "image" && exhibit.link && (
          <a href={exhibit.link.href} className="julius-source-link" target="_blank" rel="noopener noreferrer">
            <span>{exhibit.link.label} in a new tab</span>
            <CommandIcon name="external" />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

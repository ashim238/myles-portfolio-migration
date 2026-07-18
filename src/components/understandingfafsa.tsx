"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { ExpandableImage } from "@/components/expandable-image";
import {
  UF_ASSETS,
  type UfAsset,
  type UfTiledAsset,
} from "@/lib/understandingfafsa-assets";

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

function isTiledAsset(asset: UfAsset | UfTiledAsset): asset is UfTiledAsset {
  return "tiles" in asset;
}

function CaptureImage({
  asset,
  alt,
  sizes,
}: {
  asset: UfAsset | UfTiledAsset;
  alt: string;
  sizes: string;
}) {
  if (!isTiledAsset(asset)) {
    return (
      <ExpandableImage
        src={asset.src}
        alt={alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: "0.35rem",
        }}
      />
    );
  }

  return (
    <div
      className="uf-tiled-capture"
      role="img"
      aria-label={alt}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {asset.tiles.map((tile) => (
        <Image
          key={tile.src}
          src={tile.src}
          alt=""
          width={tile.width}
          height={tile.height}
          sizes={sizes}
          loading="lazy"
          fetchPriority="low"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      ))}
    </div>
  );
}

type EmailPhoneFrameProps = {
  children: ReactNode;
  tilt?: number;
  scrollable?: boolean;
  scrollLabel?: string;
};

export function EmailPhoneFrame({
  children,
  tilt = 0,
  scrollable = false,
  scrollLabel,
}: EmailPhoneFrameProps) {
  return (
    <div
      className="uf-phone"
      style={{ "--uf-phone-tilt": `${tilt}deg` } as React.CSSProperties}
    >
      <div className="uf-phone-bezel">
        <span className="uf-phone-notch" aria-hidden="true" />
        <div
          className={`uf-phone-screen${scrollable ? " uf-phone-screen--scroll" : ""}`}
          role={scrollable ? "region" : undefined}
          tabIndex={scrollable ? 0 : undefined}
          aria-label={scrollable ? scrollLabel : undefined}
        >
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
    label: "Prior sends · around 30% open rate",
    originalLabel: "prior newsletter",
    tilt: -2,
  },
  {
    asset: UF_ASSETS.mobileAfter,
    alt: "Redesigned newsletter on mobile with updated hierarchy and brand system, full scroll.",
    label: "First redesigned send · ~52.6% open rate (MPP excluded)",
    originalLabel: "redesigned newsletter",
    tilt: 2,
  },
] as const;

export function BeforeAfterPhones() {
  return (
    <div
      className="uf-before-after"
      aria-label="Newsletter mobile layouts and reported open rates"
    >
      {BEFORE_AFTER.map((item) => (
        <figure key={item.label} className="uf-before-after-item">
          <EmailPhoneFrame
            tilt={item.tilt}
            scrollable
            scrollLabel={`${item.label}. Scrollable full newsletter.`}
          >
            <CaptureImage
              asset={item.asset}
              alt={item.alt}
              sizes="(max-width: 768px) 72vw, 240px"
            />
          </EmailPhoneFrame>
          <figcaption className="uf-before-after-label">{item.label}</figcaption>
          <p className="uf-before-after-hint">Scroll inside the frame to read the full send.</p>
          <a
            href={item.asset.originalSrc}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open original ${item.originalLabel} capture`}
          >
            Open original capture <span aria-hidden="true">↗</span>
          </a>
        </figure>
      ))}
      <p className="uf-before-after-evidence-note">
        Reported open rates are shown for context. This was not a controlled attribution test.
      </p>
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

/* ── Newsletter composer ─────────────────────────────── */

type ComposerBlockId =
  | "header"
  | "reading"
  | "related"
  | "best"
  | "students"
  | "guides"
  | "closer";

const PINNED_TOP: ComposerBlockId = "header";
const PINNED_BOTTOM: ComposerBlockId = "closer";
const SWAPPABLE_IDS: ComposerBlockId[] = ["reading", "related", "best", "students", "guides"];

type ComposerBlock = {
  id: ComposerBlockId;
  name: string;
  role: string;
  asset: UfAsset;
  alt: string;
  approxKb: number;
};

// Same seven modules as ModularBlockGallery. Sizes are directional estimates
// tuned to what actually landed in the send: header + reading are heaviest.
const COMPOSER_BLOCKS: readonly ComposerBlock[] = [
  { id: "header", name: "Header", role: "Banner + brand lockup", asset: UF_ASSETS.modular.header, alt: "Newsletter header block: FAFSA banner, wave divider, brand lockup.", approxKb: 24 },
  { id: "reading", name: "Lead story", role: "Emoji header + bullets", asset: UF_ASSETS.modular.reading, alt: "Lead story block: emoji header, structured bullets, orange link accents.", approxKb: 30 },
  { id: "related", name: "Related reading", role: "News icon + links", asset: UF_ASSETS.modular.related, alt: "Related reading block: news icon, orange link accents.", approxKb: 18 },
  { id: "best", name: "Editor's picks", role: "Trophy icon + links", asset: UF_ASSETS.modular.best, alt: "Curated reading block: trophy icon, branded link styling.", approxKb: 20 },
  { id: "students", name: "Students split", role: "Juniors + seniors", asset: UF_ASSETS.modular.students, alt: "Students block: juniors + seniors segmented link lists.", approxKb: 22 },
  { id: "guides", name: "Guides", role: "Downloadable cards", asset: UF_ASSETS.modular.guides, alt: "Guide cards section linking to downloadable resources.", approxKb: 26 },
  { id: "closer", name: "Footer", role: "CTA + social + credit", asset: UF_ASSETS.modular.closer, alt: "Footer block: subscribe CTA, social links, and The New School credit.", approxKb: 16 },
] as const;

const COMPOSER_DEFAULT: ComposerBlockId[] = ["reading", "guides"];
const COMPOSER_KB_CEILING = 102;

function makeInstanceId(id: ComposerBlockId): string {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 6)
    : Math.floor(Math.random() * 1e6).toString(36);
  return `${id}-${rand}`;
}

type ComposerRow = { key: string; id: ComposerBlockId };

function seedRows(order: ComposerBlockId[]): ComposerRow[] {
  return order.map((id) => ({ key: makeInstanceId(id), id }));
}

export function NewsletterComposer() {
  const [rows, setRows] = useState<ComposerRow[]>(() => seedRows(COMPOSER_DEFAULT));
  const [announcement, setAnnouncement] = useState("");
  const [justAddedKey, setJustAddedKey] = useState<string | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const blockMap = useMemo(() => {
    const m = new Map<ComposerBlockId, ComposerBlock>();
    COMPOSER_BLOCKS.forEach((b) => m.set(b.id, b));
    return m;
  }, []);

  const pinnedTopBlock = blockMap.get(PINNED_TOP)!;
  const pinnedBottomBlock = blockMap.get(PINNED_BOTTOM)!;
  const pinnedKb = pinnedTopBlock.approxKb + pinnedBottomBlock.approxKb;
  const totalKb = pinnedKb + rows.reduce((sum, r) => sum + (blockMap.get(r.id)?.approxKb ?? 0), 0);
  const totalBlockCount = rows.length + 2;
  const overCeiling = totalKb > COMPOSER_KB_CEILING;

  const addBlock = useCallback((id: ComposerBlockId) => {
    const block = COMPOSER_BLOCKS.find((candidate) => candidate.id === id);
    setAnnouncement(
      `Added ${block?.name ?? "newsletter"} block to the end of the send. ${totalBlockCount + 1} blocks total.`,
    );
    setRows((prev) => {
      const row = { key: makeInstanceId(id), id };
      setJustAddedKey(row.key);
      return [...prev, row];
    });
  }, [totalBlockCount]);

  const removeRow = useCallback((key: string, name: string) => {
    setAnnouncement(
      `Removed ${name} block. ${totalBlockCount - 1} blocks remain.`,
    );
    setRows((prev) => prev.filter((r) => r.key !== key));
  }, [totalBlockCount]);

  const moveRow = useCallback((key: string, delta: -1 | 1, name: string, index: number) => {
    const direction = delta === -1 ? "up" : "down";
    const nextPosition = index + delta + 2;
    setAnnouncement(
      `Moved ${name} ${direction}. Position ${nextPosition} of ${totalBlockCount}.`,
    );
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.key === key);
      const next = idx + delta;
      if (idx < 0 || next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const [taken] = copy.splice(idx, 1);
      copy.splice(next, 0, taken);
      return copy;
    });
  }, [totalBlockCount]);

  const randomize = useCallback(() => {
    setAnnouncement(`Randomized ${rows.length} swappable blocks.`);
    setRows((prev) => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  }, [rows.length]);

  const reset = useCallback(() => {
    setAnnouncement(`Reset the send to ${COMPOSER_DEFAULT.length + 2} blocks.`);
    setRows(seedRows(COMPOSER_DEFAULT));
  }, []);

  useEffect(() => {
    if (!justAddedKey) return;
    const t = setTimeout(() => setJustAddedKey(null), 520);
    return () => clearTimeout(t);
  }, [justAddedKey]);

  const onDragStart = (key: string) => (e: React.DragEvent<HTMLDivElement>) => {
    setDragKey(key);
    e.dataTransfer.effectAllowed = "move";
    // Firefox requires setData for drag to fire.
    e.dataTransfer.setData("text/plain", key);
  };

  const onDragOver = (key: string) => (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragKey || dragKey === key) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverKey !== key) setDragOverKey(key);
  };

  const onDragLeave = (key: string) => () => {
    if (dragOverKey === key) setDragOverKey(null);
  };

  const onDrop = (targetKey: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragKey || dragKey === targetKey) {
      setDragKey(null);
      setDragOverKey(null);
      return;
    }
    const draggedRow = rows.find((row) => row.key === dragKey);
    const targetIndex = rows.findIndex((row) => row.key === targetKey);
    const draggedBlock = draggedRow ? blockMap.get(draggedRow.id) : undefined;
    if (draggedBlock && targetIndex >= 0) {
      setAnnouncement(
        `Moved ${draggedBlock.name}. Position ${targetIndex + 2} of ${totalBlockCount}.`,
      );
    }
    setRows((prev) => {
      const from = prev.findIndex((r) => r.key === dragKey);
      const to = prev.findIndex((r) => r.key === targetKey);
      if (from < 0 || to < 0) return prev;
      const copy = [...prev];
      const [taken] = copy.splice(from, 1);
      copy.splice(to, 0, taken);
      return copy;
    });
    setDragKey(null);
    setDragOverKey(null);
  };

  const onDragEnd = () => {
    setDragKey(null);
    setDragOverKey(null);
  };

  return (
    <div
      className="uf-composer"
      role="region"
      aria-label="Interactive newsletter composer"
    >
      <header className="uf-composer-toolbar">
        <div className="uf-composer-toolbar-title">
          <p className="uf-composer-eyebrow">Try it: assemble a send</p>
          <p className="uf-composer-help">
            Header and footer stay locked. Add middle blocks from the shelf, drag to reorder, or use
            the arrows. The exercise mirrors the system&apos;s locked and swappable rules.
          </p>
        </div>
        <div className="uf-composer-toolbar-actions" role="group" aria-label="Composer actions">
          <button
            type="button"
            className="uf-composer-btn uf-composer-btn--randomize"
            onClick={randomize}
            disabled={rows.length < 2}
          >
            Randomize
          </button>
          <button type="button" className="uf-composer-btn" onClick={reset}>
            Reset
          </button>
        </div>
      </header>

      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>

      <div className="uf-composer-layout">
        <section className="uf-composer-shelf" aria-label="Available blocks">
          <h3 className="uf-composer-heading">Block shelf</h3>
          <ul className="uf-composer-shelf-list" role="list">
            {COMPOSER_BLOCKS.filter((b) => SWAPPABLE_IDS.includes(b.id)).map((b) => {
              const usedCount = rows.filter((r) => r.id === b.id).length;
              return (
                <li key={b.id} className="uf-composer-shelf-item">
                  <button
                    type="button"
                    className="uf-composer-shelf-btn"
                    onClick={() => addBlock(b.id)}
                    aria-label={`Add ${b.name} block. ${usedCount > 0 ? `In send: ${usedCount}.` : ""}`}
                  >
                    <span className="uf-composer-shelf-thumb" aria-hidden="true">
                      <Image
                        src={b.asset.src}
                        alt=""
                        width={120}
                        height={Math.round((120 * b.asset.height) / b.asset.width)}
                        sizes="120px"
                      />
                    </span>
                    <span className="uf-composer-shelf-meta">
                      <span className="uf-composer-shelf-name">{b.name}</span>
                      <span className="uf-composer-shelf-role">{b.role}</span>
                    </span>
                    <span className="uf-composer-shelf-add" aria-hidden="true">
                      {usedCount > 0 ? `+${usedCount}` : "+"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="uf-composer-preview" aria-label="Assembled send">
          <div className="uf-composer-preview-head">
            <h3 className="uf-composer-heading">Your send</h3>
            <p className={`uf-composer-weight${overCeiling ? " uf-composer-weight--over" : ""}`}>
              <span>Illustrative estimate: {totalBlockCount} block{totalBlockCount === 1 ? "" : "s"}</span>
              <span aria-hidden="true"> · </span>
              <span>~{totalKb} KB</span>
              <span aria-hidden="true"> · </span>
              <span>102 KB Gmail clipping threshold</span>
            </p>
          </div>

          <div className="uf-composer-canvas">
            <div className="uf-composer-pinned" aria-label={`${pinnedTopBlock.name} (locked)`}>
              <div className="uf-composer-pinned-body">
                <span className="uf-composer-pinned-lock" aria-hidden="true">
                  <svg viewBox="0 0 12 14" width="12" height="14">
                    <path d="M2 6V4a4 4 0 018 0v2h.5a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 010 11.5v-4A1.5 1.5 0 011.5 6H2zm2 0h4V4a2 2 0 10-4 0v2z" fill="currentColor" />
                  </svg>
                </span>
                <span className="uf-composer-pinned-thumb">
                  <Image
                    src={pinnedTopBlock.asset.src}
                    alt={pinnedTopBlock.alt}
                    width={160}
                    height={Math.round((160 * pinnedTopBlock.asset.height) / pinnedTopBlock.asset.width)}
                    sizes="160px"
                  />
                </span>
                <span className="uf-composer-item-meta">
                  <span className="uf-composer-item-name">{pinnedTopBlock.name}</span>
                  <span className="uf-composer-item-role">{pinnedTopBlock.role}</span>
                </span>
                <span className="uf-composer-pinned-badge">Locked</span>
              </div>
            </div>

            <ol
              className="uf-composer-middle"
              role="list"
              aria-label="Swappable newsletter blocks"
            >
              {rows.length === 0 ? (
                <li className="uf-composer-empty">
                  <p>No middle blocks. Add some from the shelf.</p>
                </li>
              ) : (
                rows.map((row, index) => {
                  const block = blockMap.get(row.id);
                  if (!block) return null;
                  const isDragging = dragKey === row.key;
                  const isDragOver = dragOverKey === row.key;
                  const isEntering = justAddedKey === row.key;
                  return (
                    <li
                      key={row.key}
                      className={`uf-composer-item${isDragging ? " uf-composer-item--dragging" : ""}${isDragOver ? " uf-composer-item--dragover" : ""}${isEntering && !reducedMotion ? " uf-composer-item--enter" : ""}`}
                    >
                      <div
                        className="uf-composer-item-body"
                        draggable
                        onDragStart={onDragStart(row.key)}
                        onDragOver={onDragOver(row.key)}
                        onDragLeave={onDragLeave(row.key)}
                        onDrop={onDrop(row.key)}
                        onDragEnd={onDragEnd}
                      >
                        <span className="uf-composer-item-handle" aria-hidden="true" title="Drag to reorder">
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                        </span>
                        <span className="uf-composer-item-thumb">
                          <Image
                            src={block.asset.src}
                            alt={block.alt}
                            width={160}
                            height={Math.round((160 * block.asset.height) / block.asset.width)}
                            sizes="160px"
                          />
                        </span>
                        <span className="uf-composer-item-meta">
                          <span className="uf-composer-item-name">{block.name}</span>
                          <span className="uf-composer-item-role">{block.role}</span>
                          <span className="uf-composer-item-position">Position {index + 2} of {totalBlockCount}</span>
                        </span>
                        <span className="uf-composer-item-controls" role="group" aria-label={`Reorder ${block.name}`}>
                          <button
                            type="button"
                            className="uf-composer-mini"
                            onClick={() => moveRow(row.key, -1, block.name, index)}
                            disabled={index === 0}
                            aria-label={`Move ${block.name} up`}
                          >
                            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                              <path d="M2 8l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="uf-composer-mini"
                            onClick={() => moveRow(row.key, 1, block.name, index)}
                            disabled={index === rows.length - 1}
                            aria-label={`Move ${block.name} down`}
                          >
                            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="uf-composer-mini uf-composer-mini--remove"
                            onClick={() => removeRow(row.key, block.name)}
                            aria-label={`Remove ${block.name}`}
                          >
                            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                              <path d="M3 3l6 6M9 3l-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    </li>
                  );
                })
              )}
            </ol>

            <div className="uf-composer-pinned" aria-label={`${pinnedBottomBlock.name} (locked)`}>
              <div className="uf-composer-pinned-body">
                <span className="uf-composer-pinned-lock" aria-hidden="true">
                  <svg viewBox="0 0 12 14" width="12" height="14">
                    <path d="M2 6V4a4 4 0 018 0v2h.5a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 010 11.5v-4A1.5 1.5 0 011.5 6H2zm2 0h4V4a2 2 0 10-4 0v2z" fill="currentColor" />
                  </svg>
                </span>
                <span className="uf-composer-pinned-thumb">
                  <Image
                    src={pinnedBottomBlock.asset.src}
                    alt={pinnedBottomBlock.alt}
                    width={160}
                    height={Math.round((160 * pinnedBottomBlock.asset.height) / pinnedBottomBlock.asset.width)}
                    sizes="160px"
                  />
                </span>
                <span className="uf-composer-item-meta">
                  <span className="uf-composer-item-name">{pinnedBottomBlock.name}</span>
                  <span className="uf-composer-item-role">{pinnedBottomBlock.role}</span>
                </span>
                <span className="uf-composer-pinned-badge">Locked</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function NewsletterComposerDemo() {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="uf-composer-demo">
      <button
        type="button"
        className="uf-composer-demo-trigger"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((current) => !current)}
      >
        Try the system
      </button>
      {open ? (
        <div id={contentId} className="uf-composer-demo-content">
          <NewsletterComposer />
        </div>
      ) : null}
    </div>
  );
}

type TemplateVariant = "weekly" | "event";

type TemplateMeta = {
  label: string;
  asset: UfAsset | UfTiledAsset;
  alt: string;
  descriptor: string;
  note: string;
  scrollable: boolean;
};

const TEMPLATE_VARIANTS: Record<TemplateVariant, TemplateMeta> = {
  weekly: {
    label: "Weekly",
    asset: UF_ASSETS.templateWeekly,
    alt: "Full weekly newsletter. Modular kit with emoji section headers and color theme variants.",
    descriptor: "Default send. Full modular kit assembled each week.",
    note: "Scroll inside the frame to read the full send. Two of the three template types are shown here: weekly and event.",
    scrollable: true,
  },
  event: {
    label: "Event",
    asset: UF_ASSETS.templateEvent,
    alt: "Event-specific newsletter with fewer blocks for invites and recaps.",
    descriptor: "Event-specific send. RSVP-focused layout on the same system.",
    note: "Two of the three template types are shown here: weekly and event.",
    scrollable: false,
  },
};

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
        className={`uf-switcher-preview${reducedMotion ? " uf-switcher-preview--static" : ""}${active.scrollable ? " uf-switcher-preview--scroll" : ""}`}
        key={variant}
        role={active.scrollable ? "region" : undefined}
        tabIndex={active.scrollable ? 0 : undefined}
        aria-label={
          active.scrollable
            ? `Scrollable ${active.label} newsletter template`
            : undefined
        }
      >
        <CaptureImage
          asset={active.asset}
          alt={active.alt}
          sizes="(max-width: 768px) 92vw, 540px"
        />
      </div>
      <p className="uf-switcher-descriptor">{active.descriptor}</p>
      <p className="uf-switcher-note">{active.note}</p>
      {isTiledAsset(active.asset) ? (
        <a
          href={active.asset.originalSrc}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open original ${active.label} capture`}
        >
          Open original capture <span aria-hidden="true">↗</span>
        </a>
      ) : null}
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

// Six brand tints editors can swap through without leaving the palette.
const LOCK_SWAP_ACCENTS: readonly { hex: string; name: string }[] = [
  { hex: "#f26938", name: "Signal orange" },
  { hex: "#be5abf", name: "Magenta" },
  { hex: "#2788c1", name: "Sky" },
  { hex: "#2fac38", name: "Meadow" },
  { hex: "#f2b544", name: "Sunbeam" },
  { hex: "#164f73", name: "Deep navy" },
] as const;

export function LockedSwappableView() {
  const [focus, setFocus] = useState<LockSwapFocus>("both");
  const [accent, setAccent] = useState<string>(LOCK_SWAP_ACCENTS[0].hex);
  const reducedMotion = usePrefersReducedMotion();
  const base = UF_ASSETS.lockedSwappableBase;

  const swapOpacity = focus === "locked" ? 0.12 : 1;
  const lockOpacity = focus === "swappable" ? 0.12 : 1;
  const layerTransition = reducedMotion ? undefined : "opacity 240ms ease";
  const accentFill = `${accent}1a`; // ~10% alpha
  const rectTransition = reducedMotion ? undefined : "fill 260ms ease, stroke 260ms ease";

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
      <p className="uf-lock-hint">Pick a layer to isolate it. The other dims back.</p>
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
                fill={accentFill}
                stroke={accent}
                strokeWidth={3}
                style={{ transition: rectTransition }}
              />
            ))}
            <g transform="translate(44 392)">
              <rect
                width={132}
                height={26}
                rx={4}
                fill={accent}
                style={{ transition: rectTransition }}
              />
              <text x={66} y={18} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={600}>
                Swappable
              </text>
            </g>
          </g>
        </svg>
      </div>

      <div
        className="uf-lock-palette"
        role="group"
        aria-label="Recolor the swappable regions"
      >
        <p className="uf-lock-palette-caption">Try a swap. The palette re-tints the region markers.</p>
        <ul role="list">
          {LOCK_SWAP_ACCENTS.map((a) => (
            <li key={a.hex}>
              <button
                type="button"
                className={`uf-lock-palette-swatch${accent === a.hex ? " uf-lock-palette-swatch--active" : ""}`}
                style={{ "--uf-swatch": a.hex } as React.CSSProperties}
                onClick={() => setAccent(a.hex)}
                aria-pressed={accent === a.hex}
                aria-label={`Use ${a.name} (${a.hex}) as the swappable accent`}
              >
                <span aria-hidden="true" />
                <span className="sr-only">{a.name}</span>
              </button>
            </li>
          ))}
        </ul>
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

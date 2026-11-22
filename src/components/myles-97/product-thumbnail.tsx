"use client";

import { useId, useRef, useState } from "react";
import { TeardownDrawing, layerDescription } from "./teardown-drawing";
import type { FeaturedProjectId } from "@/lib/myles-97/programs";

const descriptions: Record<FeaturedProjectId, string> = {
  "fresh-greens": "Fresh Greens road atlas with the five-minute daylight route to Weeksville Heritage Center.",
  understandingfafsa: "FAFSA & Financial Aid 101 newsletter on perforated printer paper.",
  navi: "Prospect Park postcard with a Brooklyn park photograph and a pond postage stamp.",
  tiktok: "Fashion catalog proof sheet with the original three template designs.",
};

function AtlasCover() {
  return <>
    <span className="atlas-map" />
    <span className="atlas-spine" />
    <span className="atlas-title">Fresh<br />Greens</span>
    <span className="atlas-ticket"><b>5 min</b><span>Weeksville<br />Heritage Center</span></span>
  </>;
}

function NewsletterCover() {
  return <>
    <span className="mail-edition-back" />
    <span className="mail-edition">
      <span className="mail-masthead">
        <span className="mail-edition-heading">FAFSA &amp;</span>
        <span className="mail-edition-title">Financial Aid</span>
      </span>
      <span className="mail-edition-number">101</span>
      <span className="mail-edition-tear" />
    </span>
    <span className="mail-clipping" />
  </>;
}

function PostcardCover() {
  return <>
    <span className="postcard-photo" />
    <span className="postcard-place">Prospect<br />Park</span>
    <span className="postcard-name">navi<span>.</span></span>
    <span className="postcard-edge"><span className="postcard-stamp" /><span className="postcard-city">Brooklyn, NY</span></span>
  </>;
}

function CatalogCover() {
  return <>
    <span className="catalog-masthead">Fashion<br /><i>catalog</i></span>
    <span className="catalog-edition">TikTok Dynamic Showcase Ads</span>
    <span className="catalog-proofs">
      <span className="catalog-proof catalog-proof--academia" />
      <span className="catalog-proof catalog-proof--dopamine" />
      <span className="catalog-proof catalog-proof--eboy" />
    </span>
  </>;
}

const covers = {
  "fresh-greens": AtlasCover,
  understandingfafsa: NewsletterCover,
  navi: PostcardCover,
  tiktok: CatalogCover,
};

type CoverProps = {
  project: FeaturedProjectId;
  reduced?: boolean;
  inspect?: boolean;
  interactive?: boolean;
  assemblyOnly?: boolean;
};

export function ProductThumbnail({ project, reduced = false, inspect = false, interactive = false, assemblyOnly = false }: CoverProps) {
  const Cover = covers[project];
  return (
    <span className="product-thumbnail publication-cover" data-project={project}
      data-reduced={reduced} data-inspect={inspect} aria-hidden="true">
      {interactive && <TeardownDrawing project={project} />}
      {!assemblyOnly && <span className="edition-face"><Cover /></span>}
    </span>
  );
}

export function InspectableThumbnail({ project, title, reduced, assemblyOnly = false }: {
  project: FeaturedProjectId; title: string; reduced: boolean; assemblyOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const pointerDown = useRef(false);
  const pointerType = useRef("");
  const descriptionId = useId();
  const action = open ? "Reassemble" : "View layers";

  return (
    <button type="button" className="myles97-program-cover cover-inspector"
      aria-label={`${action} — ${title}`} aria-describedby={descriptionId} aria-pressed={open}
      onPointerEnter={event => {
        if (event.pointerType === "touch" || !window.matchMedia("(any-hover: hover)").matches) return;
        setKeyboard(false);
        setOpen(true);
      }}
      onPointerLeave={event => {
        if (event.pointerType !== "touch" && !event.currentTarget.matches(":focus-visible")) setOpen(false);
      }}
      onPointerDown={event => { pointerDown.current = true; pointerType.current = event.pointerType; setKeyboard(false); }}
      onPointerUp={() => { pointerDown.current = false; }}
      onPointerCancel={() => { pointerDown.current = false; setOpen(false); }}
      onFocus={event => {
        if (!pointerDown.current && event.currentTarget.matches(":focus-visible")) {
          setKeyboard(true);
          setOpen(true);
        }
      }}
      onBlur={() => { pointerDown.current = false; setOpen(false); }}
      onKeyDown={event => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setKeyboard(true);
          setOpen(false);
        }
      }}
      onClick={event => {
        if (event.detail > 0 && pointerType.current !== "touch" && window.matchMedia("(any-hover: hover)").matches) return;
        setKeyboard(event.detail === 0);
        setOpen(value => !value);
      }}>
      <ProductThumbnail project={project} reduced={reduced || keyboard} inspect={open} interactive assemblyOnly={assemblyOnly} />
      <span className="cover-touch-hint" aria-hidden="true">{action}</span>
      <span id={descriptionId} className="sr-only">
        {open || assemblyOnly ? layerDescription(project) : descriptions[project]}
      </span>
    </button>
  );
}

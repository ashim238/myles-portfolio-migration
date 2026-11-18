"use client";

import { useId } from "react";
import type { ProjectProgramId } from "@/lib/myles-97/programs";

/** Motion studies use original artwork; SVG windows preserve source geometry. */
export function ProductThumbnail({ project, active, reduced, expanded = false }: {
  project: ProjectProgramId; active: boolean; reduced: boolean; expanded?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const shadow = id + "-shadow";
  if (project === "fresh-greens") {
    return (
      <span
        className="product-thumbnail"
        data-project={project}
        data-active={active}
        data-reduced={reduced}
        role={expanded ? "img" : undefined}
        aria-hidden={expanded ? undefined : true}
        aria-label={expanded ? "Fresh Greens driver illustration beside the route to Weeksville Heritage Center. The preview shows 30 minutes and an all-clear status." : undefined}
      >
        <svg className="product-thumbnail-scene" viewBox="0 0 640 548" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true">
          <image className="fresh-driver-art" href="/projects/preview-art/driver-location-journey.webp" width="224" height="548" preserveAspectRatio="xMidYMin slice" />
          <image className="fresh-preview-route" href="/projects/preview-art/weeksville-route-preview.webp" x="224" width="416" height="548" />
          {!expanded && <circle className="fresh-location-pulse" cx="432" cy="127.2" r="10" fill="none" stroke="#087af5" strokeWidth="3" />}
        </svg>
      </span>
    );
  }
  return <span className="product-thumbnail" data-project={project} data-active={active} data-reduced={reduced}>
    <svg className="product-thumbnail-scene" viewBox="0 0 640 360" preserveAspectRatio={project === "understandingfafsa" ? "xMidYMax meet" : "xMidYMid meet"} focusable="false" aria-hidden="true">
      <defs><filter id={shadow} x="-40%" y="-40%" width="180%" height="200%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#1d251c" floodOpacity=".14" />
      </filter></defs>
      {project === "understandingfafsa" ? <MailScene shadow={shadow} /> : project === "navi" ? <PlacesScene shadow={shadow} /> : <CatalogScene shadow={shadow} />}
    </svg>
  </span>;
}

function SourceCrop({ src, x, y, width, height, viewBox, sourceWidth, sourceHeight, radius = 0 }: {
  src: string; x: number; y: number; width: number; height: number;
  viewBox: string; sourceWidth: number; sourceHeight: number; radius?: number;
}) {
  const clipId = useId().replace(/:/g, "") + "-crop";
  return <g>
    <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} rx={radius} /></clipPath></defs>
    <g clipPath={`url(#${clipId})`}><svg x={x} y={y} width={width} height={height} viewBox={viewBox} overflow="hidden" preserveAspectRatio="xMidYMid slice">
    <image href={src} width={sourceWidth} height={sourceHeight} />
    </svg></g>
  </g>;
}

function MailScene({ shadow }: { shadow: string }) {
  const clip = shadow + "-students";
  return <>
    <defs>
      <clipPath id={clip}><rect x="150" y="149" width="334" height="190" rx="3" /></clipPath>
    </defs>
    <rect width="640" height="360" fill="#f4eae3" />
    <path d="M0 296Q150 250 325 298T640 292V360H0" fill="#ebd7c9" />
    <path d="M140 24H122V335H140 M494 24H512V335H494" fill="none" stroke="#ccb9ac" />
    <g filter={`url(#${shadow})`}>
      <rect x="150" y="22" width="334" height="123" rx="3" fill="white" />
      <image href="/projects/preview-art/modular-header.webp" x="150" y="22" width="334" height="123" />
    </g>
    <path d="M75 85H139" stroke="#164f73" strokeDasharray="3 3" />
    <text x="28" y="77" fill="#164f73" fontSize="17" fontWeight="700">Locked</text>
    <g className="motion-mail-body">
      <rect x="150" y="149" width="334" height="190" rx="3" fill="white" stroke="#f26938" filter={`url(#${shadow})`} />
      <g clipPath={`url(#${clip})`}>
        <image href="/projects/preview-art/modular-students.webp" x="150" y="149" width="334" height="532" />
      </g>
    </g>
    <path d="M506 242H568" stroke="#a8461f" strokeDasharray="3 3" />
    <text x="520" y="230" fill="#a8461f" fontSize="15" fontWeight="700">Swappable</text>
  </>;
}

function PlacesScene({ shadow }: { shadow: string }) {
  const contentClip = `${shadow}-navi-content`;
  return <>
    <defs>
      <clipPath id={contentClip}>
        <rect x="25" y="137" width="578" height="214" />
      </clipPath>
    </defs>
    <rect width="640" height="360" fill="#f0efe9" />
    <g className="motion-navi-browser" filter={`url(#${shadow})`}>
      <rect x="-28" y="37" width="698" height="370" rx="12" fill="#fff" />
      <text x="25" y="74" fill="#222" fontSize="25" fontWeight="750">navi<tspan fill="#ff702e">.</tspan></text>
      <g className="navi-thumbnail-search">
        <rect x="174" y="46" width="310" height="42" rx="21" fill="#f4f3ef" stroke="#e3e0da" />
        <circle cx="195" cy="66" r="6" fill="none" stroke="#69645f" strokeWidth="1.5" />
        <path d="m199 70 5 5" stroke="#69645f" strokeWidth="1.5" strokeLinecap="round" />
        <text x="218" y="72" fill="#69645f" fontSize="14">Where do you want to explore?</text>
      </g>
      <text x="25" y="117" fill="#272329" fontSize="21" fontWeight="700">Handpicked by us →</text>
      <g className="motion-navi-neighbors" clipPath={`url(#${contentClip})`}>
        <image href="/projects/preview-art/prospect-trees.webp" x="-115" y="140" width="168" height="151" preserveAspectRatio="xMidYMid slice" />
        <image href="/projects/preview-art/prospect-pond.webp" x="435" y="140" width="168" height="151" preserveAspectRatio="xMidYMid slice" />
        <text x="435" y="314" fill="#272329" fontSize="12" fontWeight="650">Explore the neighborhood</text>
      </g>
      <g className="motion-navi-selected">
        <rect x="69" y="137" width="345" height="214" rx="11" fill="#fff" stroke="#e7e3db" />
        <SourceCrop src="/projects/preview-art/prospect-tunnel.webp" x={73} y={141} width={337} height={146} radius={7} viewBox="0 0 1400 932" sourceWidth={1400} sourceHeight={932} />
        <rect x="86" y="152" width="88" height="23" rx="4" fill="#fff" />
        <text x="97" y="167" fill="#58515b" fontSize="10">Locally owned</text>
        <circle cx="387" cy="165" r="13" fill="#fff" /><path d="m381 163q0-6 6-2 6-4 6 2 0 4-6 8-6-4-6-8" fill="none" stroke="#867b87" strokeWidth="1.5" />
        <text x="87" y="308" fill="#272329" fontSize="16" fontWeight="700">Discover Prospect Park</text>
        <text x="87" y="331" fill="#67616a" fontSize="12">Park Slope, Brooklyn</text>
      </g>
    </g>
    <g className="motion-navi-detail" filter={`url(#${shadow})`}>
      <rect x="388" y="204" width="225" height="110" rx="12" fill="#fff" />
      <text x="406" y="231" fill="#29242c" fontSize="14" fontWeight="700">Learn. Plan. Go.</text>
      <text x="406" y="252" fill="#716870" fontSize="11">Your next neighborhood story</text>
      <rect x="406" y="268" width="190" height="30" rx="5" fill="#ff702e" />
      <text x="448" y="288" fill="white" fontSize="12" fontWeight="650">Explore experience</text>
    </g>
  </>;
}

function CatalogScene({ shadow }: { shadow: string }) {
  const titleMask = shadow + "-title-mask";
  return <>
    <defs>
      <mask id={titleMask} maskUnits="userSpaceOnUse" x="210" y="-24" width="226" height="402">
        <rect x="210" y="-24" width="226" height="402" fill="white" />
        <rect x="346" y="28" width="88" height="25" fill="black" />
      </mask>
    </defs>
    <rect width="640" height="360" fill="#e9e2d9" />
    <g className="motion-catalog-left" filter={`url(#${shadow})`}>
      <image href="/projects/preview-art/eboy.webp" x="58" y="-5" width="173" height="308" />
    </g>
    <g className="motion-catalog-right" filter={`url(#${shadow})`}>
      <image href="/projects/preview-art/dopamine.webp" x="413" y="53" width="173" height="308" />
    </g>
    <g className="motion-catalog-main" filter={`url(#${shadow})`}>
      <rect x="210" y="-38" width="226" height="420" fill="#ffcdb2" />
      <image href="/projects/preview-art/academia.webp" x="210" y="-24" width="226" height="402" mask={`url(#${titleMask})`} />
    <g className="motion-catalog-type" filter={`url(#${shadow})`}>
      <g className="motion-catalog-type-backing"><rect x="274" y="230" width="334" height="114" fill="#fffaf3" /></g>
      <SourceCrop src="/projects/tiktok/system/academia-text.svg" x={292} y={240} width={298} height={96} viewBox="90 0 297 96" sourceWidth={387.8} sourceHeight={268.32} />
    </g>
    </g>
  </>;
}

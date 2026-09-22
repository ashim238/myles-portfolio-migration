"use client";

import { useId } from "react";
import type { ProjectProgramId } from "@/lib/myles-97/programs";

/** Motion studies use original artwork; SVG windows preserve source geometry. */
export function ProductThumbnail({ project, active, reduced }: {
  project: ProjectProgramId; active: boolean; reduced: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const shadow = id + "-shadow";
  return <span className="product-thumbnail" data-project={project} data-active={active} data-reduced={reduced}>
    <svg className="product-thumbnail-scene" viewBox="0 0 640 360" preserveAspectRatio={project === "understandingfafsa" ? "xMidYMax meet" : "xMidYMid meet"} focusable="false" aria-hidden="true">
      <defs><filter id={shadow} x="-40%" y="-40%" width="180%" height="200%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#1d251c" floodOpacity=".14" />
      </filter></defs>
      {project === "fresh-greens" ? <RouteScene shadow={shadow} /> : project === "understandingfafsa" ? <MailScene shadow={shadow} /> : project === "navi" ? <PlacesScene shadow={shadow} /> : <CatalogScene shadow={shadow} />}
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

function RouteScene({ shadow }: { shadow: string }) {
  const src = "/projects/fresh-greens/v2/route-preview.png";
  return <>
    <rect width="640" height="360" fill="#e7edde" />
    <circle cx="130" cy="190" r="195" fill="#d4e2c8" />
    <circle cx="130" cy="190" r="143" fill="none" stroke="#b9cfaa" opacity=".5" />
    <circle cx="130" cy="190" r="190" fill="none" stroke="#b9cfaa" opacity=".5" />
    <g className="motion-phone" filter={`url(#${shadow})`}>
      <rect x="70" y="-16" width="192" height="408" rx="31" fill="#143922" />
      <SourceCrop src={src} x={78} y={0} width={176} height={382} radius={24} viewBox="0 0 1290 2796" sourceWidth={1290} sourceHeight={2796} />
      <rect x="135" y="3" width="61" height="15" rx="8" fill="#0c1c10" />
    </g>
    <g className="motion-focus-panel" filter={`url(#${shadow})`}>
      <rect x="265" y="99" width="349" height="216" rx="23" fill="white" />
      <SourceCrop src={src} x={280} y={116} width={319} height={186} radius={16} viewBox="52 1960 1180 720" sourceWidth={1290} sourceHeight={2796} />
    </g>
    <g className="motion-detail">
      <text x="288" y="73" fill="#306639" fontSize="18" letterSpacing="2" fontWeight="700">FRESH GREENS</text>
      <path d="M236 184H266" stroke="#306639" strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx="236" cy="184" r="4" fill="#306639" stroke="white" strokeWidth="2" />
    </g>
  </>;
}

function MailScene({ shadow }: { shadow: string }) {
  const sheetClip = shadow + "-mail-sheet";
  return <>
    <defs><clipPath id={sheetClip}><rect x="116" y="-9" width="364" height="460" rx="7" /></clipPath></defs>
    <rect width="640" height="360" fill="#f4eae3" />
    <path d="M0 291Q184 208 347 291T640 280V360H0" fill="#ebd7c9" />
    <g className="motion-mail-sheet" filter={`url(#${shadow})`}>
      <rect x="116" y="-9" width="364" height="460" rx="7" fill="#fff" />
      <g clipPath={`url(#${sheetClip})`}>
      <g className="motion-mail-header"><image href="/projects/understandingfafsa/modular-header.png" x="116" y="10" width="364" height="134" /></g>
      <g className="motion-mail-body">
        <image href="/projects/understandingfafsa/modular-students.png" x="130" y="145" width="336" height="535" />
      </g>
      </g>
    </g>
    <g className="motion-mail-label">
      <rect x="436" y="254" width="180" height="82" rx="12" fill="#ff7033" />
      <text x="454" y="281" fill="white" fontSize="12" fontWeight="700">BUILT IN MODULES</text>
      <path d="M455 297h17v17h-17Zm24 0h17v17h-17Zm24 0h17v17h-17Z" fill="none" stroke="white" strokeWidth="1.5" />
    </g>
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
        <image href="/projects/navi-demo/prospect-trees.jpg" x="-115" y="140" width="168" height="151" preserveAspectRatio="xMidYMid slice" />
        <image href="/projects/navi-demo/prospect-pond.jpg" x="435" y="140" width="168" height="151" preserveAspectRatio="xMidYMid slice" />
        <text x="435" y="314" fill="#272329" fontSize="13" fontWeight="650">Explore the neighborhood</text>
      </g>
      <g className="motion-navi-selected">
        <rect x="69" y="137" width="345" height="214" rx="11" fill="#fff" stroke="#e7e3db" />
        <image href="/projects/navi-demo/prospect-tunnel.jpg" x="73" y="141" width="337" height="146" preserveAspectRatio="xMidYMid slice" />
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
      <image href="/projects/tiktok/system/eboy.webp" x="58" y="-5" width="173" height="308" />
    </g>
    <g className="motion-catalog-right" filter={`url(#${shadow})`}>
      <image href="/projects/tiktok/system/dopamine.webp" x="413" y="53" width="173" height="308" />
    </g>
    <g className="motion-catalog-main" filter={`url(#${shadow})`}>
      <rect x="210" y="-38" width="226" height="420" fill="#ffcdb2" />
      <image href="/projects/tiktok/system/academia.webp" x="210" y="-24" width="226" height="402" mask={`url(#${titleMask})`} />
      <g className="motion-catalog-slot">
        <rect x="238" y="56" width="146" height="166" fill="#f7f7f7" />
        <rect x="250" y="68" width="122" height="142" fill="none" stroke="#dbd4ca" strokeDasharray="3 4" />
        <path d="M295 116h30v30h-30Zm15-10v10m0 30v10m-25-25h10m30 0h10" fill="none" stroke="#9d8c7f" strokeWidth="1.5" />
        <text x="264" y="180" fill="#77695e" fontSize="11">CATALOG IMAGE</text>
      </g>
    <g className="motion-catalog-type" filter={`url(#${shadow})`}>
      <g className="motion-catalog-type-backing"><rect x="274" y="230" width="334" height="114" fill="#fffaf3" /></g>
      <SourceCrop src="/projects/tiktok/system/academia-text.svg" x={292} y={240} width={298} height={96} viewBox="90 0 297 96" sourceWidth={387.8} sourceHeight={268.32} />
    </g>
    </g>
  </>;
}

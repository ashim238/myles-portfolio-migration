import type { ReactNode, SVGProps } from "react";

export type Myles97IconName =
  | "folder"
  | "document"
  | "profile"
  | "resume"
  | "recipe"
  | "display"
  | "mail"
  | "app"
  | "loose-parts"
  | "fresh-greens"
  | "fafsa"
  | "navi"
  | "tiktok";

export type Myles97IconVariant = "mono" | "color";
export type Myles97IconTier = "chrome" | "menu" | "discovery";

type Myles97IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: Myles97IconName;
  size?: number;
  title?: string;
  compact?: boolean;
  tier?: Myles97IconTier;
  variant?: Myles97IconVariant;
};

type IconPalette = {
  color: boolean;
  ink: string;
  paper: string;
  chrome: string;
  yellow: string;
  blue: string;
  teal: string;
  orange: string;
  green: string;
  cyan: string;
  magenta: string;
};

const GRID_BY_TIER: Record<Myles97IconTier, number> = {
  chrome: 16,
  menu: 24,
  discovery: 32,
};

const STROKE_BY_TIER: Record<Myles97IconTier, number> = {
  chrome: 1,
  menu: 1.5,
  discovery: 2,
};

export function iconTierForSize(
  size: number,
  compact = false,
): Myles97IconTier {
  if (compact || size <= 18) return "chrome";
  if (size <= 24) return "menu";
  return "discovery";
}

export function iconForProgram(id: string): Myles97IconName {
  switch (id) {
    case "fresh-greens":
      return "fresh-greens";
    case "understandingfafsa":
      return "fafsa";
    case "navi":
      return "navi";
    case "tiktok":
      return "tiktok";
    case "selected-work":
      return "folder";
    case "about":
      return "profile";
    case "resume":
      return "resume";
    case "trini-roti":
      return "recipe";
    case "loose-parts":
      return "loose-parts";
    case "display-properties":
      return "display";
    default:
      return "app";
  }
}

function fill(palette: IconPalette, value: string) {
  return palette.color ? value : "none";
}

function accent(palette: IconPalette, value: string) {
  return {
    className: "myles98-icon-accent",
    fill: fill(palette, value),
    stroke: palette.color ? "none" : palette.ink,
  };
}

function secondaryAccent(palette: IconPalette, value: string) {
  return {
    className: "myles98-icon-accent-secondary",
    fill: fill(palette, value),
    stroke: palette.color ? "none" : palette.ink,
  };
}

function tertiaryAccent(palette: IconPalette, value: string) {
  return {
    className: "myles98-icon-accent-tertiary",
    fill: fill(palette, value),
    stroke: palette.color ? "none" : palette.ink,
  };
}

function surface(palette: IconPalette, value = palette.paper) {
  return {
    className: "myles98-icon-surface",
    fill: fill(palette, value),
  };
}

function line(palette: IconPalette, color = palette.ink) {
  return {
    className: "myles98-icon-line",
    fill: "none",
    stroke: palette.color ? color : palette.ink,
  };
}

function renderChromeGlyph(
  name: Myles97IconName,
  palette: IconPalette,
): ReactNode {
  switch (name) {
    case "folder":
      return (
        <>
          <path d="M1 5h5l2 2h7v7H1zM1 5V3h5l2 2" {...accent(palette, palette.yellow)} />
          <path d="M3 9h8v3H3zM4 10h4" {...line(palette, palette.blue)} />
        </>
      );
    case "document":
      return (
        <>
          <path d="M3 1h7l3 3v11H3z" {...surface(palette)} />
          <path d="M10 1v4h3M5 8h6M5 11h6" />
        </>
      );
    case "profile":
      return (
        <>
          <rect x="1" y="3" width="14" height="11" {...surface(palette)} />
          <path d="M2 4h12v2H2z" {...accent(palette, palette.blue)} />
          <circle cx="5" cy="9" r="1" {...secondaryAccent(palette, palette.yellow)} />
          <path d="M3 12c0-2 1-2 2-2s2 0 2 2z" {...tertiaryAccent(palette, palette.teal)} />
          <path d="M9 8h3M9 10h3M9 12h2" />
        </>
      );
    case "resume":
      return (
        <>
          <path d="M3 1h7l3 3v11H3z" {...surface(palette)} />
          <path d="M10 1v4h3M7 8h4M7 11h4M5 14h6" />
          <rect x="5" y="7" width="1" height="1" {...accent(palette, palette.yellow)} />
          <rect x="5" y="10" width="1" height="1" {...accent(palette, palette.yellow)} />
        </>
      );
    case "recipe":
      return (
        <>
          <path d="M3 1h7l3 3v11H3z" {...surface(palette)} />
          <path d="M10 1v4h3M5 10h6M5 13h5M6 7V5M9 7V5" />
          <rect x="5" y="8" width="6" height="1" {...accent(palette, palette.orange)} />
        </>
      );
    case "display":
      return (
        <>
          <rect x="1" y="2" width="14" height="10" {...surface(palette, palette.chrome)} />
          <rect x="3" y="4" width="10" height="6" {...accent(palette, palette.blue)} />
          <rect x="4" y="5" width="2" height="2" {...secondaryAccent(palette, palette.yellow)} />
          <path d="M5 15h6M8 12v3" />
        </>
      );
    case "mail":
      return (
        <>
          <rect x="1" y="4" width="14" height="9" {...surface(palette)} />
          <path d="m2 5 6 5 6-5M2 12l4-4M14 12l-4-4" />
          <rect x="12" y="5" width="2" height="2" {...accent(palette, palette.yellow)} />
        </>
      );
    case "app":
      return (
        <>
          <rect x="2" y="2" width="12" height="12" {...surface(palette, palette.chrome)} />
          <path d="M3 3h10v3H3z" {...accent(palette, palette.blue)} />
          <path d="M2 6h12M6 6v8" />
          <rect x="3" y="8" width="2" height="4" {...secondaryAccent(palette, palette.yellow)} />
        </>
      );
    case "loose-parts":
      return (
        <>
          <circle cx="5" cy="5" r="2" {...accent(palette, palette.yellow)} />
          <rect x="10" y="3" width="4" height="4" {...secondaryAccent(palette, palette.blue)} />
          <path d="M2 14h5l-2-4z" {...tertiaryAccent(palette, palette.teal)} />
          <path d="m10 10 4 4m0-4-4 4" {...line(palette, palette.orange)} />
        </>
      );
    case "fresh-greens":
      return (
        <>
          <rect x="1" y="1" width="14" height="14" {...accent(palette, palette.green)} />
          <rect x="2" y="2" width="4" height="4" {...secondaryAccent(palette, palette.yellow)} />
          <path d="M2 13h4l2-3 2 1 4-6" {...line(palette, palette.paper)} />
          <circle cx="13" cy="4" r="1" {...tertiaryAccent(palette, palette.orange)} />
        </>
      );
    case "fafsa":
      return (
        <>
          <path d="M1 3h14v11H1zM1 6h14" />
          <path d="M3 8h10v4H3zM3 8l5 3 5-3" />
        </>
      );
    case "navi":
      return (
        <>
          <path d="M8 14s4-4 4-8a4 4 0 1 0-8 0c0 4 4 8 4 8Z" {...accent(palette, palette.orange)} />
          <circle cx="8" cy="6" r="2" {...secondaryAccent(palette, palette.blue)} />
        </>
      );
    case "tiktok":
      return (
        <>
          <rect x="1" y="2" width="14" height="12" {...surface(palette, "#111111")} />
          <path d="M1 6h14" {...line(palette, palette.paper)} />
          <rect x="3" y="8" width="3" height="4" {...accent(palette, palette.cyan)} />
          <rect x="7" y="8" width="3" height="4" {...secondaryAccent(palette, palette.magenta)} />
          <rect x="11" y="8" width="2" height="4" {...tertiaryAccent(palette, palette.yellow)} />
        </>
      );
  }
}

function renderMenuGlyph(
  name: Myles97IconName,
  palette: IconPalette,
): ReactNode {
  switch (name) {
    case "folder":
      return (
        <>
          <path d="M2 7h8l3 3h9v11H2zM2 7V4h8l3 3" {...accent(palette, palette.yellow)} />
          <path d="M4 12h16v7H4zM6 14h7" {...line(palette, palette.blue)} />
        </>
      );
    case "document":
      return (
        <>
          <path d="M5 2h10l4 4v16H5z" {...surface(palette)} />
          <path d="M15 2v5h4" />
          <path d="M8 11h8M8 15h8M8 19h6" {...line(palette, palette.blue)} />
        </>
      );
    case "profile":
      return (
        <>
          <rect x="2" y="4" width="20" height="16" {...surface(palette)} />
          <path d="M3 5h18v4H3z" {...accent(palette, palette.blue)} />
          <circle cx="8" cy="13" r="2" {...secondaryAccent(palette, palette.yellow)} />
          <path d="M5 18c0-3 1-4 3-4s3 1 3 4z" {...tertiaryAccent(palette, palette.teal)} />
          <path d="M13 12h6M13 15h5M13 18h4" />
        </>
      );
    case "resume":
      return (
        <>
          <path d="M5 2h10l4 4v16H5z" {...surface(palette)} />
          <path d="M15 2v5h4M11 11h5M11 15h5M8 19h8" />
          <rect x="8" y="10" width="2" height="2" {...accent(palette, palette.yellow)} />
          <rect x="8" y="14" width="2" height="2" {...accent(palette, palette.yellow)} />
        </>
      );
    case "recipe":
      return (
        <>
          <path d="M5 2h10l4 4v16H5z" {...surface(palette)} />
          <path d="M15 2v5h4M8 16h8M8 19h6M9 11V8M13 11V8" />
          <rect x="8" y="12" width="8" height="2" {...accent(palette, palette.orange)} />
        </>
      );
    case "display":
      return (
        <>
          <rect x="2" y="3" width="20" height="14" {...surface(palette, palette.chrome)} />
          <rect x="5" y="6" width="14" height="8" {...accent(palette, palette.blue)} />
          <rect x="6" y="7" width="4" height="3" {...secondaryAccent(palette, palette.yellow)} />
          <path d="M8 22h8M12 17v5" />
        </>
      );
    case "mail":
      return (
        <>
          <rect x="2" y="5" width="20" height="14" {...surface(palette)} />
          <path d="m3 7 9 7 9-7M3 18l6-7M21 18l-6-7" />
          <rect x="18" y="7" width="2" height="2" {...accent(palette, palette.yellow)} />
        </>
      );
    case "app":
      return (
        <>
          <rect x="3" y="3" width="18" height="18" {...surface(palette, palette.chrome)} />
          <path d="M4 4h16v5H4z" {...accent(palette, palette.blue)} />
          <path d="M3 9h18M9 9v12" />
          <rect x="5" y="12" width="3" height="6" {...secondaryAccent(palette, palette.yellow)} />
          <rect x="6" y="6" width="3" height="1" fill={palette.color ? palette.paper : palette.ink} stroke="none" />
        </>
      );
    case "loose-parts":
      return (
        <>
          <circle cx="7" cy="7" r="3" {...accent(palette, palette.yellow)} />
          <rect x="14" y="4" width="6" height="6" {...secondaryAccent(palette, palette.blue)} />
          <path d="M3 21h8l-4-7z" {...tertiaryAccent(palette, palette.teal)} />
          <path d="m15 15 5 5m0-5-5 5" {...line(palette, palette.orange)} />
        </>
      );
    case "fresh-greens":
      return (
        <>
          <rect x="2" y="2" width="20" height="20" {...accent(palette, palette.green)} />
          <rect x="3" y="3" width="7" height="7" {...secondaryAccent(palette, palette.yellow)} />
          <path d="M3 20h6l3-5 3 2 6-10" {...line(palette, palette.paper)} />
          <circle cx="19" cy="6" r="2" {...tertiaryAccent(palette, palette.orange)} />
        </>
      );
    case "fafsa":
      return (
        <>
          <rect x="2" y="5" width="15" height="13" {...surface(palette)} />
          <path d="m3 7 6 5 7-5M3 17l5-7M16 17l-5-7" />
          <rect x="19" y="4" width="3" height="4" {...accent(palette, palette.yellow)} />
          <rect x="19" y="10" width="3" height="4" {...secondaryAccent(palette, palette.cyan)} />
          <rect x="19" y="16" width="3" height="4" {...tertiaryAccent(palette, palette.magenta)} />
        </>
      );
    case "navi":
      return (
        <>
          <path d="M12 21s7-6 7-13a7 7 0 1 0-14 0c0 7 7 13 7 13Z" {...accent(palette, palette.orange)} />
          <circle cx="12" cy="8" r="3" {...secondaryAccent(palette, palette.blue)} />
        </>
      );
    case "tiktok":
      return (
        <>
          <rect x="2" y="4" width="20" height="16" {...surface(palette, "#111111")} />
          <path d="M2 9h20" {...line(palette, palette.paper)} />
          <rect x="5" y="12" width="4" height="5" {...accent(palette, palette.cyan)} />
          <rect x="10" y="12" width="4" height="5" {...secondaryAccent(palette, palette.magenta)} />
          <rect x="15" y="12" width="4" height="5" {...tertiaryAccent(palette, palette.yellow)} />
          <path d="M5 6h3M10 6h3" {...line(palette, palette.paper)} />
        </>
      );
  }
}

function renderDiscoveryGlyph(
  name: Myles97IconName,
  palette: IconPalette,
): ReactNode {
  switch (name) {
    case "folder":
      return (
        <>
          <path d="M2 9h11l4 4h13v16H2zM2 9V5h11l4 4" {...accent(palette, palette.yellow)} />
          <path d="M5 16h22v10H5zM8 19h10M8 22h7" {...line(palette, palette.blue)} />
        </>
      );
    case "document":
      return (
        <>
          <path d="M7 2h13l6 6v22H7z" {...surface(palette)} />
          <path d="M20 2v7h6" />
          <path d="M11 14h11M11 19h11M11 24h9" {...line(palette, palette.blue)} />
        </>
      );
    case "profile":
      return (
        <>
          <rect x="2" y="5" width="28" height="23" {...surface(palette)} />
          <path d="M3 6h26v6H3z" {...accent(palette, palette.blue)} />
          <circle cx="10" cy="18" r="3" {...secondaryAccent(palette, palette.yellow)} />
          <path d="M6 25c0-4 2-5 4-5s4 1 4 5z" {...tertiaryAccent(palette, palette.teal)} />
          <path d="M17 16h9M17 20h8M17 24h6" />
        </>
      );
    case "resume":
      return (
        <>
          <path d="M7 2h13l6 6v22H7z" {...surface(palette)} />
          <path d="M20 2v7h6M14 15h8M14 21h8M11 26h11" />
          <rect x="10" y="13" width="3" height="3" {...accent(palette, palette.yellow)} />
          <rect x="10" y="19" width="3" height="3" {...accent(palette, palette.yellow)} />
        </>
      );
    case "recipe":
      return (
        <>
          <path d="M7 2h13l6 6v22H7z" {...surface(palette)} />
          <path d="M20 2v7h6M11 22h11M11 26h8M12 15v-5M18 15v-5" />
          <rect x="10" y="16" width="13" height="3" {...accent(palette, palette.orange)} />
        </>
      );
    case "display":
      return (
        <>
          <rect x="2" y="4" width="28" height="20" {...surface(palette, palette.chrome)} />
          <rect x="6" y="8" width="20" height="12" {...accent(palette, palette.blue)} />
          <rect x="8" y="10" width="6" height="4" {...secondaryAccent(palette, palette.yellow)} />
          <path d="M10 30h12M16 24v6" />
        </>
      );
    case "mail":
      return (
        <>
          <rect x="2" y="7" width="28" height="19" {...surface(palette)} />
          <path d="m4 9 12 10L28 9M4 24l8-9M28 24l-8-9" />
          <rect x="25" y="9" width="3" height="3" {...accent(palette, palette.yellow)} />
        </>
      );
    case "app":
      return (
        <>
          <rect x="4" y="4" width="24" height="24" {...surface(palette, palette.chrome)} />
          <path d="M5 5h22v7H5z" {...accent(palette, palette.blue)} />
          <path d="M4 12h24M12 12v16" />
          <rect x="7" y="16" width="4" height="8" {...secondaryAccent(palette, palette.yellow)} />
          <rect x="8" y="8" width="4" height="2" fill={palette.color ? palette.paper : palette.ink} stroke="none" />
        </>
      );
    case "loose-parts":
      return (
        <>
          <circle cx="9" cy="9" r="5" {...accent(palette, palette.yellow)} />
          <rect x="19" y="4" width="9" height="9" {...secondaryAccent(palette, palette.blue)} />
          <path d="M3 29h12L9 18z" {...tertiaryAccent(palette, palette.teal)} />
          <path d="m20 20 8 8m0-8-8 8" {...line(palette, palette.orange)} />
        </>
      );
    case "fresh-greens":
      return (
        <>
          <rect x="2" y="2" width="28" height="28" {...accent(palette, palette.green)} />
          <rect x="4" y="4" width="9" height="9" {...secondaryAccent(palette, palette.yellow)} />
          <path d="M4 27h8l4-7 4 3 8-14" {...line(palette, palette.paper)} />
          <circle cx="26" cy="7" r="3" {...tertiaryAccent(palette, palette.orange)} />
        </>
      );
    case "fafsa":
      return (
        <>
          <rect x="2" y="8" width="21" height="18" {...surface(palette)} />
          <path d="m4 10 9 8 8-8M4 24l7-9M21 24l-6-9" />
          <rect x="25" y="5" width="5" height="6" {...accent(palette, palette.yellow)} />
          <rect x="25" y="13" width="5" height="6" {...secondaryAccent(palette, palette.cyan)} />
          <rect x="25" y="21" width="5" height="6" {...tertiaryAccent(palette, palette.magenta)} />
        </>
      );
    case "navi":
      return (
        <>
          <path d="M16 29s9-8 9-17a9 9 0 1 0-18 0c0 9 9 17 9 17Z" {...accent(palette, palette.orange)} />
          <circle cx="16" cy="12" r="4" {...secondaryAccent(palette, palette.blue)} />
        </>
      );
    case "tiktok":
      return (
        <>
          <rect x="2" y="5" width="28" height="23" {...surface(palette, "#111111")} />
          <path d="M2 12h28" {...line(palette, palette.paper)} />
          <rect x="6" y="16" width="6" height="8" {...accent(palette, palette.cyan)} />
          <rect x="13" y="16" width="6" height="8" {...secondaryAccent(palette, palette.magenta)} />
          <rect x="20" y="16" width="6" height="8" {...tertiaryAccent(palette, palette.yellow)} />
          <path d="M6 8h5M13 8h5" {...line(palette, palette.paper)} />
        </>
      );
  }
}

export function Myles97Icon({
  name,
  size = 20,
  title,
  compact = false,
  tier,
  variant = "mono",
  className,
  ...props
}: Myles97IconProps) {
  const color = variant === "color";
  const resolvedTier = compact ? "chrome" : (tier ?? iconTierForSize(size));
  const grid = GRID_BY_TIER[resolvedTier];
  const palette: IconPalette = {
    color,
    ink: color ? "#111111" : "currentColor",
    paper: "#f5f3ea",
    chrome: "#c7c7c7",
    yellow: "#ffe52f",
    blue: "#263cb8",
    teal: "#087f86",
    orange: "#f26a3d",
    green: "#19784a",
    cyan: "#35d3df",
    magenta: "#e553a1",
  };
  const classes = ["myles98-icon", color ? "myles98-icon--color" : null, className]
    .filter(Boolean)
    .join(" ");
  const common = {
    width: size,
    height: size,
    viewBox: `0 0 ${grid} ${grid}`,
    fill: "none",
    stroke: palette.ink,
    strokeWidth: STROKE_BY_TIER[resolvedTier],
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    shapeRendering:
      resolvedTier === "discovery"
        ? ("geometricPrecision" as const)
        : ("crispEdges" as const),
    focusable: false,
    className: classes,
    "data-m98-icon": name,
    "data-m98-icon-grid": String(grid),
    "data-m98-icon-tier": resolvedTier,
    "data-m98-icon-variant": variant,
    "data-m98-icon-snap": "integer",
    "data-myles97-icon-density": compact ? "compact" : undefined,
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    role: title ? ("img" as const) : undefined,
    ...props,
  };

  const glyph =
    resolvedTier === "chrome"
      ? renderChromeGlyph(name, palette)
      : resolvedTier === "menu"
        ? renderMenuGlyph(name, palette)
        : renderDiscoveryGlyph(name, palette);

  return <svg {...common}>{glyph}</svg>;
}

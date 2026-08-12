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
  | "open-apps"
  | "reset-desktop"
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
    case "reminders":
      return "document";
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

const MASTER_CONCEPT_BY_ICON: Record<Myles97IconName, string> = {
  folder: "selected-work",
  document: "reminders",
  profile: "about-myles",
  resume: "resume",
  recipe: "trini-roti",
  display: "display-properties",
  mail: "email",
  app: "generic-app",
  "open-apps": "open-apps",
  "reset-desktop": "reset-desktop",
  "loose-parts": "loose-parts",
  "fresh-greens": "fresh-greens",
  fafsa: "understandingfafsa",
  navi: "navi",
  tiktok: "tiktok-catalog",
};

function masterSourceFor(
  name: Myles97IconName,
  tier: Myles97IconTier,
) {
  const concept = MASTER_CONCEPT_BY_ICON[name];
  const grid = GRID_BY_TIER[tier];

  return {
    concept,
    grid,
    source: `/myles98-icons/${concept}/${concept}-${grid}.svg`,
  };
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

type DepthPlaneName = "cast-shadow" | "side" | "highlight";

type DepthPlaneSpec = {
  castShadow: readonly string[];
  side: readonly string[];
  highlight: readonly string[];
};

const SIDE_TONE_BY_ICON: Record<Myles97IconName, string> = {
  folder: "#b58c00",
  document: "#aaa69b",
  profile: "#7e8584",
  resume: "#aaa69b",
  recipe: "#b58b6e",
  display: "#777777",
  mail: "#78929a",
  app: "#777777",
  "open-apps": "#777777",
  "reset-desktop": "#7d5d27",
  "loose-parts": "#8b6b26",
  "fresh-greens": "#0d5432",
  fafsa: "#788190",
  navi: "#b74624",
  tiktok: "#3a3a3a",
};

function depthPlaneSpec(
  name: Myles97IconName,
  tier: Exclude<Myles97IconTier, "chrome">,
): DepthPlaneSpec {
  if (tier === "menu") {
    switch (name) {
      case "folder":
        return {
          castShadow: ["M4 22H23V23H4Z"],
          side: ["M3 20H22V22H3Z", "M20 10H22V20H20Z"],
          highlight: ["M2 4H10V5H2Z", "M2 7H3V20H2Z", "M3 7H10V8H3Z"],
        };
      case "document":
        return {
          castShadow: ["M7 22H20V23H7Z", "M19 7H20V22H19Z"],
          side: ["M6 21H19V22H6Z", "M18 8H19V21H18Z"],
          highlight: ["M5 2H15V3H5Z", "M5 3H6V21H5Z"],
        };
      case "profile":
        return {
          castShadow: ["M4 21H23V22H4Z", "M22 6H23V21H22Z"],
          side: ["M3 19H22V21H3Z", "M21 5H22V19H21Z"],
          highlight: ["M2 4H21V5H2Z", "M2 5H3V19H2Z"],
        };
      case "resume":
        return {
          castShadow: ["M8 22H20V23H8Z", "M19 8H20V22H19Z"],
          side: ["M6 20H19V22H6Z", "M18 9H19V20H18Z"],
          highlight: ["M5 2H14V3H5Z", "M5 3H6V20H5Z"],
        };
      case "recipe":
        return {
          castShadow: ["M7 22H21V23H7Z", "M19 7H21V22H19Z"],
          side: ["M6 21H19V22H6Z", "M18 8H19V21H18Z"],
          highlight: ["M5 2H15V3H5Z", "M5 3H6V21H5Z", "M15 3H16V6H15Z"],
        };
      case "display":
        return {
          castShadow: ["M4 18H23V19H4Z", "M21 5H23V18H21Z", "M9 22H17V23H9Z"],
          side: ["M3 16H22V18H3Z", "M20 4H22V16H20Z", "M13 17H14V21H13Z"],
          highlight: ["M2 3H21V4H2Z", "M2 4H3V16H2Z"],
        };
      case "mail":
        return {
          castShadow: ["M5 21H23V23H5Z", "M21 9H23V21H21Z"],
          side: ["M3 19H21V21H3Z", "M20 8H21V19H20Z", "M18 3H20V9H18Z"],
          highlight: ["M6 2H19V3H6Z", "M6 3H7V7H6Z", "M2 6H20V7H2Z", "M2 7H3V19H2Z"],
        };
      case "app":
        return {
          castShadow: ["M5 21H22V23H5Z", "M21 5H23V21H21Z"],
          side: ["M4 20H21V21H4Z", "M20 4H21V20H20Z"],
          highlight: ["M3 3H20V4H3Z", "M3 4H4V20H3Z"],
        };
      case "open-apps":
        return {
          castShadow: ["M5 21H23V23H5Z", "M21 7H23V21H21Z"],
          side: ["M4 20H22V21H4Z", "M20 6H22V20H20Z"],
          highlight: ["M2 4H18V5H2Z", "M2 5H3V18H2Z", "M6 8H21V9H6Z"],
        };
      case "reset-desktop":
        return {
          castShadow: ["M5 20H20V22H5Z"],
          side: ["M4 19H19V21H4Z", "M18 7H21V19H18Z"],
          highlight: ["M4 4H16V5H4Z", "M3 5H4V15H3Z"],
        };
      case "loose-parts":
        return {
          castShadow: ["M4 21H23V23H4Z", "M21 7H23V21H21Z"],
          side: ["M3 20H22V21H3Z", "M20 6H22V20H20Z"],
          highlight: ["M2 5H21V6H2Z", "M2 6H3V20H2Z"],
        };
      case "fresh-greens":
        return {
          castShadow: ["M4 22H23V23H4Z", "M22 4H23V22H22Z"],
          side: ["M3 21H22V22H3Z", "M21 3H22V21H21Z"],
          highlight: ["M2 2H21V3H2Z", "M2 3H3V21H2Z"],
        };
      case "fafsa":
        return {
          castShadow: ["M4 19H18V21H4Z", "M20 20H23V22H20Z"],
          side: ["M3 17H17V19H3Z", "M21 4H23V20H21Z"],
          highlight: ["M2 5H17V6H2Z", "M2 6H3V17H2Z", "M19 4H22V5H19Z"],
        };
      case "navi":
        return {
          castShadow: ["M11 20H14V22H11Z", "M18 8H20V12H18Z"],
          side: ["M12 18H15V21H12Z", "M17 9H19V13H17Z"],
          highlight: ["M8 3H13V4H8Z", "M6 5H7V10H6Z"],
        };
      case "tiktok":
        return {
          castShadow: ["M4 20H23V22H4Z", "M22 6H23V20H22Z"],
          side: ["M3 19H22V20H3Z", "M21 5H22V19H21Z"],
          highlight: ["M2 4H21V5H2Z", "M2 5H3V19H2Z"],
        };
    }
  }

  switch (name) {
    case "folder":
      return {
        castShadow: ["M5 30H31V31H5Z"],
        side: ["M3 27H30V30H3Z", "M28 13H30V27H28Z"],
        highlight: ["M2 5H13V6H2Z", "M2 9H3V27H2Z", "M3 9H13V10H3Z"],
      };
    case "document":
      return {
        castShadow: ["M9 30H27V31H9Z", "M26 9H27V30H26Z"],
        side: ["M8 28H26V30H8Z", "M24 10H26V28H24Z"],
        highlight: ["M7 2H20V3H7Z", "M7 3H8V28H7Z"],
      };
    case "profile":
      return {
        castShadow: ["M5 29H31V31H5Z", "M30 7H31V29H30Z"],
        side: ["M3 27H30V29H3Z", "M28 6H30V27H28Z"],
        highlight: ["M2 5H29V6H2Z", "M2 6H3V27H2Z"],
      };
    case "resume":
      return {
        castShadow: ["M10 30H27V31H10Z", "M26 10H27V30H26Z"],
        side: ["M8 28H26V30H8Z", "M24 11H26V28H24Z"],
        highlight: ["M7 2H19V3H7Z", "M7 3H8V28H7Z"],
      };
    case "recipe":
      return {
        castShadow: ["M9 30H28V31H9Z", "M26 9H28V30H26Z"],
        side: ["M8 29H26V30H8Z", "M24 10H26V29H24Z"],
        highlight: ["M7 2H20V3H7Z", "M7 3H8V29H7Z", "M20 3H21V7H20Z"],
      };
    case "display":
      return {
        castShadow: ["M5 25H31V27H5Z", "M30 6H31V25H30Z", "M11 30H23V31H11Z"],
        side: ["M3 23H30V25H3Z", "M28 5H30V23H28Z", "M17 24H18V29H17Z"],
        highlight: ["M2 4H29V5H2Z", "M2 5H3V23H2Z"],
      };
    case "mail":
      return {
        castShadow: ["M5 28H31V30H5Z", "M29 10H31V28H29Z"],
        side: ["M3 26H29V28H3Z", "M27 9H29V26H27Z", "M24 3H27V11H24Z"],
        highlight: ["M8 2H26V3H8Z", "M8 3H9V8H8Z", "M2 7H28V8H2Z", "M2 8H3V26H2Z"],
      };
    case "app":
      return {
        castShadow: ["M6 28H30V30H6Z", "M28 6H30V28H28Z"],
        side: ["M5 27H28V28H5Z", "M27 5H28V27H27Z"],
        highlight: ["M4 4H27V5H4Z", "M4 5H5V27H4Z"],
      };
    case "open-apps":
      return {
        castShadow: ["M6 28H31V30H6Z", "M29 9H31V28H29Z"],
        side: ["M5 27H30V28H5Z", "M28 8H30V27H28Z"],
        highlight: ["M3 5H24V6H3Z", "M3 6H4V25H3Z", "M8 10H29V11H8Z"],
      };
    case "reset-desktop":
      return {
        castShadow: ["M6 27H27V30H6Z"],
        side: ["M5 26H26V28H5Z", "M25 9H29V26H25Z"],
        highlight: ["M5 5H22V6H5Z", "M4 6H5V21H4Z"],
      };
    case "loose-parts":
      return {
        castShadow: ["M5 29H31V31H5Z", "M30 7H31V29H30Z"],
        side: ["M3 28H30V29H3Z", "M28 6H30V28H28Z"],
        highlight: ["M2 5H29V6H2Z", "M2 6H3V28H2Z"],
      };
    case "fresh-greens":
      return {
        castShadow: ["M5 30H31V31H5Z", "M30 5H31V30H30Z"],
        side: ["M3 29H30V30H3Z", "M29 3H30V29H29Z"],
        highlight: ["M2 2H29V3H2Z", "M2 3H3V29H2Z"],
      };
    case "fafsa":
      return {
        castShadow: ["M5 27H24V29H5Z", "M27 27H31V29H27Z"],
        side: ["M3 25H23V27H3Z", "M29 5H31V27H29Z"],
        highlight: ["M2 8H23V9H2Z", "M2 9H3V25H2Z", "M25 5H30V6H25Z"],
      };
    case "navi":
      return {
        castShadow: ["M15 28H18V31H15Z", "M24 11H27V16H24Z"],
        side: ["M16 25H19V29H16Z", "M23 12H25V17H23Z"],
        highlight: ["M11 4H17V5H11Z", "M8 7H9V13H8Z"],
      };
    case "tiktok":
      return {
        castShadow: ["M5 28H31V30H5Z", "M30 7H31V28H30Z"],
        side: ["M3 27H30V28H3Z", "M28 6H30V27H28Z"],
        highlight: ["M2 5H29V6H2Z", "M2 6H3V27H2Z"],
      };
  }
}

function renderDepthPlanePaths(
  name: Myles97IconName,
  plane: DepthPlaneName,
  paths: readonly string[],
  tone: string,
) {
  return paths.map((data, index) => (
    <path
      key={`${plane}-${index}`}
      d={data}
      data-m98-icon-object={name}
      data-m98-icon-plane={plane}
      fill={tone}
      stroke="none"
    />
  ));
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
    case "open-apps":
      return (
        <>
          <rect x="1" y="2" width="10" height="8" {...surface(palette, palette.chrome)} />
          <path d="M2 3h8v2H2z" {...accent(palette, palette.blue)} />
          <rect x="5" y="6" width="10" height="8" {...surface(palette)} />
          <path d="M6 7h8v2H6z" {...secondaryAccent(palette, palette.teal)} />
        </>
      );
    case "reset-desktop":
      return (
        <>
          <path d="M5 3h7v3M12 3v3H9M12 7v4l-2 2H5l-2-2V7l2-2" {...line(palette)} />
          <path d="M2 6h4l-2 3z" {...accent(palette, palette.orange)} />
        </>
      );
    case "loose-parts":
      return (
        <>
          <rect
            x="1"
            y="3"
            width="14"
            height="12"
            data-m98-loose-parts-object="tray"
            {...surface(palette, palette.chrome)}
          />
          <circle
            cx="5"
            cy="8"
            r="2"
            data-m98-loose-parts-object="part"
            {...accent(palette, palette.yellow)}
          />
          <rect
            x="9"
            y="6"
            width="3"
            height="3"
            data-m98-loose-parts-object="part"
            {...secondaryAccent(palette, palette.blue)}
          />
          <path
            d="M5 13h5l-2-3z"
            data-m98-loose-parts-object="part"
            {...tertiaryAccent(palette, palette.teal)}
          />
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
          <rect
            x="6"
            y="2"
            width="13"
            height="9"
            data-m98-mail-part="paper"
            {...surface(palette, "#d8edf2")}
          />
          <path d="M8 5h8M8 8h6" {...line(palette, palette.blue)} />
          <rect
            x="2"
            y="6"
            width="19"
            height="14"
            data-m98-mail-part="envelope"
            {...surface(palette)}
          />
          <path
            d="m3 8 9 7 8-7M3 18l6-7M20 18l-6-7"
            data-m98-mail-part="fold"
          />
        </>
      );
    case "app":
      return (
        <>
          <rect x="3" y="3" width="18" height="18" {...surface(palette, palette.chrome)} />
          <path d="M4 4h16v5H4z" {...accent(palette, palette.blue)} />
          <path d="M3 9h18M9 9v12" />
          <rect x="5" y="12" width="3" height="6" {...secondaryAccent(palette, palette.yellow)} />
          <rect x="6" y="6" width="3" height="1" fill={fill(palette, palette.paper)} stroke="none" />
        </>
      );
    case "open-apps":
      return (
        <>
          <rect x="2" y="3" width="15" height="12" {...surface(palette, palette.chrome)} />
          <path d="M3 4h13v3H3z" {...accent(palette, palette.blue)} />
          <rect x="7" y="9" width="15" height="12" {...surface(palette)} />
          <path d="M8 10h13v3H8z" {...secondaryAccent(palette, palette.teal)} />
          <path d="M10 15h8M10 18h6" {...line(palette, palette.blue)} />
        </>
      );
    case "reset-desktop":
      return (
        <>
          <path d="M7 3h10v4M17 3v4h-4M18 8v7l-3 3H8l-3-3V8l3-3" {...line(palette)} />
          <path d="M3 7h6l-3 4z" {...accent(palette, palette.orange)} />
        </>
      );
    case "loose-parts":
      return (
        <>
          <rect
            x="2"
            y="5"
            width="20"
            height="16"
            data-m98-loose-parts-object="tray"
            {...surface(palette, palette.chrome)}
          />
          <path d="M3 10h18" />
          <circle
            cx="7"
            cy="15"
            r="3"
            data-m98-loose-parts-object="part"
            {...accent(palette, palette.yellow)}
          />
          <rect
            x="13"
            y="12"
            width="5"
            height="5"
            data-m98-loose-parts-object="part"
            {...secondaryAccent(palette, palette.blue)}
          />
          <path
            d="M10 20h8l-4-5z"
            data-m98-loose-parts-object="part"
            {...tertiaryAccent(palette, palette.teal)}
          />
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
          <rect
            x="8"
            y="2"
            width="18"
            height="12"
            data-m98-mail-part="paper"
            {...surface(palette, "#d8edf2")}
          />
          <path d="M11 6h11M11 9h8" {...line(palette, palette.blue)} />
          <rect
            x="2"
            y="7"
            width="27"
            height="20"
            data-m98-mail-part="envelope"
            {...surface(palette)}
          />
          <path
            d="m4 9 12 10 11-10M4 25l8-10M27 25l-8-10"
            data-m98-mail-part="fold"
          />
        </>
      );
    case "app":
      return (
        <>
          <rect x="4" y="4" width="24" height="24" {...surface(palette, palette.chrome)} />
          <path d="M5 5h22v7H5z" {...accent(palette, palette.blue)} />
          <path d="M4 12h24M12 12v16" />
          <rect x="7" y="16" width="4" height="8" {...secondaryAccent(palette, palette.yellow)} />
          <rect x="8" y="8" width="4" height="2" fill={fill(palette, palette.paper)} stroke="none" />
        </>
      );
    case "open-apps":
      return (
        <>
          <rect x="3" y="4" width="20" height="16" {...surface(palette, palette.chrome)} />
          <path d="M4 5h18v4H4z" {...accent(palette, palette.blue)} />
          <rect x="10" y="11" width="20" height="16" {...surface(palette)} />
          <path d="M11 12h18v4H11z" {...secondaryAccent(palette, palette.teal)} />
          <path d="M14 19h11M14 23h8" {...line(palette, palette.blue)} />
        </>
      );
    case "reset-desktop":
      return (
        <>
          <path d="M9 4h14v5M23 4v5h-5M25 10v10l-4 4H10l-4-4V10l4-4" {...line(palette)} />
          <path d="M4 9h8l-4 5z" {...accent(palette, palette.orange)} />
        </>
      );
    case "loose-parts":
      return (
        <>
          <rect
            x="2"
            y="5"
            width="28"
            height="23"
            data-m98-loose-parts-object="tray"
            {...surface(palette, palette.chrome)}
          />
          <path d="M3 13h26" />
          <circle
            cx="9"
            cy="20"
            r="4"
            data-m98-loose-parts-object="part"
            {...accent(palette, palette.yellow)}
          />
          <rect
            x="18"
            y="16"
            width="7"
            height="7"
            data-m98-loose-parts-object="part"
            {...secondaryAccent(palette, palette.blue)}
          />
          <path
            d="M12 27h13l-7-8z"
            data-m98-loose-parts-object="part"
            {...tertiaryAccent(palette, palette.teal)}
          />
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

  const renderer =
    resolvedTier === "chrome"
      ? renderChromeGlyph
      : resolvedTier === "menu"
        ? renderMenuGlyph
        : renderDiscoveryGlyph;
  const glyph = renderer(name, palette);
  if (!color || compact) {
    return <svg {...common}>{glyph}</svg>;
  }

  const master = masterSourceFor(name, resolvedTier);
  const masterLayer = (
    <image
      x="0"
      y="0"
      width={master.grid}
      height={master.grid}
      href={master.source}
      preserveAspectRatio="none"
      data-m98-icon-master="true"
      data-m98-icon-master-concept={master.concept}
      data-m98-icon-master-grid={String(master.grid)}
      aria-hidden="true"
    />
  );

  if (resolvedTier === "chrome") {
    return (
      <svg {...common}>
        {masterLayer}
        <g className="myles98-icon-fallback" aria-hidden="true">
          {glyph}
        </g>
      </svg>
    );
  }

  const planes = depthPlaneSpec(name, resolvedTier);

  return (
    <svg {...common}>
      {masterLayer}
      <g className="myles98-icon-fallback" aria-hidden="true">
        <g data-m98-icon-depth="shadow" data-m98-icon-layer="cast-shadow">
          {renderDepthPlanePaths(name, "cast-shadow", planes.castShadow, "#4a4a4a")}
        </g>
        <g data-m98-icon-depth="face" data-m98-icon-layer="face">
          {glyph}
        </g>
        <g data-m98-icon-depth="shadow" data-m98-icon-layer="side">
          {renderDepthPlanePaths(name, "side", planes.side, SIDE_TONE_BY_ICON[name])}
        </g>
        <g data-m98-icon-depth="highlight" data-m98-icon-layer="highlight">
          {renderDepthPlanePaths(name, "highlight", planes.highlight, "#ffffff")}
        </g>
      </g>
    </svg>
  );
}

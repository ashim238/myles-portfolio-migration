import type { SVGProps } from "react";

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

type Myles97IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: Myles97IconName;
  size?: number;
  title?: string;
  compact?: boolean;
  variant?: Myles97IconVariant;
};

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

export function Myles97Icon({
  name,
  size = 20,
  title,
  compact = false,
  variant = "mono",
  className,
  ...props
}: Myles97IconProps) {
  const color = variant === "color";
  const ink = color ? "#111111" : "currentColor";
  const paper = color ? "#f5f3ea" : "none";
  const chrome = color ? "#c7c7c7" : "none";
  const yellow = "#ffe52f";
  const blue = "#263cb8";
  const teal = "#087f86";
  const orange = "#f26a3d";
  const green = "#19784a";
  const cyan = "#35d3df";
  const magenta = "#e553a1";
  const accent = (value: string) => (color ? value : "none");
  const accentStroke = color ? "none" : ink;
  const classes = ["myles98-icon", color ? "myles98-icon--color" : null, className]
    .filter(Boolean)
    .join(" ");
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: ink,
    strokeWidth: 1.5,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    shapeRendering: "geometricPrecision" as const,
    focusable: false,
    className: classes,
    "data-m98-icon": name,
    "data-m98-icon-grid": "24",
    "data-m98-icon-variant": variant,
    "data-myles97-icon-density": compact ? "compact" : undefined,
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    role: title ? ("img" as const) : undefined,
    ...props,
  };

  switch (name) {
    case "folder":
      return (
        <svg {...common}>
          <path d="M3 7h7l2 2h9v10H3z" fill={color ? "#e4ae22" : "none"} />
          <path d="M3 7V5h7l2 2" />
          <path
            className="myles98-icon-accent"
            d="M5 11h14v6H5z"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
          <path d="M7 13h5" stroke={color ? blue : ink} />
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          <path className="myles98-icon-surface" d="M6 3h8l4 4v14H6z" fill={paper} />
          <path d="m14 3 4 4h-4z" fill={accent(blue)} stroke={accentStroke} />
          <path d="M14 3v5h4" />
          <path d="M9 12h6" stroke={color ? yellow : ink} strokeWidth="2" />
          <path d="M9 16h6" />
        </svg>
      );
    case "profile":
      return (
        <svg {...common}>
          <rect className="myles98-icon-surface" x="3" y="4" width="18" height="16" fill={paper} />
          <path d="M4 5h16v3H4z" fill={accent(blue)} stroke={accentStroke} />
          <circle cx="8" cy="12" r="2.25" fill={accent(yellow)} />
          <path d="M5 18c.4-2.4 1.4-3.6 3-3.6s2.6 1.2 3 3.6z" fill={accent(teal)} />
          <path d="M13 11h5M13 14h4.5M13 17h3.5" />
        </svg>
      );
    case "resume":
      return (
        <svg {...common}>
          <path className="myles98-icon-surface" d="M6 3h8l4 4v14H6z" fill={paper} />
          <path d="m14 3 4 4h-4z" fill={accent(blue)} stroke={accentStroke} />
          <path d="M14 3v5h4" />
          <rect x="8" y="11" width="2" height="2" fill={accent(yellow)} stroke={accentStroke} />
          <rect x="8" y="15" width="2" height="2" fill={accent(yellow)} stroke={accentStroke} />
          <path d="M12 12h4M12 16h4M8 19h8" />
        </svg>
      );
    case "recipe":
      return (
        <svg {...common}>
          <path className="myles98-icon-surface" d="M6 3h8l4 4v14H6z" fill={paper} />
          <path d="m14 3 4 4h-4z" fill={accent(orange)} stroke={accentStroke} />
          <path d="M14 3v5h4M8 15h8M8 18h6" />
          <rect x="8" y="10" width="8" height="2" fill={accent(blue)} stroke={accentStroke} />
          <path d="M8.5 8c0-1.2 1-1.2 1-2.4M11.5 8c0-1.2 1-1.2 1-2.4" stroke={color ? yellow : ink} />
        </svg>
      );
    case "display":
      return (
        <svg {...common}>
          <rect className="myles98-icon-surface" x="3" y="4" width="18" height="13" fill={chrome} />
          <path d="M6 7h12v7H6z" fill={accent(blue)} stroke={accentStroke} />
          <rect x="7" y="8" width="3" height="3" fill={accent(yellow)} stroke={accentStroke} />
          <path d="M9 21h6M12 17v4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect className="myles98-icon-surface" x="3" y="5" width="18" height="14" fill={paper} />
          <path d="m4 7 8 6 8-6v3l-8 6-8-6z" fill={accent(blue)} stroke={accentStroke} />
          <path d="m4 7 8 6 8-6" />
          <path d="m4 17 5-5M20 17l-5-5" opacity="0.55" />
          <rect x="17" y="7" width="2" height="2" fill={accent(yellow)} stroke={accentStroke} />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          <rect className="myles98-icon-surface" x="4" y="4" width="16" height="16" fill={chrome} />
          <path d="M5 5h14v4H5z" fill={accent(blue)} stroke={accentStroke} />
          <path d="M4 9h16M9 9v11" />
          <rect x="6" y="6" width="2" height="1" fill={color ? paper : ink} stroke="none" />
          <rect x="6" y="12" width="2" height="5" fill={accent(yellow)} stroke={accentStroke} />
        </svg>
      );
    case "loose-parts":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="3" fill={accent(yellow)} />
          <rect x="14" y="4" width="6" height="6" fill={accent(blue)} />
          <path d="M4 20h6l-3-5z" fill={accent(teal)} />
          <path d="M15 15l5 5M20 15l-5 5" stroke={color ? orange : ink} strokeWidth="2" />
        </svg>
      );
    case "fresh-greens":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" fill={accent(green)} />
          <path d="M4 19h5l2-4 3 2 6-9" stroke={color ? paper : ink} />
          <rect x="3" y="4" width="6" height="6" fill={accent(yellow)} />
          <path d="M6 10v4" />
          <circle cx="19" cy="6" r="2" fill={accent(orange)} />
        </svg>
      );
    case "fafsa":
      if (compact) {
        return (
          <svg {...common}>
            <path d="M3 4h18v16H3zM3 8h18" />
            <path d="M6 11h12v6H6zM6 11l6 4 6-4" />
          </svg>
        );
      }
      return (
        <svg {...common}>
          <rect className="myles98-icon-surface" x="3" y="6" width="13" height="11" fill={paper} />
          <path d="m4 8 5.5 4L15 8v3l-5.5 4L4 11z" fill={accent(blue)} stroke={accentStroke} />
          <path d="m4 8 5.5 4L15 8" />
          <rect x="17" y="5" width="4" height="4" fill={accent(yellow)} />
          <rect x="17" y="11" width="4" height="3" fill={accent(cyan)} />
          <rect x="17" y="16" width="4" height="3" fill={accent(magenta)} />
        </svg>
      );
    case "navi":
      return (
        <svg {...common}>
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" fill={accent(orange)} />
          <circle cx="12" cy="10" r="3.5" fill={accent(blue)} />
          <path d="m9 13 2-5 4-2-2 5z" fill={accent(yellow)} stroke={accentStroke} />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <rect className="myles98-icon-surface" x="3" y="4" width="18" height="16" fill={color ? "#111111" : "none"} />
          <path d="M3 9h18" stroke={color ? paper : ink} />
          <rect x="5" y="12" width="4" height="5" fill={accent(cyan)} stroke={accentStroke} />
          <rect x="10" y="12" width="4" height="5" fill={accent(magenta)} stroke={accentStroke} />
          <rect x="15" y="12" width="4" height="5" fill={accent(yellow)} stroke={accentStroke} />
          <path d="M6 6h2M10 6h2" stroke={color ? paper : ink} strokeWidth="2" />
        </svg>
      );
  }
}

import type { SVGProps } from "react";
import styles from "./icons.module.css";

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
  variant = "mono",
  className,
  ...props
}: Myles97IconProps) {
  const color = variant === "color";
  const ink = color ? "#111111" : "currentColor";
  const paper = color ? "#f5f3ea" : "none";
  const chrome = color ? "#c7c7c7" : "none";
  const yellow = color ? "#ffe52f" : "currentColor";
  const blue = color ? "#263cb8" : "currentColor";
  const teal = color ? "#087f86" : "none";
  const orange = color ? "#f26a3d" : "currentColor";
  const green = color ? "#19784a" : "none";
  const cyan = color ? "#35d3df" : "none";
  const magenta = color ? "#e553a1" : "currentColor";
  const classes = [styles.icon, color ? styles.color : null, className]
    .filter(Boolean)
    .join(" ");
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: ink,
    strokeWidth: 1.6,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    shapeRendering: "geometricPrecision" as const,
    focusable: false,
    className: classes,
    "data-m98-icon": name,
    "data-m98-icon-variant": variant,
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    role: title ? ("img" as const) : undefined,
    ...props,
  };
  const accessibleTitle = title ? <title>{title}</title> : null;

  switch (name) {
    case "folder":
      return (
        <svg {...common}>
          {accessibleTitle}
          <path
            className={styles.surface}
            d="M2.5 6.5h7l2 2H21v11H2.5z"
            fill={color ? "#e4ae22" : "none"}
          />
          <path className={styles.accent} d="M3 9h18v10.5H3z" fill={yellow} />
          <path className={styles.line} d="M3 6.5V4.5h7l2 2" />
          <rect
            className={styles.surface}
            x="5.5"
            y="12"
            width="11"
            height="4.5"
            fill={paper}
          />
          <rect
            className={styles.accentSecondary}
            x="6.5"
            y="13"
            width="4.5"
            height="1.5"
            fill={blue}
            stroke="none"
          />
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          {accessibleTitle}
          <path className={styles.surface} d="M5 2.5h9l5 5V21H5z" fill={paper} />
          <path className={styles.accentSecondary} d="M14 2.5v5h5" fill={blue} />
          <rect
            className={styles.accent}
            x="8"
            y="10.5"
            width="8"
            height="2"
            fill={yellow}
            stroke="none"
          />
          <path className={styles.line} d="M8 15h8M8 18h6" />
        </svg>
      );
    case "profile":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.surface}
            x="2.5"
            y="4"
            width="19"
            height="16"
            fill={paper}
          />
          <rect
            className={styles.accentSecondary}
            x="2.5"
            y="4"
            width="19"
            height="4"
            fill={blue}
          />
          <circle
            className={styles.accent}
            cx="8"
            cy="12.5"
            r="2.75"
            fill={yellow}
          />
          <path
            className={styles.accentTertiary}
            d="M4.75 18c.4-2.4 1.45-3.6 3.25-3.6s2.85 1.2 3.25 3.6z"
            fill={teal}
          />
          <path className={styles.line} d="M13 11h6M13 14h5M13 17h4" />
        </svg>
      );
    case "resume":
      return (
        <svg {...common}>
          {accessibleTitle}
          <path className={styles.surface} d="M5 2.5h9l5 5V21H5z" fill={paper} />
          <path className={styles.accentSecondary} d="M14 2.5v5h5" fill={blue} />
          <rect className={styles.accent} x="7.5" y="9.5" width="2" height="2" fill={yellow} />
          <rect className={styles.accent} x="7.5" y="13.5" width="2" height="2" fill={yellow} />
          <path className={styles.line} d="M11 10.5h5M11 14.5h5M7.5 18h8.5" />
        </svg>
      );
    case "recipe":
      return (
        <svg {...common}>
          {accessibleTitle}
          <path className={styles.surface} d="M5 2.5h9l5 5V21H5z" fill={paper} />
          <path className={styles.accentTertiary} d="M14 2.5v5h5" fill={orange} />
          <rect
            className={styles.accentSecondary}
            x="7.5"
            y="10"
            width="9"
            height="2"
            fill={blue}
            stroke="none"
          />
          <path className={styles.line} d="M8 15h8M8 18h6" />
          <path className={styles.accent} d="M8 7c0-1 1-1 1-2M11 7c0-1 1-1 1-2" stroke={yellow} />
        </svg>
      );
    case "display":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect className={styles.surface} x="2" y="3" width="20" height="15" fill={chrome} />
          <rect
            className={styles.accentSecondary}
            x="4.5"
            y="5.5"
            width="15"
            height="9"
            fill={blue}
          />
          <rect
            className={styles.accent}
            x="6"
            y="7"
            width="3"
            height="3"
            fill={yellow}
            stroke="none"
          />
          <path className={styles.line} d="M8 21h8M12 18v3" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect className={styles.surface} x="2.5" y="5" width="19" height="14" fill={paper} />
          <path
            className={styles.accentSecondary}
            d="m3.5 7 8.5 6 8.5-6v3.5L12 17 3.5 10.5z"
            fill={blue}
          />
          <rect className={styles.accent} x="16.5" y="7" width="2.5" height="2.5" fill={yellow} />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect className={styles.surface} x="2.5" y="3" width="19" height="18" fill={chrome} />
          <rect
            className={styles.accentSecondary}
            x="2.5"
            y="3"
            width="19"
            height="4.5"
            fill={blue}
          />
          <rect className={styles.accent} x="5" y="10" width="5" height="7" fill={yellow} />
          <path className={styles.line} d="M12.5 10h6M12.5 13.5h6M12.5 17h4" />
        </svg>
      );
    case "loose-parts":
      return (
        <svg {...common}>
          {accessibleTitle}
          <circle className={styles.accent} cx="6.5" cy="6.5" r="3.25" fill={yellow} />
          <rect
            className={styles.accentSecondary}
            x="13.5"
            y="3"
            width="7"
            height="7"
            fill={blue}
          />
          <path className={styles.accentTertiary} d="M3 14h7v6.5H3z" fill={teal} />
          <path
            className={styles.line}
            d="m14 14 6.5 6.5M20.5 14 14 20.5"
            stroke={orange}
            strokeWidth="2.4"
          />
        </svg>
      );
    case "fresh-greens":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.accentTertiary}
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            fill={green}
          />
          <rect className={styles.accent} x="4.5" y="4.5" width="5.5" height="5.5" fill={yellow} />
          <circle
            className={styles.accentSecondary}
            cx="17.5"
            cy="6.5"
            r="2.25"
            fill={orange}
          />
          <path
            className={styles.line}
            d="M4.5 18.5h4l2.5-5 3.25 2 4.25-6"
            stroke={color ? paper : ink}
            strokeWidth="2"
          />
          <path className={styles.line} d="M7.25 10v3" stroke={color ? paper : ink} />
        </svg>
      );
    case "fafsa":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect className={styles.surface} x="2" y="5.5" width="14" height="12" fill={paper} />
          <path
            className={styles.accentSecondary}
            d="m3 7.5 6 4.5 6-4.5v3L9 15l-6-4.5z"
            fill={blue}
          />
          <rect className={styles.accent} x="17.5" y="4" width="4" height="4" fill={yellow} />
          <rect className={styles.accentSecondary} x="17.5" y="10" width="4" height="4" fill={cyan} />
          <rect className={styles.accentTertiary} x="17.5" y="16" width="4" height="4" fill={magenta} />
        </svg>
      );
    case "navi":
      return (
        <svg {...common}>
          {accessibleTitle}
          <path
            className={styles.accentTertiary}
            d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"
            fill={orange}
          />
          <circle className={styles.accentSecondary} cx="12" cy="10" r="4" fill={blue} />
          <path className={styles.accent} d="m10 13 1.5-4 3-1.5-1.5 4z" fill={yellow} />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.surface}
            x="2"
            y="3"
            width="20"
            height="18"
            fill={color ? "#111111" : "none"}
            stroke={ink}
          />
          <rect
            className={styles.accentSecondary}
            x="2"
            y="3"
            width="20"
            height="4.5"
            fill={color ? "#f5f3ea" : "none"}
          />
          <rect className={styles.accentSecondary} x="4.5" y="10" width="4" height="7.5" fill={cyan} />
          <rect className={styles.accentTertiary} x="10" y="10" width="4" height="7.5" fill={magenta} />
          <rect className={styles.accent} x="15.5" y="10" width="4" height="7.5" fill={yellow} />
          <path className={styles.line} d="M5 5.25h2M9 5.25h2" stroke={color ? "#111111" : ink} />
        </svg>
      );
  }
}

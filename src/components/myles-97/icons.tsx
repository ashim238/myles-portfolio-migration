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
  const yellow = "#ffe52f";
  const blue = "#263cb8";
  const teal = "#087f86";
  const orange = "#f26a3d";
  const green = "#19784a";
  const cyan = "#35d3df";
  const magenta = "#e553a1";
  const accent = (value: string) => (color ? value : "none");
  const accentStroke = color ? "none" : ink;
  const classes = [styles.icon, color ? styles.color : null, className]
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
            d="M2.75 6.25h6.75l2 2h9.75v11H2.75z"
            fill={color ? "#e4ae22" : "none"}
          />
          <path
            className={styles.accent}
            d="M3.5 9h17v9.5h-17z"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="M3.25 9h17.5" />
          <rect
            className={styles.surface}
            x="5.75"
            y="12"
            width="10.5"
            height="4.25"
            fill={paper}
          />
          <path
            className={styles.accentSecondary}
            d="M7.25 13.5h4.25"
            stroke={color ? blue : ink}
          />
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          {accessibleTitle}
          <path
            className={styles.surface}
            d="M5.25 2.75h8.5l5 5v13.5H5.25z"
            fill={paper}
          />
          <path
            className={styles.accentSecondary}
            d="m13.75 2.75 5 5h-5z"
            fill={accent(blue)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="M13.75 2.75v5h5" />
          <rect
            className={styles.accent}
            x="7.75"
            y="10.25"
            width="8.5"
            height="2.25"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="M7.75 15.25h8.5M7.75 18.25h6.25" />
        </svg>
      );
    case "profile":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.surface}
            x="2.75"
            y="3.75"
            width="18.5"
            height="16.5"
            fill={paper}
          />
          <path
            className={styles.accentSecondary}
            d="M3.5 4.5h17v3.25h-17z"
            fill={accent(blue)}
            stroke={accentStroke}
          />
          <circle
            className={styles.accent}
            cx="8.25"
            cy="12.25"
            r="2.4"
            fill={accent(yellow)}
          />
          <path
            className={styles.accentTertiary}
            d="M4.75 18c.45-2.5 1.6-3.75 3.5-3.75s3.05 1.25 3.5 3.75z"
            fill={accent(teal)}
          />
          <path className={styles.line} d="M13.25 11h5.5M13.25 14h4.75M13.25 17h3.75" />
        </svg>
      );
    case "resume":
      return (
        <svg {...common}>
          {accessibleTitle}
          <path
            className={styles.surface}
            d="M5.25 2.75h8.5l5 5v13.5H5.25z"
            fill={paper}
          />
          <path
            className={styles.accentSecondary}
            d="m13.75 2.75 5 5h-5z"
            fill={accent(blue)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="M13.75 2.75v5h5" />
          <rect
            className={styles.accent}
            x="7.5"
            y="10"
            width="2.25"
            height="2.25"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
          <rect
            className={styles.accent}
            x="7.5"
            y="14"
            width="2.25"
            height="2.25"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="M11.5 11.125h4.75M11.5 15.125h4.75M7.5 18.5h8.75" />
        </svg>
      );
    case "recipe":
      return (
        <svg {...common}>
          {accessibleTitle}
          <path
            className={styles.surface}
            d="M5.25 2.75h8.5l5 5v13.5H5.25z"
            fill={paper}
          />
          <path
            className={styles.accentTertiary}
            d="m13.75 2.75 5 5h-5z"
            fill={accent(orange)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="M13.75 2.75v5h5" />
          <rect
            className={styles.accentSecondary}
            x="7.5"
            y="10.25"
            width="9"
            height="2.25"
            fill={accent(blue)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="M7.75 15.5h8.5M7.75 18.5h6" />
          <path
            className={styles.accent}
            d="M8.25 7.5c0-1.25 1-1.25 1-2.5M11.25 7.5c0-1.25 1-1.25 1-2.5"
            stroke={color ? yellow : ink}
          />
        </svg>
      );
    case "display":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.surface}
            x="2.75"
            y="3.25"
            width="18.5"
            height="14.5"
            fill={chrome}
          />
          <rect
            className={styles.accentSecondary}
            x="4.75"
            y="5.25"
            width="14.5"
            height="9.5"
            fill={accent(blue)}
          />
          <rect
            className={styles.accent}
            x="6.25"
            y="6.75"
            width="3.25"
            height="3.25"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
          <path
            className={styles.line}
            d="M11.25 8.25h5.5M11.25 11.25h4"
            stroke={color ? paper : ink}
          />
          <path className={styles.line} d="M8.25 21h7.5M12 17.75V21" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.surface}
            x="2.75"
            y="5.25"
            width="18.5"
            height="13.5"
            fill={paper}
          />
          <path
            className={styles.accentSecondary}
            d="m3.5 6.25 8.5 6.25 8.5-6.25v3L12 15.5 3.5 9.25z"
            fill={accent(blue)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="m3.5 6.25 8.5 6.25 8.5-6.25M3.5 17.75l6-5M20.5 17.75l-6-5" />
          <rect
            className={styles.accent}
            x="16.5"
            y="7"
            width="2.5"
            height="2.5"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.surface}
            x="2.75"
            y="3.25"
            width="18.5"
            height="17.5"
            fill={chrome}
          />
          <path
            className={styles.accentSecondary}
            d="M3.5 4h17v3.75h-17z"
            fill={accent(blue)}
            stroke={accentStroke}
          />
          <path
            className={styles.line}
            d="M16.25 5.875h1.25M19 5.875h.5"
            stroke={color ? paper : ink}
          />
          <rect
            className={styles.accent}
            x="5"
            y="9.75"
            width="5.5"
            height="7.25"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="M13 10.5h5.25M13 13.5h5.25M13 16.5h3.75" />
        </svg>
      );
    case "loose-parts":
      return (
        <svg {...common}>
          {accessibleTitle}
          <circle
            className={styles.accent}
            cx="6.25"
            cy="6.25"
            r="2.75"
            fill={accent(yellow)}
          />
          <rect
            className={styles.accentSecondary}
            x="13.25"
            y="3.25"
            width="6.5"
            height="6.5"
            fill={accent(blue)}
          />
          <path
            className={styles.accentTertiary}
            d="M3.25 20.25h7l-3.5-6z"
            fill={accent(teal)}
          />
          <path
            className={styles.line}
            d="m14 14 6.25 6.25M20.25 14 14 20.25"
            stroke={color ? orange : ink}
            strokeWidth="2"
          />
        </svg>
      );
    case "fresh-greens":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.accentTertiary}
            x="2.75"
            y="2.75"
            width="18.5"
            height="18.5"
            fill={accent(green)}
          />
          <path
            className={styles.line}
            d="M8.75 3.5v17M15.25 3.5v17M3.5 8.75h17M3.5 15.25h17"
            stroke={color ? paper : ink}
            opacity="0.22"
          />
          <path
            className={styles.line}
            d="M5.25 17.75h3l2.75-5.5 3.25 2 4.5-6"
            stroke={color ? paper : ink}
            strokeWidth="1.75"
          />
          <rect
            className={styles.accent}
            x="4.25"
            y="16.5"
            width="2.5"
            height="2.5"
            fill={accent(yellow)}
          />
          <circle
            className={styles.accentSecondary}
            cx="18.75"
            cy="8.25"
            r="1.75"
            fill={accent(orange)}
          />
        </svg>
      );
    case "fafsa":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.surface}
            x="2.75"
            y="6"
            width="13.25"
            height="11.75"
            fill={paper}
          />
          <path
            className={styles.accentSecondary}
            d="m3.5 7 5.875 4.5L15.25 7v2.75l-5.875 4.5L3.5 9.75z"
            fill={accent(blue)}
            stroke={accentStroke}
          />
          <path className={styles.line} d="m3.5 7 5.875 4.5L15.25 7M3.5 16.75l4.25-4M15.25 16.75l-4.25-4" />
          <rect
            className={styles.accent}
            x="17.25"
            y="4.25"
            width="4"
            height="4"
            fill={accent(yellow)}
          />
          <rect
            className={styles.accentSecondary}
            x="17.25"
            y="10"
            width="4"
            height="4"
            fill={accent(cyan)}
          />
          <rect
            className={styles.accentTertiary}
            x="17.25"
            y="15.75"
            width="4"
            height="4"
            fill={accent(magenta)}
          />
        </svg>
      );
    case "navi":
      return (
        <svg {...common}>
          {accessibleTitle}
          <path
            className={styles.accentTertiary}
            d="M12 21.25c4.4-4.15 6.5-7.7 6.5-11.25a6.5 6.5 0 1 0-13 0c0 3.55 2.1 7.1 6.5 11.25Z"
            fill={accent(orange)}
          />
          <circle
            className={styles.accentSecondary}
            cx="12"
            cy="10"
            r="3.75"
            fill={accent(blue)}
          />
          <path
            className={styles.accent}
            d="m9.75 12.25 1.5-4.25 4.25-1.5-1.5 4.25z"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          {accessibleTitle}
          <rect
            className={styles.surface}
            x="2.75"
            y="3.25"
            width="18.5"
            height="17.5"
            fill={color ? "#111111" : "none"}
          />
          <path
            className={styles.accentSecondary}
            d="M3.5 4h17v3.75h-17z"
            fill={color ? paper : "none"}
            stroke={accentStroke}
          />
          <path className={styles.line} d="M5.25 5.875h1.5M8.5 5.875H10" />
          <rect
            className={styles.accentSecondary}
            x="4.75"
            y="10"
            width="4"
            height="7.5"
            fill={accent(cyan)}
            stroke={accentStroke}
          />
          <rect
            className={styles.accentTertiary}
            x="10"
            y="10"
            width="4"
            height="7.5"
            fill={accent(magenta)}
            stroke={accentStroke}
          />
          <rect
            className={styles.accent}
            x="15.25"
            y="10"
            width="4"
            height="7.5"
            fill={accent(yellow)}
            stroke={accentStroke}
          />
        </svg>
      );
  }
}

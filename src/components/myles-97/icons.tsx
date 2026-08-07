import type { SVGProps } from "react";

export type Myles97IconName =
  | "folder"
  | "document"
  | "display"
  | "mail"
  | "app"
  | "loose-parts"
  | "fresh-greens"
  | "fafsa"
  | "navi"
  | "tiktok";

type Myles97IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: Myles97IconName;
  size?: number;
  title?: string;
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
    case "resume":
    case "trini-roti":
      return "document";
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
  ...props
}: Myles97IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    focusable: false,
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    role: title ? ("img" as const) : undefined,
    ...props,
  };

  switch (name) {
    case "folder":
      return (
        <svg {...common}>
          <path d="M3 7h7l2 2h9v10H3z" />
          <path d="M3 7V5h7l2 2" />
          <path d="M5 11h14v6H5z" fill="currentColor" opacity="0.16" stroke="none" />
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h4" />
          <path d="M9 12h6M9 16h6" strokeWidth="2.4" />
        </svg>
      );
    case "display":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="13" />
          <path d="M6 7h12v7H6z" fill="currentColor" opacity="0.15" stroke="none" />
          <path d="M9 21h6M12 17v4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" />
          <path d="m4 7 8 6 8-6" />
          <path d="m4 17 5-5M20 17l-5-5" opacity="0.55" />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" />
          <path d="M4 9h16M9 9v11" />
          <rect x="6" y="6" width="2" height="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "loose-parts":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="3" />
          <rect x="14" y="4" width="6" height="6" />
          <path d="M4 15h6v5H4z" />
          <path d="M15 15l5 5M20 15l-5 5" strokeWidth="2.4" />
        </svg>
      );
    case "fresh-greens":
      return (
        <svg {...common}>
          <path d="M4 19h5l2-4 3 2 6-9" />
          <rect x="3" y="4" width="6" height="6" fill="currentColor" opacity="0.2" />
          <path d="M6 10v4" />
          <circle cx="19" cy="6" r="2" fill="currentColor" />
        </svg>
      );
    case "fafsa":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="13" height="11" />
          <path d="m4 8 5.5 4L15 8" />
          <rect x="17" y="5" width="4" height="4" fill="currentColor" />
          <rect x="17" y="11" width="4" height="3" />
          <rect x="17" y="16" width="4" height="3" fill="currentColor" opacity="0.45" />
        </svg>
      );
    case "navi":
      return (
        <svg {...common}>
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
          <path d="m9 13 2-5 4-2-2 5z" fill="currentColor" opacity="0.26" />
          <path d="m11 8 4-2-2 5z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" />
          <path d="M3 9h18" />
          <rect x="6" y="12" width="4" height="5" fill="currentColor" opacity="0.28" />
          <rect x="12" y="12" width="6" height="2" />
          <rect x="12" y="16" width="6" height="1" fill="currentColor" stroke="none" />
          <path d="M6 6h2M10 6h2" strokeWidth="2.4" />
        </svg>
      );
  }
}

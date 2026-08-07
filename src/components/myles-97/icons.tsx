import type { SVGProps } from "react";

export type Myles97IconName =
  | "folder"
  | "document"
  | "display"
  | "mail"
  | "app"
  | "loose-parts";

type Myles97IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: Myles97IconName;
  size?: number;
  title?: string;
};

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
    strokeWidth: 1.8,
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
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h4M9 12h6M9 16h6" />
        </svg>
      );
    case "display":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="13" />
          <path d="M9 21h6M12 17v4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M4 9h16M9 9v11" />
        </svg>
      );
    case "loose-parts":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="3" />
          <path d="M14 4h6v6h-6zM4 15h6v5H4zM15 15l5 5M20 15l-5 5" />
        </svg>
      );
  }
}

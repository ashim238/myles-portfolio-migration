import type { SVGProps } from "react";

export type Myles97IconName =
  | "start"
  | "folder"
  | "document"
  | "profile"
  | "resume"
  | "recipe"
  | "display"
  | "mail"
  | "app"
  | "paintbrush"
  | "open-apps"
  | "reset-desktop"
  | "loose-parts"
  | "fresh-greens"
  | "fafsa"
  | "navi"
  | "tiktok"
  | "music";

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

const GRID_BY_TIER: Record<Myles97IconTier, number> = {
  chrome: 16,
  menu: 24,
  discovery: 32,
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
    case "now-playing":
      return "music";
    case "selected-work":
      return "folder";
    case "about":
      return "profile";
    case "resume":
      return "resume";
    case "reminders":
      return "document";
    case "loose-parts":
      return "loose-parts";
    case "display-properties":
      return "display";
    case "trini-roti":
      return "recipe";
    case "paint":
      return "paintbrush";
    default:
      return "app";
  }
}

const MASTER_CONCEPT_BY_ICON: Record<Myles97IconName, string> = {
  start: "start",
  folder: "selected-work",
  document: "reminders",
  profile: "about-myles",
  resume: "resume",
  recipe: "trini-roti",
  display: "display-properties",
  mail: "email",
  app: "generic-app",
  paintbrush: "paintbrush",
  "open-apps": "open-apps",
  "reset-desktop": "reset-desktop",
  "loose-parts": "loose-parts",
  "fresh-greens": "fresh-greens",
  fafsa: "understandingfafsa",
  navi: "navi",
  tiktok: "tiktok-catalog",
  music: "now-playing",
};

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
  const concept = MASTER_CONCEPT_BY_ICON[name];
  const drawing = `${concept}-${grid}`;
  const classes = ["myles98-icon", color && "myles98-icon--color", className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${grid} ${grid}`}
      shapeRendering="crispEdges"
      focusable="false"
      className={classes}
      data-m98-icon={name}
      data-m98-icon-grid={grid}
      data-m98-icon-tier={resolvedTier}
      data-m98-icon-variant={variant}
      data-m98-icon-snap="integer"
      data-myles97-icon-density={compact ? "compact" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? "img" : undefined}
      {...props}
    >
      {color && (
        <image
          width={grid}
          height={grid}
          href={`/myles98-sprites/${concept}/${drawing}.svg`}
          className="myles98-icon-master"
          data-m98-icon-master="true"
          data-m98-icon-master-concept={concept}
          data-m98-icon-master-grid={grid}
          aria-hidden="true"
        />
      )}
      <use
        href={`/myles98-sprites/monochrome.svg#${drawing}`}
        className={color ? "myles98-icon-fallback" : undefined}
        aria-hidden="true"
      />
    </svg>
  );
}

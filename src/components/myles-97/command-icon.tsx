type Command =
  | "add" | "back" | "close" | "down" | "enlarge" | "external" | "locked"
  | "minimize" | "next" | "reorder" | "subtract" | "to-top" | "up";

export function CommandIcon({
  name,
  size = 16,
  className,
}: {
  name: Command;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/myles98-sprites/commands.svg#${name}`} />
    </svg>
  );
}

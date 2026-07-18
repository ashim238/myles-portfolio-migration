type Size = "sm" | "md" | "lg";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  src,
  size = "md",
  decorative = false,
}: {
  name: string;
  src?: string;
  size?: Size;
  decorative?: boolean;
}) {
  if (src) {
    return (
      <span
        className={`nv-avatar nv-avatar--${size}`}
        aria-hidden={decorative ? "true" : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={decorative ? "" : name} />
      </span>
    );
  }
  return (
    <span
      className={`nv-avatar nv-avatar--${size}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative ? "true" : undefined}
    >
      <span aria-hidden="true">{initials(name)}</span>
    </span>
  );
}

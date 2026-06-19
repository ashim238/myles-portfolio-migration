type Size = "sm" | "md" | "lg";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: Size;
}) {
  if (src) {
    return (
      <span className={`nv-avatar nv-avatar--${size}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} />
      </span>
    );
  }
  return (
    <span className={`nv-avatar nv-avatar--${size}`} role="img" aria-label={name}>
      <span aria-hidden="true">{initials(name)}</span>
    </span>
  );
}

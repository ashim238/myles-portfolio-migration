import type { ReactNode } from "react";

export function Card({ children, padded }: { children: ReactNode; padded?: boolean }) {
  return <div className={`nv-card${padded ? " nv-card--padded" : ""}`}>{children}</div>;
}

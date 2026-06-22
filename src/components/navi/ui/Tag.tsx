import type { ReactNode } from "react";

type Tone = "neutral" | "popular" | "local";

export function Tag({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`nv-tag nv-tag--${tone}`}>{children}</span>;
}

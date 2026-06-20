import type { ReactNode } from "react";

export function Hero({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section className="nv-hero">
      <header className="nv-hero-head">
        <h2 className="nv-hero-title">{title}</h2>
        {lede && <p className="nv-hero-lede">{lede}</p>}
      </header>
      <div className="nv-hero-stage">{children}</div>
    </section>
  );
}

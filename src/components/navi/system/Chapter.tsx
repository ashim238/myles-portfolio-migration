import type { ReactNode } from "react";

export function Chapter({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="nv-chapter">
      <header className="nv-chapter-head">
        <h2 className="nv-chapter-title">{title}</h2>
        {intro && <p className="nv-chapter-intro">{intro}</p>}
      </header>
      <div className="nv-chapter-body">{children}</div>
    </section>
  );
}

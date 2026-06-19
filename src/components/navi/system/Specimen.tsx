import type { ReactNode } from "react";

export function Specimen({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="nv-specimen">
      <h2 className="nv-specimen-title">{title}</h2>
      {note && <p className="nv-specimen-note">{note}</p>}
      <div className="nv-specimen-stage">{children}</div>
    </section>
  );
}

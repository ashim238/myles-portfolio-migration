"use client";

type Item = { id: string; label: string };

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: Item[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="nv-tabs" role="tablist">
      {items.map((it) => {
        const selected = it.id === value;
        return (
          <button
            key={it.id}
            role="tab"
            type="button"
            aria-selected={selected}
            className={`nv-tab${selected ? " nv-tab--selected" : ""}`}
            onClick={() => onChange(it.id)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

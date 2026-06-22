"use client";

import type { ReactNode } from "react";

export type PillRowItem = { id: string; label: ReactNode };

type ExtraAttrs = (
  item: PillRowItem,
  active: boolean,
  index: number,
) => Record<string, string | undefined>;

export function PillRow({
  items,
  activeId,
  onSelect,
  extraAttrs,
  className,
  itemRef,
  onItemKeyDown,
  role,
}: {
  items: PillRowItem[];
  activeId: string;
  onSelect: (id: string) => void;
  extraAttrs?: ExtraAttrs;
  className?: string;
  itemRef?: (el: HTMLButtonElement | null, index: number) => void;
  onItemKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  role?: string;
}) {
  return (
    <div
      className={`nv-pill-row${className ? " " + className : ""}`}
      role={role}
    >
      {items.map((item, index) => {
        const active = item.id === activeId;
        const extras = extraAttrs ? extraAttrs(item, active, index) : {};
        return (
          <button
            key={item.id}
            type="button"
            ref={(el) => itemRef?.(el, index)}
            className={`nv-pill-row-item${active ? " nv-pill-row-item--active" : ""}`}
            onClick={() => onSelect(item.id)}
            onKeyDown={onItemKeyDown ? (e) => onItemKeyDown(e, index) : undefined}
            {...extras}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

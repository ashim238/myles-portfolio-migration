"use client";

import { useId } from "react";

export function SearchInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="nv-search">
      <label htmlFor={id} className="nv-sr-only">
        {label}
      </label>
      <span className="nv-search-icon" aria-hidden="true">
        ⌕
      </span>
      <input
        id={id}
        type="search"
        className="nv-search-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

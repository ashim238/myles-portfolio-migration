"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "transparent" | "outline";
type Size = "sm" | "md" | "lg";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  icon: ReactNode;
  variant?: Variant;
  size?: Size;
};

export function IconButton({
  label,
  icon,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`nv-icon-btn nv-icon-btn--${variant} nv-icon-btn--${size} ${className}`.trim()}
      {...rest}
    >
      <span className="nv-btn-icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}

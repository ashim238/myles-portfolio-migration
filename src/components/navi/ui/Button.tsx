"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "transparent" | "outline";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`nv-btn nv-btn--${variant} nv-btn--${size} ${className}`.trim()}
      {...rest}
    >
      {leadingIcon && (
        <span className="nv-btn-icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className="nv-btn-label">{children}</span>
      {trailingIcon && (
        <span className="nv-btn-icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}

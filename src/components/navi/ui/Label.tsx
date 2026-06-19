import type { ReactNode } from "react";

export function Label({
  htmlFor,
  required,
  optional,
  help,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label className="nv-label" htmlFor={htmlFor}>
      <span>{children}</span>
      {required && (
        <span className="nv-label-required" aria-label="required">
          *
        </span>
      )}
      {optional && <span className="nv-label-optional"> (optional)</span>}
      {help && (
        <span className="nv-label-help" role="img" aria-label={help}>
          ?
        </span>
      )}
    </label>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type TransitionLinkProps = ComponentProps<typeof Link>;

/**
 * A next/link that runs the destination navigation inside a native View
 * Transition, so the page crossfades/slides instead of hard-cutting. Opt-in
 * by usage — nothing global is patched, so the homepage→case-study FLIP and
 * ordinary nav links are untouched.
 *
 * Falls back to a normal navigation when the browser lacks the View Transitions
 * API or the user prefers reduced motion.
 */
export function TransitionLink({ href, onClick, ...rest }: TransitionLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        // Respect modifier clicks (new tab), non-primary buttons, and external/
        // hash targets — let the browser do its normal thing.
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          typeof href !== "string" ||
          !href.startsWith("/")
        ) {
          return;
        }

        const doc = document as Document & {
          startViewTransition?: (cb: () => void) => void;
        };
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!doc.startViewTransition || reduced) return;

        event.preventDefault();
        doc.startViewTransition(() => router.push(href));
      }}
      {...rest}
    />
  );
}

"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("theme") as Theme | null;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredTheme();
    const resolved = stored ?? getSystemTheme();
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  if (!mounted) return <div className="theme-toggle-placeholder" />;

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      type="button"
    >
      <svg
        className="theme-toggle-icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        {theme === "dark" ? (
          <circle
            cx="8"
            cy="8"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        ) : (
          <path
            d="M8.9 2.2A5.5 5.5 0 0 0 13.8 7.1 5.5 5.5 0 1 1 8.9 2.2Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

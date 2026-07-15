"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";
const THEME_CHANGE_EVENT = "theme-change";

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

function getThemeSnapshot(): Theme {
  const storedTheme = localStorage.getItem("theme");
  if (isTheme(storedTheme)) return storedTheme;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

function subscribeTheme(callback: () => void) {
  const query = window.matchMedia("(prefers-color-scheme: light)");
  query.addEventListener("change", callback);
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    query.removeEventListener("change", callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

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

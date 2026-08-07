"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  applyThemeToDocument,
  getThemeServerSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
} from "@/lib/myles-97/theme";

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    (notify) => subscribeTheme(() => notify()),
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  function toggle() {
    setTheme(theme === "dark" ? "light" : "dark");
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

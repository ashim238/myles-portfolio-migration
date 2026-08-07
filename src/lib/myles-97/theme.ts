export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";
export const THEME_CHANGE_EVENT = "theme-change";

type ThemeListener = (theme: Theme) => void;

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function getThemeServerSnapshot(): Theme {
  return "dark";
}

export function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return getThemeServerSnapshot();

  const stored = getStoredTheme();
  if (stored) return stored;

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function setTheme(next: Theme): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // The visual preference can still apply for the current document.
  }

  applyThemeToDocument(next);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeTheme(listener: ThemeListener): () => void {
  if (typeof window === "undefined") return () => undefined;

  const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

  const publish = (theme: Theme) => {
    applyThemeToDocument(theme);
    listener(theme);
  };

  const onSystemTheme = (event: MediaQueryListEvent) => {
    publish(getStoredTheme() ?? (event.matches ? "light" : "dark"));
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== THEME_STORAGE_KEY) return;
    publish(getThemeSnapshot());
  };
  const onThemeChange = () => publish(getThemeSnapshot());

  systemTheme.addEventListener("change", onSystemTheme);
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);

  return () => {
    systemTheme.removeEventListener("change", onSystemTheme);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
  };
}

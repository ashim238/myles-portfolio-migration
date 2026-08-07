"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { DisplayPreferences } from "@/lib/myles-97/state";
import {
  applyThemeToDocument,
  getThemeServerSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
} from "@/lib/myles-97/theme";

type DisplayPropertiesProps = {
  preferences: DisplayPreferences;
  onChange: (preferences: DisplayPreferences) => void;
  onReset: () => void;
};

export function DisplayProperties({ preferences, onChange, onReset }: DisplayPropertiesProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);
  const theme = useSyncExternalStore(
    (notify) => subscribeTheme(() => notify()),
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return (
    <div className="myles97-display-preview">
      <p>Choose the portfolio color scheme and accessibility preferences.</p>

      <fieldset>
        <legend>Color scheme</legend>
        <label>
          <input
            type="radio"
            name="myles97-theme"
            value="light"
            checked={theme === "light"}
            onChange={() => setTheme("light")}
          />
          Light
        </label>
        <label>
          <input
            type="radio"
            name="myles97-theme"
            value="dark"
            checked={theme === "dark"}
            onChange={() => setTheme("dark")}
          />
          Dark
        </label>
      </fieldset>

      <fieldset>
        <legend>Display accessibility</legend>
        <label>
          <input
            type="checkbox"
            checked={preferences.highContrast}
            onChange={(event) => onChange({ ...preferences, highContrast: event.currentTarget.checked })}
          />
          High contrast
        </label>
        <label>
          <input
            type="checkbox"
            checked={preferences.reduceMotion}
            onChange={(event) => onChange({ ...preferences, reduceMotion: event.currentTarget.checked })}
          />
          Reduce motion
        </label>
      </fieldset>

      {confirmingReset ? (
        <div className="myles97-reset-confirmation" role="alert">
          <p>Reset open programs, positions, and display preferences?</p>
          <div>
            <button
              type="button"
              onClick={() => {
                setConfirmingReset(false);
                onReset();
              }}
            >
              Confirm reset
            </button>
            <button type="button" onClick={() => setConfirmingReset(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirmingReset(true)}>
          Reset desktop…
        </button>
      )}
    </div>
  );
}

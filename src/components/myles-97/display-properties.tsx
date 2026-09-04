"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { DisplayPreferences } from "@/lib/myles-97/state";
import {
  applyThemeToDocument,
  getThemeServerSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
  type Theme,
} from "@/lib/myles-97/theme";

type DisplayPropertiesProps = {
  preferences: DisplayPreferences;
  onChange: (preferences: DisplayPreferences) => void;
  onReset: () => void;
  requestReset?: boolean;
  onResetRequestHandled?: () => void;
};

export function DisplayProperties({
  preferences,
  onChange,
  onReset,
  requestReset = false,
  onResetRequestHandled,
}: DisplayPropertiesProps) {
  const [confirmingReset, setConfirmingReset] = useState(requestReset);
  const [draftTheme, setDraftTheme] = useState<Theme | null>(null);
  const [draftPreferences, setDraftPreferences] =
    useState<DisplayPreferences | null>(null);
  const showResetConfirmation = confirmingReset || requestReset;
  const theme = useSyncExternalStore(
    (notify) => subscribeTheme(() => notify()),
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const selectedTheme = draftTheme ?? theme;
  const selectedPreferences = draftPreferences ?? preferences;
  const hasPendingChanges =
    selectedTheme !== theme ||
    selectedPreferences.highContrast !== preferences.highContrast ||
    selectedPreferences.reduceMotion !== preferences.reduceMotion;

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
            checked={selectedTheme === "light"}
            onChange={() => setDraftTheme("light")}
          />
          Light
        </label>
        <label>
          <input
            type="radio"
            name="myles97-theme"
            value="dark"
            checked={selectedTheme === "dark"}
            onChange={() => setDraftTheme("dark")}
          />
          Dark
        </label>
      </fieldset>

      <fieldset>
        <legend>Display accessibility</legend>
        <label>
          <input
            type="checkbox"
            checked={selectedPreferences.highContrast}
            onChange={(event) =>
              setDraftPreferences({
                ...selectedPreferences,
                highContrast: event.currentTarget.checked,
              })
            }
          />
          High contrast
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedPreferences.reduceMotion}
            onChange={(event) =>
              setDraftPreferences({
                ...selectedPreferences,
                reduceMotion: event.currentTarget.checked,
              })
            }
          />
          Reduce motion
        </label>
      </fieldset>

      {showResetConfirmation ? (
        <div className="myles97-reset-confirmation" role="alert">
          <p className="myles97-reset-confirmation-title">Reset portfolio?</p>
          <p>
            This closes open programs and resets window positions, color scheme,
            contrast, and motion preferences.
          </p>
          <div>
            <button
              type="button"
              onClick={() => {
                setConfirmingReset(false);
                onReset();
              }}
            >
              Reset portfolio
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmingReset(false);
                onResetRequestHandled?.();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="myles97-display-actions">
          <button
            type="button"
            disabled={!hasPendingChanges}
            onClick={() => {
              setTheme(selectedTheme);
              onChange(selectedPreferences);
            }}
          >
            Confirm changes
          </button>
          <button type="button" onClick={() => setConfirmingReset(true)}>
            Reset portfolio…
          </button>
        </div>
      )}
    </div>
  );
}

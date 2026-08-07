"use client";

import type { RefObject } from "react";
import {
  TRINI_ROTI_RECIPE,
  TRINI_ROTI_SOURCE,
} from "@/lib/myles-97/recipe";

export function RecipeNote({
  onOpen,
  triggerRef,
}: {
  onOpen: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={triggerRef}
      type="button"
      className="myles97-roti-note"
      onClick={onOpen}
      aria-label={`Open recipe note: ${TRINI_ROTI_RECIPE.title}`}
    >
      <span className="myles97-roti-label">Recipe note</span>
      <strong>{TRINI_ROTI_RECIPE.title}</strong>
      <span>{TRINI_ROTI_RECIPE.preview}</span>
    </button>
  );
}

export function RecipeNoteProgram() {
  return (
    <article className="myles97-recipe-program">
      <header>
        <p className="myles97-eyebrow">Kitchen note · makes 6</p>
        <h2>{TRINI_ROTI_RECIPE.title}</h2>
        <p>{TRINI_ROTI_RECIPE.preview}</p>
      </header>

      <section aria-labelledby="myles97-recipe-ingredients">
        <h3 id="myles97-recipe-ingredients">Ingredients</h3>
        <ul>
          {TRINI_ROTI_RECIPE.ingredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="myles97-recipe-steps">
        <h3 id="myles97-recipe-steps">Method</h3>
        <ol>
          {TRINI_ROTI_RECIPE.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {TRINI_ROTI_RECIPE.note ? (
        <p className="myles97-recipe-note-copy">{TRINI_ROTI_RECIPE.note}</p>
      ) : null}

      <p className="myles97-recipe-source">
        Adapted into this working note from{" "}
        <a href={TRINI_ROTI_SOURCE.href} target="_blank" rel="noreferrer">
          {TRINI_ROTI_SOURCE.label}
          <span aria-hidden="true"> ↗</span>
        </a>
        .
      </p>
    </article>
  );
}

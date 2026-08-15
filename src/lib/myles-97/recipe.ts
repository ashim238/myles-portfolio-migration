export type RecipeNoteContent = {
  title: string;
  preview: string;
  ingredients: readonly string[];
  steps: readonly string[];
  note?: string;
};

export const TRINI_ROTI_SOURCE = {
  label: "Immaculate Bites",
  href: "https://www.africanbites.com/paratha-buss-shut/",
} as const;

export const TRINI_ROTI_RECIPE: RecipeNoteContent = {
  title: "Buss Up Shut Paratha Roti",
  preview:
    "The buss up shut recipe I usually use: soft layered paratha, cooked hot and broken up while it is still warm.",
  ingredients: [
    "3 cups all-purpose flour",
    "1 teaspoon sugar",
    "2 teaspoons baking powder",
    "1½ teaspoons salt",
    "1 tablespoon ghee, butter, or oil for the dough",
    "About 1¼ cups warm water",
    "⅓ cup shortening or butter for the layers",
    "¼ cup oil, ghee, or melted butter for cooking",
  ],
  steps: [
    "Mix the flour, sugar, baking powder, and salt. Add the tablespoon of fat and enough warm water to bring it together, then knead briefly into a soft, slightly sticky dough.",
    "Divide into six pieces, cover, and let them rest for 15–30 minutes.",
    "Roll each piece into a rough circle. Spread on shortening or butter, dust lightly with flour, cut one slit from the center to the edge, then roll the circle into a cone and tuck the ends underneath.",
    "Oil the shaped pieces, cover them, and leave them to rest for at least 2 hours so the layers relax and develop.",
    "Flatten each cone and roll from the center outward into a thin round, roughly 10 inches across.",
    "Cook on a medium-hot tawa, griddle, or skillet. Oil the surface and edges, flip once bubbles appear, and cook until lightly browned in spots.",
    "While it is still hot, buss it up with two spatulas or shake it in a covered container or clean cloth, then serve warm.",
  ],
  note:
    "This is my condensed working note from the Immaculate Bites recipe. Don't skip the rests!",
};

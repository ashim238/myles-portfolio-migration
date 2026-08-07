# Myles 98 product naming

**Canonical product language:**

- **Myles 98** — the desktop/workstation portfolio experience.
- **Pocket 98** — the capability-led mobile adaptation.
- **Reader Mode** — the case-study reading surface shared by Myles 98 and Pocket 98.

These names supersede the earlier working names **Myles 97** and **Pocket 97** in user-facing copy, accessibility labels, product documentation, review notes, and future commit/PR language.

## Legacy implementation namespace

The repository keeps the existing `myles-97` implementation namespace for stability. Examples include `src/components/myles-97/`, `src/lib/myles-97/`, `.myles97-*` CSS classes, `Myles97Shell`, `Pocket97Shell`, `POCKET_97_QUERY`, and version-1 persistence keys.

Those identifiers are implementation details, not product names. They should not be surfaced to visitors or used as the current product name in new documentation.

Historical August 4 planning/spec filenames also retain `myles-97` so links and implementation references do not churn. When those documents mention the current product in new annotations or follow-up work, use **Myles 98** and **Pocket 98**.

## Rule for new work

If text can be seen or announced by a visitor, appears in product-facing documentation, or describes the current experience in a review, use **Myles 98** / **Pocket 98**. Use `97` only when referring to a literal legacy code identifier or historical artifact path.

/** @type {readonly ["published", "draft", "hidden"]} */
export const PROJECT_STATUSES = Object.freeze([
  "published",
  "draft",
  "hidden",
]);

/**
 * @param {unknown} value
 * @returns {"published" | "draft" | "hidden"}
 */
export function parseProjectStatus(value) {
  const status = typeof value === "string" ? value.trim() : "";
  if (!PROJECT_STATUSES.includes(status)) {
    throw new Error(
      `Project status must be published, draft, or hidden. Received ${JSON.stringify(value)}.`,
    );
  }
  return status;
}

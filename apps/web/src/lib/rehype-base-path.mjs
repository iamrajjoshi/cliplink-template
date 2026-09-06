import { withBase } from "./paths.mjs";

/** Rebase local links and media inside rendered markdown without changing files.
 * @param {{ base?: string }} [options]
 */
export default function rehypeBasePath(options = {}) {
  /** @param {{ properties?: Record<string, unknown>, children?: unknown[] }} node */
  function visit(node) {
    if (node.properties) {
      for (const key of ["href", "src", "poster"]) {
        const value = node.properties[key];
        if (typeof value === "string") node.properties[key] = withBase(value, options.base);
      }
    }
    for (const child of node.children ?? []) visit(/** @type {typeof node} */ (child));
  }
  return visit;
}

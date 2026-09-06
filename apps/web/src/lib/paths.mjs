import site from "../../../../site.config.mjs";

/** Map CLI root-relative URLs to the site's deployment path, exactly once.
 * @param {string | undefined} path
 * @param {string} [base]
 */
export function withBase(path, base = site.base) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return path;
  const prefix = `/${base.split("/").filter(Boolean).join("/")}`;
  if (prefix === "/" || path === prefix || path.startsWith(`${prefix}/`)) return path;
  return `${prefix}${path}`;
}

/** @param {string} path */
export function absoluteUrl(path) {
  return new URL(withBase(path), site.url).toString();
}

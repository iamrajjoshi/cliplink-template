/** Edit this file to make the collection yours. No credentials belong here. */
const site = {
  owner: "Your name",
  title: "Clips",
  description: "Links, notes, and things worth keeping.",
  url: "https://example.com",
  base: "/",
  repo: "",
};

// GitHub Pages supplies the deployed origin and path during its build. Local
// builds use the values above; these overrides also support other static hosts.
export default {
  ...site,
  url: process.env.CLIP_SITE_URL ?? site.url,
  base: process.env.CLIP_BASE_PATH ?? site.base,
  repo: process.env.GITHUB_REPOSITORY ?? site.repo,
};

import { execSync } from "node:child_process";
import { defineConfig } from "astro/config";
import site from "../../site.config.mjs";
import rehypeBasePath from "./src/lib/rehype-base-path.mjs";

function getCommitSha() {
  try {
    return execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "dev";
  }
}

export default defineConfig({
  site: site.url,
  base: site.base,
  output: "static",
  trailingSlash: "always",
  markdown: {
    rehypePlugins: [rehypeBasePath],
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    },
  },
  vite: {
    define: {
      "import.meta.env.PUBLIC_COMMIT_SHA": JSON.stringify(getCommitSha()),
    },
  },
});

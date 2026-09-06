# Cliplink template

A small, editable website for things you save with [Cliplink](https://github.com/iamrajjoshi/cliplink). Links, posts, images, videos, and Markdown notes share one readable feed, with a permanent page for each clip and an RSS feed.

The template uses Astro and plain CSS. It serves static HTML; reading clips does not need JavaScript. Search and the theme picker add a little JavaScript when available. No analytics, social embeds, or external font requests are included.

## Quick start

Install [Node.js](https://nodejs.org/) and the Cliplink CLI, then authenticate and create a **public** GitHub repository:

```sh
npm install -g cliplink
clip login
clip init
```

Clone the repository URL that `clip init` prints and enter that directory. Before publishing, edit `site.config.mjs` and choose **GitHub Actions** under your repository’s **Settings → Pages → Build and deployment**.

Push your configuration change, or run **Deploy Astro site to Pages** from the Actions tab. The first workflow can fail if Pages has not been enabled yet; rerun it after changing the setting.

Then save something:

```sh
clip https://example.com
```

The CLI writes your clip to the configured repository. Each push rebuilds the website. Use `clip --help` for local files, notes, and publishing options.

## Make it yours

All site identity and deployment settings live in `site.config.mjs`:

```js
const site = {
  owner: "Your name",
  title: "Clips",
  description: "Links, notes, and things worth keeping.",
  url: "https://your-name.github.io",
  base: "/your-repository/",
  repo: "your-name/your-repository",
};
```

`url` is the origin, and `base` is the path where the site lives. Use `/` for an account-level Pages site or a custom domain. `repo` is optional; it enables a source-commit link in the footer.

The Pages workflow reads the origin and base path from GitHub automatically, overriding those values during deployment. The values in the file apply to local builds and other hosts. You can also override them with `CLIP_SITE_URL`, `CLIP_BASE_PATH`, and `GITHUB_REPOSITORY`.

Colors, spacing, and type styles live in `apps/web/src/styles/global.css`. The default pairs [Gabarito](https://github.com/naipefoundry/gabarito) with warm white, mulberry, and butter yellow, plus a matching dark palette. Dates sit beside a single feed, leaving room for each saved item and your notes. The variable font is self-hosted, with its license in `apps/web/public/fonts/Gabarito-OFL.txt`.

### Custom domain

Add your domain in **Settings → Pages**, configure its DNS using [GitHub’s custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), and set `url` to its HTTPS origin and `base` to `/`.

You may add `apps/web/public/CNAME` with just the hostname for hosts that use that file. No domain is preconfigured in this template.

## Preview and edit

Use pnpm 10.25.0, the version declared in `package.json`:

```sh
pnpm install
pnpm dev
```

The terminal prints your preview address. Open `/demo/` to see examples of every clip kind in the same renderer used by your feed. Those examples are explicitly fictional and stay outside your collection, RSS, search index, and clip permalinks. The demo page asks search engines not to index it.

```sh
pnpm format:check
pnpm lint
pnpm test
pnpm check
pnpm build
```

The build output is `apps/web/dist/`. To check a project-site path locally:

```sh
CLIP_SITE_URL=https://example.com CLIP_BASE_PATH=/my-clips/ pnpm build
```

## Content contract

Keep these locations if you want the CLI to keep publishing without extra configuration:

| Content           | Location                         |
| ----------------- | -------------------------------- |
| Clip Markdown     | `apps/web/src/content/clips/`    |
| Downloaded assets | `apps/web/public/clips/<slug>/`  |
| Clip permalink    | `/clips/<slug>/`                 |
| RSS feed          | `/rss.xml`                       |
| Search index      | `/search.json`                   |
| Example fixtures  | `apps/web/src/content/examples/` |

The shared `cliplink-schema` package validates all five kinds: `link`, `tweet`, `image`, `video`, and `note`. The renderer adds your deployment base path to local assets and internal links; you do not need to rewrite the CLI’s root-relative paths.

The CLI and its authentication live in the [Cliplink repository](https://github.com/iamrajjoshi/cliplink). This repository contains the website only.

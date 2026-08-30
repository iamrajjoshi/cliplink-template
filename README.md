# clips template

A clean template for creating a static clippings site with the [cliplink](https://github.com/iamrajjoshi/cliplink) CLI. Each clip is a markdown file in the repo, rendered by Astro into a feed of cards and permalink pages. No database, no backend, no runtime service.

## Quick start

```bash
# Install the CLI
npm install -g cliplink

# Create your site from this template
clip init

# Or clone manually and start writing clips
clip login
clip <url>
```

## Tech stack

- [Astro 5](https://astro.build) — static site generator, content collections, React islands
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [React](https://react.dev) — interactive islands (card rendering, embeds)
- [pnpm](https://pnpm.io) workspaces

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm test
pnpm lint
```

## Content structure

- Clip markdown files: `apps/web/src/content/clips/` (one file per clip)
- Clip assets: `apps/web/public/clips/<slug>/`
- Schema and types: `apps/web/src/content/schema.ts`
- Content collection: `apps/web/src/content/config.ts`
- Card components: `apps/web/src/components/cards/`

Clip kinds: `link`, `tweet`, `image`, `video`, `note`.

## Deployment

The site deploys to GitHub Pages via GitHub Actions. Update `apps/web/public/CNAME` with your domain and point DNS at `iamrajjoshi.github.io` (or your GitHub Pages domain).

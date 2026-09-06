# Project

A reusable static clippings website for the [Cliplink CLI](https://github.com/iamrajjoshi/cliplink). This repository contains the website, not the CLI.

## Stack and layout

- pnpm 10.25.0 workspaces; `apps/web` uses Astro 5 and plain CSS.
- `site.config.mjs` is the single identity and deployment configuration.
- `apps/web/src/content/schema.ts` re-exports the shared `cliplink-schema` contract.
- `apps/web/src/components/ClipCard.astro` selects the renderer for both feed and permalinks.
- `apps/web/src/content/examples/` contains fictional fixtures, visible only at `/demo/`.

## Content conventions

Clip kinds are `link`, `tweet`, `image`, `video`, and `note`. Preserve the CLI contract: Markdown goes in `apps/web/src/content/clips/`, assets in `apps/web/public/clips/<slug>/`, and permalinks remain `/clips/<slug>/`.

Use sentence case. Keep personal branding out of template defaults. Use `withBase` for root-relative internal paths and assets, including those in Markdown. Do not add social embeds or publish example fixtures as real clips.

## Checks

Run `pnpm format:check`, `pnpm lint`, `pnpm test`, `pnpm check`, and `pnpm build`. Validate root and non-root base paths after routing changes. Check both themes and keyboard navigation when changing controls.

No backend is needed. Keep the feed readable with JavaScript disabled.

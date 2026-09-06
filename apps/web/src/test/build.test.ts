import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, appendFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { it } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const project = fileURLToPath(new URL("../../../../", import.meta.url));

for (const base of ["/", "/saved/"]) {
  it(`builds empty and populated collections under ${base} without publishing demo content`, async () => {
    const sandbox = await mkdtemp(path.join(tmpdir(), "cliplink-template-test-"));
    try {
      for (const relative of [
        "site.config.mjs",
        "tsconfig.base.json",
        "apps/web/src",
        "apps/web/public",
        "apps/web/astro.config.mjs",
        "apps/web/tsconfig.json",
        "apps/web/package.json",
      ]) {
        const destination = path.join(sandbox, relative);
        await mkdir(path.dirname(destination), { recursive: true });
        await cp(path.join(project, relative), destination, { recursive: true });
      }
      await symlink(path.join(project, "node_modules"), path.join(sandbox, "node_modules"), "dir");
      await symlink(
        path.join(project, "apps/web/node_modules"),
        path.join(sandbox, "apps/web/node_modules"),
        "dir",
      );
      const app = path.join(sandbox, "apps/web");
      const output = path.join(app, "dist");
      async function build(): Promise<void> {
        await exec(
          process.execPath,
          [path.join(project, "apps/web/node_modules/astro/astro.js"), "build"],
          {
            cwd: app,
            env: {
              ...process.env,
              CLIP_SITE_URL: "https://reader.example",
              CLIP_BASE_PATH: base,
              GITHUB_REPOSITORY: "reader/clips",
              ASTRO_TELEMETRY_DISABLED: "1",
            },
            maxBuffer: 4 * 1024 * 1024,
          },
        );
      }

      await build();
      const emptyHomepage = await readFile(path.join(output, "index.html"), "utf8");
      assert.match(emptyHomepage, /<div class="empty-home">\s*<div class="page-intro">/);
      assert.ok(emptyHomepage.includes('class="empty-collection"'));
      assert.ok(!emptyHomepage.includes('class="clip-feed"'));
      assert.ok(emptyHomepage.includes(`href="${base}demo/"`));

      for (const file of await readdir(path.join(app, "src/content/examples"))) {
        await cp(
          path.join(app, "src/content/examples", file),
          path.join(app, "src/content/clips", file),
        );
      }
      await appendFile(
        path.join(app, "src/content/clips/a-note.md"),
        "\n[Related clip](/clips/a-link/)\n\n![Example image](/demo-assets/notebook.svg)\n",
      );
      await build();
      const homepage = await readFile(path.join(output, "index.html"), "utf8");
      assert.ok(!homepage.includes('class="empty-home"'));
      assert.ok(!homepage.includes('class="empty-collection"'));
      assert.ok(homepage.includes('class="clip-feed"'));
      assert.equal((homepage.match(/data-clip data-kind=/g) ?? []).length, 5);
      assert.match(homepage, /lang="en"/);
      assert.ok(homepage.includes(`href="${base}fonts/fonts.css"`));
      assert.ok(homepage.includes(`href="${base}fonts/gabarito-latin-variable.woff2"`));
      assert.ok(homepage.includes(`href="${base}clips/a-link/"`));
      assert.ok(homepage.includes(`src="${base}demo-assets/notebook.svg"`));
      assert.ok(!homepage.includes("Example collection"));
      assert.match(
        homepage,
        /class="footer-credit" href="https:\/\/github\.com\/iamrajjoshi\/cliplink"/,
      );
      assert.ok(homepage.includes('href="https://github.com/reader/clips/commit/dev"'));

      const search = JSON.parse(await readFile(path.join(output, "search.json"), "utf8"));
      assert.equal(search.length, 5);
      assert.ok(
        search.every((clip: { permalink: string }) => clip.permalink.startsWith(`${base}clips/`)),
      );
      const feed = await readFile(path.join(output, "rss.xml"), "utf8");
      assert.equal((feed.match(/<item>/g) ?? []).length, 5);
      assert.ok(feed.includes(`https://reader.example${base}clips/a-link/`));

      const note = await readFile(path.join(output, "clips/a-note/index.html"), "utf8");
      assert.ok(note.includes(`href="${base}clips/a-link/"`));
      assert.ok(note.includes(`src="${base}demo-assets/notebook.svg"`));
      assert.ok(note.includes(`https://reader.example${base}og/a-note.svg`));
      const social = await readFile(path.join(output, "og/a-note.svg"), "utf8");
      assert.ok(social.includes("#FFFDF6"));
      assert.ok(social.includes("Gabarito"));
      assert.ok(social.includes("base64,"));
      const demo = await readFile(path.join(output, "demo/index.html"), "utf8");
      assert.ok(demo.includes('content="noindex, follow"'));
      assert.equal((demo.match(/data-clip data-kind=/g) ?? []).length, 5);
    } finally {
      await rm(sandbox, { recursive: true, force: true });
    }
  });
}

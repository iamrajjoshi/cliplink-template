import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { withBase } from "../lib/paths.mjs";
import rehypeBasePath from "../lib/rehype-base-path.mjs";

describe("project-site paths", () => {
  it("maps root-relative routes and CLI assets without double-prefixing", () => {
    assert.equal(
      withBase("/clips/saved/image.png", "/my-clips/"),
      "/my-clips/clips/saved/image.png",
    );
    assert.equal(withBase("/my-clips/clips/saved/", "/my-clips/"), "/my-clips/clips/saved/");
    assert.equal(withBase("/", "/my-clips/"), "/my-clips/");
    assert.equal(withBase("/rss.xml", "/"), "/rss.xml");
    assert.equal(withBase("/search.json", ""), "/search.json");
  });
  it("preserves external, relative, fragment, and data URLs", () => {
    for (const value of [
      "https://example.com/a",
      "//example.com/a",
      "image.png",
      "#note",
      "data:image/svg+xml,abc",
    ]) {
      assert.equal(withBase(value, "/collection/"), value);
    }
    assert.equal(withBase(undefined, "/collection/"), undefined);
  });
  it("rebases markdown links and image assets as well as poster attributes", () => {
    const tree = {
      children: [
        { properties: { href: "/clips/note/" } },
        {
          children: [
            { properties: { src: "/clips/note/image.png", poster: "/clips/note/poster.png" } },
          ],
        },
        { properties: { href: "https://example.com" } },
      ],
    };
    rehypeBasePath({ base: "/collection/" })(tree);
    assert.equal(tree.children[0]!.properties!.href, "/collection/clips/note/");
    assert.equal(
      tree.children[1]!.children![0]!.properties.src,
      "/collection/clips/note/image.png",
    );
    assert.equal(
      tree.children[1]!.children![0]!.properties.poster,
      "/collection/clips/note/poster.png",
    );
    assert.equal(tree.children[2]!.properties!.href, "https://example.com");
  });
});

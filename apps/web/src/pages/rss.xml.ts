import rss from "@astrojs/rss";
import { getClipDescription, getClipPermalink, getClipTitle, sortClips } from "@/lib/clips";
import { getClipEntries } from "@/lib/content";
import { absoluteUrl } from "@/lib/paths.mjs";
import site from "../../../../site.config.mjs";

export async function GET() {
  const clips = sortClips(await getClipEntries());
  return rss({
    title: site.title,
    description: site.description,
    site: absoluteUrl("/"),
    items: clips.map((clip) => ({
      title: getClipTitle(clip),
      description: getClipDescription(clip),
      pubDate: clip.data.clippedAt,
      link: absoluteUrl(getClipPermalink(clip)),
    })),
  });
}

import type { APIContext } from "astro";
import { getClipDescription, getClipTitle, type ClipEntry } from "@/lib/clips";
import { getClipEntries } from "@/lib/content";
import { socialImage } from "@/lib/social";

export async function getStaticPaths() {
  return (await getClipEntries()).map((clip) => ({
    params: { slug: clip.slug },
    props: { clip },
  }));
}
export function GET({ props }: APIContext<{ clip: ClipEntry }>) {
  return socialImage(getClipTitle(props.clip), getClipDescription(props.clip));
}

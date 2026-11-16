import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import type { z } from "astro/zod";
import { clipDataSchema } from "@/content/schema";

type ClipData = ReturnType<typeof clipDataSchema.parse>;
const schema = clipDataSchema as unknown as z.ZodType<ClipData>;

const clips = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/clips" }),
  schema,
});

const examples = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/examples" }),
  schema,
});

export const collections = { clips, examples };

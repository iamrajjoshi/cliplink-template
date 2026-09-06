import site from "../../../../site.config.mjs";
import { socialImage } from "@/lib/social";
export function GET() {
  return socialImage(site.title, site.description);
}

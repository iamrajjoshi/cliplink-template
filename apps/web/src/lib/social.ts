import site from "../../../../site.config.mjs";
import { excerpt } from "./clips";
import font from "../../public/fonts/gabarito-latin-variable.woff2?inline";

function escapeXml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  );
}

function lines(text: string, width: number, limit: number) {
  const result: string[] = [];
  for (const word of excerpt(text, width * limit).split(/\s+/)) {
    const last = result.length - 1;
    if (last >= 0 && result[last]!.length + word.length < width) result[last] += ` ${word}`;
    else result.push(word);
  }
  return result.slice(0, limit);
}

export function socialImage(title: string, description: string) {
  const titleLines = lines(title, 30, 3);
  const descriptionLines = lines(description, 66, 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" font-family="Gabarito, system-ui, sans-serif">
    <style>@font-face{font-family:'Gabarito';font-style:normal;font-weight:400 900;src:url('${font}') format('woff2')}.display{letter-spacing:-.025em}</style>
    <rect width="1200" height="630" fill="#FFFDF6"/>
    <path d="M84 114V78a15 15 0 0 1 30 0v44a23 23 0 0 1-46 0V80m31-2v36a7.5 7.5 0 0 1-15 0" fill="none" stroke="#9D274B" stroke-width="5" stroke-linecap="round"/>
    <path d="M112 78h14" stroke="#9D274B" stroke-width="7" stroke-linecap="round"/>
    <text x="150" y="110" font-size="27" fill="#716269">${escapeXml(site.owner)}</text>
    <text class="display" x="72" y="235" font-size="60" font-weight="650" fill="#392E33">${titleLines.map((line, index) => `<tspan x="72" dy="${index === 0 ? 0 : 72}">${escapeXml(line)}</tspan>`).join("")}</text>
    <text x="72" y="${270 + titleLines.length * 72}" font-size="27" fill="#716269">${descriptionLines.map((line, index) => `<tspan x="72" dy="${index === 0 ? 0 : 36}">${escapeXml(line)}</tspan>`).join("")}</text>
    <path d="M72 566h1056" stroke="#DBD2C3"/>
    <text x="72" y="603" font-size="21" fill="#9D274B">${escapeXml(site.title)}</text>
  </svg>`;
  return new Response(svg, { headers: { "content-type": "image/svg+xml; charset=utf-8" } });
}

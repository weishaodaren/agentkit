/**
 * Lucide icon renderer for Lit Web Components.
 * Uses icon-nodes.json from lucide-static to generate inline SVG strings.
 *
 * Usage in Lit render():
 *   import { icon } from "./shared/icons";
 *   html`${icon("copy", 16)}`
 */
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { DirectiveResult } from "lit/directive.js";
import iconNodes from "lucide-static/icon-nodes.json";

type IconNode = [string, Record<string, string>][];

const nodes = iconNodes as unknown as Record<string, IconNode>;

/** Default SVG wrapper attributes — uses currentColor for easy theming */
const SVG_ATTRS = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

function escapeAttr(val: string): string {
  return val.replace(/"/g, "&quot;");
}

function renderNode(node: IconNode): string {
  return node
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
        .join(" ");
      return `<${tag} ${attrStr} />`;
    })
    .join("");
}

/**
 * Render a Lucide icon as an inline SVG (returns a Lit DirectiveResult).
 *
 * @param name  - Icon name (kebab-case), e.g. "copy", "circle-check"
 * @param size  - Width & height in px (default 16)
 * @param cls   - Optional CSS class on the <svg>
 */
export function icon(name: string, size = 16, cls = ""): DirectiveResult {
  const node = nodes[name];
  if (!node) {
    return unsafeHTML(
      `<svg width="${size}" height="${size}" viewBox="0 0 24 24" class="${cls}"></svg>`,
    );
  }
  const classAttr = cls ? ` class="${cls}"` : "";
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24"${classAttr} ${Object.entries(
    SVG_ATTRS,
  )
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ")}>${renderNode(node)}</svg>`;
  return unsafeHTML(svg);
}

/** Get raw SVG string (for cases where unsafeHTML is not needed) */
export function iconSvg(name: string, size = 16): string {
  const node = nodes[name];
  if (!node) return "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${Object.entries(
    SVG_ATTRS,
  )
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ")}>${renderNode(node)}</svg>`;
}

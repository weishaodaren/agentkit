/**
 * Lucide icon renderer for Lit Web Components.
 * Uses tree-shakeable individual icon imports from `lucide` package.
 *
 * Only the icons explicitly imported here are bundled (~30 icons ≈ 8KB),
 * instead of the full icon-nodes.json (~714KB).
 *
 * To add a new icon:
 *   1. Import from 'lucide': import { NewIcon } from 'lucide'
 *   2. Add to ICON_MAP below: 'new-icon': NewIcon
 *
 * Usage in Lit render():
 *   import { icon } from "@/shared/icons";
 *   html`${icon("copy", 16)}`
 */
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { DirectiveResult } from "lit/directive.js";
import {
  Archive,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleMinus,
  CircleX,
  Clock,
  Code,
  Copy,
  Download,
  File,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  Image,
  Info,
  LoaderCircle,
  MessageCircle,
  Music,
  Plus,
  Presentation,
  SendHorizontal,
  Sparkles,
  Square,
  Table,
  Upload,
  Video,
  X,
} from "lucide";

type IconNode = [string, Record<string, string>][];

/**
 * Icon registry — maps kebab-case names to icon node data.
 * Only icons listed here are bundled; unknown names fall back to empty SVG.
 */
const ICON_MAP: Record<string, IconNode> = {
  archive: Archive as IconNode,
  check: Check as IconNode,
  "chevron-down": ChevronDown as IconNode,
  "chevron-right": ChevronRight as IconNode,
  "circle-alert": CircleAlert as IconNode,
  "circle-check": CircleCheck as IconNode,
  "circle-minus": CircleMinus as IconNode,
  "circle-x": CircleX as IconNode,
  clock: Clock as IconNode,
  code: Code as IconNode,
  copy: Copy as IconNode,
  download: Download as IconNode,
  file: File as IconNode,
  "file-code": FileCode as IconNode,
  "file-text": FileText as IconNode,
  folder: Folder as IconNode,
  "folder-open": FolderOpen as IconNode,
  image: Image as IconNode,
  info: Info as IconNode,
  loader: LoaderCircle as IconNode,
  "loader-circle": LoaderCircle as IconNode,
  "message-circle": MessageCircle as IconNode,
  music: Music as IconNode,
  plus: Plus as IconNode,
  presentation: Presentation as IconNode,
  "send-horizontal": SendHorizontal as IconNode,
  sparkles: Sparkles as IconNode,
  square: Square as IconNode,
  table: Table as IconNode,
  upload: Upload as IconNode,
  video: Video as IconNode,
  x: X as IconNode,
};

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
  const node = ICON_MAP[name];
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
  const node = ICON_MAP[name];
  if (!node) return "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${Object.entries(
    SVG_ATTRS,
  )
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ")}>${renderNode(node)}</svg>`;
}

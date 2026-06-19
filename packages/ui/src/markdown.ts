import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import { AkElement } from "@/shared/base-element";

/**
 * antd-x XMarkdown 对标实现
 * 流式友好的 Markdown 渲染器
 *
 * 特性:
 * - 流式渲染: content 逐字到达时平滑显示
 * - 代码高亮: 集成 highlight.js (通过 CodeHighlighter 主题)
 * - 自定义标签: <think>...</think> 映射为思考块
 * - 打字光标: 流式末尾显示闪烁光标
 * - 安全: HTML 输出未经过 sanitize, 请勿渲染不受信任的内容
 */

// Configure marked for streaming-friendly parsing
marked.setOptions({
  breaks: true,
  gfm: true,
});

/** Custom renderer to add classes to HTML elements */
const renderer = new marked.Renderer();

renderer.code = (token: any) => {
  const text = token.text || "";
  const language = token.lang || "text";
  return `<ak-code-block data-lang="${language}">${escapeHtml(text)}</ak-code-block>`;
};

renderer.link = (token: any) => {
  const href = token.href || "";
  const text = token.text || "";
  const title = token.title || "";
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"${titleAttr} class="ak-md-link">${escapeHtml(text)}</a>`;
};

renderer.image = (token: any) => {
  const href = token.href || "";
  const text = token.text || "";
  const title = token.title || "";
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
  return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${titleAttr} class="ak-md-img" />`;
};

renderer.table = (token: any) => {
  const header = token.header || "";
  const rows = token.rows || [];
  let body = "";
  for (const row of rows) {
    body += "<tr>";
    for (const cell of row) {
      body += `<td>${escapeHtml(cell.text || "")}</td>`;
    }
    body += "</tr>";
  }
  return `<div class="ak-md-table-wrap"><table class="ak-md-table">${header}${body}</table></div>`;
};

marked.use({ renderer });

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Process custom <think>...</think> tags in markdown content.
 * Converts them to styled think blocks.
 */
function processThinkBlocks(htmlStr: string): string {
  return htmlStr.replace(
    /&lt;think&gt;([\s\S]*?)&lt;\/think&gt;/g,
    (_match, content: string) =>
      `<div class="ak-md-think"><div class="ak-md-think-header">💭 思考过程</div><div class="ak-md-think-content">${content}</div></div>`,
  );
}

/** Inline markdown styles injected into Shadow DOM */
const markdownCSS = `
  .ak-md {
    font-size: 14px;
    line-height: 1.7;
    color: var(--_foreground, #1f2937);
    word-break: break-word;
  }
  .ak-md > *:first-child { margin-top: 0; }
  .ak-md > *:last-child { margin-bottom: 0; }

  /* Headings */
  .ak-md h1, .ak-md h2, .ak-md h3, .ak-md h4, .ak-md h5, .ak-md h6 {
    margin: 1.2em 0 0.6em;
    font-weight: 600;
    line-height: 1.4;
    color: var(--_foreground, #111827);
  }
  .ak-md h1 { font-size: 1.5em; }
  .ak-md h2 { font-size: 1.3em; }
  .ak-md h3 { font-size: 1.15em; }

  /* Paragraphs */
  .ak-md p { margin: 0.8em 0; }

  /* Links */
  .ak-md-link {
    color: var(--_primary, #1677ff);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }
  .ak-md-link:hover { border-bottom-color: var(--_primary, #1677ff); }

  /* Code inline */
  .ak-md code {
    background: var(--_muted, #f3f4f6);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }

  /* Code block wrapper */
  ak-code-block {
    display: block;
    margin: 1em 0;
    padding: 12px 16px;
    background: #0d1117;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.6;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    color: #e6edf3;
  }
  ak-code-block code {
    background: transparent;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
    color: inherit;
  }

  /* Blockquote */
  .ak-md blockquote {
    margin: 1em 0;
    padding: 0.5em 1em;
    border-left: 4px solid var(--_primary, #1677ff);
    background: var(--_muted, #f9fafb);
    color: var(--_muted-foreground, #6b7280);
    border-radius: 0 6px 6px 0;
  }
  .ak-md blockquote p { margin: 0.3em 0; }

  /* Lists */
  .ak-md ul, .ak-md ol {
    margin: 0.6em 0;
    padding-left: 1.8em;
  }
  .ak-md li { margin: 0.3em 0; }
  .ak-md li > p { margin: 0.2em 0; }

  /* Table */
  .ak-md-table-wrap { overflow-x: auto; margin: 1em 0; }
  .ak-md-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .ak-md-table th, .ak-md-table td {
    padding: 8px 12px;
    border: 1px solid var(--_border, #e5e7eb);
    text-align: left;
  }
  .ak-md-table th {
    background: var(--_muted, #f9fafb);
    font-weight: 600;
  }
  .ak-md-table tr:nth-child(even) { background: var(--_muted, #f9fafb); }

  /* Horizontal rule */
  .ak-md hr {
    border: none;
    border-top: 1px solid var(--_border, #e5e7eb);
    margin: 1.5em 0;
  }

  /* Image */
  .ak-md-img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1em 0;
  }

  /* Think block */
  .ak-md-think {
    margin: 1em 0;
    border: 1px solid var(--_border, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }
  .ak-md-think-header {
    padding: 8px 12px;
    background: var(--_muted, #f9fafb);
    font-size: 13px;
    font-weight: 500;
    border-bottom: 1px solid var(--_border, #e5e7eb);
  }
  .ak-md-think-content {
    padding: 12px;
    font-size: 13px;
    color: var(--_muted-foreground, #6b7280);
    line-height: 1.6;
  }

  /* Strong & Em */
  .ak-md strong { font-weight: 600; }
  .ak-md em { font-style: italic; }

  /* Cursor */
  .ak-md-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: currentColor;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: ak-md-blink 0.8s step-end infinite;
  }
  @keyframes ak-md-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

@customElement("ak-markdown")
export class AkMarkdown extends AkElement {
  /** Markdown content (supports streaming: update this prop as content arrives) */
  @property({ type: String })
  content = "";

  /** Stream status: 'loading' while content is arriving, 'done' when complete */
  @property({ type: String, attribute: "stream-status" })
  streamStatus: "loading" | "done" = "done";

  /** Whether to show typing cursor at end during streaming */
  @property({ type: Boolean, attribute: "show-cursor" })
  showCursor = true;

  @state()
  private _renderedHTML = "";

  private _parseTimer = 0;
  private _lastContent = "";

  override connectedCallback() {
    super.connectedCallback();
    // Inject markdown-specific styles
    if (this.shadowRoot) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(markdownCSS);
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets,
        sheet,
      ];
    }
    this._parseMarkdown();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._parseTimer) {
      clearTimeout(this._parseTimer);
    }
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("content") || changed.has("streamStatus")) {
      this._scheduleParse();
    }
  }

  /**
   * Debounce parsing to avoid excessive re-renders during streaming.
   * During 'loading' status, we parse every 50ms for smooth updates.
   * On 'done', we parse immediately for the final result.
   */
  private _scheduleParse() {
    if (this.content === this._lastContent && this.streamStatus === "done") {
      return;
    }

    if (this._parseTimer) {
      clearTimeout(this._parseTimer);
    }

    const delay = this.streamStatus === "loading" ? 50 : 0;
    this._parseTimer = window.setTimeout(() => {
      this._parseMarkdown();
    }, delay);
  }

  private _parseMarkdown() {
    this._lastContent = this.content;
    if (!this.content) {
      this._renderedHTML = "";
      return;
    }

    try {
      // Parse markdown to HTML
      let result = marked.parse(this.content, { async: false }) as string;

      // Process custom <think> blocks
      result = processThinkBlocks(result);

      this._renderedHTML = result;
    } catch {
      this._renderedHTML = `<p>${escapeHtml(this.content)}</p>`;
    }
  }

  private get _showTypingCursor(): boolean {
    return (
      this.showCursor &&
      this.streamStatus === "loading" &&
      this.content.length > 0
    );
  }

  override render() {
    if (!this.content) return nothing;

    return html`
      <div class="ak-md ak-motion-fade-in">
        ${unsafeHTML(this._renderedHTML)}${this._showTypingCursor
          ? html`<span class="ak-md-cursor"></span>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-markdown": AkMarkdown;
  }
}

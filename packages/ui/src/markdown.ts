import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import { Task } from "@lit/task";
import { AkElement } from "@/shared/base-element";

/**
 * antd-x XMarkdown 对标实现
 * 纯 Markdown 解析渲染器
 *
 * 特性:
 * - 流式友好: content 更新时平滑重渲染
 * - 代码高亮: 集成 highlight.js (通过 CodeHighlighter 主题)
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

  /* Strong & Em */
  .ak-md strong { font-weight: 600; }
  .ak-md em { font-style: italic; }
`;

@customElement("ak-markdown")
export class AkMarkdown extends AkElement {
  /** Markdown content (supports streaming: update this prop as content arrives) */
  @property({ type: String })
  content = "";

  /** Stream status: 'loading' while content is arriving, 'done' when complete */
  @property({ type: String, attribute: "stream-status" })
  streamStatus: "loading" | "done" = "done";

  /**
   * Async parsing task with built-in debounce.
   * During 'loading' status, debounces 50ms for smooth streaming updates.
   * On 'done', parses immediately for the final result.
   * Previous result is kept via initialValue until the new one is ready.
   */
  private _parseTask = new Task<[string, string], string>(this, {
    task: async ([content, status], { signal }) => {
      const delay = status === "loading" ? 50 : 0;
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, delay);
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timer);
            reject(new DOMException("Aborted", "AbortError"));
          },
          { once: true },
        );
      });

      if (!content) return "";

      try {
        return marked.parse(content, { async: false }) as string;
      } catch {
        return `<p>${escapeHtml(content)}</p>`;
      }
    },
    args: () => [this.content, this.streamStatus] as [string, string],
    initialValue: "",
  });

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
  }

  override render() {
    if (!this.content) return nothing;

    return this._parseTask.render({
      pending: () => {
        const prev = this._parseTask.value;
        return prev
          ? html`<div class="ak-md">${unsafeHTML(prev)}</div>`
          : html`<div class="ak-md"></div>`;
      },
      complete: (result) =>
        html`<div class="ak-md ak-motion-fade-in">${unsafeHTML(result)}</div>`,
      error: () =>
        html`<div class="ak-md"><p>${escapeHtml(this.content)}</p></div>`,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-markdown": AkMarkdown;
  }
}

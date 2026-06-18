import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";

// Register common languages
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("yml", yaml);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("md", markdown);

/** Inline highlight.js theme — GitHub Dark-inspired, Tailwind-compatible */
const hljsThemeCSS = `
  .hljs { color: #e6edf3; }
  .hljs-keyword, .hljs-selector-tag, .hljs-built_in { color: #ff7b72; }
  .hljs-string, .hljs-attr, .hljs-template-tag { color: #a5d6ff; }
  .hljs-number, .hljs-literal { color: #79c0ff; }
  .hljs-comment { color: #8b949e; font-style: italic; }
  .hljs-function .hljs-title, .hljs-title.function_ { color: #d2a8ff; }
  .hljs-type, .hljs-class .hljs-title { color: #ffa657; }
  .hljs-variable, .hljs-template-variable { color: #ffa657; }
  .hljs-params { color: #e6edf3; }
  .hljs-meta { color: #79c0ff; }
  .hljs-name, .hljs-tag { color: #7ee787; }
  .hljs-attribute { color: #79c0ff; }
  .hljs-symbol, .hljs-bullet { color: #ffa657; }
  .hljs-section { color: #d2a8ff; font-weight: bold; }
  .hljs-emphasis { font-style: italic; }
  .hljs-strong { font-weight: bold; }
  .hljs-addition { color: #aff5b4; background: #033a16; }
  .hljs-deletion { color: #ffdcd7; background: #67060c; }
`;

@customElement("ak-code-highlighter")
export class AkCodeHighlighter extends AkElement {
  @property({ type: String })
  code = "";

  @property({ type: String })
  language = "";

  @property({ type: Boolean })
  showLineNumbers = false;

  @state()
  private _copied = false;

  /** Lazily inject the hljs theme stylesheet into Shadow DOM */
  private _hljsInjected = false;

  override connectedCallback() {
    super.connectedCallback();
    if (!this._hljsInjected && this.shadowRoot) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(hljsThemeCSS);
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets,
        sheet,
      ];
      this._hljsInjected = true;
    }
  }

  private get _highlightedHTML(): string {
    if (!this.code) return "";
    try {
      const lang = this.language.toLowerCase();
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(this.code, { language: lang }).value;
      }
      return hljs.highlightAuto(this.code).value;
    } catch {
      return this._escapeHtml(this.code);
    }
  }

  private _escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  private _highlightedLines(): string[] {
    if (!this.code) return [];
    try {
      const lang = this.language.toLowerCase();
      const result =
        lang && hljs.getLanguage(lang)
          ? hljs.highlight(this.code, { language: lang })
          : hljs.highlightAuto(this.code);
      return result.value.split("\n");
    } catch {
      return this.code.split("\n").map((l) => this._escapeHtml(l));
    }
  }

  private async _handleCopy() {
    try {
      await navigator.clipboard.writeText(this.code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = this.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    this._copied = true;
    this.dispatchEvent(
      new CustomEvent("copy", {
        detail: { code: this.code },
        bubbles: true,
        composed: true,
      }),
    );
    setTimeout(() => {
      this._copied = false;
    }, 2000);
  }

  override render() {
    return html`
      <div
        class="ak-motion-zoom-in relative overflow-hidden rounded-lg border border-border bg-[#0d1117]"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-1.5"
        >
          <span class="text-xs text-muted-foreground"
            >${this.language || "text"}</span
          >
          <button
            class=${cn(
              "ak-btn-interactive inline-flex cursor-pointer items-center gap-1 rounded border-0 bg-transparent px-2 py-0.5 text-xs",
              this._copied
                ? "text-green-400"
                : "text-gray-400 hover:text-gray-200",
            )}
            @click=${this._handleCopy}
          >
            ${this._copied ? "✓ 已复制" : "复制"}
          </button>
        </div>

        <!-- Code -->
        <pre
          class="overflow-x-auto p-4 text-sm leading-6"
        ><code class="hljs">${this.showLineNumbers
          ? this._highlightedLines().map(
              (line, i) =>
                html`<div class="flex">
                  <span
                    class="mr-4 inline-block w-6 shrink-0 select-none text-right text-gray-600"
                    >${i + 1}</span
                  ><span>${unsafeHTML(line)}</span>
                </div>`,
            )
          : unsafeHTML(this._highlightedHTML)}</code></pre>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-code-highlighter": AkCodeHighlighter;
  }
}

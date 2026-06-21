import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Task } from "@lit/task";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

/**
 * antd-x Mermaid 对标实现
 *
 * antd-x: Uses mermaid library to render diagrams from code.
 * Supports Image/Code dual view, zoom, download.
 *
 * Our implementation:
 *   - Lazy-loads mermaid from CDN or local install
 *   - Renders SVG output
 *   - Code/Image view toggle
 *   - Download SVG
 */
const mermaidCSS: CSSResult = css`
  .ak-mermaid {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--ak-border-radius-md, 8px);
    border: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
  }
  .ak-mermaid-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--ak-padding-xxs, 4px) var(--ak-padding-sm, 12px);
    border-bottom: var(--ak-line-width, 1px) solid
      var(--ak-color-border, #d9d9d9);
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
  }
  .ak-mermaid-toolbar-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ak-mermaid-toolbar-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px var(--ak-padding-xs, 8px);
    border-radius: var(--ak-border-radius-sm, 4px);
    border: none;
    background: transparent;
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    cursor: pointer;
    transition: all var(--ak-duration-mid, 200ms);
  }
  .ak-mermaid-toolbar-btn:hover {
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-mermaid-toolbar-btn-active {
    background: var(--ak-color-primary-bg, #e6f4ff);
    color: var(--ak-color-primary, #1677ff);
  }
  .ak-mermaid-content {
    padding: var(--ak-padding, 16px);
  }
  .ak-mermaid-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--ak-padding-xl, 32px) 0;
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-mermaid-error {
    padding: var(--ak-padding, 16px) 0;
    text-align: center;
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-error, #ff4d4f);
  }
  .ak-mermaid-output {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
  }
  .ak-mermaid-code {
    overflow: auto;
    font-size: var(--ak-font-size, 14px);
    line-height: 1.5;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    margin: 0;
  }
`;

@customElement("ak-mermaid")
export class AkMermaid extends AkElement {
  static override styles = [mermaidCSS];
  /** Mermaid diagram code */
  @property({ type: String })
  code = "";

  /** View mode: rendered diagram or raw code */
  @property({ type: String })
  view: "image" | "code" = "image";

  /** Mermaid theme */
  @property({ type: String })
  theme: "default" | "dark" | "forest" | "neutral" = "default";

  /**
   * Async rendering task — automatically manages loading/error/complete states.
   * When code or theme changes, the previous render is automatically cancelled
   * (no more _renderId race condition).
   */
  private _renderTask = new Task<[string, string], string>(this, {
    task: async ([code, theme]) => {
      if (!code) return "";
      const mermaid = (window as any).mermaid;
      if (!mermaid) {
        throw new Error("mermaid library not loaded");
      }
      mermaid.initialize({ startOnLoad: false, theme });
      const { svg } = await mermaid.render(
        `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        code,
      );
      return svg as string;
    },
    args: () => [this.code, this.theme] as [string, string],
    initialValue: "",
  });

  private _toggleView() {
    this.view = this.view === "image" ? "code" : "image";
  }

  private _downloadSvg() {
    const svg = this._renderTask.value;
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  override render() {
    const svg = this._renderTask.value;

    return html`
      <div class="ak-mermaid">
        <!-- Toolbar -->
        <div class="ak-mermaid-toolbar">
          <div class="ak-mermaid-toolbar-group">
            <button
              class="ak-mermaid-toolbar-btn ${this.view === "image"
                ? "ak-mermaid-toolbar-btn-active"
                : ""}"
              @click=${() => {
                this.view = "image";
              }}
            >
              ${icon("image", 12)} 图表
            </button>
            <button
              class="ak-mermaid-toolbar-btn ${this.view === "code"
                ? "ak-mermaid-toolbar-btn-active"
                : ""}"
              @click=${() => {
                this.view = "code";
              }}
            >
              ${icon("code", 12)} 代码
            </button>
          </div>
          ${this.view === "image" && svg
            ? html`<button
                class="ak-mermaid-toolbar-btn"
                @click=${this._downloadSvg}
              >
                ${icon("download", 12)} 下载
              </button>`
            : nothing}
        </div>

        <!-- Content -->
        <div class="ak-mermaid-content">
          ${this._renderTask.render({
            pending: () =>
              html`<div class="ak-mermaid-loading">渲染中...</div>`,
            complete: (result) =>
              result
                ? this.view === "image"
                  ? html`<div class="ak-mermaid-output">
                      ${unsafeHTML(result)}
                    </div>`
                  : html`<pre class="ak-mermaid-code"><code>${this
                      .code}</code></pre>`
                : nothing,
            error: (err) =>
              html`<div class="ak-mermaid-error">${String(err)}</div>`,
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-mermaid": AkMermaid;
  }
}

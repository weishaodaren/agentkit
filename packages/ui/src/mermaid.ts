import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
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

  @state()
  private _svgContent = "";

  @state()
  private _loading = true;

  @state()
  private _error = "";

  private _renderId = 0;

  override connectedCallback() {
    super.connectedCallback();
    if (this.code) {
      this._renderDiagram();
    }
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("code") || changed.has("theme")) {
      this._renderDiagram();
    }
  }

  private async _renderDiagram() {
    if (!this.code) return;

    this._loading = true;
    this._error = "";
    const renderId = ++this._renderId;

    try {
      // Try to use globally available mermaid
      const mermaid = (window as any).mermaid;
      if (!mermaid) {
        this._error = "mermaid library not loaded";
        this._loading = false;
        return;
      }

      mermaid.initialize({
        startOnLoad: false,
        theme: this.theme,
      });

      const { svg } = await mermaid.render(`mermaid-${renderId}`, this.code);

      // Check if this render is still the latest
      if (renderId === this._renderId) {
        this._svgContent = svg;
        this._loading = false;
      }
    } catch (err) {
      if (renderId === this._renderId) {
        this._error = String(err);
        this._loading = false;
      }
    }
  }

  private _toggleView() {
    this.view = this.view === "image" ? "code" : "image";
  }

  private _downloadSvg() {
    if (!this._svgContent) return;
    const blob = new Blob([this._svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  override render() {
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
          ${this.view === "image" && this._svgContent
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
          ${this._loading
            ? html`<div class="ak-mermaid-loading">渲染中...</div>`
            : this._error
              ? html`<div class="ak-mermaid-error">${this._error}</div>`
              : this.view === "image"
                ? html`<div class="ak-mermaid-output">
                    ${this._svgContent ? this._unsafeSvg() : nothing}
                  </div>`
                : html`<pre class="ak-mermaid-code"><code>${this
                    .code}</code></pre>`}
        </div>
      </div>
    `;
  }

  private _unsafeSvg() {
    return html`${unsafeHTML(this._svgContent)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-mermaid": AkMermaid;
  }
}

import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Task } from "@lit/task";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

/** Toolbar action configuration (1:1 antd-x parity) */
export interface MermaidActions {
  /** Enable zoom in/out/reset controls (default: true) */
  enableZoom?: boolean;
  /** Enable download SVG button (default: true) */
  enableDownload?: boolean;
  /** Enable copy code button (default: true) */
  enableCopy?: boolean;
}

/**
 * antd-x Mermaid 对标实现
 *
 * antd-x: Uses mermaid library to render diagrams from code.
 * Supports Image/Code dual view, zoom, pan, download, copy.
 *
 * Our implementation:
 *   - Peer dependency: `pnpm add mermaid` (lazy dynamic import)
 *   - Renders SVG output
 *   - Code/Image view toggle
 *   - Zoom in/out/reset (1:1 antd-x parity)
 *   - Download SVG
 *   - Copy code to clipboard
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
    max-height: 480px;
  }
  .ak-mermaid-svg-wrapper {
    transform-origin: center center;
    transition: transform var(--ak-duration-mid, 200ms) ease;
    padding: var(--ak-padding, 16px);
  }
  .ak-mermaid-zoom-label {
    min-width: 40px;
    text-align: center;
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    user-select: none;
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

  /** Toolbar actions config (1:1 antd-x parity: all enabled by default) */
  @property({ type: Object })
  actions: MermaidActions = {};

  /** Internal zoom level (1.0 = 100%) */
  @state()
  private _zoom = 1.0;

  /** Internal copy feedback state */
  @state()
  private _copied = false;

  /** Resolve effective actions with defaults */
  private get _effectiveActions(): Required<MermaidActions> {
    return {
      enableZoom: this.actions.enableZoom ?? true,
      enableDownload: this.actions.enableDownload ?? true,
      enableCopy: this.actions.enableCopy ?? true,
    };
  }

  /**
   * Async rendering task — automatically manages loading/error/complete states.
   * When code or theme changes, the previous render is automatically cancelled
   * (no more _renderId race condition).
   */
  private _renderTask = new Task<[string, string], string>(this, {
    task: async ([code, theme]) => {
      if (!code) return "";
      // Dynamic import — mermaid is a peer dependency, loaded only when needed
      let mermaid: any;
      try {
        ({ default: mermaid } = await import("mermaid"));
      } catch {
        throw new Error(
          "Mermaid is not installed. Please install it: pnpm add mermaid",
        );
      }
      mermaid.initialize({ startOnLoad: false, theme: theme as any });
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

  private _zoomIn() {
    this._zoom = Math.min(this._zoom + 0.2, 3);
  }

  private _zoomOut() {
    this._zoom = Math.max(this._zoom - 0.2, 0.4);
  }

  private _resetZoom() {
    this._zoom = 1.0;
  }

  private async _copyCode() {
    try {
      await navigator.clipboard.writeText(this.code);
      this._copied = true;
      setTimeout(() => {
        this._copied = false;
      }, 2000);
    } catch {
      // Clipboard API not available
    }
  }

  /** Render zoom controls (zoom out / label / zoom in / reset) */
  private _renderZoomControls() {
    if (this._zoom === 1.0) {
      return html`
        <button class="ak-mermaid-toolbar-btn" @click=${this._zoomOut}>
          ${icon("zoom-out", 12)}
        </button>
        <span class="ak-mermaid-zoom-label"
          >${Math.round(this._zoom * 100)}%</span
        >
        <button class="ak-mermaid-toolbar-btn" @click=${this._zoomIn}>
          ${icon("zoom-in", 12)}
        </button>
      `;
    }
    return html`
      <button class="ak-mermaid-toolbar-btn" @click=${this._zoomOut}>
        ${icon("zoom-out", 12)}
      </button>
      <span class="ak-mermaid-zoom-label"
        >${Math.round(this._zoom * 100)}%</span
      >
      <button class="ak-mermaid-toolbar-btn" @click=${this._zoomIn}>
        ${icon("zoom-in", 12)}
      </button>
      <button class="ak-mermaid-toolbar-btn" @click=${this._resetZoom}>
        ${icon("rotate-ccw", 12)}
      </button>
    `;
  }

  override render() {
    const svg = this._renderTask.value;
    const acts = this._effectiveActions;
    const showActions =
      this.view === "image" &&
      svg &&
      (acts.enableZoom || acts.enableDownload || acts.enableCopy);

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
          ${showActions
            ? html`<div class="ak-mermaid-toolbar-group">
                ${acts.enableZoom ? this._renderZoomControls() : nothing}
                ${acts.enableCopy
                  ? html`<button
                      class="ak-mermaid-toolbar-btn"
                      @click=${this._copyCode}
                    >
                      ${icon(this._copied ? "check" : "copy", 12)}
                      ${this._copied ? "已复制" : "复制"}
                    </button>`
                  : nothing}
                ${acts.enableDownload
                  ? html`<button
                      class="ak-mermaid-toolbar-btn"
                      @click=${this._downloadSvg}
                    >
                      ${icon("download", 12)} 下载
                    </button>`
                  : nothing}
              </div>`
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
                      <div
                        class="ak-mermaid-svg-wrapper"
                        style="transform: scale(${this._zoom});"
                      >
                        ${unsafeHTML(result)}
                      </div>
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

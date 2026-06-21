import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { cn } from "@/shared/cn";
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
@customElement("ak-mermaid")
export class AkMermaid extends AkElement {
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
      <div
        class="ak-mermaid flex flex-col overflow-hidden rounded-lg border border-border"
      >
        <!-- Toolbar -->
        <div
          class="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-1.5"
        >
          <div class="flex items-center gap-1">
            <button
              class=${cn(
                "inline-flex cursor-pointer items-center rounded border-0 px-2 py-0.5 text-xs transition-colors",
                this.view === "image"
                  ? "bg-primary/10 text-primary"
                  : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
              @click=${() => {
                this.view = "image";
              }}
            >
              ${icon("image", 12)} 图表
            </button>
            <button
              class=${cn(
                "inline-flex cursor-pointer items-center rounded border-0 px-2 py-0.5 text-xs transition-colors",
                this.view === "code"
                  ? "bg-primary/10 text-primary"
                  : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
              @click=${() => {
                this.view = "code";
              }}
            >
              ${icon("code", 12)} 代码
            </button>
          </div>
          ${this.view === "image" && this._svgContent
            ? html`<button
                class="inline-flex cursor-pointer items-center gap-1 rounded border-0 bg-transparent px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                @click=${this._downloadSvg}
              >
                ${icon("download", 12)} 下载
              </button>`
            : nothing}
        </div>

        <!-- Content -->
        <div class="p-4">
          ${this._loading
            ? html`<div
                class="flex items-center justify-center py-8 text-sm text-muted-foreground"
              >
                渲染中...
              </div>`
            : this._error
              ? html`<div class="py-4 text-center text-sm text-destructive">
                  ${this._error}
                </div>`
              : this.view === "image"
                ? html`<div
                    class="flex items-center justify-center overflow-auto"
                  >
                    ${this._svgContent
                      ? html`<div class="mermaid-output">
                          ${this._unsafeSvg()}
                        </div>`
                      : nothing}
                  </div>`
                : html`<pre
                    class="overflow-auto text-sm leading-6 text-card-foreground"
                  ><code>${this.code}</code></pre>`}
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

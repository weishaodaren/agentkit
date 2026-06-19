import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";

export interface SourceItem {
  key: string;
  title: string;
  description?: string;
  url?: string;
}

@customElement("ak-sources")
export class AkSources extends AkElement {
  @property({ type: Array })
  items: SourceItem[] = [];

  @property({ type: String })
  title = "参考来源";

  private _handleClick(item: SourceItem) {
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
    this.dispatchEvent(
      new CustomEvent("source-click", {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    if (this.items.length === 0) return nothing;

    return html`
      <div class="flex flex-col gap-2">
        <span class="text-xs text-muted-foreground"
          >${this.title} (${this.items.length})</span
        >
        <div class="flex flex-wrap gap-2">
          ${this.items.map(
            (item, i) => html`
              <button
                class=${cn(
                  "ak-card-hover ak-motion-zoom-in flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left",
                  "max-w-[200px]",
                )}
                style="animation-delay: ${i * 60}ms;"
                @click=${() => this._handleClick(item)}
              >
                <span
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary"
                >
                  ${i + 1}
                </span>
                <div class="min-w-0 flex-1">
                  <div
                    class="truncate text-xs font-medium text-card-foreground"
                  >
                    ${item.title}
                  </div>
                  ${item.description
                    ? html`<div
                        class="truncate text-[10px] text-muted-foreground"
                      >
                        ${item.description}
                      </div>`
                    : nothing}
                </div>
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-sources": AkSources;
  }
}

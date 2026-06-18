import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";

export interface PromptsItem {
  key: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

@customElement("ak-prompts")
export class AkPrompts extends AkElement {
  @property({ type: Array })
  items: PromptsItem[] = [];

  @property({ type: String })
  title = "";

  @property({ type: String })
  columns: "1" | "2" | "3" | "4" = "2";

  private _handleClick(item: PromptsItem) {
    if (item.disabled) return;
    this.dispatchEvent(
      new CustomEvent("item-click", {
        detail: { item },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    const gridCols: Record<string, string> = {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
    };

    return html`
      <div class="flex flex-col gap-3">
        ${this.title
          ? html`<h3 class="m-0 text-sm font-medium text-muted-foreground">
              ${this.title}
            </h3>`
          : nothing}

        <div class=${cn("grid gap-2", gridCols[this.columns])}>
          ${this.items.map(
            (item, i) => html`
              <button
                class=${cn(
                  "ak-card-hover ak-motion-slide-up flex cursor-pointer flex-col items-start gap-1 rounded-lg border border-border bg-card p-3 text-left",
                  item.disabled && "pointer-events-none opacity-50",
                )}
                style="animation-delay: ${i * 50}ms;"
                ?disabled=${item.disabled}
                @click=${() => this._handleClick(item)}
              >
                <span class="text-sm font-medium text-card-foreground">
                  ${item.label}
                </span>
                ${item.description
                  ? html`<span class="text-xs text-muted-foreground">
                      ${item.description}
                    </span>`
                  : nothing}
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
    "ak-prompts": AkPrompts;
  }
}

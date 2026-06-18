import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";
import { icon } from "./shared/icons";

export interface ActionsItem {
  key: string;
  label: string;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
}

@customElement("ak-actions")
export class AkActions extends AkElement {
  @property({ type: Array })
  items: ActionsItem[] = [];

  private _handleClick(item: ActionsItem) {
    if (item.disabled) return;
    this.dispatchEvent(
      new CustomEvent("action-click", {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="flex items-center gap-1">
        ${this.items.map(
          (item) => html`
            <button
              class=${cn(
                "ak-btn-interactive inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-2 py-1 text-xs",
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                item.disabled && "pointer-events-none opacity-50",
              )}
              ?disabled=${item.disabled}
              @click=${() => this._handleClick(item)}
              title=${item.label}
            >
              ${item.icon
                ? html`<span class="flex items-center"
                    >${icon(item.icon, 14)}</span
                  >`
                : nothing}
              <span>${item.label}</span>
            </button>
          `,
        )}
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-actions": AkActions;
  }
}

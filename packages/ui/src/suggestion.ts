import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";

export interface SuggestionItem {
  key: string;
  label: string;
  value: string;
}

@customElement("ak-suggestion")
export class AkSuggestion extends AkElement {
  @property({ type: Array })
  items: SuggestionItem[] = [];

  @property({ type: Boolean })
  open = false;

  @property({ type: String, attribute: "filter-value" })
  filterValue = "";

  @state()
  private _selectedIndex = 0;

  private get _filteredItems() {
    if (!this.filterValue) return this.items;
    const lower = this.filterValue.toLowerCase();
    return this.items.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.value.toLowerCase().includes(lower),
    );
  }

  override willUpdate(changed: PropertyValues) {
    if (changed.has("filterValue") || changed.has("items")) {
      const filtered = this._filteredItems;
      if (this._selectedIndex >= filtered.length) {
        this._selectedIndex = Math.max(0, filtered.length - 1);
      }
    }
  }

  private _handleSelect(item: SuggestionItem) {
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { key: item.key, value: item.value, item },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    if (!this.open || this._filteredItems.length === 0) return nothing;

    return html`
      <div
        class=${cn(
          "ak-motion-slide-up max-h-48 overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-lg",
        )}
      >
        ${this._filteredItems.map(
          (item, i) => html`
            <button
              class=${cn(
                "flex w-full cursor-pointer items-center rounded-md border-0 bg-transparent px-3 py-1.5 text-left text-sm transition-colors",
                i === this._selectedIndex
                  ? "bg-accent text-accent-foreground"
                  : "text-card-foreground hover:bg-accent/50",
              )}
              @click=${() => this._handleSelect(item)}
              @mouseenter=${() => {
                this._selectedIndex = i;
              }}
            >
              ${item.label}
            </button>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-suggestion": AkSuggestion;
  }
}

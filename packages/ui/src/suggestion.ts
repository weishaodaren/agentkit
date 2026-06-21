import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";

export interface SuggestionItem {
  key: string;
  label: string;
  value: string;
  /** antd-x: nested children for cascading selection */
  children?: SuggestionItem[];
}

/**
 * antd-x Suggestion 对标实现
 *
 * antd-x: Based on Cascader, supports multi-level cascading selection.
 * Our implementation: flat list with expandable children sub-items.
 */
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

  @state()
  private _expandedKey = "";

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
    // If item has children, toggle expand instead of selecting
    if (item.children && item.children.length > 0) {
      this._expandedKey = this._expandedKey === item.key ? "" : item.key;
      return;
    }
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
        ${this._filteredItems.map((item, i) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = this._expandedKey === item.key;

          return html`
            <div>
              <button
                class=${cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-md border-0 bg-transparent px-3 py-1.5 text-left text-sm transition-colors",
                  i === this._selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "text-card-foreground hover:bg-accent/50",
                )}
                @click=${() => this._handleSelect(item)}
                @mouseenter=${() => {
                  this._selectedIndex = i;
                }}
              >
                <span>${item.label}</span>
                ${hasChildren
                  ? html`<span class="ml-2 text-xs text-muted-foreground"
                      >›</span
                    >`
                  : nothing}
              </button>
              <!-- Cascading children -->
              ${hasChildren && isExpanded
                ? html`<div class="ml-4 border-l border-border pl-2">
                    ${item.children!.map(
                      (child) => html`
                        <button
                          class="flex w-full cursor-pointer items-center rounded-md border-0 bg-transparent px-3 py-1 text-left text-xs text-card-foreground transition-colors hover:bg-accent/50"
                          @click=${() => this._handleSelect(child)}
                        >
                          ${child.label}
                        </button>
                      `,
                    )}
                  </div>`
                : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-suggestion": AkSuggestion;
  }
}

import { css, html, nothing, type PropertyValues, type CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
const suggestionCSS: CSSResult = css`
  .ak-suggestion {
    max-height: 192px;
    overflow-y: auto;
    border-radius: var(--ak-border-radius-md, 8px);
    border: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
    background: var(--ak-color-bg-container, #fff);
    padding: var(--ak-padding-xxs, 4px);
    box-shadow: var(--ak-box-shadow, 0 6px 16px rgba(0, 0, 0, 0.08));
  }
  .ak-suggestion-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--ak-padding-xxs, 4px) var(--ak-padding-sm, 12px);
    border-radius: var(--ak-border-radius-sm, 4px);
    border: none;
    background: transparent;
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    text-align: left;
    cursor: pointer;
    transition: background var(--ak-duration-mid, 200ms);
  }
  .ak-suggestion-item:hover {
    background: var(--ak-color-bg-text-hover, rgba(0, 0, 0, 0.04));
  }
  .ak-suggestion-item-selected {
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
  }
  .ak-suggestion-arrow {
    margin-left: var(--ak-padding-xs, 8px);
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-description, rgba(0, 0, 0, 0.45));
  }
  .ak-suggestion-children {
    margin-left: var(--ak-padding, 16px);
    border-left: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
    padding-left: var(--ak-padding-xs, 8px);
  }
  .ak-suggestion-child {
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--ak-padding-xxs, 4px) var(--ak-padding-sm, 12px);
    border-radius: var(--ak-border-radius-sm, 4px);
    border: none;
    background: transparent;
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    text-align: left;
    cursor: pointer;
    transition: background var(--ak-duration-mid, 200ms);
  }
  .ak-suggestion-child:hover {
    background: var(--ak-color-bg-text-hover, rgba(0, 0, 0, 0.04));
  }
`;

@customElement("ak-suggestion")
export class AkSuggestion extends AkElement {
  static override styles = [suggestionCSS];
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
      <div class="ak-suggestion ak-motion-slide-up">
        ${this._filteredItems.map((item, i) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = this._expandedKey === item.key;

          return html`
            <div>
              <button
                class="ak-suggestion-item ${i === this._selectedIndex
                  ? "ak-suggestion-item-selected"
                  : ""}"
                @click=${() => this._handleSelect(item)}
                @mouseenter=${() => {
                  this._selectedIndex = i;
                }}
              >
                <span>${item.label}</span>
                ${hasChildren
                  ? html`<span class="ak-suggestion-arrow">›</span>`
                  : nothing}
              </button>
              ${hasChildren && isExpanded
                ? html`<div class="ak-suggestion-children">
                    ${item.children!.map(
                      (child) => html`
                        <button
                          class="ak-suggestion-child"
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

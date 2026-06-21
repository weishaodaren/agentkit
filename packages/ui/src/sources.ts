import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AkElement } from "@/shared/base-element";

export interface SourceItem {
  key: string;
  title: string;
  description?: string;
  url?: string;
}

/**
 * antd-x Sources 对标实现
 *
 * antd-x modes:
 *   - expandable (default): list with expand/collapse
 *   - inline: horizontal scrollable card carousel (Popover style)
 *
 * antd-x structure:
 *   .ant-sources (root)
 *   ├── .ant-sources-title
 *   └── .ant-sources-list / .ant-sources-inline
 *       └── .ant-sources-item (clickable card)
 */
const sourcesCSS: CSSResult = css`
  .ak-sources {
    display: flex;
    flex-direction: column;
    gap: var(--ak-padding-xs, 8px);
  }
  .ak-sources-title {
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-sources-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ak-padding-xs, 8px);
  }
  .ak-sources-inline {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: var(--ak-padding-xxs, 4px);
  }
  .ak-sources-item {
    display: flex;
    align-items: center;
    gap: var(--ak-padding-xs, 8px);
    padding: var(--ak-padding-xs, 8px) var(--ak-padding-sm, 12px);
    border-radius: var(--ak-border-radius-md, 8px);
    border: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
    background: var(--ak-color-bg-container, #fff);
    cursor: pointer;
    text-align: left;
    max-width: 200px;
    transition: all var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
  }
  .ak-sources-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  .ak-sources-inline .ak-sources-item {
    flex-shrink: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    width: 180px;
    padding: 10px;
  }
  .ak-sources-item-index {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--ak-color-primary-bg, #e6f4ff);
    font-size: 10px;
    font-weight: 500;
    color: var(--ak-color-primary, #1677ff);
    flex-shrink: 0;
  }
  .ak-sources-item-title {
    font-size: var(--ak-font-size-sm, 12px);
    font-weight: 500;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ak-sources-item-desc {
    font-size: 10px;
    color: var(--ak-color-text-description, rgba(0, 0, 0, 0.45));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ak-sources-item-body {
    min-width: 0;
    flex: 1;
  }
`;

@customElement("ak-sources")
export class AkSources extends AkElement {
  static override styles = [sourcesCSS];
  @property({ type: Array })
  items: SourceItem[] = [];

  @property({ type: String })
  title = "参考来源";

  /** antd-x: display mode (list = default expandable, inline = horizontal carousel) */
  @property({ type: String })
  mode: "list" | "inline" = "list";

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

    if (this.mode === "inline") {
      return html`
        <div class="ak-sources">
          <span class="ak-sources-title"
            >${this.title} (${this.items.length})</span
          >
          <div class="ak-sources-list ak-sources-inline">
            ${this.items.map(
              (item, i) => html`
                <button
                  class="ak-sources-item"
                  @click=${() => this._handleClick(item)}
                >
                  <span class="ak-sources-item-index">${i + 1}</span>
                  <div class="ak-sources-item-title">${item.title}</div>
                  ${item.description
                    ? html`<div class="ak-sources-item-desc">
                        ${item.description}
                      </div>`
                    : nothing}
                </button>
              `,
            )}
          </div>
        </div>
      `;
    }

    // Default list mode
    return html`
      <div class="ak-sources">
        <span class="ak-sources-title"
          >${this.title} (${this.items.length})</span
        >
        <div class="ak-sources-list">
          ${this.items.map(
            (item, i) => html`
              <button
                class="ak-sources-item"
                @click=${() => this._handleClick(item)}
              >
                <span class="ak-sources-item-index">${i + 1}</span>
                <div class="ak-sources-item-body">
                  <div class="ak-sources-item-title">${item.title}</div>
                  ${item.description
                    ? html`<div class="ak-sources-item-desc">
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

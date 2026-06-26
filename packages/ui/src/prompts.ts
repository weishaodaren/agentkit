import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

export interface PromptsItem {
  key: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  /** Nested children prompts (antd-x: children?: BasePromptsItemType[]) */
  children?: PromptsItem[];
}

/**
 * antd-x Prompts 对标实现
 *
 * antd-x 结构：
 *   .ant-prompts (root)
 *   ├── .ant-prompts-title (Typography.Title level=5)
 *   └── .ant-prompts-list (flex/grid)
 *       └── .ant-prompts-item (clickable card)
 *           ├── .ant-prompts-icon
 *           └── .ant-prompts-content
 *               ├── .ant-prompts-label (h6)
 *               ├── .ant-prompts-desc (p)
 *               └── nested Prompts (vertical, .ant-prompts-nested)
 *
 * Features:
 *   - children 嵌套（递归渲染子 Prompts）
 *   - disabled 状态
 *   - vertical / wrap 布局
 *   - fadeIn / fadeInLeft 动画
 */
const promptsCSS: CSSResult = css`
  .ak-prompts {
    display: flex;
    flex-direction: column;
    gap: var(--ak-margin-sm, 12px);
  }
  .ak-prompts-nested {
    margin-top: var(--ak-margin-xs, 8px);
  }
  .ak-prompts-title {
    margin: 0;
    font-size: var(--ak-font-size, 14px);
    font-weight: 500;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-prompts-list {
    display: grid;
    gap: var(--ak-padding-xs, 8px);
  }
  .ak-prompts-list-vertical {
    display: flex;
    flex-direction: column;
  }
  .ak-prompts-list-cols-1 {
    grid-template-columns: 1fr;
  }
  .ak-prompts-list-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .ak-prompts-list-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  .ak-prompts-list-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  .ak-prompts-list-wrap {
    flex-wrap: wrap;
  }
  .ak-prompts-item {
    display: flex;
    align-items: flex-start;
    gap: var(--ak-padding-xs, 8px);
    padding: var(--ak-padding-sm, 12px);
    border-radius: var(--ak-border-radius-lg, 12px);
    border: var(--ak-line-width, 1px) solid
      var(--ak-prompts-item-border, var(--ak-color-border-secondary, #f0f0f0));
    background: var(--ak-prompts-item-bg, var(--ak-color-bg-container, #fff));
    cursor: pointer;
    transition: all var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
  }
  .ak-prompts-item:hover {
    background: var(
      --ak-prompts-item-hover-bg,
      var(--ak-color-bg-text-hover, rgba(0, 0, 0, 0.04))
    );
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  .ak-prompts-item:active {
    transform: translateY(0) scale(0.98);
  }
  .ak-prompts-item-disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  .ak-prompts-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: var(--ak-color-primary, #1677ff);
  }
  .ak-prompts-content {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }
  .ak-prompts-label {
    margin: 0;
    font-size: var(--ak-font-size, 14px);
    font-weight: 500;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-prompts-desc {
    margin: 4px 0 0;
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-description, rgba(0, 0, 0, 0.45));
  }
`;

@customElement("ak-prompts")
export class AkPrompts extends AkElement {
  static override styles = [promptsCSS];
  @property({ type: Array })
  items: PromptsItem[] = [];

  @property({ type: String })
  title = "";

  @property({ type: String })
  columns: "1" | "2" | "3" | "4" = "2";

  /** antd-x: whether prompt list is arranged vertically */
  @property({ type: Boolean })
  vertical = false;

  /** antd-x: whether prompt list wraps */
  @property({ type: Boolean })
  wrap = false;

  /** antd-x: enable fade-in animation */
  @property({ type: Boolean, attribute: "fade-in" })
  fadeIn = false;

  /** antd-x: enable fade-in from left animation */
  @property({ type: Boolean, attribute: "fade-in-left" })
  fadeInLeft = false;

  /** Whether this is a nested prompts (internal) */
  @property({ type: Boolean })
  nested = false;

  private _handleClick(item: PromptsItem) {
    if (item.disabled) return;
    const hasChildren = item.children && item.children.length > 0;
    if (hasChildren) return; // antd-x: items with nested children are not clickable
    this.dispatchEvent(
      new CustomEvent("item-click", {
        detail: { item },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _renderItem(item: PromptsItem, index: number, motionClass: string) {
    const hasChildren = item.children && item.children.length > 0;

    return html`
      <div
        class="ak-prompts-item ${motionClass} ${item.disabled
          ? "ak-prompts-item-disabled"
          : ""} ${hasChildren ? "ak-prompts-item-has-nest" : ""}"
        style="animation-delay: ${index * 50}ms;"
        @click=${() => this._handleClick(item)}
      >
        <!-- Icon -->
        ${item.icon
          ? html`<div class="ak-prompts-icon">${icon(item.icon, 16)}</div>`
          : nothing}

        <!-- Content -->
        <div class="ak-prompts-content flex min-w-0 flex-1 flex-col">
          ${item.label
            ? html`<h6 class="ak-prompts-label">${item.label}</h6>`
            : nothing}
          ${item.description
            ? html`<p class="ak-prompts-desc">${item.description}</p>`
            : nothing}

          <!-- Nested children (recursive) -->
          ${hasChildren
            ? html`<ak-prompts
                class="ak-prompts-nested"
                .items=${item.children!}
                .vertical=${true}
                .nested=${true}
                @item-click=${(e: Event) => {
                  // Bubble up the nested click event
                  e.stopPropagation();
                  this.dispatchEvent(
                    new CustomEvent("item-click", {
                      detail: (e as CustomEvent).detail,
                      bubbles: true,
                      composed: true,
                    }),
                  );
                }}
              ></ak-prompts>`
            : nothing}
        </div>
      </div>
    `;
  }

  override render() {
    const motionClass = this.fadeInLeft
      ? "ak-motion-fade-in-left"
      : this.fadeIn
        ? "ak-motion-fade-in"
        : "";

    const listCls = `ak-prompts-list ${this.vertical ? "ak-prompts-list-vertical" : `ak-prompts-list-cols-${this.columns}`} ${this.wrap ? "ak-prompts-list-wrap" : ""}`;

    return html`
      <div
        class="ak-prompts ${this.nested
          ? "ak-prompts-nested"
          : ""} ${motionClass}"
      >
        ${this.title && !this.nested
          ? html`<h5 class="ak-prompts-title">${this.title}</h5>`
          : nothing}

        <div class=${listCls}>
          ${this.items.map((item, i) => this._renderItem(item, i, motionClass))}
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

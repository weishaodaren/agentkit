import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";

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
@customElement("ak-prompts")
export class AkPrompts extends AkElement {
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

  private _renderItem(item: PromptsItem, index: number) {
    const hasChildren = item.children && item.children.length > 0;

    return html`
      <div
        class=${cn(
          "ak-prompts-item ak-card-hover flex cursor-pointer items-start gap-2 rounded-xl border border-border bg-card p-3",
          item.disabled &&
            "ak-prompts-item-disabled pointer-events-none opacity-50",
          hasChildren && "ak-prompts-item-has-nest",
        )}
        style="animation-delay: ${index * 50}ms;"
        @click=${() => this._handleClick(item)}
      >
        <!-- Icon -->
        ${item.icon
          ? html`<div
              class="ak-prompts-icon flex shrink-0 items-center text-primary"
            >
              ${item.icon}
            </div>`
          : nothing}

        <!-- Content -->
        <div class="ak-prompts-content flex min-w-0 flex-1 flex-col">
          ${item.label
            ? html`<h6
                class="ak-prompts-label m-0 text-sm font-medium text-card-foreground"
              >
                ${item.label}
              </h6>`
            : nothing}
          ${item.description
            ? html`<p
                class="ak-prompts-desc m-0 mt-1 text-xs text-muted-foreground"
              >
                ${item.description}
              </p>`
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

    const listCls = cn(
      "ak-prompts-list",
      this.vertical
        ? "flex flex-col gap-2"
        : `grid gap-2 grid-cols-${this.columns}`,
      this.wrap && "ak-prompts-list-wrap flex-wrap",
    );

    return html`
      <div
        class=${cn(
          "ak-prompts flex flex-col gap-3",
          motionClass,
          this.nested && "mt-2",
        )}
      >
        ${this.title && !this.nested
          ? html`<h5
              class="ak-prompts-title m-0 text-sm font-medium text-muted-foreground"
            >
              ${this.title}
            </h5>`
          : nothing}

        <div class=${listCls}>
          ${this.items.map((item, i) => this._renderItem(item, i))}
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

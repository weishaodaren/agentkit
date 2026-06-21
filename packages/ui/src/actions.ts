import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

export interface ActionsItem {
  key: string;
  label: string;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
}

/**
 * antd-x Actions 对标实现
 *
 * antd-x variants: borderless (default) / filled / outlined
 * antd token mapping:
 *   list gap: paddingXS (8px) → gap-2
 *   item height: controlHeightSM (24px) → h-6
 *   item paddingInline: paddingXXS+1 (5px) → px-[5px]
 *   item paddingBlock: paddingXXS (4px) → py-1
 *   item borderRadiusSM (4px) → rounded
 *   item fontSize (14px) → text-sm
 */
const actionsCSS: CSSResult = css`
  .ak-actions {
    display: inline-flex;
    align-items: center;
    gap: var(--ak-padding-xs, 8px);
    padding: 2px var(--ak-padding-xxs, 4px);
    border-radius: var(--ak-border-radius-sm, 4px);
  }
  .ak-actions-filled {
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
  }
  .ak-actions-outlined {
    border: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
  }
  .ak-actions-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: var(--ak-control-height-sm, 24px);
    padding: var(--ak-padding-xxs, 4px) 5px;
    border-radius: var(--ak-border-radius-sm, 4px);
    border: none;
    background: transparent;
    font-size: var(--ak-font-size, 14px);
    cursor: pointer;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    transition: all var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
  }
  .ak-actions-item:hover {
    background: var(--ak-color-bg-text-hover, rgba(0, 0, 0, 0.04));
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    transform: scale(1.05);
  }
  .ak-actions-item:active {
    transform: scale(0.95);
  }
  .ak-actions-item-active {
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-actions-item-disabled {
    pointer-events: none;
    opacity: 0.45;
  }
  .ak-actions-item-icon {
    display: flex;
    align-items: center;
    transition: transform 150ms;
  }
`;

@customElement("ak-actions")
export class AkActions extends AkElement {
  static override styles = [actionsCSS];
  @property({ type: Array })
  items: ActionsItem[] = [];

  /** antd-x variant: borderless (default) / filled / outlined */
  @property({ type: String })
  variant: "borderless" | "filled" | "outlined" = "borderless";

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
      <div
        class="ak-actions ${this.variant !== "borderless"
          ? `ak-actions-${this.variant}`
          : ""}"
      >
        ${this.items.map(
          (item) => html`
            <button
              class="ak-actions-item ${item.active
                ? "ak-actions-item-active"
                : ""} ${item.disabled ? "ak-actions-item-disabled" : ""}"
              ?disabled=${item.disabled}
              @click=${() => this._handleClick(item)}
              title=${item.label}
            >
              ${item.icon
                ? html`<span class="ak-actions-item-icon"
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

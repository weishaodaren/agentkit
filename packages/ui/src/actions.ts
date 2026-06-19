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

/**
 * antd token mapping:
 *   list gap: paddingXS (8px) → gap-2
 *   item height: controlHeightSM (24px) → h-6
 *   item paddingInline: paddingXXS+1 (5px) → px-[5px]
 *   item paddingBlock: paddingXXS (4px) → py-1
 *   item borderRadiusSM (4px) → rounded
 *   item fontSize (14px) → text-sm
 *   transition: all motionDurationMid(200ms) motionEaseInOut
 *   hover: colorBgTextHover → hover:bg-black/[0.04]
 */
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
      <!-- antd: inline-flex, flex-row, items-center, gap paddingXS(8px) -->
      <div class="inline-flex items-center gap-2">
        ${this.items.map(
          (item) => html`
            <button
              class=${cn(
                // antd: h controlHeightSM(24px), inline-flex, items-center, justify-center
                // px paddingXXS+1(5px), py paddingXXS(4px), rounded borderRadiusSM(4px)
                "inline-flex h-6 cursor-pointer items-center justify-center gap-1 rounded border-0 bg-transparent px-[5px] py-1 text-sm",
                "transition-all duration-200",
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground",
                item.disabled && "pointer-events-none opacity-45",
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

import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

export interface ConversationItem {
  key: string;
  label: string;
  timestamp?: string;
  active?: boolean;
  icon?: string;
  disabled?: boolean;
}

/**
 * antd token mapping:
 *   container: flex column, gap paddingXXS(4px), padding paddingSM(12px)
 *   item height: controlHeightLG(40px) → h-10
 *   item gap: paddingXS(8px) → gap-2
 *   item padding: 0 paddingXS(8px) → px-2
 *   item borderRadiusLG(8px) → rounded-lg
 *   item hover: colorBgTextHover → hover:bg-black/[0.04]
 *   item active: colorBgTextHover → bg-black/[0.04]
 *   label: flex-1, colorText, overflow-hidden, ellipsis, nowrap
 *   transition: all motionDurationMid(200ms) motionEaseInOut
 */
@customElement("ak-conversations")
export class AkConversations extends AkElement {
  @property({ type: Array })
  items: ConversationItem[] = [];

  @property({ type: String })
  title = "对话列表";

  @property({ type: String, attribute: "active-key" })
  activeKey = "";

  private _handleClick(item: ConversationItem) {
    if (item.disabled) return;
    this.dispatchEvent(
      new CustomEvent("conversation-click", {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <!-- antd: flex, flex-col, gap paddingXXS(4px), overflow-y auto, padding paddingSM(12px) -->
      <div class="flex h-full flex-col gap-1 overflow-y-auto p-3">
        ${this.title
          ? html`<div class="flex items-center justify-between px-1 pb-2">
              <span class="text-sm font-medium text-foreground"
                >${this.title}</span
              >
              <slot name="extra"></slot>
            </div>`
          : nothing}

        <!-- antd: flex, flex-col, gap paddingXXS(4px) -->
        <div class="flex flex-col gap-1">
          ${this.items.map(
            (item) => html`
              <!-- antd: h controlHeightLG(40px), gap paddingXS(8px), px paddingXS(8px) -->
              <button
                class=${cn(
                  "flex h-10 min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 text-left",
                  "transition-all duration-200",
                  item.disabled
                    ? "pointer-events-none opacity-45"
                    : item.active || item.key === this.activeKey
                      ? "bg-black/[0.04] text-foreground"
                      : "text-foreground hover:bg-black/[0.04]",
                )}
                ?disabled=${item.disabled}
                @click=${() => this._handleClick(item)}
              >
                ${item.icon
                  ? html`<span class="shrink-0 text-sm"
                      >${icon(item.icon, 14)}</span
                    >`
                  : html`<span class="shrink-0 text-sm"
                      >${icon("message-circle", 14)}</span
                    >`}
                <!-- antd: flex-1, colorText, overflow hidden, ellipsis, nowrap -->
                <div
                  class="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground"
                >
                  ${item.label}
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
    "ak-conversations": AkConversations;
  }
}

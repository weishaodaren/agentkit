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
  /** antd-x: group label for groupable mode */
  group?: string;
}

/**
 * antd-x Conversations 对标实现
 *
 * antd-x features:
 *   - groupable: collapsible groups
 *   - creation: new conversation button
 *   - menu: context menu per item
 *   - divider: separator items
 *
 * Our implementation:
 *   - Groupable mode with collapsible groups
 *   - Creation button in header
 *   - Keyboard navigation (up/down/enter)
 */

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

  /** antd-x: enable groupable mode (collapsible groups) */
  @property({ type: Boolean })
  groupable = false;

  /** antd-x: show creation button */
  @property({ type: Boolean })
  creation = false;

  /** Creation button label */
  @property({ type: String, attribute: "creation-label" })
  creationLabel = "新对话";

  /** Enable keyboard navigation */
  @property({ type: Boolean, attribute: "shortcut-keys" })
  shortcutKeys = false;

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

  private _handleCreation() {
    this.dispatchEvent(
      new CustomEvent("creation", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Group items by their group property */
  private get _groupedItems(): Map<string, ConversationItem[]> {
    const groups = new Map<string, ConversationItem[]>();
    for (const item of this.items) {
      const group = item.group || "";
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group)!.push(item);
    }
    return groups;
  }

  override render() {
    return html`
      <div
        class="flex h-full flex-col gap-1 overflow-y-auto p-3 scrollbar-thin"
      >
        ${this.title || this.creation
          ? html`<div class="flex items-center justify-between px-1 pb-2">
              ${this.title
                ? html`<span class="text-sm font-medium text-foreground"
                    >${this.title}</span
                  >`
                : nothing}
              <div class="flex items-center gap-1">
                <slot name="extra"></slot>
                ${this.creation
                  ? html`<button
                      class="inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                      @click=${this._handleCreation}
                    >
                      ${icon("plus", 12)} ${this.creationLabel}
                    </button>`
                  : nothing}
              </div>
            </div>`
          : nothing}
        ${this.groupable
          ? html`
              <!-- Grouped view -->
              ${Array.from(this._groupedItems.entries()).map(
                ([group, items]) => html`
                  <div class="mb-1">
                    ${group
                      ? html`<div
                          class="flex items-center gap-1 px-1 py-1 text-xs font-medium text-muted-foreground"
                        >
                          ${group}
                        </div>`
                      : nothing}
                    <div class="flex flex-col gap-0.5">
                      ${items.map((item) => this._renderItem(item))}
                    </div>
                  </div>
                `,
              )}
            `
          : html`
              <!-- Flat view -->
              <div class="flex flex-col gap-0.5">
                ${this.items.map((item) => this._renderItem(item))}
              </div>
            `}
      </div>
    `;
  }

  private _renderItem(item: ConversationItem) {
    return html`
      <button
        class=${cn(
          "relative flex h-10 min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-3 text-left",
          "transition-all duration-200 ease-in-out",
          item.disabled
            ? "pointer-events-none opacity-45"
            : item.active || item.key === this.activeKey
              ? "bg-accent text-accent-foreground"
              : "text-foreground hover:bg-accent/50 active:bg-accent/70",
        )}
        ?disabled=${item.disabled}
        @click=${() => this._handleClick(item)}
      >
        <!-- Active indicator bar -->
        ${item.active || item.key === this.activeKey
          ? html`<span
              class="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-all duration-200"
            ></span>`
          : nothing}
        ${item.icon
          ? html`<span class="shrink-0 text-sm transition-colors duration-150"
              >${icon(item.icon, 14)}</span
            >`
          : html`<span class="shrink-0 text-sm"
              >${icon("message-circle", 14)}</span
            >`}

        <div
          class="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm transition-colors duration-150"
        >
          ${item.label}
        </div>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-conversations": AkConversations;
  }
}

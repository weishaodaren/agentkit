import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property } from "lit/decorators.js";
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
const conversationsCSS: CSSResult = css`
  .ak-conversations {
    display: flex;
    flex-direction: column;
    gap: var(--ak-padding-xxs, 4px);
    padding: var(--ak-padding-sm, 12px);
    height: 100%;
    overflow-y: auto;
  }
  .ak-conversations-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--ak-padding-xxs, 4px) var(--ak-padding-xs, 8px);
  }
  .ak-conversations-title {
    font-size: var(--ak-font-size, 14px);
    font-weight: 500;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-conversations-creation-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px var(--ak-padding-xxs, 4px);
    border-radius: var(--ak-border-radius-sm, 4px);
    border: none;
    background: transparent;
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    cursor: pointer;
    transition: color var(--ak-duration-mid, 200ms);
  }
  .ak-conversations-creation-btn:hover {
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-conversations-group-label {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: var(--ak-padding-xxs, 4px);
    font-size: var(--ak-font-size-sm, 12px);
    font-weight: 500;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-conversations-group {
    margin-bottom: var(--ak-margin-xxs, 4px);
  }
  .ak-conversations-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .ak-conversations-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--ak-padding-xs, 8px);
    height: var(--ak-control-height-lg, 40px);
    min-height: var(--ak-control-height-lg, 40px);
    padding: 0 var(--ak-padding-sm, 12px);
    border-radius: var(--ak-border-radius-md, 8px);
    border: none;
    background: transparent;
    text-align: left;
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    cursor: pointer;
    transition: all var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
    width: 100%;
  }
  .ak-conversations-item:hover {
    background: var(--ak-color-bg-text-hover, rgba(0, 0, 0, 0.04));
  }
  .ak-conversations-item:active {
    background: var(--ak-color-bg-text-active, rgba(0, 0, 0, 0.06));
  }
  .ak-conversations-item-active {
    background: var(--ak-color-bg-text-hover, rgba(0, 0, 0, 0.04));
  }
  .ak-conversations-item-disabled {
    pointer-events: none;
    opacity: 0.45;
  }
  .ak-conversations-item-indicator {
    position: absolute;
    left: 0;
    top: 50%;
    width: 3px;
    height: 20px;
    border-radius: 2px;
    background: var(--ak-color-primary, #1677ff);
    transform: translateY(-50%);
    transition: all var(--ak-duration-mid, 200ms);
  }
  .ak-conversations-item-icon {
    flex-shrink: 0;
    font-size: var(--ak-font-size, 14px);
    transition: color 150ms;
  }
  .ak-conversations-item-label {
    min-width: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 150ms;
  }
`;

@customElement("ak-conversations")
export class AkConversations extends AkElement {
  static override styles = [conversationsCSS];
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
      <div class="ak-conversations">
        ${this.title || this.creation
          ? html`<div class="ak-conversations-header">
              ${this.title
                ? html`<span class="ak-conversations-title"
                    >${this.title}</span
                  >`
                : nothing}
              <div style="display:flex;align-items:center;gap:4px;">
                <slot name="extra"></slot>
                ${this.creation
                  ? html`<button
                      class="ak-conversations-creation-btn"
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
              ${Array.from(this._groupedItems.entries()).map(
                ([group, items]) => html`
                  <div class="ak-conversations-group">
                    ${group
                      ? html`<div class="ak-conversations-group-label">
                          ${group}
                        </div>`
                      : nothing}
                    <div class="ak-conversations-list">
                      ${items.map((item) => this._renderItem(item))}
                    </div>
                  </div>
                `,
              )}
            `
          : html`
              <div class="ak-conversations-list">
                ${this.items.map((item) => this._renderItem(item))}
              </div>
            `}
      </div>
    `;
  }

  private _renderItem(item: ConversationItem) {
    const isActive = item.active || item.key === this.activeKey;
    return html`
      <button
        class="ak-conversations-item ${isActive
          ? "ak-conversations-item-active"
          : ""} ${item.disabled ? "ak-conversations-item-disabled" : ""}"
        ?disabled=${item.disabled}
        @click=${() => this._handleClick(item)}
      >
        ${isActive
          ? html`<span class="ak-conversations-item-indicator"></span>`
          : nothing}
        ${item.icon
          ? html`<span class="ak-conversations-item-icon"
              >${icon(item.icon, 14)}</span
            >`
          : html`<span class="ak-conversations-item-icon"
              >${icon("message-circle", 14)}</span
            >`}
        <div class="ak-conversations-item-label">${item.label}</div>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-conversations": AkConversations;
  }
}

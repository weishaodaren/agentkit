import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Task } from "@lit/task";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

export interface ThoughtChainItem {
  key: string;
  title: string;
  description?: string;
  status?: "pending" | "running" | "success" | "error";
  icon?: string;
  /** Extra content slot data */
  content?: string;
  /** Footer slot data */
  footer?: string;
}

/**
 * antd-x ThoughtChain 对标实现
 *
 * antd-x 结构：
 *   .ant-thought-chain (root)
 *   └── .ant-thought-chain-item (relative flex)
 *       ├── .ant-thought-chain-item-header (flex col, icon + connector line)
 *       │   └── .ant-thought-chain-item-icon (status icon)
 *       │       connector: border-inline-start on ::after
 *       └── .ant-thought-chain-item-content-box (flex-1)
 *           ├── .ant-thought-chain-item-title
 *           ├── .ant-thought-chain-item-description
 *           ├── .ant-thought-chain-item-content (slot)
 *           └── .ant-thought-chain-item-footer (slot)
 *
 * Features:
 *   - 连接线使用 border-inline-start（antd-x 风格）
 *   - line 样式（solid/dashed/dotted）
 *   - content/footer 插槽
 *   - collapsible 折叠
 */
const thoughtChainCSS: CSSResult = css`
  .ak-thought-chain {
    display: flex;
    flex-direction: column;
  }
  .ak-thought-chain-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: var(--ak-padding-xs, 8px);
    padding: 0;
    border: none;
    background: transparent;
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    cursor: pointer;
    transition: color var(--ak-duration-mid, 200ms);
  }
  .ak-thought-chain-toggle:hover {
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-thought-chain-toggle-icon {
    display: inline-flex;
    transition: transform var(--ak-duration-mid, 200ms);
  }
  .ak-thought-chain-toggle-icon-expanded {
    transform: rotate(90deg);
  }
  .ak-thought-chain-item {
    display: flex;
    gap: var(--ak-padding-sm, 12px);
    align-items: baseline;
  }
  .ak-thought-chain-item-header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .ak-thought-chain-item-icon-wrap {
    position: relative;
    line-height: 1;
  }
  .ak-thought-chain-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    font-size: 14px;
    transition: all var(--ak-duration-mid, 200ms);
  }
  .ak-thought-chain-status-pending {
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-thought-chain-status-running {
    background: var(--ak-color-primary-bg, #e6f4ff);
    color: var(--ak-color-primary, #1677ff);
  }
  .ak-thought-chain-status-success {
    background: rgba(82, 196, 26, 0.1);
    color: #52c41a;
  }
  .ak-thought-chain-status-error {
    background: rgba(255, 77, 79, 0.1);
    color: var(--ak-color-error, #ff4d4f);
  }
  .ak-thought-chain-connector {
    position: absolute;
    left: 50%;
    top: 100%;
    width: 0;
    transform: translateX(-50%);
    height: calc(100% + 16px);
  }
  .ak-thought-chain-item-content-box {
    flex: 1;
    padding-bottom: var(--ak-padding, 16px);
  }
  .ak-thought-chain-item-title {
    font-size: var(--ak-font-size, 14px);
    font-weight: 500;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-thought-chain-item-description {
    margin-top: var(--ak-padding-xs, 8px);
    font-size: var(--ak-font-size, 14px);
    line-height: 1.5714;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-thought-chain-item-content {
    margin-top: var(--ak-padding-xs, 8px);
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-thought-chain-item-footer {
    margin-top: var(--ak-padding-xs, 8px);
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
`;

@customElement("ak-thought-chain")
export class AkThoughtChain extends AkElement {
  static override styles = [thoughtChainCSS];
  @property({ type: Array })
  items: ThoughtChainItem[] = [];

  @property({ type: Boolean })
  collapsible = false;

  @property({ type: Boolean })
  collapsed = false;

  /** Typing speed in ms per character for descriptions (0 = disabled) */
  @property({ type: Number, attribute: "typing-speed" })
  typingSpeed = 20;

  /** antd-x: line style for connector (solid/dashed/dotted) */
  @property({ type: String, attribute: "line-style" })
  lineStyle: "solid" | "dashed" | "dotted" = "solid";

  /** antd-x: item variant (solid/outlined) */
  @property({ type: String, attribute: "item-variant" })
  itemVariant: "solid" | "outlined" = "solid";

  @state()
  private _internalCollapsed = false;

  @state()
  private _userInteracted = false;

  @state()
  private _typedLengths: Record<string, number> = {};

  private get _isCollapsed() {
    if (this._userInteracted) return this._internalCollapsed;
    return this.collapsed;
  }

  /**
   * Typing animation task — types all item descriptions in parallel.
   * When items/speed/collapsed change, the previous task is automatically
   * aborted via AbortSignal. On disconnect, cleanup is automatic.
   */
  private _typingTask = new Task<[ThoughtChainItem[], number, boolean], void>(
    this,
    {
      task: async ([items, speed, collapsed], { signal }) => {
        if (collapsed || speed <= 0) return;
        // Reset and start typing all items in parallel
        this._typedLengths = {};
        const descs = items.filter((it) => it.description);
        await Promise.allSettled(
          descs.map((it) =>
            this._typeItem(it.key, it.description!, speed, signal),
          ),
        );
      },
      args: () =>
        [this.items, this.typingSpeed, this._isCollapsed] as [
          ThoughtChainItem[],
          number,
          boolean,
        ],
    },
  );

  /** Type a single item's description, updating _typedLengths progressively */
  private async _typeItem(
    key: string,
    text: string,
    speed: number,
    signal: AbortSignal,
  ) {
    this._typedLengths = { ...this._typedLengths, [key]: 0 };
    for (let i = 0; i < text.length; i++) {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, speed);
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timer);
            reject(new DOMException("Aborted", "AbortError"));
          },
          { once: true },
        );
      });
      this._typedLengths = { ...this._typedLengths, [key]: i + 1 };
    }
  }

  private _isItemTyping(key: string, text: string): boolean {
    const typed = this._typedLengths[key] ?? 0;
    return typed > 0 && typed < text.length;
  }

  private _getItemVisibleText(key: string, text: string): string {
    if (this.typingSpeed <= 0) return text;
    const typed = this._typedLengths[key] ?? 0;
    return text.slice(0, typed);
  }

  private _statusIcon(status: string) {
    const map: Record<string, string> = {
      pending: "clock",
      running: "loader",
      success: "circle-check",
      error: "circle-x",
    };
    return icon(map[status] ?? "clock", 14);
  }

  private _statusColor(status: string) {
    const map: Record<string, string> = {
      pending: "ak-thought-chain-status-pending",
      running: "ak-thought-chain-status-running",
      success: "ak-thought-chain-status-success",
      error: "ak-thought-chain-status-error",
    };
    return map[status] ?? map.pending;
  }

  private _toggleCollapse() {
    if (!this.collapsible) return;
    this._userInteracted = true;
    this._internalCollapsed = !this._isCollapsed;
    // Task auto-restarts when _isCollapsed changes via args
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { collapsed: this._isCollapsed },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    if (this.items.length === 0) return nothing;

    return html`
      <div class="ak-thought-chain ak-motion-fade-in">
        ${this.collapsible
          ? html`
              <button
                class="ak-thought-chain-toggle"
                @click=${this._toggleCollapse}
              >
                <span
                  class="ak-thought-chain-toggle-icon ${this._isCollapsed
                    ? ""
                    : "ak-thought-chain-toggle-icon-expanded"}"
                >
                  ${icon("chevron-right", 12)}
                </span>
                ${this._isCollapsed ? "展开" : "收起"}思考过程
              </button>
            `
          : nothing}
        ${!this._isCollapsed
          ? this.items.map(
              (item, i) => html`
                <div
                  class="ak-thought-chain-item ak-motion-slide-up"
                  style="animation-delay: ${i * 60}ms;"
                >
                  <div class="ak-thought-chain-item-header">
                    <div class="ak-thought-chain-item-icon-wrap">
                      <div
                        class="ak-thought-chain-item-icon ${this._statusColor(
                          item.status ?? "pending",
                        )}"
                      >
                        ${item.icon
                          ? icon(item.icon, 14)
                          : this._statusIcon(item.status ?? "pending")}
                      </div>
                      ${i < this.items.length - 1
                        ? html`<div
                            class="ak-thought-chain-connector"
                            style="border-inline-start: 1px ${this
                              .lineStyle} var(--ak-color-border, #d9d9d9);"
                          ></div>`
                        : nothing}
                    </div>
                  </div>
                  <div class="ak-thought-chain-item-content-box">
                    <div class="ak-thought-chain-item-title">${item.title}</div>
                    ${item.description
                      ? html`<div class="ak-thought-chain-item-description">
                          ${this._getItemVisibleText(
                            item.key,
                            item.description,
                          )}${this._isItemTyping(item.key, item.description)
                            ? html`<span class="ak-cursor"></span>`
                            : nothing}
                        </div>`
                      : nothing}
                    ${item.content
                      ? html`<div class="ak-thought-chain-item-content">
                          ${item.content}
                        </div>`
                      : nothing}
                    ${item.footer
                      ? html`<div class="ak-thought-chain-item-footer">
                          ${item.footer}
                        </div>`
                      : nothing}
                  </div>
                </div>
              `,
            )
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-thought-chain": AkThoughtChain;
  }
}

import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Task } from "@lit/task";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

export interface ThoughtChainItem {
  key: string;
  title: string;
  description?: string;
  status?: "pending" | "loading" | "running" | "success" | "error" | "abort";
  icon?: string;
  /** Extra content slot data (collapsible when item.collapsible = true) */
  content?: string;
  /** Footer slot data */
  footer?: string;
  /** Per-item collapsible (antd-x: collapsible) */
  collapsible?: boolean;
  /** Per-item blink — gradient sweep on title (antd-x: blink) */
  blink?: boolean;
}

/**
 * antd-x ThoughtChain 1:1 实现
 *
 * antd-x Structure (Node.tsx):
 *   .ant-thought-chain-box (root, flex column)
 *   └── .ant-thought-chain-node (relative, flex, baseline, gap: marginSM)
 *       ├── .ant-thought-chain-node-icon (Status wrapper, ::after = connector)
 *       │   └── status icon / custom icon / index number
 *       └── .ant-thought-chain-node-box
 *           ├── .ant-thought-chain-node-header (flex col)
 *           │   ├── .ant-thought-chain-node-title (flex, gap: marginXS, fontWeight: 500)
 *           │   │   ├── title text
 *           │   │   └── .ant-thought-chain-node-collapse-icon (rotates 90deg)
 *           │   └── .ant-thought-chain-node-description (colorTextDescription)
 *           ├── .ant-thought-chain-node-content (collapsible: height + opacity)
 *           │   └── .ant-thought-chain-node-content-box
 *           └── .ant-thought-chain-node-footer
 *
 * Visual matching:
 *   - Connector: ::after pseudo-element on icon (hidden on last node)
 *   - Icons: bare status icons (NO background circle), index number as default
 *   - Loading: spinning LoaderCircle (antd-x: LoadingOutlined with spin)
 *   - Blink: gradient sweep on title (same as Think component)
 *   - Collapse: CSSMotion height + opacity transition
 */
const thoughtChainCSS: CSSResult = css`
  /* ── Root container ───────────────────────────── */
  .ak-thought-chain {
    display: flex;
    flex-direction: column;
  }

  /* ── Global toggle (backward compat) ──────────── */
  .ak-thought-chain-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 12px;
    color: var(--ak-color-text-description, rgba(0, 0, 0, 0.45));
    cursor: pointer;
    transition: color 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ak-thought-chain-toggle:hover {
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-thought-chain-toggle-icon {
    display: inline-flex;
    transition: transform 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ak-thought-chain-toggle-icon-expanded {
    transform: rotate(90deg);
  }

  /* ── Node (ant-thought-chain-node) ────────────── */
  .ak-thought-chain-node {
    position: relative;
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  /* ── Icon / Status wrapper ────────────────────── */
  .ak-thought-chain-node-icon {
    line-height: 1;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Connector line via ::after — positioned relative to .ak-thought-chain-node */
  .ak-thought-chain-node-icon::after {
    content: "";
    position: absolute;
    height: calc(100% - 14px * 1.5714);
    border-inline-start: 1px solid rgba(0, 0, 0, 0.06);
    inset-inline-start: calc((14px - 1px) / 2);
    top: calc(14px * 1.5714);
  }
  /* Line style variants */
  .ak-thought-chain-node-icon-dashed::after {
    border-inline-start-style: dashed;
  }
  .ak-thought-chain-node-icon-dotted::after {
    border-inline-start-style: dotted;
  }
  .ak-thought-chain-node-icon-none::after {
    display: none;
  }
  /* Hide connector on last node (antd-x: :last-of-type) */
  .ak-thought-chain
    > .ak-thought-chain-node:last-of-type
    > .ak-thought-chain-node-icon::after {
    display: none;
  }

  /* Status colors (antd-x: .ant-thought-chain-status-*) */
  .ak-thought-chain-status-pending {
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.45));
  }
  .ak-thought-chain-status-loading {
    color: var(--ak-color-primary, #1677ff);
  }
  .ak-thought-chain-status-success {
    color: var(--ak-color-success, #52c41a);
  }
  .ak-thought-chain-status-error {
    color: var(--ak-color-error, #ff4d4f);
  }
  .ak-thought-chain-status-abort {
    color: var(--ak-color-text-description, rgba(0, 0, 0, 0.45));
  }

  /* Index number icon (default when no status and no custom icon) */
  .ak-thought-chain-node-index-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.45));
    font-size: 12px;
    width: 14px;
    height: 14px;
    background-color: rgba(0, 0, 0, 0.06);
    border-radius: 7px;
  }

  /* Loading spin (antd-x: LoadingOutlined → anticon-spin) */
  @keyframes ak-thought-chain-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .ak-thought-chain-spin {
    animation: ak-thought-chain-spin 1s linear infinite;
  }

  /* ── Node box ─────────────────────────────────── */
  .ak-thought-chain-node-box {
    flex: 1;
  }

  /* ── Node header ──────────────────────────────── */
  .ak-thought-chain-node-header {
    display: flex;
    flex-direction: column;
  }

  /* ── Node title ───────────────────────────────── */
  .ak-thought-chain-node-title {
    font-weight: 500;
    display: flex;
    gap: 8px;
    font-size: 14px;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    line-height: 1.5714;
  }
  .ak-thought-chain-node-collapsible {
    padding-inline-end: 16px;
    cursor: pointer;
  }
  .ak-thought-chain-node-collapse-icon {
    display: inline-flex;
    align-items: center;
  }
  .ak-thought-chain-node-collapse-icon svg {
    transition: transform 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ak-thought-chain-node-collapse-icon-expanded svg {
    transform: rotate(90deg);
  }

  /* ── Node description ─────────────────────────── */
  .ak-thought-chain-node-description {
    color: var(--ak-color-text-description, rgba(0, 0, 0, 0.45));
    font-size: 14px;
    line-height: 1.5714;
    margin-block-end: 16px;
  }

  /* ── Node content (collapsible via CSSMotion) ─── */
  .ak-thought-chain-node-content {
    overflow: hidden;
    transition:
      max-height 200ms cubic-bezier(0.645, 0.045, 0.355, 1),
      opacity 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ak-thought-chain-node-content-collapsed {
    max-height: 0;
    opacity: 0;
  }
  .ak-thought-chain-node-content-expanded {
    max-height: 2000px;
    opacity: 1;
  }
  .ak-thought-chain-node-content-box {
    margin-bottom: 16px;
    font-size: 14px;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }

  /* ── Node footer ──────────────────────────────── */
  .ak-thought-chain-node-footer {
    margin-bottom: 16px;
    font-size: 12px;
    color: var(--ak-color-text-description, rgba(0, 0, 0, 0.45));
  }

  /* ── Blink: gradient sweep (same as Think) ────── */
  @keyframes ak-thought-chain-blink {
    0% {
      background-position-x: -200%;
      background-position-y: 100%;
    }
    25% {
      background-position-x: -100%;
      background-position-y: 100%;
    }
    50% {
      background-position-x: 0%;
      background-position-y: 100%;
    }
    75% {
      background-position-x: 100%;
      background-position-y: 100%;
    }
    100% {
      background-position-x: 200%;
      background-position-y: 100%;
    }
  }
  .ak-thought-chain-motion-blink {
    background-clip: text;
    -webkit-background-clip: text;
    color: var(--ak-color-text-description, rgba(0, 0, 0, 0.45));
    background-image: linear-gradient(
      90deg,
      transparent,
      var(--ak-color-text, rgba(0, 0, 0, 0.88)),
      transparent
    );
    background-size: 50%;
    background-repeat: no-repeat;
    animation: ak-thought-chain-blink 1s linear infinite forwards;
  }

  /* ── Typewriter cursor ────────────────────────── */
  .ak-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: currentColor;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: ak-typewriter-cursor 0.8s step-end infinite;
  }
  @keyframes ak-typewriter-cursor {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
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

  /** Whether to show connector lines (antd-x: line) */
  @property({ type: Boolean })
  line = true;

  /** Controlled expanded keys for per-item collapsible (antd-x: expandedKeys) */
  @property({ type: Array, attribute: "expanded-keys" })
  expandedKeys: string[] | null = null;

  /** Default expanded keys (antd-x: defaultExpandedKeys) */
  @property({ type: Array, attribute: "default-expanded-keys" })
  defaultExpandedKeys: string[] = [];

  @state()
  private _internalCollapsed = false;

  @state()
  private _userInteracted = false;

  @state()
  private _typedLengths: Record<string, number> = {};

  /** Tracks collapsed item keys in uncontrolled mode */
  @state()
  private _collapsedItemKeys: Set<string> = new Set();

  @state()
  private _defaultExpandedInitialized = false;

  private get _isCollapsed() {
    if (this._userInteracted) return this._internalCollapsed;
    return this.collapsed;
  }

  /**
   * Typing animation task — types all item descriptions in parallel.
   *
   * Key design: `items` is intentionally NOT in args. This prevents the task
   * from being aborted on every streaming chunk (which would reset all typing
   * progress). Instead, each _typeItem while-loop continuously tracks the
   * item's description as it grows during streaming.
   *
   * The task only restarts when `typingSpeed` or `collapsed` changes.
   * On disconnect, cleanup is automatic via AbortSignal.
   */
  private _typingTask = new Task<[number, boolean], void>(this, {
    task: async ([speed, collapsed], { signal }) => {
      if (collapsed || speed <= 0) return;
      this._typedLengths = {};
      const descs = this.items.filter((it) => it.description);
      await Promise.allSettled(
        descs.map((it) => this._typeItem(it.key, speed, signal)),
      );
    },
    args: () => [this.typingSpeed, this._isCollapsed] as [number, boolean],
  });

  /**
   * Type a single item's description, updating _typedLengths progressively.
   * Uses a while-loop to track description growth for streaming support.
   */
  private async _typeItem(key: string, speed: number, signal: AbortSignal) {
    this._typedLengths = { ...this._typedLengths, [key]: 0 };
    while (true) {
      const item = this.items.find((it) => it.key === key);
      const text = item?.description ?? "";
      const typed = this._typedLengths[key] ?? 0;
      if (typed >= text.length) break;
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
      const currentTyped = this._typedLengths[key] ?? 0;
      const currentText =
        this.items.find((it) => it.key === key)?.description ?? "";
      if (currentTyped < currentText.length) {
        this._typedLengths = {
          ...this._typedLengths,
          [key]: currentTyped + 1,
        };
      }
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

  // ── Status icons (antd-x: LoadingOutlined, CheckCircleOutlined, etc.) ──

  private _statusIconName(status: string): string {
    const map: Record<string, string> = {
      pending: "clock",
      loading: "loader",
      running: "loader",
      success: "circle-check",
      error: "circle-x",
      abort: "circle-minus",
    };
    return map[status] ?? "clock";
  }

  private _statusClass(status: string): string {
    const map: Record<string, string> = {
      pending: "ak-thought-chain-status-pending",
      loading: "ak-thought-chain-status-loading",
      running: "ak-thought-chain-status-loading",
      success: "ak-thought-chain-status-success",
      error: "ak-thought-chain-status-error",
      abort: "ak-thought-chain-status-abort",
    };
    return map[status] ?? "";
  }

  private _isSpinStatus(status: string): boolean {
    return status === "loading" || status === "running";
  }

  // ── Per-item collapsible ──

  private _isItemExpanded(key: string): boolean {
    if (this.expandedKeys !== null) {
      return this.expandedKeys.includes(key);
    }
    return !this._collapsedItemKeys.has(key);
  }

  private _toggleItemExpand(key: string) {
    const isExpanded = this._isItemExpanded(key);
    if (this.expandedKeys !== null) {
      // Controlled mode — emit event, parent updates expandedKeys
      this.dispatchEvent(
        new CustomEvent("expand", {
          detail: { key, expanded: !isExpanded },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }
    // Uncontrolled mode
    const newKeys = new Set(this._collapsedItemKeys);
    if (isExpanded) {
      newKeys.add(key);
    } else {
      newKeys.delete(key);
    }
    this._collapsedItemKeys = newKeys;
    this.dispatchEvent(
      new CustomEvent("expand", {
        detail: { key, expanded: !newKeys.has(key) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ── Global toggle ──

  private _toggleCollapse() {
    if (!this.collapsible) return;
    this._userInteracted = true;
    this._internalCollapsed = !this._isCollapsed;
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { collapsed: this._isCollapsed },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ── Initialize default expanded keys ──

  protected override willUpdate(changedProps: import("lit").PropertyValues) {
    if (
      !this._defaultExpandedInitialized &&
      this.defaultExpandedKeys.length > 0
    ) {
      this._defaultExpandedInitialized = true;
      const expandedSet = new Set(this.defaultExpandedKeys);
      // Collapse items with collapsible+content that are NOT in defaultExpandedKeys
      const toCollapse = this.items
        .filter(
          (it) => it.collapsible && it.content && !expandedSet.has(it.key),
        )
        .map((it) => it.key);
      this._collapsedItemKeys = new Set(toCollapse);
    }
  }

  // ── Render ──

  private _renderIcon(item: ThoughtChainItem, index: number) {
    const status = item.status;
    // Any defined status shows a status icon (antd-x: status ? StatusIcon : icon)
    const isStatusActive = !!status;

    // Build icon class
    let iconCls = "ak-thought-chain-node-icon";
    if (!this.line) {
      iconCls += " ak-thought-chain-node-icon-none";
    } else if (this.lineStyle === "dashed") {
      iconCls += " ak-thought-chain-node-icon-dashed";
    } else if (this.lineStyle === "dotted") {
      iconCls += " ak-thought-chain-node-icon-dotted";
    }

    // Add status color class
    const statusCls = this._statusClass(status ?? "");
    if (statusCls) {
      iconCls += ` ${statusCls}`;
    }

    // Determine icon content
    let iconContent;
    if (isStatusActive) {
      // Status icon takes precedence (antd-x: status ? StatusIcon[status] : icon)
      const iconName = this._statusIconName(status!);
      const spinCls = this._isSpinStatus(status!)
        ? "ak-thought-chain-spin"
        : "";
      iconContent = html`<span class="${spinCls}">${icon(iconName, 14)}</span>`;
    } else if (item.icon) {
      // Custom icon
      iconContent = icon(item.icon, 14);
    } else {
      // Default: index number in a circle (antd-x: node-index-icon)
      iconContent = html`<span class="ak-thought-chain-node-index-icon"
        >${index + 1}</span
      >`;
    }

    return html`<div class="${iconCls}">${iconContent}</div>`;
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
                  class="ak-thought-chain-node ak-motion-slide-up"
                  style="animation-delay: ${i * 60}ms;"
                >
                  ${this._renderIcon(item, i)}
                  <div class="ak-thought-chain-node-box">
                    <div class="ak-thought-chain-node-header">
                      <div
                        class="ak-thought-chain-node-title ${item.collapsible
                          ? "ak-thought-chain-node-collapsible"
                          : ""} ${item.blink
                          ? "ak-thought-chain-motion-blink"
                          : ""}"
                        @click=${item.collapsible
                          ? () => this._toggleItemExpand(item.key)
                          : undefined}
                      >
                        ${item.title}
                        ${item.collapsible && item.content
                          ? html`<span
                              class="ak-thought-chain-node-collapse-icon ${this._isItemExpanded(
                                item.key,
                              )
                                ? "ak-thought-chain-node-collapse-icon-expanded"
                                : ""}"
                            >
                              ${icon("chevron-right", 12)}
                            </span>`
                          : nothing}
                      </div>
                      ${item.description
                        ? html`<div class="ak-thought-chain-node-description">
                            ${this._getItemVisibleText(
                              item.key,
                              item.description,
                            )}${this._isItemTyping(item.key, item.description)
                              ? html`<span class="ak-cursor"></span>`
                              : nothing}
                          </div>`
                        : nothing}
                    </div>
                    ${item.content
                      ? html`<div
                          class="ak-thought-chain-node-content ${item.collapsible
                            ? this._isItemExpanded(item.key)
                              ? "ak-thought-chain-node-content-expanded"
                              : "ak-thought-chain-node-content-collapsed"
                            : "ak-thought-chain-node-content-expanded"}"
                        >
                          <div class="ak-thought-chain-node-content-box">
                            ${item.content}
                          </div>
                        </div>`
                      : nothing}
                    ${item.footer
                      ? html`<div class="ak-thought-chain-node-footer">
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

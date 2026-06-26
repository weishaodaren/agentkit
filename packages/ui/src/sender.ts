import { css, html, type CSSResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ResizeController } from "@lit-labs/observers/resize-controller.js";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

/**
 * antd-x Sender 1:1 实现
 *
 * Structure:
 *   .ak-sender (root, flex col, rounded border)
 *   ├── slot[name=header]  (collapsible Sender.Header)
 *   ├── textarea (auto-resize, no border)
 *   └── .ak-sender-actions (flex, prefix + suffix + send/cancel)
 *
 * Features:
 *   - Enter to send, Shift+Enter for newline
 *   - Auto-resize textarea
 *   - Loading state shows cancel button
 *   - Slots: header, prefix, suffix, footer
 */

const senderCSS: CSSResult = css`
  :host {
    display: block;
  }
  .ak-sender {
    display: flex;
    flex-direction: column;
    border-radius: var(--ak-border-radius-lg, 12px);
    border: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
    background: var(--ak-color-bg-container, #fff);
    transition: all var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
  }
  .ak-sender-focused {
    border-color: color-mix(
      in srgb,
      var(--ak-color-primary, #1677ff) 50%,
      transparent
    );
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--ak-color-primary, #1677ff) 20%, transparent);
  }
  .ak-sender-disabled {
    opacity: 0.6;
  }
  .ak-sender-textarea-wrap {
    position: relative;
    padding: var(--ak-padding-sm, 12px) var(--ak-padding, 16px) 0;
  }
  .ak-sender-textarea {
    width: 100%;
    resize: none;
    border: none;
    background: transparent;
    padding: 0;
    margin: 0;
    font-size: var(--ak-font-size, 14px);
    line-height: 1.5;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    outline: none;
    box-shadow: none;
    appearance: none;
    -webkit-appearance: none;
    font-family: inherit;
  }
  .ak-sender-textarea::placeholder {
    color: var(--ak-color-text-quaternary, rgba(0, 0, 0, 0.25));
  }
  .ak-sender-textarea:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .ak-sender-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--ak-padding-xs, 8px) var(--ak-padding, 16px)
      var(--ak-padding-sm, 12px);
  }
  .ak-sender-actions-left,
  .ak-sender-actions-right {
    display: flex;
    align-items: center;
    gap: var(--ak-padding-xxs, 4px);
  }
  /* Send button — antd-x: 24x24 circle */
  .ak-sender-send-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: all var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
  }
  .ak-sender-send-btn-active {
    background: var(--ak-color-primary, #1677ff);
    color: #fff;
  }
  .ak-sender-send-btn-active:hover {
    background: var(--ak-color-primary-hover, #4096ff);
  }
  .ak-sender-send-btn-active:active {
    background: var(--ak-color-primary-active, #0958d9);
  }
  .ak-sender-send-btn-inactive {
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
    color: var(--ak-color-text-quaternary, rgba(0, 0, 0, 0.25));
    cursor: default;
  }
  /* Cancel button — antd-x StopLoading: same 24x24 circle */
  .ak-sender-cancel-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--ak-color-primary, #1677ff);
    cursor: pointer;
    flex-shrink: 0;
    transition: all var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
    padding: 0;
  }
  .ak-sender-cancel-btn:hover {
    color: var(--ak-color-primary-hover, #4096ff);
  }
  .ak-sender-cancel-btn svg {
    width: 14px;
    height: 14px;
  }
`;

@customElement("ak-sender")
export class AkSender extends AkElement {
  static override styles = [senderCSS];

  @property({ type: String })
  value = "";

  @property({ type: String })
  placeholder = "输入消息...";

  @property({ type: Boolean })
  loading = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String, attribute: "submit-type" })
  submitType: "enter" | "shiftEnter" = "enter";

  @property({ type: Number, attribute: "max-rows" })
  maxRows = 8;

  @state()
  private _internalValue = "";

  @state()
  private _focused = false;

  @query("textarea")
  private _textarea!: HTMLTextAreaElement;

  /**
   * ResizeController observes the host element for width changes.
   * When the panel width changes (e.g., copilot open/close, window resize),
   * the textarea content wraps differently and needs height re-measurement.
   */
  private _resizeController = new ResizeController(this, {
    callback: (entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (this._lastHostWidth !== undefined && this._lastHostWidth !== width) {
        this._autoResize();
      }
      this._lastHostWidth = width;
      return width;
    },
    skipInitial: true,
  });

  private _lastHostWidth?: number;

  private get _currentValue() {
    return this.value || this._internalValue;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this._internalValue = target.value;
    this._autoResize();
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: target.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleKeyDown(e: KeyboardEvent) {
    const isEnter = e.key === "Enter";
    if (!isEnter) return;

    const isShift = e.shiftKey;
    const shouldSubmit = this.submitType === "enter" ? !isShift : isShift;

    if (shouldSubmit && this._currentValue.trim()) {
      e.preventDefault();
      this._handleSubmit();
    }
  }

  private _handleSubmit() {
    if (this.loading || this.disabled || !this._currentValue.trim()) return;
    this.dispatchEvent(
      new CustomEvent("submit", {
        detail: { value: this._currentValue },
        bubbles: true,
        composed: true,
      }),
    );
    this._internalValue = "";
    if (this._textarea) {
      this._textarea.value = "";
      this._autoResize();
    }
  }

  private _handleCancel() {
    this.dispatchEvent(
      new CustomEvent("sender-cancel", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Click on the sender container focuses the textarea (antd-x behavior).
   * Ignores clicks on buttons, slots, or the textarea itself.
   */
  private _handleContainerClick(e: MouseEvent) {
    if (this.disabled) return;
    const target = e.target as HTMLElement;
    // Don't focus if clicking on a button, slot content, or the textarea itself
    if (target.closest("button")) return;
    if (target.closest("[slot]")) return;
    if (target.tagName === "TEXTAREA") return;
    if (this._textarea) {
      this._textarea.focus();
    }
  }

  private _autoResize() {
    if (!this._textarea) return;
    this._textarea.style.height = "auto";
    const lineHeight = 21;
    const maxHeight = lineHeight * this.maxRows;
    this._textarea.style.height = `${Math.min(this._textarea.scrollHeight, maxHeight)}px`;
  }

  /**
   * antd-x StopLoadingIcon 1:1 — spinning arc + inner square
   */
  private _renderStopLoadingIcon() {
    return html`<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <rect
        fill="currentColor"
        height="250"
        rx="24"
        ry="24"
        width="250"
        x="375"
        y="375"
      />
      <circle
        cx="500"
        cy="500"
        fill="none"
        r="450"
        stroke="currentColor"
        stroke-width="100"
        opacity="0.45"
      />
      <circle
        cx="500"
        cy="500"
        fill="none"
        r="450"
        stroke="currentColor"
        stroke-width="100"
        stroke-dasharray="600 9999999"
      >
        <animateTransform
          attributeName="transform"
          dur="1s"
          from="0 500 500"
          repeatCount="indefinite"
          to="360 500 500"
          type="rotate"
        />
      </circle>
    </svg>`;
  }

  override render() {
    const hasValue = this._currentValue.trim().length > 0;

    return html`
      <div
        class="ak-sender ${this._focused ? "ak-sender-focused" : ""} ${this
          .disabled
          ? "ak-sender-disabled"
          : ""}"
        @click=${this._handleContainerClick}
      >
        <!-- Header slot -->
        <slot name="header"></slot>

        <!-- Textarea -->
        <div class="ak-sender-textarea-wrap">
          <textarea
            class="ak-sender-textarea"
            placeholder=${this.placeholder}
            .value=${this.value || this._internalValue}
            ?disabled=${this.disabled}
            rows="1"
            @input=${this._handleInput}
            @keydown=${this._handleKeyDown}
            @focus=${() => {
              this._focused = true;
            }}
            @blur=${() => {
              this._focused = false;
            }}
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="ak-sender-actions">
          <!-- Left: prefix -->
          <div class="ak-sender-actions-left">
            <slot name="prefix"></slot>
          </div>

          <!-- Right: suffix + send/cancel -->
          <div class="ak-sender-actions-right">
            <slot name="suffix"></slot>

            ${this.loading
              ? html`
                  <button
                    class="ak-sender-cancel-btn"
                    @click=${this._handleCancel}
                    title="停止"
                  >
                    ${this._renderStopLoadingIcon()}
                  </button>
                `
              : html`
                  <button
                    class="ak-sender-send-btn ${hasValue && !this.disabled
                      ? "ak-sender-send-btn-active"
                      : "ak-sender-send-btn-inactive"}"
                    ?disabled=${!hasValue || this.disabled}
                    @click=${this._handleSubmit}
                    title="发送"
                  >
                    ${icon("arrow-up", 14)}
                  </button>
                `}
          </div>
        </div>

        <!-- Footer slot -->
        <slot name="footer"></slot>
      </div>
    `;
  }
}

/**
 * Sender.Header — collapsible panel above the textarea.
 * antd-x: Sender.Header with title, open, onOpenChange.
 */
@customElement("ak-sender-header")
export class AkSenderHeader extends AkElement {
  static override styles = [
    css`
      .ak-sender-header {
        border-bottom: var(--ak-line-width, 1px) solid
          var(--ak-color-border-secondary, #f0f0f0);
      }
      .ak-sender-header-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--ak-padding-xs, 8px) var(--ak-padding, 16px);
        cursor: pointer;
        user-select: none;
        font-size: var(--ak-font-size-sm, 12px);
        color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
      }
      .ak-sender-header-toggle:hover {
        color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
      }
      .ak-sender-header-content {
        overflow: hidden;
        transition: max-height var(--ak-duration-mid, 200ms)
          var(--ak-ease-in-out);
      }
      .ak-sender-header-open {
        max-height: 400px;
      }
      .ak-sender-header-closed {
        max-height: 0;
      }
    `,
  ];

  @property({ type: String })
  title = "";

  @property({ type: Boolean, reflect: true })
  open = false;

  private _toggle() {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent("open-change", {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="ak-sender-header">
        <div class="ak-sender-header-toggle" @click=${this._toggle}>
          <span>${this.title}</span>
          <span
            style="transform: rotate(${this.open
              ? 180
              : 0}deg); transition: transform 0.2s;"
          >
            ${icon("chevron-down", 12)}
          </span>
        </div>
        <div
          class="ak-sender-header-content ${this.open
            ? "ak-sender-header-open"
            : "ak-sender-header-closed"}"
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-sender": AkSender;
    "ak-sender-header": AkSenderHeader;
  }
}

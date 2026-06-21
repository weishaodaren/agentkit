import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

/**
 * antd-x Bubble 1:1 实现
 *
 * Structure:
 *   .ak-bubble (root, flex, gap paddingSM)
 *   ├── .ak-bubble-avatar
 *   ├── .ak-bubble-body (flex col)
 *   │   ├── .ak-bubble-header (slot)
 *   │   ├── .ak-bubble-content (variant + shape)
 *   │   │   └── content / slot
 *   │   └── .ak-bubble-footer (slot, inner/outer placement)
 *   └── .ak-bubble-extra (slot)
 *
 * Variants: filled / outlined / shadow / borderless
 * Shapes: default (12px) / round (pill) / corner (12px + sharp)
 */

const bubbleCSS: CSSResult = css`
  /* ── Root ──────────────────────────────────── */
  .ak-bubble {
    display: flex;
    column-gap: var(--ak-padding-sm, 12px);
  }
  .ak-bubble-loading {
    align-items: center;
  }
  .ak-bubble-start {
    flex-direction: row;
    align-self: flex-start;
  }
  .ak-bubble-end {
    flex-direction: row-reverse;
    align-self: flex-end;
  }

  /* ── Avatar ────────────────────────────────── */
  .ak-bubble-avatar {
    min-width: 32px;
    flex-shrink: 0;
  }

  /* ── Body ──────────────────────────────────── */
  .ak-bubble-body {
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }

  /* ── Header ────────────────────────────────── */
  .ak-bubble-header {
    display: flex;
    margin-bottom: var(--ak-padding-xxs, 4px);
    font-size: var(--ak-font-size, 14px);
    line-height: var(--ak-line-height, 1.5714);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-bubble-start .ak-bubble-header {
    flex-direction: row;
  }
  .ak-bubble-end .ak-bubble-header {
    flex-direction: row-reverse;
  }

  /* ── Content ───────────────────────────────── */
  .ak-bubble-content {
    position: relative;
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    min-height: calc(
      var(--ak-padding-sm, 12px) * 2 + var(--ak-line-height, 1.5714) *
        var(--ak-font-size, 14px)
    );
    padding-inline: var(--ak-padding, 16px);
    padding-block: var(--ak-padding-sm, 12px);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    font-size: var(--ak-font-size, 14px);
    line-height: var(--ak-line-height, 1.5714);
    word-break: break-word;
    transition: all var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
  }

  /* Variants */
  .ak-bubble-content-filled {
    background-color: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
  }
  .ak-bubble-content-outlined {
    border: var(--ak-line-width, 1px) solid
      var(--ak-color-border-secondary, #f0f0f0);
  }
  .ak-bubble-content-shadow {
    box-shadow: var(--ak-box-shadow-tertiary);
  }
  .ak-bubble-content-borderless {
    background-color: transparent;
    padding: 0;
    min-height: 0;
  }

  /* Shapes */
  .ak-bubble-content-default {
    border-radius: var(--ak-border-radius-lg, 12px);
  }
  .ak-bubble-content-round {
    border-radius: 18px;
  }
  .ak-bubble-content-corner {
    border-radius: var(--ak-border-radius-lg, 12px);
  }
  .ak-bubble-start .ak-bubble-content-corner {
    border-start-start-radius: var(--ak-border-radius-xs, 2px);
  }
  .ak-bubble-end .ak-bubble-content-corner {
    border-start-end-radius: var(--ak-border-radius-xs, 2px);
  }

  /* ── Footer ────────────────────────────────── */
  .ak-bubble-footer {
    display: flex;
    margin-block-start: var(--ak-margin, 16px);
    font-size: var(--ak-font-size, 14px);
    line-height: var(--ak-line-height, 1.5714);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-bubble-footer-start {
    flex-direction: row;
  }
  .ak-bubble-footer-end {
    flex-direction: row-reverse;
  }

  /* ── Extra ─────────────────────────────────── */
  .ak-bubble-extra {
    flex-shrink: 0;
  }

  /* ── Loading dots ──────────────────────────── */
  @keyframes ak-bubble-loading-move {
    0% {
      transform: translateY(0);
    }
    10% {
      transform: translateY(4px);
    }
    20% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-4px);
    }
    40% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(0);
    }
  }
  .ak-bubble-dot {
    position: relative;
    height: var(--ak-control-height, 32px);
    display: flex;
    align-items: center;
    column-gap: var(--ak-margin-xs, 8px);
    padding: 0 var(--ak-padding-xxs, 4px);
    align-self: center;
  }
  .ak-bubble-dot-item {
    background-color: var(--ak-color-primary, #1677ff);
    border-radius: 100%;
    width: 4px;
    height: 4px;
    animation: ak-bubble-loading-move 2s linear infinite;
  }
  .ak-bubble-dot-item:nth-child(1) {
    animation-delay: 0s;
  }
  .ak-bubble-dot-item:nth-child(2) {
    animation-delay: 0.2s;
  }
  .ak-bubble-dot-item:nth-child(3) {
    animation-delay: 0.4s;
  }

  /* ── Typing cursor ─────────────────────────── */
  @keyframes ak-bubble-cursor-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  .ak-bubble-typing-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: currentColor;
    margin-inline-start: 0.1em;
    vertical-align: text-bottom;
    font-weight: 900;
    animation: ak-bubble-cursor-blink 0.8s step-end infinite;
  }

  /* ── Fade in ───────────────────────────────── */
  @keyframes ak-bubble-fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .ak-bubble-fade-in {
    animation: ak-bubble-fade-in 0.3s var(--ak-ease-out) both;
  }
`;

@customElement("ak-bubble")
export class AkBubble extends AkElement {
  static override styles = [bubbleCSS];

  // ── Placement ──
  @property({ type: String })
  placement: "start" | "end" = "start";

  // ── Content ──
  @property({ type: String })
  content = "";

  // ── Variant ──
  @property({ type: String })
  variant: "filled" | "outlined" | "shadow" | "borderless" = "filled";

  // ── Shape ──
  @property({ type: String })
  shape: "default" | "round" | "corner" = "default";

  // ── Loading ──
  @property({ type: Boolean })
  loading = false;

  // ── Typing animation ──
  @property({ type: Boolean })
  typing = false;

  @property({ type: Number, attribute: "typing-speed" })
  typingSpeed = 25;

  // ── Streaming (delays typing-complete until done) ──
  @property({ type: Boolean })
  streaming = false;

  // ── Avatar ──
  @property({ type: String })
  avatar = "";

  // ── Footer placement ──
  @property({ type: String, attribute: "footer-placement" })
  footerPlacement:
    | "inner-start"
    | "inner-end"
    | "outer-start"
    | "outer-end"
    | "" = "";

  // ── Internal typing state ──
  @state()
  private _typedLength = 0;

  private _typingTimer = 0;

  private get _isTyping(): boolean {
    return (
      this.typing &&
      this.content.length > 0 &&
      this._typedLength < this.content.length
    );
  }

  private get _effectiveFooterPlacement(): string {
    if (this.footerPlacement) return this.footerPlacement;
    return this.placement === "start" ? "outer-start" : "outer-end";
  }

  private get _isFooterInner(): boolean {
    return this._effectiveFooterPlacement.includes("inner");
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.typing && this.content) {
      this._startTyping();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._stopTyping();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("content") || changed.has("typing")) {
      if (this.typing && this.content) {
        requestAnimationFrame(() => {
          this._typedLength = 0;
          this._startTyping();
        });
      }
    }
  }

  private _startTyping() {
    this._stopTyping();
    this._typedLength = 0;
    this._typingTimer = window.setInterval(() => {
      if (this._typedLength >= this.content.length) {
        this._stopTyping();
        if (!this.streaming) {
          this.dispatchEvent(
            new CustomEvent("typing-complete", {
              detail: { content: this.content },
              bubbles: true,
              composed: true,
            }),
          );
        }
        return;
      }
      this._typedLength += 1;
      this.dispatchEvent(
        new CustomEvent("typing", {
          detail: { content: this.content.slice(0, this._typedLength) },
          bubbles: true,
          composed: true,
        }),
      );
    }, this.typingSpeed);
  }

  private _stopTyping() {
    if (this._typingTimer) {
      clearInterval(this._typingTimer);
      this._typingTimer = 0;
    }
  }

  private get _visibleContent(): string {
    if (!this.typing) return this.content;
    return this.content.slice(0, this._typedLength);
  }

  override render() {
    const isFooterIn = this._isFooterInner;
    const isStringContent =
      typeof this.content === "string" && this.content.length > 0;

    return html`
      <div
        class="ak-bubble ak-bubble-${this.placement} ${this.loading
          ? "ak-bubble-loading"
          : ""} ak-bubble-fade-in"
      >
        <!-- Avatar -->
        ${this.avatar
          ? html`<div class="ak-bubble-avatar">
              <img
                src=${this.avatar}
                alt="avatar"
                style="width:32px;height:32px;border-radius:50%;object-fit:cover;"
              />
            </div>`
          : html`<slot name="avatar"></slot>`}

        <!-- Body -->
        <div class="ak-bubble-body">
          <!-- Header slot -->
          <div class="ak-bubble-header">
            <slot name="header"></slot>
          </div>

          <!-- Content -->
          <div
            class="ak-bubble-content ak-bubble-content-${this.variant} ${this
              .variant !== "borderless"
              ? `ak-bubble-content-${this.shape}`
              : ""} ${isStringContent ? "ak-bubble-content-string" : ""}"
          >
            ${this.loading
              ? html`
                  <!-- Loading dots -->
                  <div class="ak-bubble-dot">
                    <span class="ak-bubble-dot-item"></span>
                    <span class="ak-bubble-dot-item"></span>
                    <span class="ak-bubble-dot-item"></span>
                  </div>
                `
              : this.content
                ? html`
                    ${isFooterIn
                      ? html`<div>
                            ${this._visibleContent}${this._isTyping
                              ? html`<span
                                  class="ak-bubble-typing-cursor"
                                ></span>`
                              : nothing}
                          </div>
                          <div
                            class="ak-bubble-footer ak-bubble-footer-${this._effectiveFooterPlacement.includes(
                              "start",
                            )
                              ? "start"
                              : "end"}"
                          >
                            <slot name="footer"></slot>
                          </div>`
                      : html`${this._visibleContent}${this._isTyping
                          ? html`<span class="ak-bubble-typing-cursor"></span>`
                          : nothing}`}
                  `
                : html`<slot></slot>`}
          </div>

          <!-- Footer (outer placement) -->
          ${!this.loading && !isFooterIn
            ? html`<div
                class="ak-bubble-footer ak-bubble-footer-${this._effectiveFooterPlacement.includes(
                  "start",
                )
                  ? "start"
                  : "end"}"
              >
                <slot name="footer"></slot>
              </div>`
            : nothing}
        </div>

        <!-- Extra slot -->
        ${!this.loading
          ? html`<div class="ak-bubble-extra"><slot name="extra"></slot></div>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-bubble": AkBubble;
  }
}

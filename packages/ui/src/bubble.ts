import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";

/**
 * antd-x Bubble 对标实现
 *
 * antd-x 结构：
 *   .ant-bubble (root, flex, gap paddingSM=12px)
 *   ├── .ant-bubble-avatar
 *   ├── .ant-bubble-body (flex col, max-width 100%)
 *   │   ├── .ant-bubble-header (slot)
 *   │   ├── .ant-bubble-content (variant + shape)
 *   │   │   └── content / slot
 *   │   └── .ant-bubble-footer (slot, outer placement)
 *   └── .ant-bubble-extra (slot)
 *
 * Variants: filled / outlined / shadow / borderless
 * Shapes: default (12px) / round (pill) / corner (12px + sharp corner)
 * String content: no white-space override (pre-wrap causes blank gaps)
 */
const bubbleVariants = cva("flex gap-3", {
  variants: {
    placement: {
      start: "flex-row self-start",
      end: "flex-row-reverse self-end",
    },
  },
  defaultVariants: {
    placement: "start",
  },
});

type BubbleVariants = VariantProps<typeof bubbleVariants>;

@customElement("ak-bubble")
export class AkBubble extends AkElement {
  @property({ type: String })
  placement: BubbleVariants["placement"] = "start";

  @property({ type: String })
  content = "";

  @property({ type: Boolean })
  loading = false;

  /** Enable typewriter animation for content text */
  @property({ type: Boolean })
  typing = false;

  /** Typing speed in ms per character (default 25) */
  @property({ type: Number, attribute: "typing-speed" })
  typingSpeed = 25;

  /** Whether content is still streaming (affects typing-complete callback) */
  @property({ type: Boolean })
  streaming = false;

  /** Avatar image URL */
  @property({ type: String })
  avatar = "";

  /** Content shape variant */
  @property({ type: String })
  shape: "default" | "round" | "corner" = "default";

  /** Content variant style */
  @property({ type: String })
  variant: "filled" | "outlined" | "shadow" | "borderless" = "filled";

  /** Footer placement relative to content */
  @property({ type: String, attribute: "footer-placement" })
  footerPlacement:
    | "inner-start"
    | "inner-end"
    | "outer-start"
    | "outer-end"
    | "" = "";

  @state()
  private _typedLength = 0;

  private _typingTimer = 0;

  private get _isTyping() {
    return (
      this.typing &&
      this.content.length > 0 &&
      this._typedLength < this.content.length
    );
  }

  /** antd-x: default footer placement based on bubble placement */
  private get _effectiveFooterPlacement() {
    if (this.footerPlacement) return this.footerPlacement;
    return this.placement === "start" ? "outer-start" : "outer-end";
  }

  private get _isFooterInner() {
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
        this.dispatchEvent(
          new CustomEvent("typing-complete", {
            detail: { content: this.content },
            bubbles: true,
            composed: true,
          }),
        );
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

  /** antd-x: corner shape gives one sharper corner based on placement */
  private get _shapeClasses(): string {
    if (this.shape === "round") return "ak-bubble-content-round";
    if (this.shape === "corner") {
      return this.placement === "start"
        ? "ak-bubble-content-corner ak-bubble-content-corner-start"
        : "ak-bubble-content-corner ak-bubble-content-corner-end";
    }
    return "ak-bubble-content-default";
  }

  /** antd-x variant classes */
  private get _variantClasses(): string {
    return `ak-bubble-content-${this.variant}`;
  }

  override render() {
    const isFooterIn = this._isFooterInner;
    const footerOuterStart =
      !isFooterIn && this._effectiveFooterPlacement.includes("start");
    const footerOuterEnd =
      !isFooterIn && this._effectiveFooterPlacement.includes("end");

    return html`
      <div
        class=${cn(
          bubbleVariants({ placement: this.placement }),
          "ak-motion-slide-up group",
          this.loading && "items-center",
        )}
      >
        <!-- Avatar -->
        ${this.avatar
          ? html`<div class="ak-bubble-avatar shrink-0">
              <img
                src=${this.avatar}
                alt="avatar"
                class="h-8 w-8 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-primary/20"
              />
            </div>`
          : html`<slot name="avatar"></slot>`}

        <!-- Body (flex column) -->
        <div class="ak-bubble-body flex max-w-full flex-col">
          <!-- Header slot -->
          <slot name="header"></slot>

          <!-- Content -->
          <div
            class=${cn(
              "ak-bubble-content box-border max-w-full break-words text-sm leading-[1.5714] text-foreground transition-all duration-150",
              this._shapeClasses,
              this._variantClasses,
              this.content && typeof this.content === "string"
                ? "ak-bubble-content-string"
                : "",
            )}
          >
            ${this.loading
              ? html`
                  <!-- Loading: antd-x style dots (4px, colorPrimary, translateY ±4px, 2s) -->
                  <div class="ak-bubble-dot">
                    <span class="ak-bubble-dot-item"></span>
                    <span class="ak-bubble-dot-item"></span>
                    <span class="ak-bubble-dot-item"></span>
                  </div>
                `
              : this.content
                ? html`
                    ${isFooterIn
                      ? html`<div class="ak-bubble-content-with-footer">
                          ${this._visibleContent}${this._isTyping
                            ? html`<span class="ak-cursor"></span>`
                            : nothing}
                        </div>`
                      : html`${this._visibleContent}${this._isTyping
                          ? html`<span class="ak-cursor"></span>`
                          : nothing}`}
                    ${isFooterIn ? html`<slot name="footer"></slot>` : nothing}
                  `
                : html`<slot></slot>`}
          </div>

          <!-- Footer slot (outer placement) -->
          ${!this.loading && !isFooterIn
            ? html`<div
                class=${cn(
                  "ak-bubble-footer",
                  footerOuterStart && "ak-bubble-footer-start",
                  footerOuterEnd && "ak-bubble-footer-end",
                )}
              >
                <slot name="footer"></slot>
              </div>`
            : nothing}
        </div>

        <!-- Extra slot -->
        ${!this.loading ? html`<slot name="extra"></slot>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-bubble": AkBubble;
  }
}

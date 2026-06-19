import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";

/**
 * antd token mapping:
 *   columnGap: paddingSM (12px) → gap-3
 *   content paddingInline: padding (16px) → px-4
 *   content paddingBlock: paddingSM (12px) → py-3
 *   content borderRadius default: borderRadius*2 (12px) → rounded-xl
 *   content corner shape: start gets sharper top-left corner
 *   content filled: colorFillContent → bg-muted
 *   loading dots: 4px, colorPrimary, translateY ±4px, 2s
 *   typing cursor: "|" blink 0.8s
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

  @property({ type: String })
  avatar = "";

  /** Content shape variant */
  @property({ type: String })
  shape: "default" | "round" | "corner" = "default";

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
        return;
      }
      this._typedLength += 1;
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

  /** antd: corner shape gives one sharper corner based on placement */
  private get _shapeClasses(): string {
    if (this.shape === "round") return "rounded-[20px]";
    if (this.shape === "corner") {
      return this.placement === "start"
        ? "rounded-xl rounded-tl-[2px]"
        : "rounded-xl rounded-tr-[2px]";
    }
    return "rounded-xl"; // default: 12px
  }

  override render() {
    return html`
      <div
        class=${cn(
          bubbleVariants({ placement: this.placement }),
          "ak-motion-slide-up",
          this.loading && "items-center",
        )}
      >
        <!-- Avatar -->
        ${this.avatar
          ? html`<div class="shrink-0">
              <img
                src=${this.avatar}
                alt="avatar"
                class="h-8 w-8 rounded-full object-cover"
              />
            </div>`
          : html`<slot name="avatar"></slot>`}

        <!-- Body (flex column) -->
        <div class="flex max-w-full flex-col">
          <!-- Content -->
          <div
            class=${cn(
              "box-border max-w-full break-words px-4 py-3 text-sm leading-[1.5714] text-foreground",
              this._shapeClasses,
              this.placement === "start"
                ? "bg-muted"
                : "bg-primary text-primary-foreground",
            )}
            style="min-height: 46px;"
          >
            ${this.loading
              ? html`
                  <!-- antd: 4px dots, colorPrimary, translateY ±4px, 2s cycle -->
                  <div class="flex h-8 items-center gap-1 px-0.5">
                    <span
                      class="inline-block h-1 w-1 rounded-full bg-primary"
                      style="animation: ak-loading-bounce 2s linear infinite; animation-delay: 0s;"
                    ></span>
                    <span
                      class="inline-block h-1 w-1 rounded-full bg-primary"
                      style="animation: ak-loading-bounce 2s linear infinite; animation-delay: 0.2s;"
                    ></span>
                    <span
                      class="inline-block h-1 w-1 rounded-full bg-primary"
                      style="animation: ak-loading-bounce 2s linear infinite; animation-delay: 0.4s;"
                    ></span>
                  </div>
                `
              : this.content
                ? html`<div class="whitespace-pre-wrap">
                    ${this._visibleContent}${this._isTyping
                      ? html`<span class="ak-cursor"></span>`
                      : nothing}
                  </div>`
                : html`<slot></slot>`}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-bubble": AkBubble;
  }
}

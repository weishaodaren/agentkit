import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";

const bubbleVariants = cva("flex gap-3", {
  variants: {
    placement: {
      start: "flex-row",
      end: "flex-row-reverse",
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
        this._typedLength = 0;
        this._startTyping();
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

  override render() {
    const motionClass =
      this.placement === "start" ? "ak-motion-slide-up" : "ak-motion-slide-up";

    return html`
      <div
        class=${cn(bubbleVariants({ placement: this.placement }), motionClass)}
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

        <!-- Bubble Content -->
        <div
          class=${cn(
            "max-w-[80%] rounded-lg px-3 py-2",
            this.placement === "start"
              ? "bg-muted text-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          ${this.loading
            ? html`
                <div class="flex items-center gap-1.5">
                  <span
                    class="inline-block h-2 w-2 rounded-full bg-current opacity-60"
                    style="animation: ak-pulse-dot 1.4s ease-in-out infinite; animation-delay: 0ms;"
                  ></span>
                  <span
                    class="inline-block h-2 w-2 rounded-full bg-current opacity-60"
                    style="animation: ak-pulse-dot 1.4s ease-in-out infinite; animation-delay: 200ms;"
                  ></span>
                  <span
                    class="inline-block h-2 w-2 rounded-full bg-current opacity-60"
                    style="animation: ak-pulse-dot 1.4s ease-in-out infinite; animation-delay: 400ms;"
                  ></span>
                </div>
              `
            : this.content
              ? html`<div class="whitespace-pre-wrap text-sm">
                  ${this._visibleContent}${this._isTyping
                    ? html`<span class="ak-cursor"></span>`
                    : nothing}
                </div>`
              : html`<slot></slot>`}
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

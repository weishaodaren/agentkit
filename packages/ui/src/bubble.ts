import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
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

  @property({ type: Boolean })
  typing = false;

  @property({ type: String })
  avatar = "";

  override render() {
    return html`
      <div class=${cn(bubbleVariants({ placement: this.placement }))}>
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
                <div class="flex items-center gap-1">
                  <span
                    class="inline-block h-2 w-2 animate-bounce rounded-full bg-current opacity-60 [animation-delay:0ms]"
                  ></span>
                  <span
                    class="inline-block h-2 w-2 animate-bounce rounded-full bg-current opacity-60 [animation-delay:150ms]"
                  ></span>
                  <span
                    class="inline-block h-2 w-2 animate-bounce rounded-full bg-current opacity-60 [animation-delay:300ms]"
                  ></span>
                </div>
              `
            : this.content
              ? html`<div class="whitespace-pre-wrap text-sm">
                  ${this.content}${this.typing
                    ? html`<span
                        class="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current"
                      ></span>`
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

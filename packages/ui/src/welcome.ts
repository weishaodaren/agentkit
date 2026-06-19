import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";

const welcomeVariants = cva("flex gap-4", {
  variants: {
    variant: {
      filled: "rounded-lg bg-muted px-4 py-3",
      borderless: "",
    },
  },
  defaultVariants: {
    variant: "filled",
  },
});

type WelcomeVariants = VariantProps<typeof welcomeVariants>;

@customElement("ak-welcome")
export class AkWelcome extends AkElement {
  @property({ type: String })
  variant: WelcomeVariants["variant"] = "filled";

  @property({ type: String })
  title = "";

  @property({ type: String })
  description = "";

  override render() {
    return html`
      <div
        class=${cn(
          welcomeVariants({ variant: this.variant }),
          "ak-motion-fade-in",
        )}
      >
        <!-- Icon -->
        <slot name="icon"></slot>

        <!-- Content -->
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <!-- Title Row -->
          <div class="flex items-start gap-2">
            ${this.title
              ? html`<h4
                  class="m-0 flex-1 text-base font-semibold leading-6 text-foreground"
                >
                  ${this.title}
                </h4>`
              : html`<slot name="title"></slot>`}
            <slot name="extra"></slot>
          </div>

          <!-- Description -->
          ${this.description
            ? html`<p class="m-0 text-sm text-muted-foreground">
                ${this.description}
              </p>`
            : html`<slot name="description"></slot>`}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-welcome": AkWelcome;
  }
}

import { css, html, type CSSResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";

const buttonVariants = cva(
  "ak-btn-interactive inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

@customElement("ak-button")
export class AkButton extends AkElement {
  static override styles: CSSResult[] = [
    css`
      button:disabled {
        pointer-events: none;
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ];

  @property({ type: String })
  variant: ButtonVariants["variant"] = "default";

  @property({ type: String })
  size: ButtonVariants["size"] = "default";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  override render() {
    return html`
      <button
        class=${cn(buttonVariants({ variant: this.variant, size: this.size }))}
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-button": AkButton;
  }
}

export { buttonVariants };
export type { ButtonVariants };

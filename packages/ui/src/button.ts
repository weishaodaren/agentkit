import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

@customElement("ak-button")
export class AkButton extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
    }

    button {
      cursor: pointer;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      transition: all 150ms ease;
      font-family: inherit;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Variants */
    .primary {
      background-color: var(--color-primary, #2563eb);
      color: white;
    }
    .primary:hover:not(:disabled) {
      background-color: var(--color-primary-hover, #1d4ed8);
    }

    .secondary {
      background-color: var(--color-secondary, #64748b);
      color: white;
    }
    .secondary:hover:not(:disabled) {
      background-color: var(--color-secondary-hover, #475569);
    }

    .ghost {
      background-color: transparent;
      color: var(--color-primary, #2563eb);
    }
    .ghost:hover:not(:disabled) {
      background-color: rgba(37, 99, 235, 0.08);
    }

    /* Sizes */
    .sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }
    .md {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
    .lg {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }
  `;

  @property({ type: String })
  variant: ButtonVariant = "primary";

  @property({ type: String })
  size: ButtonSize = "md";

  @property({ type: Boolean })
  disabled = false;

  override render() {
    return html`
      <button class="${this.variant} ${this.size}" ?disabled=${this.disabled}>
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

import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";

@customElement("ak-think")
export class AkThink extends AkElement {
  @property({ type: String })
  title = "思考过程";

  @property({ type: Boolean })
  expanded = false;

  @property({ type: Boolean, attribute: "loading" })
  loading = false;

  @state()
  private _internalExpanded = false;

  private get _isExpanded() {
    return this.expanded || this._internalExpanded;
  }

  private _toggle() {
    this._internalExpanded = !this._internalExpanded;
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { expanded: this._isExpanded },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="rounded-lg border border-border bg-card">
        <!-- Header -->
        <button
          class=${cn(
            "flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left transition-colors",
            "hover:bg-accent/50",
          )}
          @click=${this._toggle}
        >
          <!-- Icon -->
          <span
            class=${cn(
              "inline-flex h-4 w-4 items-center justify-center text-muted-foreground transition-transform duration-200",
              this._isExpanded && "rotate-90",
            )}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 2.5L8 6L4.5 9.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <!-- Title -->
          <span class="text-sm font-medium text-card-foreground">
            ${this.title}
          </span>

          <!-- Loading indicator -->
          ${this.loading
            ? html`<span
                class="ml-auto inline-block h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
              ></span>`
            : ""}
        </button>

        <!-- Content -->
        <div
          class=${cn(
            "overflow-hidden transition-all duration-200",
            this._isExpanded
              ? "max-h-[2000px] opacity-100"
              : "max-h-0 opacity-0",
          )}
        >
          <div class="border-t border-border px-3 py-2">
            <div class="text-sm text-muted-foreground">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-think": AkThink;
  }
}

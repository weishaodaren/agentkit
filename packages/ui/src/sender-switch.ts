import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";

/**
 * antd-x SenderSwitch 对标实现
 *
 * Simple toggle button used with Sender component.
 * antd-x: Based on antd Switch with checked state.
 */
@customElement("ak-sender-switch")
export class AkSenderSwitch extends AkElement {
  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  label = "";

  private _toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <button
        class=${cn(
          "ak-sender-switch inline-flex h-6 cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-2 py-1 text-sm",
          "transition-all duration-200 ease-in-out",
          "hover:bg-black/[0.04]",
          this.checked && "bg-primary/10 text-primary hover:bg-primary/15",
          !this.checked && "text-muted-foreground hover:text-foreground",
          this.disabled && "pointer-events-none opacity-45",
        )}
        ?disabled=${this.disabled}
        @click=${this._toggle}
      >
        <!-- Track -->
        <span
          class=${cn(
            "relative inline-block h-4 w-7 rounded-full transition-colors duration-200",
            this.checked ? "bg-primary" : "bg-muted-foreground/30",
          )}
        >
          <!-- Thumb -->
          <span
            class=${cn(
              "absolute top-0.5 block h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-200",
              this.checked ? "translate-x-3.5" : "translate-x-0.5",
            )}
          ></span>
        </span>
        ${this.label ? html`<span class="text-xs">${this.label}</span>` : ""}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-sender-switch": AkSenderSwitch;
  }
}

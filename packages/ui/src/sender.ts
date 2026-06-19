import { html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";

@customElement("ak-sender")
export class AkSender extends AkElement {
  @property({ type: String })
  value = "";

  @property({ type: String })
  placeholder = "输入消息...";

  @property({ type: Boolean })
  loading = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String, attribute: "submit-type" })
  submitType: "enter" | "shiftEnter" = "enter";

  @property({ type: Number, attribute: "max-rows" })
  maxRows = 8;

  @state()
  private _internalValue = "";

  @query("textarea")
  private _textarea!: HTMLTextAreaElement;

  private get _currentValue() {
    return this.value || this._internalValue;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this._internalValue = target.value;
    this._autoResize();
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: target.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleKeyDown(e: KeyboardEvent) {
    const isEnter = e.key === "Enter";
    if (!isEnter) return;

    const isShift = e.shiftKey;
    const shouldSubmit = this.submitType === "enter" ? !isShift : isShift;

    if (shouldSubmit && this._currentValue.trim()) {
      e.preventDefault();
      this._handleSubmit();
    }
  }

  private _handleSubmit() {
    if (this.loading || this.disabled || !this._currentValue.trim()) return;
    this.dispatchEvent(
      new CustomEvent("submit", {
        detail: { value: this._currentValue },
        bubbles: true,
        composed: true,
      }),
    );
    this._internalValue = "";
    if (this._textarea) {
      this._textarea.value = "";
      this._autoResize();
    }
  }

  private _handleCancel() {
    this.dispatchEvent(
      new CustomEvent("cancel", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _autoResize() {
    if (!this._textarea) return;
    this._textarea.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * this.maxRows;
    this._textarea.style.height = `${Math.min(this._textarea.scrollHeight, maxHeight)}px`;
  }

  override render() {
    const hasValue = this._currentValue.trim().length > 0;

    return html`
      <div
        class=${cn(
          "flex flex-col rounded-xl border border-border bg-card shadow-sm transition-colors",
          "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
        )}
      >
        <!-- Header slot -->
        <slot name="header"></slot>

        <!-- Textarea -->
        <div class="relative px-3 pt-2">
          <textarea
            class=${cn(
              "w-full resize-none border-0 bg-transparent text-sm text-card-foreground outline-none",
              "placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            placeholder=${this.placeholder}
            .value=${this.value || this._internalValue}
            ?disabled=${this.disabled}
            rows="1"
            @input=${this._handleInput}
            @keydown=${this._handleKeyDown}
          ></textarea>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3 pb-2">
          <!-- Prefix slot -->
          <div class="flex items-center gap-1">
            <slot name="prefix"></slot>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <slot name="suffix"></slot>

            ${this.loading
              ? html`
                  <button
                    class=${cn(
                      "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md",
                      "border-0 bg-destructive text-destructive-foreground transition-colors",
                      "hover:bg-destructive/90",
                    )}
                    @click=${this._handleCancel}
                    title="取消"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                `
              : html`
                  <button
                    class=${cn(
                      "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md",
                      "border-0 transition-colors",
                      hasValue && !this.disabled
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed",
                    )}
                    ?disabled=${!hasValue || this.disabled}
                    @click=${this._handleSubmit}
                    title="发送"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.5 1.5L6.5 7.5M12.5 1.5L9 12.5L6.5 7.5M12.5 1.5L1.5 5L6.5 7.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                `}
          </div>
        </div>

        <!-- Footer slot -->
        <slot name="footer"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-sender": AkSender;
  }
}

import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";
import { icon } from "./shared/icons";

@customElement("ak-think")
export class AkThink extends AkElement {
  @property({ type: String })
  title = "思考过程";

  @property({ type: Boolean })
  expanded = false;

  @property({ type: Boolean })
  loading = false;

  /** Full text for typewriter effect. If provided, renders with typewriter animation. */
  @property({ type: String })
  content = "";

  /** Typing speed in ms per character (default 20) */
  @property({ type: Number, attribute: "typing-speed" })
  typingSpeed = 20;

  @state()
  private _internalExpanded = false;

  @state()
  private _typedLength = 0;

  private _typingTimer = 0;

  private get _isExpanded() {
    return this.expanded || this._internalExpanded;
  }

  private get _isTyping() {
    return this.content.length > 0 && this._typedLength < this.content.length;
  }

  override connectedCallback() {
    super.connectedCallback();
    // If content is set and expanded, start typing
    if (this.content && this._isExpanded) {
      this._startTyping();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._stopTyping();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("expanded") || changed.has("_internalExpanded")) {
      if (this._isExpanded && this.content) {
        this._startTyping();
      }
    }
    if (changed.has("content")) {
      // Defer state change to avoid update-in-update cycle
      requestAnimationFrame(() => {
        this._typedLength = 0;
        if (this._isExpanded && this.content) {
          this._startTyping();
        }
      });
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
      <div class="ak-motion-slide-up rounded-lg border border-border bg-card">
        <!-- Header -->
        <button
          class=${cn(
            "ak-btn-interactive flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left",
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
            ${icon("chevron-right", 12)}
          </span>

          <!-- Title -->
          <span class="text-sm font-medium text-card-foreground"
            >${this.title}</span
          >

          <!-- Loading indicator -->
          ${this.loading
            ? html`<span
                class="ml-auto inline-block h-3 w-3 rounded-full border-2 border-muted-foreground border-t-transparent"
                style="animation: ak-spin 0.8s linear infinite;"
              ></span>`
            : this._isTyping
              ? html`<span class="ml-auto text-xs text-muted-foreground"
                  >${Math.round(
                    (this._typedLength / this.content.length) * 100,
                  )}%</span
                >`
              : nothing}
        </button>

        <!-- Content -->
        <div
          class=${cn(
            "overflow-hidden transition-all duration-300",
            this._isExpanded
              ? "max-h-[2000px] opacity-100"
              : "max-h-0 opacity-0",
          )}
          style="transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);"
        >
          <div class="border-t border-border px-3 py-2">
            <div class="text-sm text-muted-foreground">
              ${this.content
                ? html`${this.content.slice(0, this._typedLength)}${this
                    ._isTyping
                    ? html`<span class="ak-cursor"></span>`
                    : nothing}`
                : html`<slot></slot>`}
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

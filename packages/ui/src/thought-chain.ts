import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";
import { icon } from "./shared/icons";

export interface ThoughtChainItem {
  key: string;
  title: string;
  description?: string;
  status?: "pending" | "running" | "success" | "error";
  icon?: string;
}

@customElement("ak-thought-chain")
export class AkThoughtChain extends AkElement {
  @property({ type: Array })
  items: ThoughtChainItem[] = [];

  @property({ type: Boolean })
  collapsible = false;

  @property({ type: Boolean })
  collapsed = false;

  /** Typing speed in ms per character for descriptions (0 = disabled) */
  @property({ type: Number, attribute: "typing-speed" })
  typingSpeed = 20;

  @state()
  private _internalCollapsed = false;

  @state()
  private _typedLengths: Record<string, number> = {};

  private _typingTimers = new Map<string, number>();

  private get _isCollapsed() {
    return this._internalCollapsed || this.collapsed;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this._isCollapsed) {
      this._startAllTyping();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAllTyping();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("items")) {
      this._stopAllTyping();
      // Defer state change to avoid triggering update during update cycle
      requestAnimationFrame(() => {
        this._typedLengths = {};
        if (!this._isCollapsed) {
          this._startAllTyping();
        }
      });
    }
  }

  private _startAllTyping() {
    if (this.typingSpeed <= 0) return;
    for (const item of this.items) {
      if (item.description) {
        this._startTyping(item.key, item.description);
      }
    }
  }

  private _startTyping(key: string, text: string) {
    this._stopTyping(key);
    this._typedLengths = { ...this._typedLengths, [key]: 0 };
    const timer = window.setInterval(() => {
      const current = this._typedLengths[key] ?? 0;
      if (current >= text.length) {
        this._stopTyping(key);
        return;
      }
      this._typedLengths = { ...this._typedLengths, [key]: current + 1 };
    }, this.typingSpeed);
    this._typingTimers.set(key, timer);
  }

  private _stopTyping(key: string) {
    const timer = this._typingTimers.get(key);
    if (timer) {
      clearInterval(timer);
      this._typingTimers.delete(key);
    }
  }

  private _stopAllTyping() {
    this._typingTimers.forEach((timer) => clearInterval(timer));
    this._typingTimers.clear();
  }

  private _isItemTyping(key: string, text: string): boolean {
    const typed = this._typedLengths[key] ?? 0;
    return typed > 0 && typed < text.length;
  }

  private _getItemVisibleText(key: string, text: string): string {
    if (this.typingSpeed <= 0) return text;
    const typed = this._typedLengths[key] ?? 0;
    return text.slice(0, typed);
  }

  private _statusIcon(status: string) {
    const map: Record<string, string> = {
      pending: "clock",
      running: "loader",
      success: "circle-check",
      error: "circle-x",
    };
    return icon(map[status] ?? "clock", 14);
  }

  private _statusColor(status: string) {
    const colors: Record<string, string> = {
      pending: "bg-muted text-muted-foreground",
      running: "bg-primary/10 text-primary",
      success: "bg-green-500/10 text-green-600",
      error: "bg-destructive/10 text-destructive",
    };
    return colors[status] ?? colors.pending;
  }

  private _toggleCollapse() {
    if (!this.collapsible) return;
    const wasCollapsed = this._isCollapsed;
    this._internalCollapsed = !this._internalCollapsed;
    if (wasCollapsed && !this._isCollapsed) {
      this._typedLengths = {};
      this._startAllTyping();
    }
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { collapsed: this._isCollapsed },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    if (this.items.length === 0) return nothing;

    return html`
      <div class="ak-motion-fade-in flex flex-col">
        ${this.collapsible
          ? html`
              <button
                class="ak-btn-interactive mb-2 flex cursor-pointer items-center gap-1 border-0 bg-transparent text-xs text-muted-foreground hover:text-foreground"
                @click=${this._toggleCollapse}
              >
                <span
                  class="inline-flex transition-transform duration-200 ${this
                    ._isCollapsed
                    ? ""
                    : "rotate-90"}"
                  >${icon("chevron-right", 12)}</span
                >
                ${this._isCollapsed ? "展开" : "收起"}思考过程
              </button>
            `
          : nothing}
        ${!this._isCollapsed
          ? this.items.map(
              (item, i) => html`
                <!-- antd: relative, flex, alignItems baseline, gap marginSM(12px) -->
                <div
                  class="ak-motion-slide-up relative flex gap-3"
                  style="align-items: baseline; animation-delay: ${i * 60}ms;"
                >
                  <!-- antd: node-header flex col -->
                  <div class="flex flex-col items-center">
                    <!-- antd: node-icon, lineHeight 1, fontSize iconSize(14) -->
                    <div class="relative leading-none">
                      <div
                        class=${cn(
                          "flex items-center justify-center rounded-full transition-all duration-200",
                          this._statusColor(item.status ?? "pending"),
                        )}
                        style="width: 14px; height: 14px; font-size: 14px;"
                      >
                        ${item.icon
                          ? icon(item.icon, 14)
                          : this._statusIcon(item.status ?? "pending")}
                      </div>
                      <!-- antd: connector line via ::after, 1px solid colorFillContent -->
                      ${i < this.items.length - 1
                        ? html`<div
                            class="absolute left-1/2 top-full w-px -translate-x-1/2 bg-border"
                            style="height: calc(100% + 16px);"
                          ></div>`
                        : nothing}
                    </div>
                  </div>

                  <!-- antd: node-content-box, marginBottom margin(16px) -->
                  <div class="flex-1 pb-4">
                    <!-- antd: node-title, fontWeight 500, flex, gap marginXS(8px) -->
                    <div class="flex gap-2 text-sm font-medium text-foreground">
                      ${item.title}
                    </div>
                    ${item.description
                      ? html`<div
                          class="mt-2 text-sm leading-[1.5714] text-muted-foreground"
                        >
                          ${this._getItemVisibleText(
                            item.key,
                            item.description,
                          )}${this._isItemTyping(item.key, item.description)
                            ? html`<span class="ak-cursor"></span>`
                            : nothing}
                        </div>`
                      : nothing}
                  </div>
                </div>
              `,
            )
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-thought-chain": AkThoughtChain;
  }
}

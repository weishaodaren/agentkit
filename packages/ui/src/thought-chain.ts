import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";

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

  @state()
  private _internalCollapsed = false;

  private get _isCollapsed() {
    return this._internalCollapsed || this.collapsed;
  }

  private _toggleCollapse() {
    if (!this.collapsible) return;
    this._internalCollapsed = !this._internalCollapsed;
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { collapsed: this._isCollapsed },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _statusIcon(status: string) {
    const icons: Record<string, string> = {
      pending: "⏳",
      running: "🔄",
      success: "✅",
      error: "❌",
    };
    return icons[status] ?? "⏳";
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

  override render() {
    if (this.items.length === 0) return nothing;

    return html`
      <div class="flex flex-col">
        ${this.collapsible
          ? html`
              <button
                class="mb-2 flex cursor-pointer items-center gap-1 border-0 bg-transparent text-xs text-muted-foreground hover:text-foreground"
                @click=${this._toggleCollapse}
              >
                <span
                  class="transition-transform ${this._isCollapsed
                    ? ""
                    : "rotate-90"}"
                  >▶</span
                >
                ${this._isCollapsed ? "展开" : "收起"}思考过程
              </button>
            `
          : nothing}
        ${!this._isCollapsed
          ? this.items.map(
              (item, i) => html`
                <div class="flex gap-3">
                  <!-- Timeline -->
                  <div class="flex flex-col items-center">
                    <div
                      class=${cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        this._statusColor(item.status ?? "pending"),
                      )}
                    >
                      ${item.icon ?? this._statusIcon(item.status ?? "pending")}
                    </div>
                    ${i < this.items.length - 1
                      ? html`<div class="w-px flex-1 bg-border"></div>`
                      : nothing}
                  </div>

                  <!-- Content -->
                  <div class="flex-1 pb-4">
                    <div class="text-sm font-medium text-foreground">
                      ${item.title}
                    </div>
                    ${item.description
                      ? html`<div class="mt-1 text-xs text-muted-foreground">
                          ${item.description}
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

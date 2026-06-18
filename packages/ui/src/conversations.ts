import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";
import { icon } from "./shared/icons";

export interface ConversationItem {
  key: string;
  label: string;
  timestamp?: string;
  active?: boolean;
  icon?: string;
}

@customElement("ak-conversations")
export class AkConversations extends AkElement {
  @property({ type: Array })
  items: ConversationItem[] = [];

  @property({ type: String })
  title = "对话列表";

  @property({ type: String, attribute: "active-key" })
  activeKey = "";

  private _handleClick(item: ConversationItem) {
    this.dispatchEvent(
      new CustomEvent("conversation-click", {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="flex h-full flex-col">
        ${this.title
          ? html`<div
              class="flex items-center justify-between border-b border-border px-3 py-2"
            >
              <span class="text-sm font-medium text-foreground"
                >${this.title}</span
              >
              <slot name="extra"></slot>
            </div>`
          : nothing}

        <div class="flex-1 overflow-y-auto p-1">
          ${this.items.map(
            (item, i) => html`
              <button
                class=${cn(
                  "ak-btn-interactive ak-motion-fade-in flex w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-3 py-2 text-left",
                  item.active || item.key === this.activeKey
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50",
                )}
                style="animation-delay: ${i * 40}ms;"
                @click=${() => this._handleClick(item)}
              >
                ${item.icon
                  ? html`<span class="shrink-0 text-sm"
                      >${icon(item.icon, 14)}</span
                    >`
                  : html`<span class="shrink-0 text-sm"
                      >${icon("message-circle", 14)}</span
                    >`}
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm">${item.label}</div>
                  ${item.timestamp
                    ? html`<div class="truncate text-xs text-muted-foreground">
                        ${item.timestamp}
                      </div>`
                    : nothing}
                </div>
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-conversations": AkConversations;
  }
}

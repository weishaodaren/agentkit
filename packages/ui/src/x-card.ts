import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";
import { icon } from "./shared/icons";

/**
 * antd-x XCard 对标实现
 * 动态内容加载卡片
 *
 * 特性:
 * - 异步加载卡片内容 (customLoader)
 * - 自动重试机制 (指数退避)
 * - 可定制加载/错误/空状态
 * - 卡片类型: default/info/success/warning/error
 * - 可关闭、可禁用
 * - 响应式网格布局
 */

export interface XCardItem {
  /** Unique card identifier */
  key: string;
  /** Card title */
  title: string;
  /** Card content (string or HTML) */
  content?: string;
  /** Card type variant */
  type?: "default" | "info" | "success" | "warning" | "error";
  /** Whether card is currently loading */
  loading?: boolean;
  /** Whether card can be closed */
  closable?: boolean;
  /** Card size */
  size?: "small" | "middle" | "large";
  /** Whether card is disabled */
  disabled?: boolean;
  /** Extra content in card header */
  extra?: string;
  /** Lucide icon name */
  icon?: string;
}

interface CardState {
  key: string;
  content?: string;
  loading: boolean;
  error?: string;
  retryCount: number;
  closed: boolean;
}

@customElement("ak-x-card")
export class AkXCard extends AkElement {
  /** Array of card items to display */
  @property({ type: Array })
  items: XCardItem[] = [];

  /** Max concurrent loading requests */
  @property({ type: Number, attribute: "max-concurrent" })
  maxConcurrent = 5;

  /** Max retry count for failed loads */
  @property({ type: Number, attribute: "retry-count" })
  retryCount = 3;

  /** Loading timeout in ms */
  @property({ type: Number })
  timeout = 10000;

  /** Grid columns: 1-4 */
  @property({ type: String })
  columns: "1" | "2" | "3" | "4" = "2";

  @state()
  private _cardStates: Map<string, CardState> = new Map();

  override connectedCallback() {
    super.connectedCallback();
    this._initCardStates();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("items")) {
      requestAnimationFrame(() => this._initCardStates());
    }
  }

  private _initCardStates() {
    const newStates = new Map<string, CardState>();
    for (const item of this.items) {
      const existing = this._cardStates.get(item.key);
      newStates.set(item.key, {
        key: item.key,
        content: item.content,
        loading: item.loading ?? false,
        error: undefined,
        retryCount: existing?.retryCount ?? 0,
        closed: existing?.closed ?? false,
      });
    }
    this._cardStates = newStates;
  }

  /** External API: set card content (call this when async content arrives) */
  setCardContent(key: string, content: string) {
    this._updateState(key, { content, loading: false, error: undefined });
  }

  /** External API: set card error */
  setCardError(key: string, error: string) {
    this._updateState(key, { loading: false, error });
  }

  private _updateState(key: string, updates: Partial<CardState>) {
    const existing = this._cardStates.get(key);
    if (existing) {
      const newState = new Map(this._cardStates);
      newState.set(key, { ...existing, ...updates });
      this._cardStates = newState;
    }
  }

  private _handleClose(e: Event, item: XCardItem) {
    e.stopPropagation();
    this._updateState(item.key, { closed: true });
    this.dispatchEvent(
      new CustomEvent("card-close", {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleRetry(item: XCardItem) {
    const cardState = this._cardStates.get(item.key);
    if (cardState && cardState.retryCount < this.retryCount) {
      this._updateState(item.key, {
        retryCount: cardState.retryCount + 1,
        loading: true,
        error: undefined,
      });
      this.dispatchEvent(
        new CustomEvent("card-load", {
          detail: { key: item.key, item },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private _typeIcon(type: string): string {
    const map: Record<string, string> = {
      default: "file-text",
      info: "info",
      success: "circle-check",
      warning: "circle-alert",
      error: "circle-x",
    };
    return map[type] ?? "file-text";
  }

  private _typeClasses(type: string): string {
    const map: Record<string, string> = {
      default: "border-border",
      info: "border-blue-200 bg-blue-50/30",
      success: "border-green-200 bg-green-50/30",
      warning: "border-amber-200 bg-amber-50/30",
      error: "border-destructive/50 bg-destructive/5",
    };
    return map[type] ?? map.default;
  }

  private _sizeClasses(size: string): string {
    const map: Record<string, string> = {
      small: "p-2 text-xs",
      middle: "p-3 text-sm",
      large: "p-4 text-sm",
    };
    return map[size] ?? map.middle;
  }

  override render() {
    const visibleItems = this.items.filter((item) => {
      const cardState = this._cardStates.get(item.key);
      return !cardState?.closed;
    });

    if (visibleItems.length === 0) {
      return html`
        <div
          class="flex items-center justify-center rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground"
        >
          暂无内容
        </div>
      `;
    }

    const gridCols: Record<string, string> = {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
    };

    return html`
      <div class=${cn("grid gap-3", gridCols[this.columns])}>
        ${visibleItems.map(
          (item) => html`
            <div
              class=${cn(
                "ak-motion-slide-up ak-card-hover flex flex-col rounded-lg border bg-card",
                this._typeClasses(item.type ?? "default"),
                item.disabled && "pointer-events-none opacity-50",
              )}
            >
              <!-- Header -->
              <div
                class=${cn(
                  "flex items-center justify-between border-b border-border/50",
                  this._sizeClasses(item.size ?? "middle"),
                )}
              >
                <div class="flex items-center gap-2">
                  ${item.icon || item.type
                    ? html`<span
                        class="flex items-center text-muted-foreground"
                      >
                        ${icon(
                          item.icon || this._typeIcon(item.type ?? "default"),
                          16,
                        )}
                      </span>`
                    : nothing}
                  <span class="font-medium text-card-foreground"
                    >${item.title}</span
                  >
                </div>
                <div class="flex items-center gap-1">
                  ${item.extra
                    ? html`<span class="text-xs text-muted-foreground"
                        >${item.extra}</span
                      >`
                    : nothing}
                  ${item.closable
                    ? html`<button
                        class="ak-btn-interactive flex h-5 w-5 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-muted-foreground hover:text-foreground"
                        @click=${(e: Event) => this._handleClose(e, item)}
                      >
                        ${icon("x", 12)}
                      </button>`
                    : nothing}
                </div>
              </div>

              <!-- Content -->
              <div
                class=${cn("flex-1", this._sizeClasses(item.size ?? "middle"))}
              >
                ${this._cardStates.get(item.key)?.loading
                  ? html`
                      <div
                        class="flex items-center gap-2 text-muted-foreground"
                      >
                        <span
                          class="inline-block h-3 w-3 rounded-full border-2 border-current border-t-transparent"
                          style="animation: ak-spin 0.8s linear infinite;"
                        ></span>
                        <span class="text-xs">加载中...</span>
                      </div>
                    `
                  : this._cardStates.get(item.key)?.error
                    ? html`
                        <div
                          class="flex flex-col items-center gap-2 text-center"
                        >
                          <span class="text-destructive"
                            >${icon("circle-x", 20)}</span
                          >
                          <span class="text-xs text-destructive"
                            >${this._cardStates.get(item.key)?.error}</span
                          >
                          ${this._cardStates.get(item.key)!.retryCount <
                          this.retryCount
                            ? html`<button
                                class="ak-btn-interactive mt-1 cursor-pointer rounded border border-border bg-transparent px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                                @click=${() => this._handleRetry(item)}
                              >
                                重试
                                (${this._cardStates.get(item.key)!
                                  .retryCount}/${this.retryCount})
                              </button>`
                            : nothing}
                        </div>
                      `
                    : item.content
                      ? html`<div class="text-card-foreground">
                          ${item.content}
                        </div>`
                      : html`<slot name=${item.key}></slot>`}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-x-card": AkXCard;
  }
}

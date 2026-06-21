import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

export interface NotificationOptions {
  key?: string;
  title: string;
  description?: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
}

interface ToastItem extends NotificationOptions {
  id: string;
  visible: boolean;
}

const notificationCSS: CSSResult = css`
  .ak-notification {
    position: fixed;
    z-index: var(--ak-z-index-notification, 1010);
    display: flex;
    flex-direction: column;
    gap: var(--ak-padding-xs, 8px);
  }
  .ak-notification-top-right {
    top: 16px;
    right: 16px;
  }
  .ak-notification-top-left {
    top: 16px;
    left: 16px;
  }
  .ak-notification-bottom-right {
    bottom: 16px;
    right: 16px;
  }
  .ak-notification-bottom-left {
    bottom: 16px;
    left: 16px;
  }
  .ak-notification-toast {
    display: flex;
    align-items: flex-start;
    gap: var(--ak-padding-sm, 12px);
    width: 320px;
    padding: var(--ak-padding, 16px);
    border-radius: var(--ak-border-radius-md, 8px);
    border: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
    background: var(--ak-color-bg-elevated, #fff);
    box-shadow: var(--ak-box-shadow, 0 6px 16px rgba(0, 0, 0, 0.08));
    transition: all var(--ak-duration-slow, 300ms) var(--ak-ease-in-out);
  }
  .ak-notification-toast-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .ak-notification-toast-hidden {
    opacity: 0;
    transform: translateY(-8px);
  }
  .ak-notification-icon {
    flex-shrink: 0;
    font-size: 18px;
  }
  .ak-notification-icon-info {
    color: var(--ak-color-info, #1677ff);
  }
  .ak-notification-icon-success {
    color: var(--ak-color-success, #52c41a);
  }
  .ak-notification-icon-warning {
    color: var(--ak-color-warning, #faad14);
  }
  .ak-notification-icon-error {
    color: var(--ak-color-error, #ff4d4f);
  }
  .ak-notification-body {
    min-width: 0;
    flex: 1;
  }
  .ak-notification-title {
    font-size: var(--ak-font-size, 14px);
    font-weight: 500;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-notification-description {
    margin-top: 4px;
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-notification-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    transition: color var(--ak-duration-mid, 200ms);
    padding: 0;
  }
  .ak-notification-close:hover {
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
`;

@customElement("ak-notification")
export class AkNotification extends AkElement {
  static override styles = [notificationCSS];
  @property({ type: String })
  placement: "top-right" | "top-left" | "bottom-right" | "bottom-left" =
    "top-right";

  @state()
  private _toasts: ToastItem[] = [];

  private _counter = 0;
  private _timers = new Set<number>();

  private _safeTimeout(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      this._timers.delete(id);
      fn();
    }, ms);
    this._timers.add(id);
    return id;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._timers.forEach((id) => clearTimeout(id));
    this._timers.clear();
  }

  open(options: NotificationOptions) {
    const id = options.key ?? `toast-${++this._counter}`;
    const toast: ToastItem = { ...options, id, visible: true };
    this._toasts = [...this._toasts, toast];

    const duration = options.duration ?? 4500;
    if (duration > 0) {
      this._safeTimeout(() => this.close(id), duration);
    }
    return id;
  }

  close(id: string) {
    this._toasts = this._toasts.map((t) =>
      t.id === id ? { ...t, visible: false } : t,
    );
    this._safeTimeout(() => {
      this._toasts = this._toasts.filter((t) => t.id !== id);
    }, 300);
  }

  private get _placementClasses() {
    return `ak-notification-${this.placement}`;
  }

  private _typeIconClass(type: string) {
    const map: Record<string, string> = {
      info: "ak-notification-icon-info",
      success: "ak-notification-icon-success",
      warning: "ak-notification-icon-warning",
      error: "ak-notification-icon-error",
    };
    return map[type] ?? map.info;
  }

  private _typeIcon(type: string) {
    const map: Record<string, string> = {
      info: "info",
      success: "circle-check",
      warning: "circle-alert",
      error: "circle-x",
    };
    return icon(map[type] ?? "info", 18);
  }

  override render() {
    if (this._toasts.length === 0) return nothing;

    return html`
      <div class="ak-notification ${this._placementClasses}">
        ${this._toasts.map(
          (toast) => html`
            <div
              class="ak-notification-toast ${toast.visible
                ? "ak-notification-toast-visible"
                : "ak-notification-toast-hidden"}"
            >
              <span
                class="ak-notification-icon ${this._typeIconClass(
                  toast.type ?? "info",
                )}"
              >
                ${this._typeIcon(toast.type ?? "info")}
              </span>
              <div class="ak-notification-body">
                <div class="ak-notification-title">${toast.title}</div>
                ${toast.description
                  ? html`<div class="ak-notification-description">
                      ${toast.description}
                    </div>`
                  : nothing}
              </div>
              <button
                class="ak-notification-close"
                @click=${() => this.close(toast.id)}
              >
                ${icon("x", 14)}
              </button>
            </div>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-notification": AkNotification;
  }
}

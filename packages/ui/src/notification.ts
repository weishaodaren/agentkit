import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";
import { icon } from "./shared/icons";

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

@customElement("ak-notification")
export class AkNotification extends AkElement {
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
    const map: Record<string, string> = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
    };
    return map[this.placement];
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
      <div
        class=${cn("fixed z-50 flex flex-col gap-2", this._placementClasses)}
      >
        ${this._toasts.map(
          (toast) => html`
            <div
              class=${cn(
                "ak-motion-enter-right flex w-80 items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg transition-all duration-300",
                toast.visible
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0",
              )}
            >
              <span class="shrink-0 text-base">
                ${this._typeIcon(toast.type ?? "info")}
              </span>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium text-card-foreground">
                  ${toast.title}
                </div>
                ${toast.description
                  ? html`<div class="mt-1 text-xs text-muted-foreground">
                      ${toast.description}
                    </div>`
                  : nothing}
              </div>
              <button
                class="ak-btn-interactive shrink-0 cursor-pointer border-0 bg-transparent text-muted-foreground hover:text-foreground"
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

import { css, html, type CSSResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

const welcomeCSS: CSSResult = css`
  .ak-welcome {
    display: flex;
    gap: var(--ak-padding, 16px);
  }
  .ak-welcome-filled {
    border-radius: var(--ak-border-radius-md, 8px);
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
    padding: var(--ak-padding-sm, 12px) var(--ak-padding, 16px);
  }
  .ak-welcome-borderless {
    /* no background or border */
  }
  .ak-welcome-icon {
    flex-shrink: 0;
  }
  .ak-welcome-icon img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  .ak-welcome-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    flex: 1;
  }
  .ak-welcome-title-row {
    display: flex;
    align-items: flex-start;
    gap: var(--ak-padding-xs, 8px);
  }
  .ak-welcome-title {
    margin: 0;
    font-size: var(--ak-font-size-lg, 16px);
    font-weight: 600;
    line-height: 1.5;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    flex: 1;
  }
  .ak-welcome-description {
    margin: 0;
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
`;

@customElement("ak-welcome")
export class AkWelcome extends AkElement {
  static override styles = [welcomeCSS];
  @property({ type: String })
  variant: "filled" | "borderless" = "filled";

  @property({ type: String })
  title = "";

  @property({ type: String })
  description = "";

  /** Icon: URL string auto-converts to <img>, otherwise use slot */
  @property({ type: String })
  icon = "";

  /** antd-x: icon supports string URL auto-convert to img */
  private _isIconUrl(): boolean {
    return (
      this.icon.startsWith("http") ||
      this.icon.startsWith("data:") ||
      this.icon.startsWith("/")
    );
  }

  override render() {
    return html`
      <div class="ak-welcome ak-welcome-${this.variant} ak-motion-fade-in">
        <!-- Icon -->
        ${this.icon
          ? html`<div class="ak-welcome-icon">
              ${this._isIconUrl()
                ? html`<img src=${this.icon} alt="icon" />`
                : html`${icon(this.icon, 20)}`}
            </div>`
          : html`<slot name="icon"></slot>`}

        <!-- Body -->
        <div class="ak-welcome-body">
          <!-- Title Row -->
          <div class="ak-welcome-title-row">
            ${this.title
              ? html`<h4 class="ak-welcome-title">${this.title}</h4>`
              : html`<slot name="title"></slot>`}
            <slot name="extra"></slot>
          </div>

          <!-- Description -->
          ${this.description
            ? html`<p class="ak-welcome-description">${this.description}</p>`
            : html`<slot name="description"></slot>`}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-welcome": AkWelcome;
  }
}

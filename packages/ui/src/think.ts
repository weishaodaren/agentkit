import { css, html, nothing, type PropertyValues, type CSSResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { Task } from "@lit/task";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

/**
 * antd-x Think 1:1 实现
 *
 * Structure:
 *   .ak-think (root, block)
 *   ├── .ak-think-status-wrapper (fit-content flex row, clickable)
 *   │   ├── .ak-think-status-icon (sparkles / loader)
 *   │   ├── .ak-think-status-text
 *   │   └── .ak-think-status-down-icon (chevron-down, rotates 180)
 *   └── .ak-think-content (left border timeline, collapsible)
 *
 * Collapse behavior:
 *   - Content always in DOM, height + overflow transition
 *   - Collapse/expand does NOT re-trigger typing
 *   - motionAppear: false
 */

const thinkCSS: CSSResult = css`
  .ak-think {
    display: block;
  }
  .ak-think-status-wrapper {
    width: fit-content;
    display: flex;
    flex-direction: row;
    gap: var(--ak-padding-xs, 8px);
    align-items: center;
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    line-height: var(--ak-line-height, 1.5714);
    cursor: pointer;
    user-select: none;
    padding: 2px 0;
    transition: color var(--ak-duration-mid, 200ms);
  }
  .ak-think-status-wrapper:hover {
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-think-status-icon {
    font-size: var(--ak-font-size-heading-5, 16px);
    display: flex;
    align-items: center;
  }
  .ak-think-status-text {
    line-height: var(--ak-line-height, 1.5714);
    font-size: var(--ak-font-size, 14px);
  }
  .ak-think-status-down-icon {
    font-size: var(--ak-font-size-sm, 12px);
    display: inline-flex;
    align-items: center;
    transition: transform var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
  }
  @keyframes ak-think-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }
  .ak-think-motion-blink {
    animation: ak-think-blink 1.2s step-end infinite;
  }
  .ak-think-content {
    margin-top: var(--ak-margin-sm, 12px);
    width: 100%;
    color: var(--ak-color-text-description, rgba(0, 0, 0, 0.45));
    padding-inline-start: var(--ak-padding-sm, 12px);
    border-inline-start: var(--ak-line-width-bold, 2px) solid
      var(--ak-color-border, #d9d9d9);
    transition:
      height var(--ak-duration-mid, 200ms) var(--ak-ease-in-out),
      opacity var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
  }
`;

@customElement("ak-think")
export class AkThink extends AkElement {
  static override styles = [thinkCSS];
  @property({ type: String })
  title = "";

  /** Whether the content area is visible (controlled). undefined = uncontrolled, use defaultExpanded. */
  @property({ type: Boolean, reflect: true })
  expanded: boolean | undefined = undefined;

  /** Initial expanded state (uncontrolled) */
  @property({ type: Boolean, attribute: "default-expanded" })
  defaultExpanded = true;

  @property({ type: Boolean })
  loading = false;

  /** Custom icon name (lucide). Default: sparkles, loading: loader */
  @property({ type: String })
  icon = "";

  /** Whether the title text should blink (streaming indicator) */
  @property({ type: Boolean })
  blink = false;

  /** Full text for typewriter effect in content area */
  @property({ type: String })
  content = "";

  /** Typing speed in ms per character (default 20) */
  @property({ type: Number, attribute: "typing-speed" })
  typingSpeed = 20;

  @state()
  private _isExpanded = true;

  @state()
  private _userInteracted = false;

  @state()
  private _typedLength = 0;

  /** Explicit height for collapse animation; null = height: auto */
  @state()
  private _animHeight: string | null = null;

  /** Whether content is visible (for overflow/opacity transition) */
  @state()
  private _contentVisible = true;

  @query(".ak-think-content")
  private _contentEl!: HTMLElement;

  private _animating = false;

  /**
   * Typing animation task — progressively reveals content.
   * Only runs when expanded; continues from current position (supports streaming).
   * Automatically cancelled on disconnect or when args change.
   */
  private _typingTask = new Task<[string, number, boolean], void>(this, {
    task: async ([content, speed, expanded], { signal }) => {
      if (!content || speed <= 0 || !expanded) return;
      // Already fully typed — don't restart
      if (this._typedLength >= content.length) return;
      for (let i = this._typedLength; i < content.length; i++) {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, speed);
          signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(new DOMException("Aborted", "AbortError"));
            },
            { once: true },
          );
        });
        this._typedLength = i + 1;
      }
    },
    args: () =>
      [this.content, this.typingSpeed, this._getEffectiveExpanded()] as [
        string,
        number,
        boolean,
      ],
  });

  override connectedCallback() {
    super.connectedCallback();
    this._isExpanded = this.defaultExpanded;
    this._contentVisible = this._isExpanded;
  }

  override willUpdate(changed: PropertyValues) {
    // Handle controlled expanded change — set state BEFORE render to avoid change-in-update
    // Only apply when expanded is explicitly set (not undefined)
    if (changed.has("expanded") && this.expanded !== undefined) {
      if (!this._userInteracted) {
        this._isExpanded = this.expanded;
        this._contentVisible = this._isExpanded;
      }
    }
  }

  private _getEffectiveExpanded(): boolean {
    if (this._userInteracted) return this._isExpanded;
    return this.expanded ?? this.defaultExpanded;
  }

  private _getIsTyping(): boolean {
    return this.content.length > 0 && this._typedLength < this.content.length;
  }

  /**
   * antd-x 使用 CSSMotion 实现折叠动画：
   *   展开: height 0 → scrollHeight → auto
   *   折叠: height offsetHeight → 0
   * 内容始终在 DOM 中，不重新触发打字动画
   */
  private _toggle() {
    if (this._animating) return;

    this._userInteracted = true;
    const wasExpanded = this._getEffectiveExpanded();
    this._isExpanded = !wasExpanded;
    this._animating = true;

    if (wasExpanded) {
      // Collapse: current height → 0
      const el = this._contentEl;
      if (el) {
        const h = el.offsetHeight;
        // Step 1: pin to current pixel height
        this._animHeight = `${h}px`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Step 2: animate to 0
            this._animHeight = "0px";
            this._contentVisible = false;
          });
        });
      } else {
        this._animHeight = "0px";
        this._contentVisible = false;
        this._animating = false;
      }
    } else {
      // Expand: 0 → scrollHeight → auto
      this._contentVisible = true;
      this._animHeight = "0px";
      requestAnimationFrame(() => {
        const el = this._contentEl;
        if (el) {
          const h = el.scrollHeight;
          requestAnimationFrame(() => {
            // Step 2: animate to scrollHeight
            this._animHeight = `${h}px`;
          });
        }
      });
    }

    // Clean up after animation completes
    setTimeout(() => {
      this._animating = false;
      if (this._isExpanded) {
        this._animHeight = null; // back to auto
      }
    }, 300);

    this.dispatchEvent(
      new CustomEvent("expand", {
        detail: { expanded: this._isExpanded },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private get _contentStyle(): string {
    if (this._animHeight !== null) {
      return `height: ${this._animHeight}; overflow: hidden; transition: height 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.2s cubic-bezier(0.645, 0.045, 0.355, 1); opacity: ${this._contentVisible ? 1 : 0};`;
    }
    if (!this._getEffectiveExpanded()) {
      return "height: 0px; overflow: hidden; opacity: 0;";
    }
    return "";
  }

  override render() {
    const isExpanded = this._getEffectiveExpanded();
    const isTyping = this._getIsTyping();
    const iconName = this.loading ? "loader" : this.icon || "sparkles";

    return html`
      <div class="ak-think">
        <!-- Status bar (clickable) -->
        <div class="ak-think-status-wrapper" @click=${this._toggle}>
          <!-- Icon -->
          <div class="ak-think-status-icon">${icon(iconName, 16)}</div>

          <!-- Title text -->
          <div
            class="ak-think-status-text ${this.blink
              ? "ak-think-motion-blink"
              : ""}"
          >
            ${this.title || (this.loading ? "思考中..." : "思考过程")}
          </div>

          <!-- Down arrow (chevron-down, rotates 180 when expanded) -->
          <span
            class="ak-think-status-down-icon"
            style="transform: rotate(${isExpanded ? 180 : 0}deg);"
          >
            ${icon("chevron-down", 12)}
          </span>
        </div>

        <!-- Content area (collapsible, always in DOM) -->
        <div class="ak-think-content" style=${this._contentStyle}>
          ${this.content
            ? html`${this.content.slice(0, this._typedLength)}${isTyping
                ? html`<span class="ak-cursor"></span>`
                : nothing}`
            : html`<slot></slot>`}
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

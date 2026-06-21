import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";

/**
 * antd-x Think 对标实现
 *
 * antd-x 结构：
 *   .ant-think-status-wrapper: fit-content 横向 flex (icon + title + DownOutlined)
 *   .ant-think-content: 左侧时间线边框，marginTop marginSM，CSSMotion 折叠动画
 *
 * 折叠行为：
 *   - 内容始终在 DOM 中，通过 height + overflow hidden 过渡隐藏/显示
 *   - 折叠/展开不重新触发打字动画
 *   - motionAppear: false（初始渲染不播放动画）
 */
@customElement("ak-think")
export class AkThink extends AkElement {
  @property({ type: String })
  title = "";

  /** Whether the content area is visible (controlled) */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  /** Initial expanded state (uncontrolled) */
  @property({ type: Boolean, attribute: "default-expanded" })
  defaultExpanded = true;

  @property({ type: Boolean })
  loading = false;

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

  private _typingTimer = 0;
  private _typingStarted = false;
  private _animating = false;

  override connectedCallback() {
    super.connectedCallback();
    this._isExpanded = this.defaultExpanded;
    this._contentVisible = this._isExpanded;
    if (this.content && this._isExpanded) {
      this._startTyping();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._stopTyping();
  }

  override willUpdate(changed: PropertyValues) {
    // Handle controlled expanded change — set state BEFORE render to avoid change-in-update
    if (changed.has("expanded")) {
      if (!this._userInteracted) {
        this._isExpanded = this.expanded;
        this._contentVisible = this._isExpanded;
      }
    }
  }

  override updated(changed: PropertyValues) {
    // Start typing when content arrives for the first time
    // This is OK in updated() because _startTyping uses setInterval (async side effect)
    if (changed.has("content") && this.content && !this._typingStarted) {
      if (this._getEffectiveExpanded()) {
        this._startTyping();
      }
    }
  }

  private _getEffectiveExpanded(): boolean {
    if (this._userInteracted) return this._isExpanded;
    return this.expanded || this.defaultExpanded;
  }

  private _getIsTyping(): boolean {
    return this.content.length > 0 && this._typedLength < this.content.length;
  }

  private _startTyping() {
    if (this._typingStarted) return;
    this._typingStarted = true;
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
    if (!this._isExpanded) {
      return "height: 0px; overflow: hidden; opacity: 0;";
    }
    return "";
  }

  override render() {
    const isExpanded = this._getEffectiveExpanded();
    const isTyping = this._getIsTyping();

    return html`
      <div class="ak-think">
        <!-- Status bar (clickable) — antd-x: status-wrapper -->
        <div class="ak-think-status-wrapper" @click=${this._toggle}>
          <!-- Icon — antd-x: status-icon -->
          <div class="ak-think-status-icon">
            ${this.loading
              ? html`<svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3a5 5 0 1 0 5 5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 8 8"
                      to="360 8 8"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>`
              : html`<svg
                  width="16"
                  height="16"
                  viewBox="0 0 1024 1024"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M847.936 168.448c65.088 65.664 46.144 198.528-36.224 337.536 88.128 143.04 109.824 281.408 43.008 348.8-66.56 67.072-202.688 45.696-343.808-41.984-141.12 87.68-277.248 109.056-343.808 41.984-66.816-67.392-45.056-205.76 43.008-348.8-82.368-139.008-101.248-271.872-36.16-337.536 65.408-65.92 198.336-46.336 336.96 37.76l9.728-5.76c135.104-79.232 263.36-96.448 327.296-32zM249.088 565.568l-2.24 4.16a536.704 536.704 0 0 0-38.272 85.696c-28.928 85.888-16.128 134.144 3.584 153.984 19.712 19.776 67.52 32.768 152.704 3.584a531.84 531.84 0 0 0 87.616-40.064c-35.84-26.816-71.488-57.664-105.792-92.288a950.4 950.4 0 0 1-97.6-115.072z m523.648 0.064l-2.56 3.584c-27.392 37.76-59.2 75.328-94.976 111.424a951.744 951.744 0 0 1-105.856 92.288c30.336 17.088 59.904 30.528 87.68 40.064 85.12 29.184 132.992 16.192 152.64-3.584 19.712-19.84 32.576-68.096 3.584-153.984a541.824 541.824 0 0 0-40.512-89.792z m-261.76-283.2l-17.664 12.416c-36.352 26.24-72.96 57.472-108.416 93.184a878.208 878.208 0 0 0-99.008 118.656c28.8 42.88 64.128 86.528 105.792 128.512a874.24 874.24 0 0 0 119.232 100.928 875.84 875.84 0 0 0 119.232-100.928 871.232 871.232 0 0 0 105.728-128.448 868.224 868.224 0 0 0-98.944-118.72 867.136 867.136 0 0 0-126.016-105.6z m3.2 105.472a11.52 11.52 0 0 1 7.808 7.808l7.232 24.512c10.432 35.2 37.888 62.72 73.088 73.152l24.192 7.168a11.52 11.52 0 0 1 0.064 22.144l-24.704 7.424A108.288 108.288 0 0 0 529.28 603.008l-7.296 24.576a11.52 11.52 0 0 1-22.144 0l-7.296-24.576a108.288 108.288 0 0 0-72.576-72.96l-24.704-7.36a11.52 11.52 0 0 1 0-22.144l24.32-7.168c35.136-10.432 62.592-37.952 73.024-73.152l7.232-24.512a11.52 11.52 0 0 1 14.336-7.808z m136.064-177.664a522.496 522.496 0 0 0-79.872 35.776c37.76 27.84 75.456 60.16 111.552 96.64a956.16 956.16 0 0 1 89.856 104.32c14.656-27.392 26.24-54.016 34.688-79.168 28.928-85.888 16.064-134.08-3.52-153.984-19.712-19.776-67.52-32.768-152.704-3.584z m-431.36 3.584c-19.584 19.84-32.512 68.096-3.52 153.984 8.512 25.152 20.096 51.776 34.688 79.168 26.24-35.392 56.32-70.528 89.856-104.32a948.224 948.224 0 0 1 111.616-96.64 514.816 514.816 0 0 0-79.936-35.776c-85.12-29.184-132.928-16.192-152.64 3.584z"
                  />
                </svg>`}
          </div>

          <!-- Title text — antd-x: status-text -->
          <div
            class=${cn(
              "ak-think-status-text",
              this.blink && "ak-think-motion-blink",
            )}
          >
            ${this.title || (this.loading ? "思考中..." : "思考过程")}
          </div>

          <!-- Down arrow — antd-x: status-down-icon (DownOutlined with rotate) -->
          <span
            class="ak-think-status-down-icon"
            style="transform: rotate(${isExpanded
              ? 180
              : 0}deg); transition: transform 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);"
          >
            <svg
              width="12"
              height="12"
              viewBox="64 64 896 896"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
              />
            </svg>
          </span>
        </div>

        <!-- Content area — antd-x: CSSMotion wrapper, content always in DOM -->
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

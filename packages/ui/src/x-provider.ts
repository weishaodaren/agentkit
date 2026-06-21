import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createContext, ContextProvider } from "@lit/context";
import { AkElement } from "@/shared/base-element";

/**
 * antd-x XProvider 对标实现
 *
 * 使用 @lit/context（Lit 官方 Context API）替代 CustomEvent，
 * 实现类似 React Context 的响应式上下文传递：
 *
 *   - Provider 通过 ContextProvider controller 向下提供配置
 *   - Consumer 通过 @consume() 装饰器或 ContextConsumer controller 消费
 *   - 支持 prefixCls、direction (RTL)、theme 配置
 *
 * 用法：
 *   // Provider
 *   <ak-x-provider prefix-cls="ant" direction="ltr" theme="light">
 *     <ak-bubble content="Hello" />
 *   </ak-x-provider>
 *
 *   // Consumer (子组件中)
 *   import { xProviderContext } from "@agentkit/ui";
 *   @consume({ context: xProviderContext })
 *   providerConfig?: XProviderConfig;
 */

/** Context 配置类型 */
export interface XProviderConfig {
  /** CSS 类名前缀 */
  prefixCls: string;
  /** 布局方向 */
  direction: "ltr" | "rtl";
  /** 主题名称 */
  theme: string;
}

/** 默认配置 */
export const defaultXProviderConfig: XProviderConfig = {
  prefixCls: "ant",
  direction: "ltr",
  theme: "",
};

/**
 * Lit Context 实例 — 子组件通过 @consume({ context: xProviderContext }) 消费
 *
 * @example
 * ```ts
 * import { consume } from "@lit/context";
 * import { xProviderContext, type XProviderConfig } from "@agentkit/ui";
 *
 * class MyComponent extends LitElement {
 *   @consume({ context: xProviderContext })
 *   providerConfig?: XProviderConfig;
 * }
 * ```
 */
export const xProviderContext = createContext<XProviderConfig>(
  Symbol("x-provider-context"),
);

@customElement("ak-x-provider")
export class AkXProvider extends AkElement {
  /** Prefix for CSS class names (antd-x: prefixCls) */
  @property({ type: String, attribute: "prefix-cls" })
  prefixCls = "ant";

  /** Layout direction: ltr or rtl */
  @property({ type: String })
  direction: "ltr" | "rtl" = "ltr";

  /** Theme name */
  @property({ type: String })
  theme = "";

  /** @lit/context: ContextProvider controller */
  private _contextProvider = new ContextProvider(this, {
    context: xProviderContext,
  });

  override connectedCallback() {
    super.connectedCallback();
    this._applyDirection();
    this._syncContext();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("direction")) {
      this._applyDirection();
    }
    if (
      changed.has("prefixCls") ||
      changed.has("direction") ||
      changed.has("theme")
    ) {
      this._syncContext();
    }
  }

  private _applyDirection() {
    this.style.direction = this.direction;
  }

  /** 将当前属性同步到 ContextProvider，子组件自动响应 */
  private _syncContext() {
    this._contextProvider.setValue({
      prefixCls: this.prefixCls,
      direction: this.direction,
      theme: this.theme,
    });
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-x-provider": AkXProvider;
  }
}

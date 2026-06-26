---
category: Components
group:
  title: 其他
  order: 5
title: XProvider
subtitle: 全局配置
description: 全局配置组件，提供主题、国际化和方向控制
---

## 何时使用

- 在应用根节点包裹所有 AgentKit UI 组件
- 统一管理主题、国际化和文本方向
- 通过 `@lit/context` 实现响应式上下文传递

## 代码演示

### 基础用法 — `prefixCls`

<preview path="./demos/x-provider/x-provider-basic.vue" title="基础用法" description="XProvider 包裹子组件，提供全局上下文配置，prefixCls 默认为「ant」"></preview>

### 文本方向 — `direction`

<preview path="./demos/x-provider/x-provider-direction.vue" title="文本方向" description="direction=rtl 设置从右到左的布局方向"></preview>

### 主题配置 — `theme`

<preview path="./demos/x-provider/x-provider-theme.vue" title="主题配置" description="theme 属性设置主题名称，子组件通过 Context 响应主题变化"></preview>

## API

### XProvider

| 属性      | 说明         | 类型           | 默认值  |
| --------- | ------------ | -------------- | ------- |
| prefixCls | CSS 类名前缀 | `string`       | `"ant"` |
| direction | 文本方向     | `ltr` \| `rtl` | `ltr`   |
| theme     | 主题名称     | `string`       | `""`    |

### 上下文注入

XProvider 通过 `@lit/context` 向所有子组件注入以下配置：

```typescript
interface XProviderConfig {
  prefixCls: string;
  direction: "ltr" | "rtl";
  theme: string;
  locale: Locale;
}
```

子组件可通过 `consume` 装饰器访问配置：

```typescript
import { consume } from "@lit/context";
import { xProviderContext } from "@agentkit/ui";

class MyComponent extends LitElement {
  @consume({ context: xProviderContext })
  providerConfig?: XProviderConfig;
}
```

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

### 基础用法

```html
<ak-x-provider>
  <ak-bubble content="Hello" placement="start"></ak-bubble>
  <ak-sender placeholder="输入消息..."></ak-sender>
</ak-x-provider>
```

### 主题配置

```html
<ak-x-provider theme="dark">
  <!-- 所有子组件将使用暗色主题 -->
</ak-x-provider>
```

### RTL 支持

```html
<ak-x-provider direction="rtl">
  <!-- 所有子组件使用从右到左的布局 -->
</ak-x-provider>
```

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

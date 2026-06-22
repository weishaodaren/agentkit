# 快速开始

AgentKit UI 是一个基于 **Lit** + **Tailwind CSS v4** 构建的 Web Components 组件库，专为 AI 对话界面设计。

## 安装

::: code-group

```bash [npm]
npm install @agentkit/ui
```

```bash [pnpm]
pnpm add @agentkit/ui
```

```bash [yarn]
yarn add @agentkit/ui
```

:::

## 在 React 中使用

```tsx
import { Bubble, Sender } from "@agentkit/ui/adaptor/react";

function Chat() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Bubble content="Hello!" placement="start" />
      <Bubble content="你好！" placement="end" />
      <Sender placeholder="输入消息..." onSubmit={handleSubmit} />
    </div>
  );
}
```

如果需要 Markdown 渲染插件：

```tsx
import { Markdown } from "@agentkit/ui/adaptor/react-plugins";

function Message({ content }: { content: string }) {
  return <Markdown content={content} streamStatus="done" />;
}
```

## 在 Vue 中使用

```vue
<script setup>
import { Bubble, Sender } from "@agentkit/ui/adaptor/vue";
</script>

<template>
  <div>
    <Bubble content="Hello!" placement="start" />
    <Sender placeholder="输入消息..." />
  </div>
</template>
```

## 在原生 HTML 中使用

直接使用 Web Components 自定义元素标签：

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module">
      import "@agentkit/ui";
    </script>
  </head>
  <body>
    <ak-bubble
      content="Hello from Web Components!"
      placement="start"
    ></ak-bubble>
    <ak-sender placeholder="输入消息..."></ak-sender>
  </body>
</html>
```

## TypeScript 支持

AgentKit UI 使用 TypeScript 开发并提供完整的类型定义。安装后即可享受完整的类型推导和自动补全。

```typescript
import type { ConversationItem, PromptsItem } from "@agentkit/ui";

const conversations: ConversationItem[] = [
  { key: "1", label: "对话 1", group: "今天" },
];
```

## 按需加载

`@agentkit/ui` 默认支持基于 ES Modules 的 tree shaking。你可以按需导入所需组件：

```typescript
// 只导入 Bubble 和 Sender
import { AkBubble, AkSender } from "@agentkit/ui";
```

对于 Markdown 渲染和代码高亮，使用独立的入口：

```typescript
import "@agentkit/ui/markdown";
import "@agentkit/ui/code-highlighter";
```

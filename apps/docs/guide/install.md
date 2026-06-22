# 安装

## 使用包管理器安装

推荐使用 [npm](https://www.npmjs.com/)、[pnpm](https://pnpm.io/zh/) 或 [yarn](https://github.com/yarnpkg/yarn/) 进行安装。

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

## 依赖说明

`@agentkit/ui` 的核心依赖：

| 依赖                    | 版本 | 说明                    |
| ----------------------- | ---- | ----------------------- |
| `lit`                   | ^3.3 | Web Components 基础框架 |
| `tailwindcss`           | ^4.3 | 原子化 CSS              |
| `@lit/task`             | ^1.0 | 异步任务管理            |
| `@lit-labs/virtualizer` | ^2.1 | 虚拟列表                |
| `@lit-labs/observers`   | ^2.1 | DOM 观察器              |

可选依赖（按需引入）：

| 依赖           | 说明          | 引入方式                                 |
| -------------- | ------------- | ---------------------------------------- |
| `marked`       | Markdown 解析 | `import '@agentkit/ui/markdown'`         |
| `highlight.js` | 代码语法高亮  | `import '@agentkit/ui/code-highlighter'` |

## 框架适配器

AgentKit UI 提供主流框架的适配层，需安装对应的框架依赖：

::: code-group

```bash [React]
pnpm add @agentkit/ui
# 确保已安装 react >= 18
```

```bash [Vue]
pnpm add @agentkit/ui
# 确保已安装 vue >= 3
```

:::

适配器导入方式：

```typescript
// React
import { Bubble } from "@agentkit/ui/adaptor/react";

// Vue
import { Bubble } from "@agentkit/ui/adaptor/vue";
```

## 按需加载

`@agentkit/ui` 支持基于 ES Modules 的 tree shaking。你可以按需导入所需组件：

```typescript
// 只导入需要的组件
import { AkBubble, AkSender, AkThink } from "@agentkit/ui";
```

Markdown 和代码高亮作为独立的插件包，仅在需要时引入：

```typescript
import "@agentkit/ui/markdown";
import "@agentkit/ui/code-highlighter";
```

## 版本策略

| 主版本 | 说明                       |
| ------ | -------------------------- |
| 0.x    | 初始开发阶段，API 可能变动 |
| 1.x    | 稳定版本，遵循语义化版本   |

---
category: Components
group:
  title: 唤醒
  order: 2
title: Welcome
subtitle: 欢迎
description: 欢迎信息组件，引导用户开始对话
---

## 何时使用

- 在对话开始前展示欢迎信息
- 引导用户了解 AI 助手的能力
- 配合 Prompts 组件提供快速开始选项

## 代码演示

### 基础用法

```html
<ak-welcome
  title="你好，我是 AgentKit AI"
  description="基于 Lit + Tailwind CSS v4 构建的 AI 组件库。有什么我可以帮你的吗？"
></ak-welcome>
```

### 带图标

```html
<ak-welcome
  title="欢迎使用"
  description="输入你的问题开始对话"
  icon="https://example.com/logo.png"
></ak-welcome>
```

### 样式变体

```html
<!-- 填充（默认） -->
<ak-welcome title="Hello" variant="filled"></ak-welcome>

<!-- 无边框 -->
<ak-welcome title="Hello" variant="borderless"></ak-welcome>
```

## API

### Welcome

| 属性        | 说明                           | 类型                     | 默认值   |
| ----------- | ------------------------------ | ------------------------ | -------- |
| title       | 标题文本                       | `string`                 | `""`     |
| description | 描述文本                       | `string`                 | `""`     |
| variant     | 样式变体                       | `filled` \| `borderless` | `filled` |
| icon        | 图标（URL 字符串自动转为 img） | `string`                 | `""`     |

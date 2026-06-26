---
category: Components
group:
  title: 确认
  order: 1
title: Think
subtitle: 思考过程
description: 展示大模型深度思考过程
---

## 何时使用

- 在对话中展示大模型的深度思考过程
- 支持折叠/展开控制
- 支持打字动画效果（逐字显示）
- 支持加载状态和标题闪烁动画

## 代码演示

### 基础用法 — `title` / `content`

<preview path="./demos/think/think-basic.vue" title="基础用法" description="title 设置状态文本，content 设置思考内容"></preview>

### 加载状态 — `loading` / `blink`

<preview path="./demos/think/think-loading.vue" title="加载状态与闪烁" description="loading 显示加载图标，blink 启用标题闪烁动画"></preview>

### 折叠展开 — `defaultExpanded` / `expanded`

<preview path="./demos/think/think-collapse.vue" title="折叠控制" description="default-expanded 控制默认折叠状态，点击标题栏可展开/折叠"></preview>

### 打字动画 — `content` / `typingSpeed`

<preview path="./demos/think/think-typing.vue" title="打字动画" description="content 配合 typingSpeed 实现逐字显示，支持流式 content 动态增长"></preview>

### 自定义图标 — `icon`

<preview path="./demos/think/think-icon.vue" title="自定义图标" description="icon 属性接受 lucide 图标名，默认 sparkles，可设为 brain、lightbulb、search 等"></preview>

## API

### Think

| 属性            | 说明                      | 类型                     | 默认值      |
| --------------- | ------------------------- | ------------------------ | ----------- |
| title           | 状态文本                  | `string`                 | `""`        |
| content         | 思考内容                  | `string`                 | `""`        |
| expanded        | 是否展开（受控）          | `boolean` \| `undefined` | `undefined` |
| defaultExpanded | 默认是否展开（非受控）    | `boolean`                | `true`      |
| loading         | 加载中状态                | `boolean`                | `false`     |
| blink           | 标题闪烁动画              | `boolean`                | `false`     |
| typingSpeed     | 打字速度（ms/字符）       | `number`                 | `20`        |
| icon            | 自定义图标（lucide 名称） | `string`                 | `""`        |

### 插槽

| 插槽名  | 说明                        |
| ------- | --------------------------- |
| default | 当 content 为空时的内容插槽 |

### 事件

| 事件名 | 说明          | 参数                    |
| ------ | ------------- | ----------------------- |
| expand | 展开/折叠切换 | `{ expanded: boolean }` |

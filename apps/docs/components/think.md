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

### 基础用法

```html
<ak-think
  title="思考过程"
  content="用户询问了关于 AgentKit UI 的信息，我需要介绍其核心特性和使用方式..."
></ak-think>
```

### 加载状态

```html
<ak-think title="深度思考中..." loading></ak-think>
```

### 标题闪烁

配合流式输出，`blink` 属性使标题文本产生闪烁动画效果：

```html
<ak-think title="思考中..." blink loading></ak-think>
```

### 折叠/展开

```html
<!-- 默认展开 -->
<ak-think title="思考过程" content="..." default-expanded></ak-think>

<!-- 默认折叠 -->
<ak-think title="思考过程" content="..." default-expanded="false"></ak-think>

<!-- 受控模式 -->
<ak-think title="思考过程" content="..." expanded="false"></ak-think>
```

### 打字动画

```html
<ak-think
  title="思考中"
  content="这是正在逐字显示的思考内容..."
  typing-speed="20"
></ak-think>
```

### 自定义图标

```html
<!-- 使用 lucide 图标名 -->
<ak-think title="分析中" icon="brain" content="..."></ak-think>
```

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

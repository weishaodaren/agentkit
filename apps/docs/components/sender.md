---
category: Components
group:
  title: 表达
  order: 3
title: Sender
subtitle: 发送框
description: 消息发送输入框，支持多行输入和自动调整高度
---

## 何时使用

- 作为 AI 对话的输入区域
- 支持多行文本输入和自动扩展
- 支持 Enter 或 Shift+Enter 发送
- 支持加载状态（AI 响应中）和取消操作

## 代码演示

### 基础用法 — `value` / `placeholder`

<preview path="./demos/sender-basic.vue" title="基础用法" description="value 设置输入值，placeholder 设置占位文本"></preview>

### 加载状态 — `loading`

<preview path="./demos/sender-loading.vue" title="加载状态" description="loading 状态下发送按钮变为取消按钮，用于中断 AI 响应"></preview>

### 禁用状态 — `disabled`

<preview path="./demos/sender-disabled.vue" title="禁用状态" description="disabled 属性禁用输入框，不可输入和发送"></preview>

### 发送方式 — `submitType`

<preview path="./demos/sender-submit-type.vue" title="发送方式" description="submitType 支持 enter（默认）和 shiftEnter 两种发送方式"></preview>

### 最大行数 — `maxRows`

<preview path="./demos/sender-max-rows.vue" title="最大行数" description="maxRows 属性控制 textarea 最大显示行数，超出后出现滚动条"></preview>

### 前缀插槽 — `prefix`

<preview path="./demos/sender-prefix.vue" title="前缀插槽" description="prefix 插槽用于在输入框左侧放置附件、表情等按钮"></preview>

### 头部面板 — `header` / `SenderHeader`

<preview path="./demos/sender-header.vue" title="头部面板" description="header 插槽配合 Sender.Header 组件实现可折叠面板"></preview>

## API

### Sender

| 属性        | 说明                  | 类型                    | 默认值          |
| ----------- | --------------------- | ----------------------- | --------------- |
| value       | 输入值                | `string`                | `""`            |
| placeholder | 占位文本              | `string`                | `"输入消息..."` |
| loading     | 加载状态（AI 响应中） | `boolean`               | `false`         |
| disabled    | 禁用状态              | `boolean`               | `false`         |
| submitType  | 发送方式              | `enter` \| `shiftEnter` | `enter`         |
| maxRows     | 最大行数              | `number`                | `8`             |

### SenderHeader

| 属性  | 说明     | 类型      | 默认值  |
| ----- | -------- | --------- | ------- |
| title | 面板标题 | `string`  | `""`    |
| open  | 是否展开 | `boolean` | `false` |

### 插槽

| 插槽名  | 说明                     |
| ------- | ------------------------ |
| prefix  | 输入框前缀（如附件按钮） |
| suffix  | 输入框后缀               |
| header  | 可折叠的头部面板         |
| default | 默认插槽                 |

### 事件

| 事件名 | 说明       | 参数                |
| ------ | ---------- | ------------------- |
| submit | 提交消息   | `{ value: string }` |
| change | 输入值变化 | `{ value: string }` |
| cancel | 取消加载   | -                   |

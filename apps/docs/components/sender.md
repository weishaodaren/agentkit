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

### 基础用法

<preview path="./demos/sender-basic.vue" title="基础用法" description="基本的消息发送输入框"></preview>

### 加载状态

<preview path="./demos/sender-loading.vue" title="加载状态" description="loading 状态下的发送框，显示取消按钮"></preview>

### 发送方式

```html
<!-- Enter 发送（默认） -->
<ak-sender submit-type="enter"></ak-sender>

<!-- Shift+Enter 发送 -->
<ak-sender submit-type="shift-enter"></ak-sender>
```

### 最大行数限制

```html
<ak-sender max-rows="4" placeholder="最多显示 4 行"></ak-sender>
```

### 带前缀插槽

```html
<ak-sender>
  <button slot="prefix" title="附件">📎</button>
</ak-sender>
```

### Sender Header 面板

```html
<ak-sender>
  <ak-sender-header slot="header" title="上传文件" open="false">
    <!-- header content -->
  </ak-sender-header>
</ak-sender>
```

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

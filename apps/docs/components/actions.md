---
category: Components
group:
  title: 反馈
  order: 4
title: Actions
subtitle: 操作列表
description: 操作按钮列表，用于消息反馈（复制、点赞等）
---

## 何时使用

- 在 AI 回复消息下方展示操作按钮
- 支持复制、重新生成、点赞/踩等操作
- 支持多种样式变体

## 代码演示

### 基础用法

<preview path="./demos/actions-basic.vue" title="基础用法" description="展示消息操作按钮列表，包含刷新、复制、点赞、踩"></preview>

### 样式变体

```html
<!-- 无边框（默认） -->
<ak-actions variant="borderless" .items="${JSON.stringify([...])}"></ak-actions>

<!-- 填充 -->
<ak-actions variant="filled" .items="${JSON.stringify([...])}"></ak-actions>

<!-- 描边 -->
<ak-actions variant="outlined" .items="${JSON.stringify([...])}"></ak-actions>
```

## API

### Actions

| 属性    | 说明       | 类型                                   | 默认值       |
| ------- | ---------- | -------------------------------------- | ------------ |
| items   | 操作项数据 | `ActionsItem[]`                        | `[]`         |
| variant | 样式变体   | `borderless` \| `filled` \| `outlined` | `borderless` |

### ActionsItem

| 属性     | 说明                | 类型      | 默认值  |
| -------- | ------------------- | --------- | ------- |
| key      | 唯一标识            | `string`  | -       |
| label    | 按钮文本            | `string`  | `""`    |
| icon     | 图标（lucide 名称） | `string`  | -       |
| active   | 激活状态            | `boolean` | `false` |
| disabled | 禁用状态            | `boolean` | `false` |

### 事件

| 事件名       | 说明       | 参数                                 |
| ------------ | ---------- | ------------------------------------ |
| action-click | 点击操作项 | `{ key: string, item: ActionsItem }` |

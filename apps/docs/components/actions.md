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

### 基础用法 — `items`

<preview path="./demos/actions-basic.vue" title="基础用法" description="items 提供操作项数据，包含 key、label、icon 等"></preview>

### 图标与文本 — `items[].icon` / `items[].label`

<preview path="./demos/actions-icon.vue" title="图标与文本" description="icon 设置 lucide 图标，label 设置文本，两者可单独或组合使用"></preview>

### 样式变体 — `variant`

<preview path="./demos/actions-variant.vue" title="样式变体" description="variant 支持 borderless（默认）、filled（填充）、outlined（描边）三种样式"></preview>

### 激活状态 — `items[].active`

<preview path="./demos/actions-active.vue" title="激活状态" description="active 属性高亮按钮，常用于点赞/收藏的选中状态"></preview>

### 禁用状态 — `items[].disabled`

<preview path="./demos/actions-disabled.vue" title="禁用状态" description="disabled 属性禁用按钮，不可点击且显示半透明"></preview>

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

---
category: Components
group:
  title: 表达
  order: 3
title: Suggestion
subtitle: 快捷指令
description: 快捷指令建议列表，支持模糊搜索过滤
---

## 何时使用

- 在输入框上方展示快捷指令建议
- 通过 `/` 前缀触发指令选择
- 支持嵌套子项和模糊搜索过滤

## 代码演示

### 基础用法 — `items` / `open`

<preview path="./demos/suggestion/suggestion-basic.vue" title="基础用法" description="items 提供建议项数据，open 控制是否显示"></preview>

### 过滤筛选 — `filterValue`

<preview path="./demos/suggestion/suggestion-filter.vue" title="过滤筛选" description="filterValue 属性过滤建议项，支持模糊搜索 label 和 value"></preview>

### 嵌套子项 — `items[].children`

<preview path="./demos/suggestion/suggestion-children.vue" title="嵌套子项" description="children 属性支持多级嵌套，点击父项展开子项列表"></preview>

## API

### Suggestion

| 属性        | 说明       | 类型               | 默认值  |
| ----------- | ---------- | ------------------ | ------- |
| items       | 建议项数据 | `SuggestionItem[]` | `[]`    |
| open        | 是否显示   | `boolean`          | `false` |
| filterValue | 过滤关键词 | `string`           | `""`    |

### SuggestionItem

| 属性     | 说明     | 类型               | 默认值 |
| -------- | -------- | ------------------ | ------ |
| key      | 唯一标识 | `string`           | -      |
| label    | 标签文本 | `string`           | -      |
| value    | 选中值   | `string`           | -      |
| children | 嵌套子项 | `SuggestionItem[]` | -      |

### 事件

| 事件名 | 说明       | 参数                                      |
| ------ | ---------- | ----------------------------------------- |
| select | 选中建议项 | `{ value: string, item: SuggestionItem }` |

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

### 基础用法

```html
<ak-suggestion
  open
  .items='${JSON.stringify([
    { key: "report", label: "写一份报告", value: "report" },
    { key: "translate", label: "翻译文本", value: "translate" },
    { key: "summarize", label: "总结内容", value: "summarize" }
  ])}'
></ak-suggestion>
```

### 带过滤

```html
<ak-suggestion
  open
  filter-value="/re"
  .items='${JSON.stringify([
    { key: "report", label: "写一份报告", value: "report" },
    { key: "review", label: "代码审查", value: "review" }
  ])}'
></ak-suggestion>
```

### 嵌套子项

```html
<ak-suggestion
  open
  .items='${JSON.stringify([
    {
      key: "knowledge",
      label: "查阅知识",
      children: [
        { key: "react", label: "关于 React", value: "react" },
        { key: "vue", label: "关于 Vue", value: "vue" }
      ]
    }
  ])}'
></ak-suggestion>
```

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

---
category: Components
group:
  title: 唤醒
  order: 2
title: Prompts
subtitle: 提示集
description: 提示集组件，引导用户快速开始对话
---

## 何时使用

- 在欢迎页面提供快速开始的问题建议
- 支持嵌套子项和多层布局
- 支持禁用状态和图标配置

## 代码演示

### 基础用法

```html
<ak-prompts
  title="我可以帮你："
  .items='${JSON.stringify([
    { key: "1", label: "写一份报告", description: "帮我写一份项目报告" },
    { key: "2", label: "翻译文本", description: "将中文翻译为英文" },
    { key: "3", label: "解释概念", description: "解释量子计算的基本原理" }
  ])}'
></ak-prompts>
```

### 垂直布局

```html
<ak-prompts
  vertical
  title="快速开始"
  .items='${JSON.stringify([
    { key: "1", label: "选项 A", description: "描述 A" },
    { key: "2", label: "选项 B", description: "描述 B" }
  ])}'
></ak-prompts>
```

### 带图标

```html
<ak-prompts
  .items='${JSON.stringify([
    { key: "1", label: "代码分析", icon: "code", description: "分析代码质量" },
    { key: "2", label: "数据分析", icon: "bar-chart", description: "分析数据趋势" }
  ])}'
></ak-prompts>
```

### 嵌套子项

```html
<ak-prompts
  .items='${JSON.stringify([
    {
      key: "1",
      label: "编程",
      icon: "code",
      children: [
        { key: "1-1", label: "React", description: "关于 React 的问题" },
        { key: "1-2", label: "Vue", description: "关于 Vue 的问题" }
      ]
    }
  ])}'
></ak-prompts>
```

## API

### Prompts

| 属性     | 说明             | 类型                     | 默认值  |
| -------- | ---------------- | ------------------------ | ------- |
| items    | 提示项数据       | `PromptsItem[]`          | `[]`    |
| title    | 标题文本         | `string`                 | `""`    |
| vertical | 垂直布局         | `boolean`                | `false` |
| cols     | 列数（网格布局） | `1` \| `2` \| `3` \| `4` | `3`     |
| wrap     | 是否换行         | `boolean`                | `false` |

### PromptsItem

| 属性        | 说明                | 类型            | 默认值  |
| ----------- | ------------------- | --------------- | ------- |
| key         | 唯一标识            | `string`        | -       |
| label       | 标签文本            | `string`        | -       |
| description | 描述文本            | `string`        | -       |
| icon        | 图标（lucide 名称） | `string`        | -       |
| disabled    | 禁用状态            | `boolean`       | `false` |
| children    | 嵌套子项            | `PromptsItem[]` | -       |

### 事件

| 事件名     | 说明       | 参数                    |
| ---------- | ---------- | ----------------------- |
| item-click | 点击提示项 | `{ item: PromptsItem }` |

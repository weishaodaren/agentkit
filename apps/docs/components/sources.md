---
category: Components
group:
  title: 反馈
  order: 4
title: Sources
subtitle: 来源引用
description: 来源引用列表，展示参考来源信息
---

## 何时使用

- 展示 AI 回复的参考来源
- 支持列表和行内两种展示模式
- 显示来源标题、链接和摘要

## 代码演示

### 基础用法

```html
<ak-sources
  .items='${JSON.stringify([
    { key: "1", title: "AgentKit 文档", url: "https://example.com/docs" },
    { key: "2", title: "Lit 官方指南", url: "https://lit.dev/docs" }
  ])}'
></ak-sources>
```

### 自定义标题

```html
<ak-sources title="参考资料" .items="${JSON.stringify([...])}"></ak-sources>
```

### 行内模式

```html
<ak-sources mode="inline" .items="${JSON.stringify([...])}"></ak-sources>
```

## API

### Sources

| 属性  | 说明     | 类型               | 默认值       |
| ----- | -------- | ------------------ | ------------ |
| items | 来源数据 | `SourceItem[]`     | `[]`         |
| title | 标题文本 | `string`           | `"参考来源"` |
| mode  | 展示模式 | `list` \| `inline` | `list`       |

### SourceItem

| 属性    | 说明     | 类型     | 默认值 |
| ------- | -------- | -------- | ------ |
| key     | 唯一标识 | `string` | -      |
| title   | 来源标题 | `string` | -      |
| url     | 来源链接 | `string` | -      |
| summary | 摘要     | `string` | -      |

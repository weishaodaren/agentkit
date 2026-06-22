---
category: Components
group:
  title: 其他
  order: 5
title: XCard
subtitle: 卡片
description: 卡片容器组件，支持多列布局和并发控制
---

## 何时使用

- 以卡片形式展示内容项
- 支持多列网格布局
- 支持并发请求控制和重试机制

## 代码演示

### 基础用法

```html
<ak-x-card
  .items='${JSON.stringify([
    { key: "1", title: "项目 A", description: "描述 A" },
    { key: "2", title: "项目 B", description: "描述 B" }
  ])}'
></ak-x-card>
```

### 多列布局

```html
<ak-x-card columns="3" .items="${JSON.stringify([...])}"></ak-x-card>
```

### 并发控制

```html
<ak-x-card
  max-concurrent="3"
  retry-count="2"
  timeout="5000"
  .items="${JSON.stringify([...])}"
></ak-x-card>
```

## API

### XCard

| 属性          | 说明             | 类型                     | 默认值  |
| ------------- | ---------------- | ------------------------ | ------- |
| items         | 卡片数据         | `XCardItem[]`            | `[]`    |
| columns       | 列数             | `1` \| `2` \| `3` \| `4` | `2`     |
| maxConcurrent | 最大并发请求数   | `number`                 | `5`     |
| retryCount    | 重试次数         | `number`                 | `3`     |
| timeout       | 超时时间（毫秒） | `number`                 | `10000` |

### XCardItem

| 属性        | 说明     | 类型     | 默认值 |
| ----------- | -------- | -------- | ------ |
| key         | 唯一标识 | `string` | -      |
| title       | 卡片标题 | `string` | -      |
| description | 卡片描述 | `string` | -      |

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

<preview path="./demos/sources/sources-basic.vue" title="基础用法" description="展示来源引用列表"></preview>

### 自定义标题 — `title`

<preview path="./demos/sources/sources-title.vue" title="自定义标题" description="title 属性自定义来源列表的标题文本，默认为「参考来源」"></preview>

### 行内模式 — `mode`

<preview path="./demos/sources/sources-inline.vue" title="行内模式" description="mode=inline 时来源以横向滚动卡片展示，适合空间受限场景"></preview>

## API

### Sources

| 属性  | 说明     | 类型               | 默认值       |
| ----- | -------- | ------------------ | ------------ |
| items | 来源数据 | `SourceItem[]`     | `[]`         |
| title | 标题文本 | `string`           | `"参考来源"` |
| mode  | 展示模式 | `list` \| `inline` | `list`       |

### SourceItem

| 属性        | 说明     | 类型     | 默认值 |
| ----------- | -------- | -------- | ------ |
| key         | 唯一标识 | `string` | -      |
| title       | 来源标题 | `string` | -      |
| url         | 来源链接 | `string` | -      |
| description | 摘要描述 | `string` | -      |

### 事件

| 事件名       | 说明       | 参数                                |
| ------------ | ---------- | ----------------------------------- |
| source-click | 点击来源项 | `{ key: string, item: SourceItem }` |

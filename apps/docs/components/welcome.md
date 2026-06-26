---
category: Components
group:
  title: 唤醒
  order: 2
title: Welcome
subtitle: 欢迎
description: 欢迎信息组件，引导用户开始对话
---

## 何时使用

- 在对话开始前展示欢迎信息
- 引导用户了解 AI 助手的能力
- 配合 Prompts 组件提供快速开始选项

## 代码演示

### 基础用法 — `title` / `description`

<preview path="./demos/welcome-basic.vue" title="基础用法" description="title 设置标题，description 设置描述文本"></preview>

### 样式变体 — `variant`

<preview path="./demos/welcome-variant.vue" title="样式变体" description="variant 支持 filled（填充背景，默认）和 borderless（无边框）两种样式"></preview>

### 带图标 — `icon`

<preview path="./demos/welcome-icon.vue" title="带图标" description="icon 属性接受 URL 自动转为 img，也支持 emoji 字符"></preview>

## API

### Welcome

| 属性        | 说明                           | 类型                     | 默认值   |
| ----------- | ------------------------------ | ------------------------ | -------- |
| title       | 标题文本                       | `string`                 | `""`     |
| description | 描述文本                       | `string`                 | `""`     |
| variant     | 样式变体                       | `filled` \| `borderless` | `filled` |
| icon        | 图标（URL 字符串自动转为 img） | `string`                 | `""`     |

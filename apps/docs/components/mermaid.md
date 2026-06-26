---
category: Components
group:
  title: 反馈
  order: 4
title: Mermaid
subtitle: 图表工具
description: Mermaid 图表渲染组件，支持图表/代码双视图和下载
---

## 何时使用

- 在 AI 回复中渲染 Mermaid 图表
- 支持图表视图和代码视图切换
- 支持 SVG 下载功能

## 代码演示

### 基础用法 — `code`

<preview path="./demos/mermaid-basic.vue" title="基础用法" description="code 属性设置 Mermaid 图表代码，默认以图表视图渲染"></preview>

### 视图模式 — `view`

<preview path="./demos/mermaid-view.vue" title="视图模式" description="view 属性支持 image（图表渲染）和 code（原始代码）两种模式"></preview>

### 图表主题 — `theme`

<preview path="./demos/mermaid-theme.vue" title="图表主题" description="theme 属性支持 default、dark、forest、neutral 四种主题"></preview>

## API

### Mermaid

| 属性  | 说明             | 类型                                         | 默认值    |
| ----- | ---------------- | -------------------------------------------- | --------- |
| code  | Mermaid 图表代码 | `string`                                     | `""`      |
| view  | 视图模式         | `image` \| `code`                            | `image`   |
| theme | 图表主题         | `default` \| `dark` \| `forest` \| `neutral` | `default` |

### 依赖

需要在页面中加载 Mermaid 库：

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
```

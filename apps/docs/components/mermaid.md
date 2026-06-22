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

### 基础用法

```html
<ak-mermaid
  code="graph TD&#10;  A[开始] --> B{条件?}&#10;  B -->|是| C[执行]&#10;  B -->|否| D[结束]"
></ak-mermaid>
```

### 代码视图

```html
<ak-mermaid
  view="code"
  code="sequenceDiagram&#10;  A->>B: Hello&#10;  B-->>A: Hi"
></ak-mermaid>
```

### 主题

```html
<!-- 默认主题 -->
<ak-mermaid theme="default" code="..."></ak-mermaid>

<!-- 暗色主题 -->
<ak-mermaid theme="dark" code="..."></ak-mermaid>

<!-- 森林主题 -->
<ak-mermaid theme="forest" code="..."></ak-mermaid>
```

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

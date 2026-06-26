---
category: Components
group:
  title: 反馈
  order: 4
title: Mermaid
subtitle: 图表工具
description: Mermaid 图表渲染组件，支持图表/代码双视图、缩放、复制和下载
---

## 何时使用

- 在 AI 回复中渲染 Mermaid 图表
- 支持图表视图和代码视图切换
- 支持缩放、平移、复制代码、下载 SVG

## 代码演示

### 基础用法 — `code`

<preview path="./demos/mermaid/mermaid-basic.vue" title="基础用法" description="code 属性设置 Mermaid 图表代码，默认以图表视图渲染"></preview>

### 视图模式 — `view`

<preview path="./demos/mermaid/mermaid-view.vue" title="视图模式" description="view 属性支持 image（图表渲染）和 code（原始代码）两种模式"></preview>

### 图表主题 — `theme`

<preview path="./demos/mermaid/mermaid-theme.vue" title="图表主题" description="theme 属性支持 default、dark、forest、neutral 四种主题"></preview>

### 缩放交互 — `actions.enableZoom`

<preview path="./demos/mermaid/mermaid-zoom.vue" title="缩放交互" description="图表视图下默认启用缩放，支持放大/缩小/重置，缩放偏离 100% 时显示重置按钮"></preview>

### 操作栏配置 — `actions`

<preview path="./demos/mermaid/mermaid-actions.vue" title="操作栏配置" description="actions 属性可独立控制缩放、下载、复制三个按钮的显隐，默认全部启用"></preview>

## API

### Mermaid

| 属性    | 说明                                                           | 类型                                                                       | 默认值                                                         |
| ------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
| code    | Mermaid 图表代码                                               | `string`                                                                   | `""`                                                           |
| view    | 视图模式                                                       | `image` \| `code`                                                          | `image`                                                        |
| theme   | 图表主题                                                       | `default` \| `dark` \| `forest` \| `neutral`                               | `default`                                                      |
| actions | 操作栏配置（缩放/下载/复制），各项默认 `true`，1:1 对标 antd-x | `{ enableZoom?: boolean; enableDownload?: boolean; enableCopy?: boolean }` | `{ enableZoom: true, enableDownload: true, enableCopy: true }` |

### 依赖

Mermaid 作为 peer dependency 按需安装，不会打包进 `@agentkit/ui`：

```bash
pnpm add mermaid
```

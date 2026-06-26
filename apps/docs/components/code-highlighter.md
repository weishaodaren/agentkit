---
category: Components
group:
  title: 反馈
  order: 4
title: CodeHighlighter
subtitle: 代码高亮
description: 代码语法高亮显示组件，支持行号和复制功能
---

## 何时使用

- 在 AI 回复中展示代码片段
- 支持多种编程语言的语法高亮
- 内置复制按钮和可选行号

## 代码演示

### 基础用法 — `code` / `language`

<preview path="./demos/code-highlighter/code-highlighter-basic.vue" title="基础用法" description="code 设置代码内容，language 指定编程语言"></preview>

### 多语言支持 — `language`

<preview path="./demos/code-highlighter/code-highlighter-languages.vue" title="多语言支持" description="language 支持 TypeScript、Python、JSON、Bash、CSS、HTML、SQL、YAML、Markdown 等"></preview>

### 行号显示 — `showLineNumbers`

<preview path="./demos/code-highlighter/code-highlighter-line-numbers.vue" title="行号显示" description="showLineNumbers 属性控制是否在代码左侧显示行号"></preview>

### 支持的语言

TypeScript, JavaScript, Python, CSS, HTML, JSON, Bash, SQL, YAML, Markdown

## API

### CodeHighlighter

| 属性            | 说明     | 类型      | 默认值  |
| --------------- | -------- | --------- | ------- |
| code            | 代码内容 | `string`  | `""`    |
| language        | 编程语言 | `string`  | `""`    |
| showLineNumbers | 显示行号 | `boolean` | `false` |

### 事件

| 事件名 | 说明     | 参数               |
| ------ | -------- | ------------------ |
| copy   | 复制代码 | `{ code: string }` |

### 依赖

需要安装 `highlight.js` 作为 peer dependency：

```bash
pnpm add highlight.js
```

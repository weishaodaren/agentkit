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

### 基础用法

```html
<ak-code-highlighter
  language="typescript"
  code="const greeting: string = 'Hello, World!';&#10;console.log(greeting);"
></ak-code-highlighter>
```

### 显示行号

```html
<ak-code-highlighter
  language="python"
  show-line-numbers
  code="def hello():&#10;    print('Hello')&#10;&#10;hello()"
></ak-code-highlighter>
```

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

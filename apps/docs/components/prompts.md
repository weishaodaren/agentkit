---
category: Components
group:
  title: 唤醒
  order: 2
title: Prompts
subtitle: 提示集
description: 提示集组件，展示一组预设问题或建议，引导用户快速开始对话
---

## 何时使用

Prompts 组件用于展示一组与当前上下文相关的预设问题或建议，常用于：

- 在欢迎页面提供快速开始的问题建议
- 支持嵌套子项和多层布局
- 支持禁用状态、图标配置和淡入动画
- 支持垂直布局、自动换行和多列网格

## 代码演示

### 基础用法

<preview path="./demos/prompts/prompts-basic.vue" title="基础用法" description="展示提示集组件，支持标题、描述和点击事件"></preview>

### 禁用状态 — `items[].disabled`

为提示项添加 `disabled` 属性，可禁止点击：

<preview path="./demos/prompts/prompts-disabled.vue" title="禁用状态" description="为提示项添加 disabled 属性后该项不可点击，常用于已使用或不可用的选项"></preview>

### 垂直布局 — `vertical`

使用 `vertical` 属性控制提示集的排列方向为垂直方向：

<preview path="./demos/prompts/prompts-vertical.vue" title="垂直布局" description="vertical 属性使提示项垂直排列"></preview>

### 自动换行 — `wrap`

使用 `wrap` 属性让提示项在空间不足时自动换行：

<preview path="./demos/prompts/prompts-wrap.vue" title="自动换行" description="wrap 属性控制提示项是否自动换行布局"></preview>

### 多列网格 — `columns`

`columns` 控制网格布局的列数，支持 `1` / `2` / `3` / `4`，默认 `2`：

<preview path="./demos/prompts/prompts-columns.vue" title="多列网格" description="columns 属性支持 1/2/3/4 列布局"></preview>

### 嵌套子项 — `items[].children`

每个提示项可包含 `children` 数组，递归渲染嵌套的子提示集：

<preview path="./demos/prompts/prompts-nest.vue" title="嵌套子项" description="children 属性支持递归嵌套，子提示集自动以垂直布局展示"></preview>

### 带图标 — `items[].icon`

通过 `icon` 属性为提示项指定 lucide 图标名称：

<preview path="./demos/prompts/prompts-icon.vue" title="带图标" description="icon 属性接受 lucide 图标名，显示在提示项左侧"></preview>

### 淡入动画 — `fadeIn` / `fadeInLeft`

`fadeIn` 启用淡入动画，`fadeInLeft` 启用从左侧淡入动画。点击按钮重新渲染可观察动画效果：

<preview path="./demos/prompts/prompts-fade-in.vue" title="淡入动画" description="fadeIn 与 fadeInLeft 两种淡入效果，可切换并重新渲染观察动画"></preview>

## API

### Prompts

| 属性       | 说明                                 | 类型                     | 默认值  |
| ---------- | ------------------------------------ | ------------------------ | ------- |
| items      | 提示项数据                           | `PromptsItem[]`          | `[]`    |
| title      | 标题文本                             | `string`                 | `""`    |
| vertical   | 垂直布局                             | `boolean`                | `false` |
| columns    | 网格列数（vertical 为 false 时生效） | `1` \| `2` \| `3` \| `4` | `2`     |
| wrap       | 是否自动换行                         | `boolean`                | `false` |
| fadeIn     | 启用淡入动画                         | `boolean`                | `false` |
| fadeInLeft | 启用从左侧淡入动画                   | `boolean`                | `false` |
| nested     | 是否为嵌套子集（内部使用）           | `boolean`                | `false` |

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

### 与 antd-x 对齐情况

| antd-x 特性             | 状态      | 说明                                          |
| ----------------------- | --------- | --------------------------------------------- |
| `vertical` 垂直布局     | ✅ 已实现 | 控制提示项的排列方向                          |
| `wrap` 自动换行         | ✅ 已实现 | 空间不足时自动换行                            |
| `items[].children` 嵌套 | ✅ 已实现 | 递归渲染子提示集，自动垂直布局                |
| `items[].disabled`      | ✅ 已实现 | 禁用项不可点击                                |
| `items[].icon`          | ✅ 已实现 | 支持 lucide 图标名                            |
| `fadeIn` / `fadeInLeft` | ✅ 已实现 | 两种淡入动画                                  |
| `classNames` / `styles` | 不适用    | Web Components 使用 Shadow DOM + CSS 变量定制 |

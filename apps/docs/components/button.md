---
category: Components
group:
  title: 其他
  order: 5
title: Button
subtitle: 按钮
description: 通用按钮组件
---

## 何时使用

- 触发操作或提交表单
- 支持多种样式变体和尺寸

## 代码演示

### 基础用法 — 默认按钮

<preview path="./demos/button-basic.vue" title="基础用法" description="默认按钮样式，variant=default、size=default"></preview>

### 样式变体 — `variant`

<preview path="./demos/button-variant.vue" title="样式变体" description="variant 支持 default、secondary、outline、ghost、link、destructive 六种变体，以及 disabled 禁用状态"></preview>

### 按钮尺寸 — `size`

<preview path="./demos/button-size.vue" title="按钮尺寸" description="size 支持 default、sm、lg、icon 四种尺寸"></preview>

### 禁用状态 — `disabled`

<preview path="./demos/button-variant.vue" title="禁用状态" description="disabled 属性禁用按钮交互，样式见上方变体示例中的禁用按钮"></preview>

## API

### Button

| 属性     | 说明     | 类型                                                                        | 默认值    |
| -------- | -------- | --------------------------------------------------------------------------- | --------- |
| variant  | 样式变体 | `default` \| `secondary` \| `outline` \| `ghost` \| `link` \| `destructive` | `default` |
| size     | 按钮尺寸 | `default` \| `sm` \| `lg` \| `icon`                                         | `default` |
| disabled | 禁用状态 | `boolean`                                                                   | `false`   |

### 插槽

| 插槽名  | 说明     |
| ------- | -------- |
| default | 按钮内容 |

### 事件

| 事件名 | 说明     | 参数 |
| ------ | -------- | ---- |
| click  | 点击按钮 | -    |

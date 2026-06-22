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

### 基础用法

<preview path="./demos/button-basic.vue" title="基础用法" description="默认按钮样式"></preview>

### 变体

<preview path="./demos/button-variant.vue" title="样式变体" description="支持 default、outline、ghost、destructive 四种变体和禁用状态"></preview>

### 尺寸

```html
<ak-button size="default">默认</ak-button>
<ak-button size="sm">小号</ak-button>
<ak-button size="lg">大号</ak-button>
<ak-button size="icon">图标</ak-button>
```

### 禁用状态

```html
<ak-button disabled>禁用按钮</ak-button>
```

## API

### Button

| 属性     | 说明     | 类型                                               | 默认值    |
| -------- | -------- | -------------------------------------------------- | --------- |
| variant  | 样式变体 | `default` \| `outline` \| `ghost` \| `destructive` | `default` |
| size     | 按钮尺寸 | `default` \| `sm` \| `lg` \| `icon`                | `default` |
| disabled | 禁用状态 | `boolean`                                          | `false`   |

### 插槽

| 插槽名  | 说明     |
| ------- | -------- |
| default | 按钮内容 |

### 事件

| 事件名 | 说明     | 参数 |
| ------ | -------- | ---- |
| click  | 点击按钮 | -    |

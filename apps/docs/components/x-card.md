---
category: Components
group:
  title: 其他
  order: 5
title: XCard
subtitle: 卡片
description: 卡片容器组件，支持多列布局和并发控制
---

## 何时使用

- 以卡片形式展示内容项
- 支持多列网格布局
- 支持并发请求控制和重试机制

## 代码演示

### 基础用法 — `items`

<preview path="./demos/x-card/x-card-basic.vue" title="基础用法" description="items 属性提供卡片数据，默认两列网格布局"></preview>

### 多列布局 — `columns`

<preview path="./demos/x-card/x-card-columns.vue" title="多列布局" description="columns 属性支持 1、2、3、4 列网格布局"></preview>

### 卡片类型 — `type`

<preview path="./demos/x-card/x-card-type.vue" title="卡片类型" description="type 支持 default、info、success、warning、error 五种类型，对应不同边框和背景色"></preview>

### 关闭卡片 — `closable`

<preview path="./demos/x-card/x-card-closable.vue" title="关闭卡片" description="closable 属性显示关闭按钮，点击后隐藏对应卡片"></preview>

### 卡片尺寸 — `size`

<preview path="./demos/x-card/x-card-size.vue" title="卡片尺寸" description="size 支持 small、middle、large 三种尺寸，控制内边距和字体大小"></preview>

### 加载状态 — `loading`

<preview path="./demos/x-card/x-card-loading.vue" title="加载状态" description="loading 属性显示加载动画，适合异步加载场景"></preview>

### 图标与额外信息 — `icon` / `extra` / `disabled`

<preview path="./demos/x-card/x-card-extra.vue" title="图标与额外信息" description="icon 设置 Lucide 图标，extra 在标题栏右侧显示附加文本，disabled 禁用卡片交互"></preview>

## API

### XCard

| 属性          | 说明             | 类型                     | 默认值  |
| ------------- | ---------------- | ------------------------ | ------- |
| items         | 卡片数据         | `XCardItem[]`            | `[]`    |
| columns       | 列数             | `1` \| `2` \| `3` \| `4` | `2`     |
| maxConcurrent | 最大并发请求数   | `number`                 | `5`     |
| retryCount    | 重试次数         | `number`                 | `3`     |
| timeout       | 超时时间（毫秒） | `number`                 | `10000` |

### XCardItem

| 属性     | 说明          | 类型                                                     | 默认值    |
| -------- | ------------- | -------------------------------------------------------- | --------- |
| key      | 唯一标识      | `string`                                                 | -         |
| title    | 卡片标题      | `string`                                                 | -         |
| content  | 卡片内容      | `string`                                                 | -         |
| type     | 卡片类型      | `default` \| `info` \| `success` \| `warning` \| `error` | `default` |
| loading  | 是否加载中    | `boolean`                                                | `false`   |
| closable | 是否可关闭    | `boolean`                                                | `false`   |
| size     | 卡片尺寸      | `small` \| `middle` \| `large`                           | `middle`  |
| disabled | 是否禁用      | `boolean`                                                | `false`   |
| extra    | 额外信息      | `string`                                                 | -         |
| icon     | Lucide 图标名 | `string`                                                 | -         |

### 事件

| 事件名     | 说明         | 参数                               |
| ---------- | ------------ | ---------------------------------- |
| card-close | 关闭卡片     | `{ key: string, item: XCardItem }` |
| card-load  | 加载卡片内容 | `{ key: string, item: XCardItem }` |

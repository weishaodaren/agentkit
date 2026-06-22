---
category: Components
group:
  title: 通用
  order: 0
title: Bubble
subtitle: 消息气泡
description: 聊天气泡组件，用于展示对话消息
---

## 何时使用

- 在 AI 对话场景中展示用户消息和 AI 回复
- 支持多种样式变体（填充、描边、阴影、无边框）
- 支持打字机效果（逐字显示）
- 支持加载状态（等待 AI 回复）

## 代码演示

### 基础用法

<preview path="./demos/bubble-basic.vue" title="基础用法" description="展示基本的消息气泡用法，支持 start/end 两种位置"></preview>

### 样式变体

<preview path="./demos/bubble-variant.vue" title="样式变体" description="Bubble 支持 filled、outlined、shadow、borderless 四种样式变体"></preview>

### 形状

```html
<!-- 默认圆角 -->
<ak-bubble content="default" shape="default" placement="start"></ak-bubble>

<!-- 胶囊形 -->
<ak-bubble content="round" shape="round" placement="start"></ak-bubble>

<!-- 方角 -->
<ak-bubble content="corner" shape="corner" placement="start"></ak-bubble>
```

### 加载状态

<preview path="./demos/bubble-loading.vue" title="加载状态" description="展示加载中的气泡样式，常用于等待 AI 回复"></preview>

### 打字动画

```html
<ak-bubble
  content="这是一段正在打字的内容..."
  typing
  typing-speed="30"
  placement="start"
></ak-bubble>
```

### 流式模式

当配合流式响应使用时，`streaming` 属性会延迟 `typing-complete` 事件的触发，直到流式结束：

```html
<ak-bubble
  content="流式内容逐字增长..."
  typing
  streaming
  placement="start"
></ak-bubble>
```

## API

### Bubble

| 属性            | 说明                             | 类型                                                         | 默认值    |
| --------------- | -------------------------------- | ------------------------------------------------------------ | --------- |
| placement       | 气泡位置                         | `start` \| `end`                                             | `start`   |
| content         | 气泡内容                         | `string`                                                     | `""`      |
| variant         | 样式变体                         | `filled` \| `outlined` \| `shadow` \| `borderless`           | `filled`  |
| shape           | 气泡形状                         | `default` \| `round` \| `corner`                             | `default` |
| loading         | 加载状态                         | `boolean`                                                    | `false`   |
| typing          | 启用打字动画                     | `boolean`                                                    | `false`   |
| typingSpeed     | 打字速度（ms/字符）              | `number`                                                     | `25`      |
| streaming       | 流式模式（延迟 typing-complete） | `boolean`                                                    | `false`   |
| avatar          | 头像图片 URL                     | `string`                                                     | `""`      |
| footerPlacement | 底部插槽位置                     | `outer-start` \| `outer-end` \| `inner-start` \| `inner-end` | `""`      |

### 插槽

| 插槽名  | 说明                                  |
| ------- | ------------------------------------- |
| avatar  | 头像插槽                              |
| header  | 头部插槽                              |
| footer  | 底部插槽                              |
| extra   | 额外内容插槽                          |
| default | 默认内容插槽（当 content 为空时使用） |

### 事件

| 事件名          | 说明               | 参数                  |
| --------------- | ------------------ | --------------------- |
| typing          | 打字过程中逐字触发 | `{ content: string }` |
| typing-complete | 打字动画完成       | `{ content: string }` |

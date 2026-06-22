---
category: Components
group:
  title: 通用
  order: 0
title: Conversations
subtitle: 会话管理
description: 会话列表组件，支持分组、虚拟滚动和键盘导航
---

## 何时使用

- 展示对话历史列表
- 支持按时间分组显示
- 使用虚拟列表渲染大量会话项
- 支持键盘快捷键导航

## 代码演示

### 基础用法

<preview path="./demos/conversations-basic.vue" title="基础用法" description="支持分组的会话列表，使用虚拟滚动渲染"></preview>

### 新建对话按钮

```html
<ak-conversations creation creation-label="新建对话"></ak-conversations>
```

## API

### Conversations

| 属性          | 说明               | 类型                 | 默认值       |
| ------------- | ------------------ | -------------------- | ------------ |
| items         | 会话列表数据       | `ConversationItem[]` | `[]`         |
| title         | 列表标题           | `string`             | `"对话列表"` |
| activeKey     | 当前选中的会话 key | `string`             | `""`         |
| groupable     | 启用分组模式       | `boolean`            | `false`      |
| creation      | 显示新建对话按钮   | `boolean`            | `false`      |
| creationLabel | 新建按钮文本       | `string`             | `"新对话"`   |
| shortcutKeys  | 启用键盘导航       | `boolean`            | `false`      |

### ConversationItem

| 属性      | 说明                          | 类型      | 默认值  |
| --------- | ----------------------------- | --------- | ------- |
| key       | 唯一标识                      | `string`  | -       |
| label     | 显示文本                      | `string`  | -       |
| group     | 分组标签                      | `string`  | -       |
| icon      | 自定义图标                    | `string`  | -       |
| disabled  | 禁用状态                      | `boolean` | `false` |
| active    | 是否选中（由 activeKey 控制） | `boolean` | -       |
| timestamp | 时间戳                        | `string`  | -       |

### 事件

| 事件名             | 说明         | 参数                                      |
| ------------------ | ------------ | ----------------------------------------- |
| conversation-click | 点击会话项   | `{ key: string, item: ConversationItem }` |
| create             | 点击新建按钮 | -                                         |

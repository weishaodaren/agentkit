---
category: Components
group:
  title: 确认
  order: 1
title: ThoughtChain
subtitle: 思维链
description: 展示推理步骤的思维链组件
---

## 何时使用

- 展示 AI 的推理步骤和中间过程
- 多个推理步骤并行展示
- 支持打字动画和折叠控制

## 代码演示

### 基础用法

<preview path="./demos/thought-chain-basic.vue" title="基础用法" description="展示 AI 推理步骤，支持 success/running/pending/error 状态"></preview>

### 可折叠

```html
<ak-thought-chain
  collapsible
  .items='${JSON.stringify([
    { key: "1", title: "步骤 1", description: "第一步分析", status: "success" },
    { key: "2", title: "步骤 2", description: "第二步分析", status: "success" }
  ])}'
></ak-thought-chain>
```

### 连接线样式

```html
<!-- 实线（默认） -->
<ak-thought-chain
  line-style="solid"
  .items="${JSON.stringify([...])}"
></ak-thought-chain>

<!-- 虚线 -->
<ak-thought-chain
  line-style="dashed"
  .items="${JSON.stringify([...])}"
></ak-thought-chain>

<!-- 点线 -->
<ak-thought-chain
  line-style="dotted"
  .items="${JSON.stringify([...])}"
></ak-thought-chain>
```

## API

### ThoughtChain

| 属性        | 说明                          | 类型                            | 默认值  |
| ----------- | ----------------------------- | ------------------------------- | ------- |
| items       | 思维链数据                    | `ThoughtChainItem[]`            | `[]`    |
| collapsible | 启用折叠功能                  | `boolean`                       | `false` |
| collapsed   | 默认折叠状态                  | `boolean`                       | `false` |
| typingSpeed | 打字速度（ms/字符），0 为禁用 | `number`                        | `20`    |
| lineStyle   | 连接线样式                    | `solid` \| `dashed` \| `dotted` | `solid` |
| itemVariant | 项目变体                      | `solid` \| `outlined`           | `solid` |

### ThoughtChainItem

| 属性        | 说明                     | 类型                                           | 默认值 |
| ----------- | ------------------------ | ---------------------------------------------- | ------ |
| key         | 唯一标识                 | `string`                                       | -      |
| title       | 步骤标题                 | `string`                                       | -      |
| description | 步骤描述（支持打字动画） | `string`                                       | -      |
| status      | 步骤状态                 | `pending` \| `running` \| `success` \| `error` | -      |
| icon        | 自定义图标（lucide）     | `string`                                       | -      |
| content     | 额外内容                 | `string`                                       | -      |
| footer      | 底部内容                 | `string`                                       | -      |

### 事件

| 事件名 | 说明          | 参数                     |
| ------ | ------------- | ------------------------ |
| toggle | 折叠/展开切换 | `{ collapsed: boolean }` |

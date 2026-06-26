---
category: Components
group:
  title: 确认
  order: 1
title: ThoughtChain
subtitle: 思维链
description: 展示 AI 推理步骤的思维链组件，1:1 对标 antd-x ThoughtChain
---

## 何时使用

- 展示 AI 的推理步骤和中间过程
- 多个推理步骤并行展示
- 调试和追踪复杂 Agent 系统中的调用链

## 代码演示

### 基础用法 — `items`

<preview path="./demos/thought-chain/thought-chain-basic.vue" title="基础用法" description="items 属性接受 ThoughtChainItem[] 数组，包含 key、title、description、status 等"></preview>

### 节点状态 — `items[].status`

<preview path="./demos/thought-chain/thought-chain-status.vue" title="节点状态" description="status 支持 pending、loading、running、success、error、abort 六种状态"></preview>

### 自定义图标 — `items[].icon`

<preview path="./demos/thought-chain/thought-chain-icon.vue" title="自定义图标" description="icon 属性接受 lucide 图标名，覆盖默认状态图标和序号"></preview>

### 闪烁动画 — `items[].blink`

<preview path="./demos/thought-chain/thought-chain-blink.vue" title="闪烁动画" description="blink 属性为标题添加渐变扫光效果，常配合 loading 状态使用"></preview>

### 逐节点折叠 — `items[].collapsible`

<preview path="./demos/thought-chain/thought-chain-item-collapsible.vue" title="逐节点可折叠" description="每个节点可独立设置 collapsible，点击标题展开/收起 content 内容"></preview>

### 受控展开 — `expandedKeys` / `defaultExpandedKeys`

<preview path="./demos/thought-chain/thought-chain-expanded-keys.vue" title="受控展开" description="expandedKeys 受控控制展开节点，defaultExpandedKeys 非受控设置默认展开"></preview>

### 全局折叠 — `collapsible`

<preview path="./demos/thought-chain/thought-chain-collapsible.vue" title="全局可折叠" description="collapsible 属性启用全局折叠按钮，可收起整个思维链"></preview>

### 默认折叠 — `collapsed`

<preview path="./demos/thought-chain/thought-chain-collapsed.vue" title="默认折叠" description="collapsed 属性配合 collapsible 使用，使思维链默认处于折叠状态"></preview>

### 连接线样式 — `lineStyle`

<preview path="./demos/thought-chain/thought-chain-line-style.vue" title="连接线样式" description="lineStyle 支持 solid（实线）、dashed（虚线）、dotted（点线）三种样式"></preview>

### 隐藏连接线 — `line`

<preview path="./demos/thought-chain/thought-chain-line-false.vue" title="隐藏连接线" description="line 属性设为 false 可完全隐藏节点间的连接线"></preview>

### 打字动画 — `typingSpeed`

<preview path="./demos/thought-chain/thought-chain-typing.vue" title="打字动画" description="typingSpeed 控制描述的逐字显示速度（ms/字符），设为 0 禁用"></preview>

## API

### ThoughtChain

| 属性                | 说明                                  | 类型                            | 默认值  |
| ------------------- | ------------------------------------- | ------------------------------- | ------- |
| items               | 思维链节点数据                        | `ThoughtChainItem[]`            | `[]`    |
| collapsible         | 启用全局折叠功能                      | `boolean`                       | `false` |
| collapsed           | 全局默认折叠状态                      | `boolean`                       | `false` |
| typingSpeed         | 打字动画速度（ms/字符），0 为禁用     | `number`                        | `20`    |
| lineStyle           | 连接线样式                            | `solid` \| `dashed` \| `dotted` | `solid` |
| line                | 是否显示连接线                        | `boolean`                       | `true`  |
| expandedKeys        | 受控展开的节点 key 数组（逐节点折叠） | `string[]` \| `null`            | `null`  |
| defaultExpandedKeys | 默认展开的节点 key 数组（非受控）     | `string[]`                      | `[]`    |

### ThoughtChainItem

| 属性        | 说明                                           | 类型                                                                   | 默认值  |
| ----------- | ---------------------------------------------- | ---------------------------------------------------------------------- | ------- |
| key         | 唯一标识                                       | `string`                                                               | -       |
| title       | 步骤标题                                       | `string`                                                               | -       |
| description | 步骤描述（支持打字动画）                       | `string`                                                               | -       |
| status      | 步骤状态                                       | `pending` \| `loading` \| `running` \| `success` \| `error` \| `abort` | -       |
| icon        | 自定义图标（lucide 名称），覆盖默认状态图标    | `string`                                                               | -       |
| content     | 额外内容（collapsible 为 true 时可折叠）       | `string`                                                               | -       |
| footer      | 底部内容                                       | `string`                                                               | -       |
| collapsible | 逐节点可折叠（点击标题展开/收起 content）      | `boolean`                                                              | `false` |
| blink       | 标题渐变扫光动画（与 antd-x Think blink 一致） | `boolean`                                                              | `false` |

### 事件

| 事件名 | 说明              | 参数                                 |
| ------ | ----------------- | ------------------------------------ |
| toggle | 全局折叠/展开切换 | `{ collapsed: boolean }`             |
| expand | 逐节点展开/收起   | `{ key: string, expanded: boolean }` |

### 与 antd-x 对齐情况

| antd-x 特性                            | 状态      | 说明                                          |
| -------------------------------------- | --------- | --------------------------------------------- |
| 逐节点 `collapsible`                   | ✅ 已实现 | 每个节点可独立设置 collapsible，点击标题折叠  |
| 逐节点 `blink`                         | ✅ 已实现 | 渐变扫光动画，与 Think 组件一致               |
| `expandedKeys` / `defaultExpandedKeys` | ✅ 已实现 | 支持受控和非受控两种模式                      |
| `status: 'abort'`                      | ✅ 已实现 | 中止状态，显示 circle-minus 图标              |
| `status: 'loading'`                    | ✅ 已实现 | 加载状态，图标旋转动画                        |
| `line: false` 隐藏连接线               | ✅ 已实现 | `line` 属性控制连接线显示                     |
| 连接线 `::after` 伪元素                | ✅ 已实现 | 与 antd-x 完全一致的实现方式                  |
| 默认序号图标                           | ✅ 已实现 | 无 status 时显示序号数字（带圆形背景）        |
| `classNames` / `styles`                | 不适用    | Web Components 使用 Shadow DOM + CSS 变量定制 |

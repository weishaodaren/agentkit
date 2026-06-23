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

### 基础用法

<preview path="./demos/thought-chain-basic.vue" title="基础用法" description="展示基本的思维链节点，包含标题和描述"></preview>

### status — 节点状态

支持 `success`、`loading`、`pending`、`error`、`abort` 五种状态。`loading` 状态图标会旋转，无状态时显示序号数字：

<preview path="./demos/thought-chain-status.vue" title="节点状态" description="success(绿色)、loading(蓝色旋转)、pending(灰色)、error(红色)、abort(灰色)"></preview>

```html
<ak-thought-chain
  .items='${JSON.stringify([
    { key: "1", title: "已完成步骤", status: "success" },
    { key: "2", title: "正在执行", status: "loading" },
    { key: "3", title: "等待中", status: "pending" },
    { key: "4", title: "执行失败", status: "error" },
    { key: "5", title: "已中止", status: "abort" }
  ])}'
></ak-thought-chain>
```

### blink — 闪烁动画

`blink` 属性为节点标题添加渐变扫光动画（与 antd-x Think 组件一致），常用于表示正在思考的节点：

<preview path="./demos/thought-chain-blink.vue" title="闪烁动画" description="blink 属性为标题添加渐变扫光效果，常配合 loading 状态使用"></preview>

```html
<ak-thought-chain
  .items='${JSON.stringify([
    { key: "1", title: "分析需求", status: "success" },
    { key: "2", title: "搜索资料", status: "success" },
    { key: "3", title: "正在思考", status: "loading", blink: true }
  ])}'
></ak-thought-chain>
```

### 逐节点 collapsible — 可折叠内容

每个节点可独立设置 `collapsible: true`，点击标题展开/收起 `content` 内容：

<preview path="./demos/thought-chain-item-collapsible.vue" title="逐节点可折叠" description="每个节点可独立折叠，点击标题展开 content 内容"></preview>

```html
<ak-thought-chain
  .items='${JSON.stringify([
    {
      key: "1", title: "分析需求", status: "success",
      collapsible: true,
      content: "用户需要一个 AI 对话界面"
    },
    {
      key: "2", title: "搜索资料", status: "success",
      collapsible: true,
      content: "找到 3 篇相关文档"
    }
  ])}'
></ak-thought-chain>
```

### 全局 collapsible — 折叠整个思维链

启用全局 `collapsible` 后，显示折叠/展开按钮，收起整个思维链：

<preview path="./demos/thought-chain-collapsible.vue" title="全局可折叠" description="启用 collapsible 属性后显示折叠按钮"></preview>

### line-style — 连接线样式

`lineStyle` 控制节点间连接线的样式，支持 `solid`、`dashed`、`dotted`。设置 `line="false"` 可隐藏连接线：

<preview path="./demos/thought-chain-line-style.vue" title="连接线样式" description="solid / dashed / dotted 三种连接线样式对比"></preview>

```html
<!-- 实线（默认） -->
<ak-thought-chain line-style="solid" .items="..."></ak-thought-chain>

<!-- 虚线 -->
<ak-thought-chain line-style="dashed" .items="..."></ak-thought-chain>

<!-- 点线 -->
<ak-thought-chain line-style="dotted" .items="..."></ak-thought-chain>

<!-- 隐藏连接线 -->
<ak-thought-chain :line="false" .items="..."></ak-thought-chain>
```

### typing-speed — 打字动画

`typingSpeed` 控制描述的打字动画速度（毫秒/字符），设为 `0` 禁用：

<preview path="./demos/thought-chain-typing.vue" title="打字动画" description="description 文字逐字显示，typingSpeed 控制速度"></preview>

### content / footer — 额外内容

每个节点支持 `content`（可折叠内容）和 `footer`（底部内容）：

```html
<ak-thought-chain
  .items='${JSON.stringify([
    {
      key: "1",
      title: "创建任务",
      description: "执行创建新组件所需文件",
      content: "mkdir -p component",
      footer: "文件夹已创建",
      status: "success"
    }
  ])}'
></ak-thought-chain>
```

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

---

category: Components
group:
title: 确认
order: 1
title: ThoughtChain
subtitle: 思维链
description: 展示 AI 推理步骤的思维链组件，用于可视化和追踪 Agent 到 Actions/Tools 的调用链

---

## 何时使用

- 调试和追踪复杂 Agent 系统中的调用链
- 展示 AI 的推理步骤和中间过程
- 类似的链式场景

## 代码演示

### 基础用法

<preview path="./demos/thought-chain-basic.vue" title="基础用法" description="展示基本的思维链节点，包含标题和描述"></preview>

### items — 节点数据

`items` 属性接受 `ThoughtChainItem[]` 数组，每个节点包含 `key`、`title`、`description` 等字段：

```html
<ak-thought-chain
  .items='${JSON.stringify([
  { key: "1", title: "知识查询", description: "查询知识库" },
  { key: "2", title: "Web 搜索", description: "工具调用" },
  { key: "3", title: "模型调用完成", description: "调用模型获取响应" }
])}'
>
</ak-thought-chain>
```

### status — 节点状态

每个节点支持 `pending`、`running`、`success`、`error` 四种状态，不同状态显示不同的图标和颜色：

<preview path="./demos/thought-chain-status.vue" title="节点状态" description="pending(灰色)、running(蓝色)、success(绿色)、error(红色)"></preview>

```html
<ak-thought-chain
  .items='${JSON.stringify([
  { key: "1", title: "已完成步骤", status: "success" },
  { key: "2", title: "正在执行", status: "running" },
  { key: "3", title: "等待中", status: "pending" },
  { key: "4", title: "执行失败", status: "error" }
])}'
>
</ak-thought-chain>
```

### icon — 自定义图标

通过 `icon` 属性为节点指定 lucide 图标名称，覆盖默认的状态图标：

```html
<ak-thought-chain
  .items='${JSON.stringify([
  { key: "1", title: "搜索知识", icon: "search", status: "success" },
  { key: "2", title: "分析数据", icon: "bar-chart", status: "running" },
  { key: "3", title: "生成报告", icon: "file-text", status: "pending" }
])}'
>
</ak-thought-chain>
```

### collapsible — 可折叠

启用 `collapsible` 后，显示折叠/展开按钮，可以收起思维链内容：

<preview path="./demos/thought-chain-collapsible.vue" title="可折叠" description="启用 collapsible 属性后显示折叠按钮"></preview>

```html
<ak-thought-chain
  collapsible
  .items='${JSON.stringify([
  { key: "1", title: "步骤 1", description: "创建组件文件夹", status: "success" },
  { key: "2", title: "步骤 2", description: "创建 index.tsx", status: "success" },
  { key: "3", title: "步骤 3", description: "创建文档", status: "success" }
])}'
>
</ak-thought-chain>
```

### collapsed — 默认折叠

配合 `collapsible` 使用，设置 `collapsed` 使思维链默认处于折叠状态：

```html
<ak-thought-chain
  collapsible
  collapsed
  .items='${JSON.stringify([
  { key: "1", title: "步骤 1", description: "描述 1", status: "success" },
  { key: "2", title: "步骤 2", description: "描述 2", status: "success" }
])}'
>
</ak-thought-chain>
```

### lineStyle — 连接线样式

`lineStyle` 控制节点间连接线的样式，支持 `solid`（实线，默认）、`dashed`（虚线）、`dotted`（点线）：

<preview path="./demos/thought-chain-line-style.vue" title="连接线样式" description="solid / dashed / dotted 三种连接线样式对比"></preview>

```html
<!-- 实线（默认） -->
<ak-thought-chain line-style="solid" .items="..."></ak-thought-chain>

<!-- 虚线 -->
<ak-thought-chain line-style="dashed" .items="..."></ak-thought-chain>

<!-- 点线 -->
<ak-thought-chain line-style="dotted" .items="..."></ak-thought-chain>
```

### itemVariant — 节点变体

`itemVariant` 控制节点的视觉风格，支持 `solid`（实心，默认）和 `outlined`（描边）：

```html
<!-- 实心（默认） -->
<ak-thought-chain item-variant="solid" .items="..."></ak-thought-chain>

<!-- 描边 -->
<ak-thought-chain item-variant="outlined" .items="..."></ak-thought-chain>
```

### typingSpeed — 打字动画速度

`typingSpeed` 控制描述的打字动画速度（毫秒/字符），设为 `0` 禁用打字动画：

<preview path="./demos/thought-chain-typing.vue" title="打字动画" description="description 文字逐字显示，typingSpeed 控制速度"></preview>

```html
<!-- 20ms/字符（默认） -->
<ak-thought-chain typing-speed="20" .items="..."></ak-thought-chain>

<!-- 禁用打字动画 -->
<ak-thought-chain typing-speed="0" .items="..."></ak-thought-chain>
```

### content / footer — 额外内容

每个节点支持 `content`（额外内容）和 `footer`（底部内容）字段：

```html
<ak-thought-chain
  .items='${JSON.stringify([
  {
    key: "1",
    title: "创建任务",
    description: "执行创建新组件所需文件",
    content: "mkdir -p component",
    footer: "文件夹已创建",
    status: "success"
  }
])}'
>
</ak-thought-chain>
```

## API

### ThoughtChain

| 属性        | 说明                              | 类型                            | 默认值  |
| ----------- | --------------------------------- | ------------------------------- | ------- |
| items       | 思维链节点数据                    | `ThoughtChainItem[]`            | `[]`    |
| collapsible | 启用折叠功能                      | `boolean`                       | `false` |
| collapsed   | 默认折叠状态                      | `boolean`                       | `false` |
| typingSpeed | 打字动画速度（ms/字符），0 为禁用 | `number`                        | `20`    |
| lineStyle   | 连接线样式                        | `solid` \| `dashed` \| `dotted` | `solid` |
| itemVariant | 节点变体                          | `solid` \| `outlined`           | `solid` |

### ThoughtChainItem

| 属性        | 说明                                        | 类型                                           | 默认值 |
| ----------- | ------------------------------------------- | ---------------------------------------------- | ------ |
| key         | 唯一标识                                    | `string`                                       | -      |
| title       | 步骤标题                                    | `string`                                       | -      |
| description | 步骤描述（支持打字动画）                    | `string`                                       | -      |
| status      | 步骤状态                                    | `pending` \| `running` \| `success` \| `error` | -      |
| icon        | 自定义图标（lucide 名称），覆盖默认状态图标 | `string`                                       | -      |
| content     | 额外内容                                    | `string`                                       | -      |
| footer      | 底部内容                                    | `string`                                       | -      |

### 事件

| 事件名 | 说明          | 参数                     |
| ------ | ------------- | ------------------------ |
| toggle | 折叠/展开切换 | `{ collapsed: boolean }` |

### 与 antd-x 差异

| antd-x 特性                            | 当前状态  | 说明                                          |
| -------------------------------------- | --------- | --------------------------------------------- |
| 逐节点 `collapsible`                   | ❌ 未实现 | antd-x 支持每个节点独立折叠，我们仅有全局折叠 |
| 逐节点 `blink`                         | ❌ 未实现 | antd-x 支持每个节点独立的闪烁动画             |
| `expandedKeys` / `defaultExpandedKeys` | ❌ 未实现 | antd-x 支持逐节点展开控制                     |
| `status: 'abort'`                      | ❌ 未实现 | antd-x 有 abort 状态，我们用 error 替代       |
| `line: false` 隐藏连接线               | ❌ 未实现 | antd-x 支持 `false` 隐藏连接线                |
| Item `variant: 'text'`                 | ❌ 未实现 | antd-x 支持 text 变体                         |
| `classNames` / `styles`                | 不适用    | Web Components 使用 Shadow DOM + CSS 变量定制 |

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

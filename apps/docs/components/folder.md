---
category: Components
group:
  title: 反馈
  order: 4
title: Folder
subtitle: 文件树
description: 文件树组件，支持展开/折叠和文件预览
---

## 何时使用

- 展示项目文件结构
- 支持树形目录的展开/折叠
- 支持选中文件并显示预览内容

## 代码演示

### 基础用法

```html
<ak-folder
  .items='${JSON.stringify([
    { key: "src", label: "src", children: [
      { key: "index.ts", label: "index.ts" },
      { key: "app.tsx", label: "App.tsx" }
    ]},
    { key: "package.json", label: "package.json" }
  ])}'
></ak-folder>
```

### 选中文件

```html
<ak-folder active-key="index.ts" .items="${JSON.stringify([...])}"></ak-folder>
```

### 自定义宽度

```html
<ak-folder tree-width="280" .items="${JSON.stringify([...])}"></ak-folder>
```

## API

### Folder

| 属性      | 说明               | 类型           | 默认值 |
| --------- | ------------------ | -------------- | ------ |
| items     | 文件树数据         | `FolderItem[]` | `[]`   |
| activeKey | 当前选中的文件 key | `string`       | `""`   |
| treeWidth | 目录树宽度（px）   | `number`       | `220`  |
| preview   | 显示文件预览       | `boolean`      | `true` |

### FolderItem

| 属性     | 说明     | 类型           | 默认值 |
| -------- | -------- | -------------- | ------ |
| key      | 唯一标识 | `string`       | -      |
| label    | 显示文本 | `string`       | -      |
| children | 子项     | `FolderItem[]` | -      |

### 事件

| 事件名 | 说明     | 参数                                |
| ------ | -------- | ----------------------------------- |
| select | 选中文件 | `{ key: string, item: FolderItem }` |

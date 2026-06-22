---
category: Components
group:
  title: 表达
  order: 3
title: Attachments
subtitle: 输入附件
description: 文件附件上传组件，支持拖拽和点击上传
---

## 何时使用

- 在发送框中添加文件上传功能
- 支持拖拽文件到上传区域
- 支持文件类型限制和数量限制

## 代码演示

### 基础用法

```html
<ak-attachments placeholder="拖拽文件到此处，或点击上传"></ak-attachments>
```

### 限制文件类型

```html
<ak-attachments accept="image/*,.pdf,.docx"></ak-attachments>
```

### 多文件上传

```html
<ak-attachments multiple max-count="5"></ak-attachments>
```

### 带已有文件列表

```javascript
const el = document.querySelector("ak-attachments");
el.files = [
  { name: "report.pdf", size: 1024000, status: "done" },
  { name: "photo.png", size: 2048000, status: "uploading", progress: 60 },
];
```

## API

### Attachments

| 属性        | 说明                     | 类型               | 默认值                         |
| ----------- | ------------------------ | ------------------ | ------------------------------ |
| files       | 文件列表                 | `AttachmentFile[]` | `[]`                           |
| accept      | 允许的文件类型           | `string`           | `""`                           |
| multiple    | 允许多文件上传           | `boolean`          | `false`                        |
| maxCount    | 最大文件数量，0 为不限制 | `number`           | `0`                            |
| placeholder | 占位文本                 | `string`           | `"拖拽文件到此处，或点击上传"` |

### AttachmentFile

| 属性     | 说明              | 类型                                          | 默认值 |
| -------- | ----------------- | --------------------------------------------- | ------ |
| name     | 文件名            | `string`                                      | -      |
| size     | 文件大小（字节）  | `number`                                      | -      |
| status   | 上传状态          | `pending` \| `uploading` \| `done` \| `error` | -      |
| progress | 上传进度（0-100） | `number`                                      | -      |
| type     | 文件类型          | `string`                                      | -      |
| file     | 原始 File 对象    | `File`                                        | -      |

### 事件

| 事件名 | 说明     | 参数                          |
| ------ | -------- | ----------------------------- |
| upload | 文件上传 | `{ files: AttachmentFile[] }` |
| remove | 移除文件 | `{ index: number }`           |

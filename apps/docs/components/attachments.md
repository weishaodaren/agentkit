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

### 基础用法 — `placeholder` / `multiple`

<preview path="./demos/attachments-basic.vue" title="基础用法" description="placeholder 设置占位文本，multiple 启用多文件上传"></preview>

### 占位文本 — `placeholder`

<preview path="./demos/attachments-placeholder.vue" title="占位文本" description="placeholder 属性自定义上传区域的提示文本"></preview>

### 文件类型 — `accept`

<preview path="./demos/attachments-accept.vue" title="文件类型" description="accept 属性限制可上传的文件类型，如 image/* 或 .pdf,.docx"></preview>

### 数量限制 — `maxCount`

<preview path="./demos/attachments-max-count.vue" title="数量限制" description="maxCount 属性限制最大文件数量，达到上限后隐藏上传区域"></preview>

### 文件列表 — `files`

<preview path="./demos/attachments-files.vue" title="文件列表" description="files 属性设置已有文件列表，展示 done、uploading、error 三种状态"></preview>

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

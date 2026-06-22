---
category: Components
group:
  title: 反馈
  order: 4
title: FileCard
subtitle: 文件卡片
description: 文件预览卡片，显示文件名、大小、状态和进度
---

## 何时使用

- 展示上传的文件信息
- 显示文件上传进度
- 支持图片预览和缩略图
- 支持可移除操作

## 代码演示

### 基础用法

```html
<ak-file-card name="report.pdf" size="1048576" status="done"></ak-file-card>
```

### 上传中

```html
<ak-file-card
  name="photo.png"
  size="2097152"
  status="uploading"
  progress="65"
></ak-file-card>
```

### 图片文件

```html
<ak-file-card
  name="screenshot.png"
  size="512000"
  status="done"
  type="image"
  thumb="https://example.com/thumb.png"
></ak-file-card>
```

### 可移除

```html
<ak-file-card name="doc.pdf" size="1024" status="done" removable></ak-file-card>
```

## API

### FileCard

| 属性      | 说明              | 类型                                          | 默认值  |
| --------- | ----------------- | --------------------------------------------- | ------- |
| name      | 文件名            | `string`                                      | `""`    |
| size      | 文件大小（字节）  | `number`                                      | `0`     |
| status    | 上传状态          | `pending` \| `uploading` \| `done` \| `error` | `done`  |
| progress  | 上传进度（0-100） | `number`                                      | `0`     |
| removable | 显示移除按钮      | `boolean`                                     | `false` |
| type      | 文件类型          | `image` \| `video` \| `audio` \| `file`       | `file`  |
| thumb     | 缩略图 URL        | `string`                                      | `""`    |
| mask      | 显示遮罩          | `boolean`                                     | `false` |

### 事件

| 事件名 | 说明     | 参数 |
| ------ | -------- | ---- |
| remove | 移除文件 | -    |
| click  | 点击卡片 | -    |

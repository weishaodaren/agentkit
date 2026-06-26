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

### 基础用法 — `name` / `size` / `removable`

<preview path="./demos/file-card/file-card-basic.vue" title="基础用法" description="name 设置文件名，size 设置文件大小，removable 显示移除按钮"></preview>

### 上传状态 — `status`

<preview path="./demos/file-card/file-card-status.vue" title="上传状态" description="status 支持 done、pending、uploading、error 四种状态"></preview>

### 上传进度 — `progress`

<preview path="./demos/file-card/file-card-progress.vue" title="上传进度" description="status=uploading 时 progress 属性控制进度条宽度（0-100）"></preview>

### 图片缩略图 — `type` / `thumb`

<preview path="./demos/file-card/file-card-image.vue" title="图片缩略图" description="type=image/video 时 thumb 属性显示缩略图，type=file 显示文件图标"></preview>

### 悬停遮罩 — `mask`

<preview path="./demos/file-card/file-card-mask.vue" title="悬停遮罩" description="mask 属性在鼠标悬停缩略图时显示遮罩层"></preview>

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

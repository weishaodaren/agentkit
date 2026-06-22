---
category: Components
group:
  title: 通用
  order: 0
title: Notification
subtitle: 系统通知
description: 全局通知提示组件，支持多种类型和位置
---

## 何时使用

- 在操作完成后给用户反馈
- 显示成功、警告、错误、信息等类型的通知
- 支持自动消失和手动关闭

## 代码演示

### 基础用法

<preview path="./demos/notification-basic.vue" title="基础用法" description="支持 info、success、warning、error 四种通知类型"></preview>

### 通知类型

```javascript
// 信息
notif.open({ title: "提示", description: "这是一条信息", type: "info" });

// 成功
notif.open({ title: "成功", description: "操作已完成", type: "success" });

// 警告
notif.open({ title: "警告", description: "请注意检查", type: "warning" });

// 错误
notif.open({ title: "错误", description: "操作失败", type: "error" });
```

### 自定义持续时间

```javascript
notif.open({
  title: "自定义时长",
  description: "5 秒后消失",
  type: "info",
  duration: 5000, // 毫秒
});
```

## API

### Notification

| 属性      | 说明         | 类型                                                         | 默认值      |
| --------- | ------------ | ------------------------------------------------------------ | ----------- |
| placement | 通知出现位置 | `top-right` \| `top-left` \| `bottom-right` \| `bottom-left` | `top-right` |

### 命令式方法

#### `open(options: NotificationOptions)`

显示一条通知。

### NotificationOptions

| 属性        | 说明                                   | 类型                                        | 默认值 |
| ----------- | -------------------------------------- | ------------------------------------------- | ------ |
| key         | 唯一标识（用于更新已有通知）           | `string`                                    | -      |
| title       | 通知标题                               | `string`                                    | -      |
| description | 通知描述                               | `string`                                    | -      |
| type        | 通知类型                               | `info` \| `success` \| `warning` \| `error` | `info` |
| duration    | 自动关闭时间（毫秒），0 表示不自动关闭 | `number`                                    | `4500` |

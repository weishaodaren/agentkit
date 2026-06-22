# 组件总览

AgentKit UI 基于 RICH 交互范式，提供覆盖 AI 对话全场景的原子组件。

## 组件分类

### 通用

| 组件                                       | 标签名               | 说明                                       |
| ------------------------------------------ | -------------------- | ------------------------------------------ |
| [Bubble](/components/bubble)               | `<ak-bubble>`        | 消息气泡，支持多种样式、打字动画、加载状态 |
| [Conversations](/components/conversations) | `<ak-conversations>` | 会话列表管理，支持分组、虚拟滚动           |
| [Notification](/components/notification)   | `<ak-notification>`  | 全局通知提示，支持多种类型和位置           |

### 确认

| 组件                                      | 标签名               | 说明                                  |
| ----------------------------------------- | -------------------- | ------------------------------------- |
| [Think](/components/think)                | `<ak-think>`         | 展示大模型深度思考过程，支持折叠/展开 |
| [ThoughtChain](/components/thought-chain) | `<ak-thought-chain>` | 展示推理步骤的思维链，支持打字动画    |

### 唤醒

| 组件                           | 标签名         | 说明                           |
| ------------------------------ | -------------- | ------------------------------ |
| [Welcome](/components/welcome) | `<ak-welcome>` | 欢迎信息展示，引导用户开始对话 |
| [Prompts](/components/prompts) | `<ak-prompts>` | 提示集，支持嵌套子项、多列布局 |

### 表达

| 组件                                   | 标签名             | 说明                                   |
| -------------------------------------- | ------------------ | -------------------------------------- |
| [Sender](/components/sender)           | `<ak-sender>`      | 消息发送输入框，支持多行、自动调整高度 |
| [Attachments](/components/attachments) | `<ak-attachments>` | 文件附件上传区域，支持拖拽上传         |
| [Suggestion](/components/suggestion)   | `<ak-suggestion>`  | 快捷指令建议列表，支持模糊搜索         |

### 反馈

| 组件                                            | 标签名                  | 说明                                  |
| ----------------------------------------------- | ----------------------- | ------------------------------------- |
| [Actions](/components/actions)                  | `<ak-actions>`          | 操作按钮列表（复制、点赞等）          |
| [CodeHighlighter](/components/code-highlighter) | `<ak-code-highlighter>` | 代码语法高亮显示，支持行号            |
| [FileCard](/components/file-card)               | `<ak-file-card>`        | 文件预览卡片，显示名称、大小、进度    |
| [Folder](/components/folder)                    | `<ak-folder>`           | 文件树组件，支持展开/折叠             |
| [Mermaid](/components/mermaid)                  | `<ak-mermaid>`          | Mermaid 图表渲染，支持图表/代码双视图 |
| [Sources](/components/sources)                  | `<ak-sources>`          | 来源引用列表                          |

### 其他

| 组件                                | 标签名            | 说明                     |
| ----------------------------------- | ----------------- | ------------------------ |
| [Button](/components/button)        | `<ak-button>`     | 通用按钮组件             |
| [XCard](/components/x-card)         | `<ak-x-card>`     | 卡片容器组件             |
| [XProvider](/components/x-provider) | `<ak-x-provider>` | 全局配置（主题、国际化） |

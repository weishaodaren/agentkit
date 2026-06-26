---
layout: home

hero:
  name: "AgentKit"
  text: "AI 对话界面 Web Components 组件库"
  tagline: 基于 Lit + Tailwind CSS v4 构建，框架无关、开箱即用
  image:
    src: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original
    alt: AgentKit
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 组件总览
      link: /components/overview
    - theme: alt
      text: Wiki
      link: /wiki/项目概述
    - theme: alt
      text: GitHub
      link: https://github.com/weishaodaren/agentkit

features:
  - icon: 🌐
    title: 框架无关
    details: 基于 Web Components 标准，可在 React、Vue、Angular 或原生 HTML 中使用，提供官方适配层。
  - icon: 🎨
    title: Tailwind CSS v4
    details: 采用原子化 CSS，Shadow DOM 内嵌样式，支持 Design Tokens 和主题定制。
  - icon: 📦
    title: 插件化分包
    details: Markdown 渲染和代码高亮作为可选插件包，按需加载，减小产物体积。
  - icon: ⚡
    title: 流式渲染
    details: 专为 AI 对话场景优化，支持流式打字动画、逐字输出、Markdown 流式解析。
  - icon: 🧩
    title: 丰富的原子组件
    details: 覆盖对话气泡、发送框、思考过程、会话管理等全场景 AI 交互组件。
  - icon: 🛡️
    title: TypeScript 全覆盖
    details: 提供完整的类型定义文件，享受类型安全的开发体验。
---

## 组件分类

AgentKit UI 基于 RICH 交互范式，提供覆盖 AI 对话全场景的原子组件：

| 分类     | 组件                                                                                                                                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **通用** | [Bubble](/components/bubble) 消息气泡、[Conversations](/components/conversations) 会话管理、[Notification](/components/notification) 系统通知                                                                                                                        |
| **唤醒** | [Welcome](/components/welcome) 欢迎、[Prompts](/components/prompts) 提示集                                                                                                                                                                                           |
| **表达** | [Sender](/components/sender) 发送框、[Attachments](/components/attachments) 输入附件、[Suggestion](/components/suggestion) 快捷指令                                                                                                                                  |
| **确认** | [Think](/components/think) 思考过程、[ThoughtChain](/components/thought-chain) 思维链                                                                                                                                                                                |
| **反馈** | [Actions](/components/actions) 操作列表、[CodeHighlighter](/components/code-highlighter) 代码高亮、[FileCard](/components/file-card) 文件卡片、[Folder](/components/folder) 文件树、[Mermaid](/components/mermaid) 图表工具、[Sources](/components/sources) 来源引用 |
| **其他** | [XProvider](/components/x-provider) 全局配置、[Button](/components/button) 按钮、[XCard](/components/x-card) 卡片                                                                                                                                                    |

## 快速安装

```bash
pnpm add @agentkit/ui
```

## 最简示例

```html
<script type="module">
  import "@agentkit/ui";
</script>

<ak-bubble content="Hello, AgentKit!" placement="start"></ak-bubble>
<ak-sender placeholder="输入消息..."></ak-sender>
```

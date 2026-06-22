import { defineConfig } from "vitepress";

export default defineConfig({
  title: "AgentKit UI",
  description: "AI 对话界面 Web Components 组件库",
  lang: "zh-CN",

  themeConfig: {
    logo: "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original",
    nav: [
      { text: "指南", link: "/guide/getting-started" },
      { text: "组件", link: "/components/overview" },
      { text: "Playground", link: "http://localhost:3000" },
      {
        text: "GitHub",
        link: "https://github.com/weishaodaren/agentkit",
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [
            { text: "快速开始", link: "/guide/getting-started" },
            { text: "安装", link: "/guide/install" },
          ],
        },
      ],
      "/components/": [
        { text: "组件总览", link: "/components/overview" },
        {
          text: "通用",
          items: [
            { text: "Bubble 消息气泡", link: "/components/bubble" },
            {
              text: "Conversations 会话管理",
              link: "/components/conversations",
            },
            { text: "Notification 系统通知", link: "/components/notification" },
          ],
        },
        {
          text: "确认",
          items: [
            { text: "Think 思考过程", link: "/components/think" },
            { text: "ThoughtChain 思维链", link: "/components/thought-chain" },
          ],
        },
        {
          text: "唤醒",
          items: [
            { text: "Welcome 欢迎", link: "/components/welcome" },
            { text: "Prompts 提示集", link: "/components/prompts" },
          ],
        },
        {
          text: "表达",
          items: [
            { text: "Sender 发送框", link: "/components/sender" },
            { text: "Attachments 输入附件", link: "/components/attachments" },
            { text: "Suggestion 快捷指令", link: "/components/suggestion" },
          ],
        },
        {
          text: "反馈",
          items: [
            { text: "Actions 操作列表", link: "/components/actions" },
            {
              text: "CodeHighlighter 代码高亮",
              link: "/components/code-highlighter",
            },
            { text: "FileCard 文件卡片", link: "/components/file-card" },
            { text: "Folder 文件树", link: "/components/folder" },
            { text: "Mermaid 图表工具", link: "/components/mermaid" },
            { text: "Sources 来源引用", link: "/components/sources" },
          ],
        },
        {
          text: "其他",
          items: [
            { text: "Button 按钮", link: "/components/button" },
            { text: "XCard 卡片", link: "/components/x-card" },
            { text: "XProvider 全局配置", link: "/components/x-provider" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/weishaodaren/agentkit" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present AgentKit",
    },

    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "搜索文档", buttonAriaLabel: "搜索文档" },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },

    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },

    outline: {
      label: "页面导航",
    },

    lastUpdated: {
      text: "最后更新于",
    },

    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
});

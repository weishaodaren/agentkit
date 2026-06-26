import { defineConfig } from "vitepress";
import {
  containerPreview,
  componentPreview,
} from "@vitepress-demo-preview/plugin";

export default defineConfig({
  base: "/agentkit/",
  title: "AgentKit",
  description: "Lit Web Components + Mastra + Hono",
  lang: "zh-CN",
  ignoreDeadLinks: [/^https?:\/\/localhost/, /^https?:\/\/127\.0\.0\.1/],

  markdown: {
    config(md) {
      md.use(containerPreview, { clientOnly: true });
      md.use(componentPreview, { clientOnly: true });
    },
  },

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith("ak-"),
      },
    },
  },

  themeConfig: {
    logo: "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original",
    nav: [
      { text: "指南", link: "/guide/getting-started" },
      { text: "组件", link: "/components/overview" },
      { text: "Wiki", link: "/wiki/项目概述" },
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
      "/wiki/": [
        { text: "项目概述", link: "/wiki/项目概述" },
        { text: "快速开始", link: "/wiki/快速开始" },
        {
          text: "Monorepo 管理",
          items: [
            {
              text: "Monorepo 管理",
              link: "/wiki/Monorepo-管理/Monorepo-管理",
            },
            {
              text: "Changesets 版本管理",
              link: "/wiki/Monorepo-管理/Changesets-版本管理",
            },
            { text: "共享类型包", link: "/wiki/Monorepo-管理/共享类型包" },
          ],
        },
        {
          text: "配置详解",
          items: [
            { text: "配置详解", link: "/wiki/配置详解/配置详解" },
            { text: "Turbo 构建配置", link: "/wiki/配置详解/Turbo-构建配置" },
            {
              text: "TypeScript 基础配置",
              link: "/wiki/配置详解/TypeScript-基础配置",
            },
            { text: "pnpm 工作区配置", link: "/wiki/配置详解/pnpm-工作区配置" },
          ],
        },
        {
          text: "开发工具集成",
          items: [
            { text: "开发工具集成", link: "/wiki/开发工具集成/开发工具集成" },
            {
              text: "Babel 构建工具链",
              link: "/wiki/开发工具集成/Babel-构建工具链",
            },
            {
              text: "CSS 样式基础设施",
              link: "/wiki/开发工具集成/CSS-样式基础设施",
            },
            {
              text: "Hono 服务器应用",
              link: "/wiki/开发工具集成/Hono服务器应用",
            },
            {
              text: "Lefthook Git 钩子",
              link: "/wiki/开发工具集成/Lefthook-Git-钩子配置",
            },
            {
              text: "Oxlint 代码检查",
              link: "/wiki/开发工具集成/Oxlint-代码检查配置",
            },
            { text: "Pino 日志系统", link: "/wiki/开发工具集成/Pino-日志系统" },
            {
              text: "React 编译器集成",
              link: "/wiki/开发工具集成/React-编译器集成",
            },
            {
              text: "Renovate 自动依赖管理",
              link: "/wiki/开发工具集成/Renovate-自动依赖管理",
            },
            {
              text: "Rolldown Babel 插件",
              link: "/wiki/开发工具集成/Rolldown-Babel-插件",
            },
            {
              text: "版本控制忽略规则",
              link: "/wiki/开发工具集成/版本控制忽略规则",
            },
          ],
        },
        {
          text: "最佳实践",
          items: [
            { text: "最佳实践", link: "/wiki/最佳实践/最佳实践" },
            {
              text: "Lit 框架使用指南",
              link: "/wiki/最佳实践/Lit-框架使用指南",
            },
            {
              text: "React 适配器系统",
              link: "/wiki/最佳实践/React-适配器系统",
            },
            { text: "Vue 适配器系统", link: "/wiki/最佳实践/Vue-适配器系统" },
            {
              text: "Tailwind CSS 样式系统",
              link: "/wiki/最佳实践/Tailwind-CSS-样式系统",
            },
            {
              text: "Vite 构建系统配置",
              link: "/wiki/最佳实践/Vite-构建系统配置",
            },
            {
              text: "VitePress 文档系统",
              link: "/wiki/最佳实践/VitePress-文档系统",
            },
            { text: "Mastra 代理系统", link: "/wiki/最佳实践/Mastra代理系统" },
            { text: "设计令牌系统", link: "/wiki/最佳实践/设计令牌系统" },
            { text: "国际化支持", link: "/wiki/最佳实践/国际化支持" },
            {
              text: "@agentkit/sdk 包",
              link: "/wiki/最佳实践/@agentkit_sdk-包",
            },
            {
              text: "Web Components 集成指南",
              link: "/wiki/最佳实践/Web-Components-集成指南/Web-Components-集成指南",
            },
            {
              text: "ThoughtChain 思维链组件",
              link: "/wiki/最佳实践/Web-Components-集成指南/ThoughtChain-思维链组件",
            },
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

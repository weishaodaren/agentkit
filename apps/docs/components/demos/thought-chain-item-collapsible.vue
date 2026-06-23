<script setup>
import '@agentkit/ui'
const items = [
  {
    key: '1',
    title: '分析需求',
    description: '理解用户意图和上下文',
    status: 'success',
    collapsible: true,
    content: '用户需要一个支持流式输出的 AI 对话界面，包含思考过程展示和思维链可视化。',
  },
  {
    key: '2',
    title: '搜索资料',
    description: '检索相关文档和代码片段',
    status: 'success',
    collapsible: true,
    content: '找到 3 篇相关文档：\n1. Lit Web Components 官方文档\n2. antd-x 组件设计规范\n3. CSS 动画最佳实践',
  },
  {
    key: '3',
    title: '生成回答',
    description: '基于搜索结果组织回答内容',
    status: 'loading',
  },
]
</script>

<template>
  <ak-thought-chain :items="items"></ak-thought-chain>
</template>

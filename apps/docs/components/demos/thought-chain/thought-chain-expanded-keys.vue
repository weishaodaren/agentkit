<script setup>
import '@agentkit/ui'
import { ref } from 'vue'

const items = [
  {
    key: '1',
    title: '分析需求',
    description: '理解用户意图',
    status: 'success',
    collapsible: true,
    content: '用户需要一个 AI 对话界面，支持流式输出和思考过程展示。',
  },
  {
    key: '2',
    title: '搜索资料',
    description: '从知识库检索',
    status: 'success',
    collapsible: true,
    content: '找到 3 篇相关文档：组件设计、Lit 教程、Tailwind 配置。',
  },
  {
    key: '3',
    title: '编写代码',
    description: '实现组件',
    status: 'running',
    collapsible: true,
    content: '正在编写组件模板和样式逻辑...',
  },
]

// 受控模式：只有 key="2" 展开
const expandedKeys = ref(['2'])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">受控模式 expandedKeys（仅 key="2" 展开）</div>
      <ak-thought-chain :items="items" :expanded-keys="expandedKeys"></ak-thought-chain>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">非受控模式 default-expanded-keys（key="1" 和 key="3" 默认展开）</div>
      <ak-thought-chain :items="items" :default-expanded-keys="['1', '3']"></ak-thought-chain>
    </div>
  </div>
</template>

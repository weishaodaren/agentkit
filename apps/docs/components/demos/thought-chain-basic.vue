<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', title: '理解问题', description: '分析用户需求', status: 'success' },
  { key: '2', title: '搜索知识', description: '从知识库中检索相关信息', status: 'running' },
  { key: '3', title: '生成回答', description: '基于搜索结果组织回答', status: 'pending' },
]
</script>

<template>
  <ak-thought-chain :items="items"></ak-thought-chain>
</template>

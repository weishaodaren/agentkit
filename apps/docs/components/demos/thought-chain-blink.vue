<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', title: '分析需求', description: '理解用户意图和上下文', status: 'success' },
  { key: '2', title: '搜索资料', description: '检索相关文档和代码片段', status: 'success' },
  { key: '3', title: '正在思考', description: '组织回答内容...', status: 'loading', blink: true },
]
</script>

<template>
  <ak-thought-chain :items="items"></ak-thought-chain>
</template>

<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: '什么是 AgentKit UI?', group: '今天' },
  { key: '2', label: '如何安装组件?', group: '今天' },
  { key: '3', label: '支持哪些框架?', group: '昨天' },
  { key: '4', label: 'TypeScript 支持', group: '昨天' },
]
</script>

<template>
  <div style="height: 300px;">
    <ak-conversations
      :items="items"
      active-key="1"
      groupable
    ></ak-conversations>
  </div>
</template>

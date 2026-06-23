<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', title: '分析任务', description: '理解任务工作流，分析所需步骤', status: 'success' },
  { key: '2', title: '创建任务', description: '创建任务所需的文件和文件夹', status: 'running' },
  { key: '3', title: '执行任务', description: '使用新组件完成任务', status: 'pending' },
]
</script>

<template>
  <ak-thought-chain typing-speed="30" :items="items"></ak-thought-chain>
</template>

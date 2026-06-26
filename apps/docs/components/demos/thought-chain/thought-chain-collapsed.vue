<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', title: '创建文件夹', description: 'mkdir -p component', status: 'success' },
  { key: '2', title: '创建 index.tsx', description: '组件入口文件', status: 'success' },
  { key: '3', title: '创建文档', description: '组件中英文文档', status: 'success' },
]
</script>

<template>
  <ak-thought-chain collapsible collapsed :items="items"></ak-thought-chain>
</template>

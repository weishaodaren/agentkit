<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', title: '搜索知识', icon: 'search', description: '从知识库检索', status: 'success' },
  { key: '2', title: '分析数据', icon: 'bar-chart-3', description: '统计分析结果', status: 'success' },
  { key: '3', title: '编写文档', icon: 'file-text', description: '生成技术文档', status: 'running' },
  { key: '4', title: '部署上线', icon: 'rocket', description: '发布到生产环境', status: 'pending' },
]
</script>

<template>
  <ak-thought-chain :items="items"></ak-thought-chain>
</template>

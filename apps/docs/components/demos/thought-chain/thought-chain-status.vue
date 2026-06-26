<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', title: '已完成步骤', description: '查询知识库并返回结果', status: 'success' },
  { key: '2', title: '正在执行', description: '调用 Web 搜索工具', status: 'loading' },
  { key: '3', title: '等待中', description: '等待模型响应', status: 'pending' },
  { key: '4', title: '执行失败', description: 'API 调用超时', status: 'error' },
  { key: '5', title: '已中止', description: '用户手动停止', status: 'abort' },
]
</script>

<template>
  <ak-thought-chain :items="items"></ak-thought-chain>
</template>

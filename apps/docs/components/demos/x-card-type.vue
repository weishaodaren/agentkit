<script setup>
import '@agentkit/ui'

const items = [
  { key: '1', title: '默认', content: 'default 类型', type: 'default' },
  { key: '2', title: '信息', content: 'info 类型', type: 'info' },
  { key: '3', title: '成功', content: 'success 类型', type: 'success' },
  { key: '4', title: '警告', content: 'warning 类型', type: 'warning' },
  { key: '5', title: '错误', content: 'error 类型', type: 'error' },
]
</script>

<template>
  <ak-x-card columns="3" :items="items"></ak-x-card>
</template>

<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: '可用提示项', description: '点击可触发' },
  { key: '2', label: '禁用提示项', description: '不可点击', disabled: true },
  { key: '3', label: '另一个可用项', description: '正常触发' },
]
</script>

<template>
  <ak-prompts title="Disabled 演示" :items="items"></ak-prompts>
</template>

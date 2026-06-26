<script setup>
import '@agentkit/ui'

const items = [
  { key: '1', title: '来源一', description: '这是一个参考来源的描述', url: 'https://example.com/1' },
  { key: '2', title: '来源二', description: '另一个参考来源', url: 'https://example.com/2' },
  { key: '3', title: '来源三', description: '第三个参考来源', url: 'https://example.com/3' },
  { key: '4', title: '来源四', description: '第四个参考来源', url: 'https://example.com/4' },
  { key: '5', title: '来源五', description: '第五个参考来源', url: 'https://example.com/5' },
]
</script>

<template>
  <ak-sources mode="inline" :items="items"></ak-sources>
</template>

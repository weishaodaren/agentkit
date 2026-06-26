<script setup>
import '@agentkit/ui'

const items = [
  { key: '1', title: '可关闭', content: '点击右上角 × 关闭此卡片', closable: true },
  { key: '2', title: '不可关闭', content: '此卡片没有关闭按钮', closable: false },
]
</script>

<template>
  <ak-x-card :items="items"></ak-x-card>
</template>

<script setup>
import '@agentkit/ui'

const items = [
  { key: '1', title: '加载中', content: '内容正在加载...', loading: true },
  { key: '2', title: '已加载', content: '此卡片内容已加载完成。' },
]
</script>

<template>
  <ak-x-card :items="items"></ak-x-card>
</template>

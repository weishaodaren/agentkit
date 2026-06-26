<script setup>
import '@agentkit/ui'

const items = [
  { key: '1', title: 'small', content: '小尺寸卡片，padding 较小', size: 'small' },
  { key: '2', title: 'middle', content: '中等尺寸卡片，默认大小', size: 'middle' },
  { key: '3', title: 'large', content: '大尺寸卡片，padding 较大', size: 'large' },
]
</script>

<template>
  <ak-x-card columns="3" :items="items"></ak-x-card>
</template>

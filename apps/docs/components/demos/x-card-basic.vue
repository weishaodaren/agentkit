<script setup>
import '@agentkit/ui'

const items = [
  { key: '1', title: '卡片一', content: '这是第一个卡片的内容，展示基本的卡片布局。' },
  { key: '2', title: '卡片二', content: '这是第二个卡片的内容，展示基本的卡片布局。' },
]
</script>

<template>
  <ak-x-card :items="items"></ak-x-card>
</template>

<script setup>
import '@agentkit/ui'

const items = [
  { key: '1', title: '带图标', content: 'icon 属性设置 Lucide 图标', icon: 'rocket' },
  { key: '2', title: '带额外信息', content: 'extra 属性在标题栏右侧显示', extra: 'v1.0' },
  { key: '3', title: '已禁用', content: 'disabled 属性禁用卡片交互', disabled: true },
]
</script>

<template>
  <ak-x-card columns="3" :items="items"></ak-x-card>
</template>

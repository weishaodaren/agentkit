<script setup>
import '@agentkit/ui'
const items = [
  {
    key: '1',
    label: 'Ignite Your Creativity',
    icon: 'sparkles',
    children: [
      { key: '1-1', label: 'What sparks your creativity?', description: '寻找创意灵感' },
      { key: '1-2', label: 'How do you get inspired?', description: '获取灵感的方法' },
    ],
  },
  {
    key: '2',
    label: 'Uncover Background Info',
    icon: 'palette',
    children: [
      { key: '2-1', label: 'What is the background of this topic?', description: '主题背景' },
      { key: '2-2', label: 'Why is this important?', description: '重要性分析' },
    ],
  },
]
</script>

<template>
  <ak-prompts title="Nested Prompts" :items="items"></ak-prompts>
</template>

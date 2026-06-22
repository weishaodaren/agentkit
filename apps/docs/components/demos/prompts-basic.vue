<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: '写一份报告', description: '帮我写一份项目报告' },
  { key: '2', label: '翻译文本', description: '将中文翻译为英文' },
  { key: '3', label: '解释概念', description: '解释量子计算的基本原理' },
]
</script>

<template>
  <ak-prompts title="我可以帮你：" :items="items"></ak-prompts>
</template>

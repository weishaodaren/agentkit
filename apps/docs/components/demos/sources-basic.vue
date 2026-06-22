<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', title: 'AgentKit 文档', url: 'https://example.com/docs' },
  { key: '2', title: 'Lit 官方指南', url: 'https://lit.dev' },
  { key: '3', title: 'Tailwind CSS', url: 'https://tailwindcss.com' },
]
</script>

<template>
  <ak-sources :items="items"></ak-sources>
</template>

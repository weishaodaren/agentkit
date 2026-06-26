<script setup>
import '@agentkit/ui'

const items = [
  { key: '1', title: 'React 文档', description: '官方 React 指南', url: 'https://react.dev' },
  { key: '2', title: 'Vue 文档', description: '官方 Vue 指南', url: 'https://vuejs.org' },
  { key: '3', title: 'Angular 文档', description: '官方 Angular 指南', url: 'https://angular.dev' },
]
</script>

<template>
  <ak-sources title="参考资料" :items="items"></ak-sources>
</template>

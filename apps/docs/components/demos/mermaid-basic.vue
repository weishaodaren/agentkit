<script setup>
import '@agentkit/ui'
import { onMounted } from 'vue'

const code = `graph TD
  A[开始] --> B{条件判断}
  B -->|是| C[执行操作]
  B -->|否| D[跳过]
  C --> E[结束]
  D --> E`

onMounted(() => {
  if (!window.mermaid) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js'
    document.head.appendChild(script)
  }
})
</script>

<template>
  <ak-mermaid :code="code"></ak-mermaid>
</template>

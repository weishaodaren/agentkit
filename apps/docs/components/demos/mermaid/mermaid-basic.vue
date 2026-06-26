<script setup>
import '@agentkit/ui'

const code = `graph TD
  A[开始] --> B{条件判断}
  B -->|是| C[执行操作]
  B -->|否| D[跳过]
  C --> E[结束]
  D --> E`
</script>

<template>
  <ak-mermaid :code="code"></ak-mermaid>
</template>

<script setup>
import '@agentkit/ui'
import '@agentkit/ui/code-highlighter'
const code = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`
</script>

<template>
  <ak-code-highlighter language="typescript" :code="code" show-line-numbers></ak-code-highlighter>
</template>

<script setup>
import '@agentkit/ui'
import '@agentkit/ui/code-highlighter'

const code = 'function greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet(\'World\'));'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">showLineNumbers = false（默认，不显示行号）</div>
      <ak-code-highlighter language="typescript" :code="code"></ak-code-highlighter>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">showLineNumbers = true（显示行号）</div>
      <ak-code-highlighter language="typescript" :code="code" show-line-numbers></ak-code-highlighter>
    </div>
  </div>
</template>

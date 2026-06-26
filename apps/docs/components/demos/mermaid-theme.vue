<script setup>
import '@agentkit/ui'
import { onMounted } from 'vue'

const code = `graph LR
  A[需求分析] --> B[开发]
  B --> C[测试]
  C --> D[部署]`

onMounted(() => {
  if (!window.mermaid) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js'
    document.head.appendChild(script)
  }
})
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">default</div>
      <ak-mermaid theme="default" :code="code"></ak-mermaid>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">dark</div>
      <ak-mermaid theme="dark" :code="code"></ak-mermaid>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">forest</div>
      <ak-mermaid theme="forest" :code="code"></ak-mermaid>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">neutral</div>
      <ak-mermaid theme="neutral" :code="code"></ak-mermaid>
    </div>
  </div>
</template>

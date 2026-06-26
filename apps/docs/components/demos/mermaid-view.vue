<script setup>
import '@agentkit/ui'
import { onMounted } from 'vue'

const code = `sequenceDiagram
  participant User
  participant Server
  User->>Server: 发送请求
  Server-->>User: 返回数据
  User->>Server: 确认收到`

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
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">图表视图（view="image"）</div>
      <ak-mermaid view="image" :code="code"></ak-mermaid>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">代码视图（view="code"）</div>
      <ak-mermaid view="code" :code="code"></ak-mermaid>
    </div>
  </div>
</template>

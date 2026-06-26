<script setup>
import '@agentkit/ui'

const code = `sequenceDiagram
  participant User
  participant Server
  User->>Server: 发送请求
  Server-->>User: 返回数据
  User->>Server: 确认收到`
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

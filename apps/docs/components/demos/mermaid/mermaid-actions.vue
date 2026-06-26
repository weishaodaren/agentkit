<script setup>
import '@agentkit/ui'

const code = `sequenceDiagram
  participant U as 用户
  participant A as Agent
  participant T as Tool
  U->>A: 发送消息
  A->>A: 理解意图
  A->>T: 调用工具
  T-->>A: 返回结果
  A-->>U: 组织回复`

const actions1 = { enableZoom: true, enableDownload: false, enableCopy: false }
const actions2 = { enableZoom: false, enableDownload: true, enableCopy: true }
const actions3 = { enableZoom: false, enableDownload: false, enableCopy: false }
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">仅缩放</div>
      <ak-mermaid :code="code" :actions="actions1"></ak-mermaid>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">下载 + 复制</div>
      <ak-mermaid :code="code" :actions="actions2"></ak-mermaid>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">全部关闭</div>
      <ak-mermaid :code="code" :actions="actions3"></ak-mermaid>
    </div>
  </div>
</template>

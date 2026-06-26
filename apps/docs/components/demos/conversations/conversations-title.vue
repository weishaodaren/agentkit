<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: '什么是 AgentKit UI?' },
  { key: '2', label: '如何安装组件?' },
  { key: '3', label: '支持哪些框架?' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">title = "对话列表"（默认）</div>
      <div style="height: 200px;">
        <ak-conversations :items="items" title="对话列表"></ak-conversations>
      </div>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">title = "历史记录"</div>
      <div style="height: 200px;">
        <ak-conversations :items="items" title="历史记录"></ak-conversations>
      </div>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">title = ""（不显示标题）</div>
      <div style="height: 200px;">
        <ak-conversations :items="items" title=""></ak-conversations>
      </div>
    </div>
  </div>
</template>

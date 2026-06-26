<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: '什么是 AgentKit UI?' },
  { key: '2', label: '如何安装组件?' },
  { key: '3', label: '支持哪些框架?' },
  { key: '4', label: 'TypeScript 支持' },
  { key: '5', label: '如何自定义主题?' },
]
</script>

<template>
  <div>
    <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">
      启用 shortcutKeys 后，焦点在列表上时可使用 ↑/↓ 导航，Enter 选中
    </div>
    <div style="height: 300px;">
      <ak-conversations
        :items="items"
        title="对话列表"
        shortcut-keys
        active-key="1"
      ></ak-conversations>
    </div>
  </div>
</template>

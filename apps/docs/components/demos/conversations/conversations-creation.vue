<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: '什么是 AgentKit UI?' },
  { key: '2', label: '如何安装组件?' },
  { key: '3', label: '支持哪些框架?' },
]
</script>

<template>
  <div style="height: 300px;">
    <ak-conversations
      :items="items"
      title="对话列表"
      creation
      creation-label="新建对话"
    ></ak-conversations>
  </div>
</template>

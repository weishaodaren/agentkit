<script setup>
import '@agentkit/ui'
</script>

<template>
  <ak-x-provider>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <ak-bubble content="XProvider 包裹的气泡组件" placement="start"></ak-bubble>
      <ak-sender placeholder="在 XProvider 内部的输入框"></ak-sender>
    </div>
  </ak-x-provider>
</template>

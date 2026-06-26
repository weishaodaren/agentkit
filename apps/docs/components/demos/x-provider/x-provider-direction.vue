<script setup>
import '@agentkit/ui'
</script>

<template>
  <ak-x-provider direction="rtl">
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <div style="font-size: 12px; color: #666;">direction="rtl" — 从右到左布局</div>
      <ak-bubble content="RTL 模式下的气泡，文本方向从右到左" placement="start"></ak-bubble>
      <ak-sender placeholder="RTL 输入框..."></ak-sender>
    </div>
  </ak-x-provider>
</template>

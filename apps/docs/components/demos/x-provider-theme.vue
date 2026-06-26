<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <ak-x-provider theme="light">
      <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff;">
        <div style="font-size: 12px; color: #666; margin-bottom: 8px;">theme="light"</div>
        <ak-bubble content="浅色主题" placement="start"></ak-bubble>
      </div>
    </ak-x-provider>
    <ak-x-provider theme="dark">
      <div style="padding: 16px; border: 1px solid #374151; border-radius: 8px; background: #1f2937;">
        <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">theme="dark"</div>
        <ak-bubble content="深色主题" placement="start"></ak-bubble>
      </div>
    </ak-x-provider>
  </div>
</template>

<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="width: 100%;">
    <ak-sender placeholder="prefix 插槽可放置附件、表情等按钮">
      <button
        slot="prefix"
        title="附件"
        style="border: none; background: transparent; cursor: pointer; font-size: 18px; padding: 4px; line-height: 1;"
      >📎</button>
      <button
        slot="prefix"
        title="表情"
        style="border: none; background: transparent; cursor: pointer; font-size: 18px; padding: 4px; line-height: 1;"
      >😊</button>
    </ak-sender>
  </div>
</template>

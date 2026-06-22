<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <ak-button variant="default">默认</ak-button>
    <ak-button variant="outline">描边</ak-button>
    <ak-button variant="ghost">幽灵</ak-button>
    <ak-button variant="destructive">危险</ak-button>
    <ak-button disabled>禁用</ak-button>
  </div>
</template>

<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <ak-button variant="default">默认</ak-button>
    <ak-button variant="secondary">次要</ak-button>
    <ak-button variant="outline">描边</ak-button>
    <ak-button variant="ghost">幽灵</ak-button>
    <ak-button variant="link">链接</ak-button>
    <ak-button variant="destructive">危险</ak-button>
    <ak-button variant="default" disabled>禁用</ak-button>
  </div>
</template>

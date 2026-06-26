<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <ak-bubble content="default — 圆角 12px" shape="default" placement="start"></ak-bubble>
    <ak-bubble content="round — 胶囊形圆角 18px" shape="round" placement="start"></ak-bubble>
    <ak-bubble content="corner — 方角，左上角小圆角" shape="corner" placement="start"></ak-bubble>
    <ak-bubble content="corner at end — 方角，右上角小圆角" shape="corner" placement="end"></ak-bubble>
  </div>
</template>

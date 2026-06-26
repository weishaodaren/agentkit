<script setup>
import '@agentkit/ui'

const items = [
  { key: '1', title: '列 1', content: '内容 A' },
  { key: '2', title: '列 2', content: '内容 B' },
  { key: '3', title: '列 3', content: '内容 C' },
  { key: '4', title: '列 4', content: '内容 D' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">columns="1"</div>
      <ak-x-card columns="1" :items="items"></ak-x-card>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">columns="3"</div>
      <ak-x-card columns="3" :items="items"></ak-x-card>
    </div>
    <div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">columns="4"</div>
      <ak-x-card columns="4" :items="items"></ak-x-card>
    </div>
  </div>
</template>

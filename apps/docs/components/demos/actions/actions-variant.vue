<script setup>
import '@agentkit/ui'
const items = [
  { key: 'copy', label: '复制', icon: 'copy' },
  { key: 'like', label: '点赞', icon: 'heart' },
  { key: 'share', label: '分享', icon: 'share' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">variant = borderless（默认，无边框）</div>
      <ak-actions :items="items" variant="borderless"></ak-actions>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">variant = filled（填充背景）</div>
      <ak-actions :items="items" variant="filled"></ak-actions>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">variant = outlined（描边）</div>
      <ak-actions :items="items" variant="outlined"></ak-actions>
    </div>
  </div>
</template>

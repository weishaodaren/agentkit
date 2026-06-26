<script setup>
import '@agentkit/ui'
const iconOnly = [
  { key: 'reload', label: '', icon: 'refresh-cw' },
  { key: 'copy', label: '', icon: 'copy' },
  { key: 'like', label: '', icon: 'heart' },
]

const withLabel = [
  { key: 'reload', label: '重试', icon: 'refresh-cw' },
  { key: 'copy', label: '复制', icon: 'copy' },
  { key: 'like', label: '点赞', icon: 'heart' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">仅图标（label 为空）</div>
      <ak-actions :items="iconOnly"></ak-actions>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">图标 + 文本</div>
      <ak-actions :items="withLabel"></ak-actions>
    </div>
  </div>
</template>

<script setup>
import '@agentkit/ui'
const items = [
  { key: 'copy', label: '复制', icon: 'copy' },
  { key: 'edit', label: '编辑', icon: 'pencil', disabled: true },
  { key: 'delete', label: '删除', icon: 'trash-2', disabled: true },
  { key: 'share', label: '分享', icon: 'share' },
]
</script>

<template>
  <div>
    <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">
      disabled 属性禁用按钮，不可点击且显示半透明
    </div>
    <ak-actions :items="items"></ak-actions>
  </div>
</template>
 
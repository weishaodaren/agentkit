<script setup>
import '@agentkit/ui'
import { ref } from 'vue'

const items = ref([
  { key: 'like', label: '点赞', icon: 'heart', active: false },
  { key: 'dislike', label: '踩', icon: 'thumbs-down', active: false },
  { key: 'favorite', label: '收藏', icon: 'star', active: true },
])

function onAction(e) {
  const key = e.detail.key
  items.value = items.value.map((it) =>
    it.key === key ? { ...it, active: !it.active } : it,
  )
}
</script>

<template>
  <div>
    <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">
      active 属性高亮按钮，点击切换激活状态
    </div>
    <ak-actions :items="items" @action-click="onAction"></ak-actions>
  </div>
</template>

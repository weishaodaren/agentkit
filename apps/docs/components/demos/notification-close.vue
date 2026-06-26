<script setup>
import '@agentkit/ui'
import { ref } from 'vue'

const notif = ref(null)

function openWithKey() {
  notif.value?.open({
    key: 'progress',
    title: '处理中...',
    description: '点击关闭按钮可提前关闭此通知',
    type: 'info',
    duration: 0,
  })
}

function updateNotif() {
  notif.value?.open({
    key: 'progress',
    title: '处理完成',
    description: '使用相同 key 更新已有通知内容',
    type: 'success',
    duration: 3000,
  })
}
</script>

<template>
  <div>
    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
      <ak-button @click="openWithKey">打开通知（不自动关闭）</ak-button>
      <ak-button @click="updateNotif">更新通知（相同 key）</ak-button>
    </div>
    <ak-notification ref="notif" placement="top-right"></ak-notification>
  </div>
</template>

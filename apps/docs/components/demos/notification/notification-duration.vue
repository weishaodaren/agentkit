<script setup>
import '@agentkit/ui'
import { ref } from 'vue'

const notif = ref(null)

function openShort() {
  notif.value?.open({
    title: '快速消失',
    description: 'duration = 2000，2 秒后自动关闭',
    type: 'info',
    duration: 2000,
  })
}

function openLong() {
  notif.value?.open({
    title: '较慢消失',
    description: 'duration = 8000，8 秒后自动关闭',
    type: 'warning',
    duration: 8000,
  })
}

function openPersistent() {
  notif.value?.open({
    title: '不自动关闭',
    description: 'duration = 0，需要手动点击关闭按钮',
    type: 'success',
    duration: 0,
  })
}
</script>

<template>
  <div>
    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
      <ak-button @click="openShort">2 秒消失</ak-button>
      <ak-button @click="openLong">8 秒消失</ak-button>
      <ak-button @click="openPersistent">不自动关闭</ak-button>
    </div>
    <ak-notification ref="notif" placement="top-right"></ak-notification>
  </div>
</template>

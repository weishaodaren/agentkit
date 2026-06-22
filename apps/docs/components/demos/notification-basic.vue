<script setup lang="ts">
import '@agentkit/ui'
import { ref } from 'vue'
const notif = ref<any>(null)
function openNotif(type: string) {
  notif.value?.open({ title: `${type} 通知`, description: `这是一条 ${type} 类型的通知`, type })
}
</script>

<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
      <ak-button @click="openNotif('info')">信息</ak-button>
      <ak-button @click="openNotif('success')">成功</ak-button>
      <ak-button @click="openNotif('warning')">警告</ak-button>
      <ak-button @click="openNotif('error')">错误</ak-button>
    </div>
    <ak-notification ref="notif" placement="top-right"></ak-notification>
  </div>
</template>

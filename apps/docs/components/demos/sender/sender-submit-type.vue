<script setup>
import '@agentkit/ui'
import { ref } from 'vue'

const lastSubmit1 = ref('')
const lastSubmit2 = ref('')

function onSubmit1(e) {
  lastSubmit1.value = e.detail.value
}

function onSubmit2(e) {
  lastSubmit2.value = e.detail.value
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">Enter 发送（默认），Shift+Enter 换行</p>
      <ak-sender placeholder="按 Enter 发送" @submit="onSubmit1"></ak-sender>
      <p v-if="lastSubmit1" style="margin: 8px 0 0; font-size: 12px; color: #1677ff;">已发送：{{ lastSubmit1 }}</p>
    </div>

    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">Shift+Enter 发送，Enter 换行</p>
      <ak-sender submit-type="shiftEnter" placeholder="按 Shift+Enter 发送" @submit="onSubmit2"></ak-sender>
      <p v-if="lastSubmit2" style="margin: 8px 0 0; font-size: 12px; color: #1677ff;">已发送：{{ lastSubmit2 }}</p>
    </div>
  </div>
</template>

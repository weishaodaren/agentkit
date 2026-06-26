<script setup>
import '@agentkit/ui'
import { ref } from 'vue'

const notifTR = ref(null)
const notifTL = ref(null)
const notifBR = ref(null)
const notifBL = ref(null)

function open(placement) {
  const refs = {
    'top-right': notifTR,
    'top-left': notifTL,
    'bottom-right': notifBR,
    'bottom-left': notifBL,
  }
  refs[placement].value?.open({
    title: `${placement} 通知`,
    description: `这条通知出现在 ${placement} 位置`,
    type: 'info',
    duration: 3000,
  })
}
</script>

<template>
  <div>
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <ak-button @click="open('top-right')">top-right</ak-button>
      <ak-button @click="open('top-left')">top-left</ak-button>
      <ak-button @click="open('bottom-right')">bottom-right</ak-button>
      <ak-button @click="open('bottom-left')">bottom-left</ak-button>
    </div>
    <ak-notification ref="notifTR" placement="top-right"></ak-notification>
    <ak-notification ref="notifTL" placement="top-left"></ak-notification>
    <ak-notification ref="notifBR" placement="bottom-right"></ak-notification>
    <ak-notification ref="notifBL" placement="bottom-left"></ak-notification>
  </div>
</template>

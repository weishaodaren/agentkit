<script setup>
import '@agentkit/ui'
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

let timer = null
onMounted(() => {
  timer = setInterval(() => {
    progress.value = (progress.value + 5) % 105
  }, 200)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div>
    <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">
      status = uploading，progress 动态更新（当前 {{ progress }}%）
    </div>
    <ak-file-card
      name="uploading-file.mp4"
      :size="52428800"
      status="uploading"
      :progress="progress"
    ></ak-file-card>
  </div>
</template>

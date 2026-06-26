<script setup>
import '@agentkit/ui'
import { ref, onMounted, onUnmounted } from 'vue'

const content = ref('')
const fullText = '流式模式下，content 会随时间增长。streaming 属性会延迟 typing-complete 事件的触发，直到流式结束。'

let timer = null
onMounted(() => {
  let i = 0
  timer = setInterval(() => {
    if (i < fullText.length) {
      content.value = fullText.slice(0, i + 1)
      i++
    } else {
      clearInterval(timer)
    }
  }, 80)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <ak-bubble
    :content="content"
    typing
    streaming
    :typing-speed="30"
    placement="start"
  ></ak-bubble>
</template>

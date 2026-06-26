<script setup>
import '@agentkit/ui'
import { ref, onMounted, onUnmounted } from 'vue'

const content = ref('')
const fullText = '用户询问了关于 AgentKit UI 的信息，我需要介绍其核心特性和使用方式。AgentKit UI 基于 Lit + Tailwind CSS v4 构建，提供了丰富的 AI 对话组件。让我逐字呈现这段思考过程，模拟流式输出的效果。'

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
  }, 100)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">typingSpeed = 20（快速，默认值）</p>
      <ak-think
        title="思考中"
        content="用户询问了关于 AgentKit UI 的信息，我需要介绍其核心特性和使用方式。AgentKit UI 基于 Lit + Tailwind CSS v4 构建，提供了丰富的 AI 对话组件。"
        :typing-speed="20"
      ></ak-think>
    </div>

    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">typingSpeed = 80（慢速）</p>
      <ak-think
        title="慢速打字"
        content="设置 typingSpeed 为 80ms 每字符，可以看到更明显的逐字显示效果。"
        :typing-speed="80"
      ></ak-think>
    </div>

    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">流式 content（动态增长）</p>
      <ak-think
        title="流式思考"
        :content="content"
        :typing-speed="30"
      ></ak-think>
    </div>
  </div>
</template>

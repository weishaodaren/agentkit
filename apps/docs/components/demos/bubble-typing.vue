<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <ak-bubble
      content="这是一段正在逐字显示的内容，typing 属性启用打字机效果。"
      typing
      :typing-speed="40"
      placement="start"
    ></ak-bubble>
    <ak-bubble
      content="更快的打字速度 (10ms/字符)：流式输出时通常使用较快的速度。"
      typing
      :typing-speed="10"
      placement="start"
    ></ak-bubble>
  </div>
</template>

<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">variant = filled（默认，带背景填充）</div>
      <ak-welcome
        title="你好，我是 AgentKit AI"
        description="基于 Lit + Tailwind CSS v4 构建的 AI 组件库。"
        variant="filled"
      ></ak-welcome>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">variant = borderless（无边框）</div>
      <ak-welcome
        title="你好，我是 AgentKit AI"
        description="基于 Lit + Tailwind CSS v4 构建的 AI 组件库。"
        variant="borderless"
      ></ak-welcome>
    </div>
  </div>
</template>

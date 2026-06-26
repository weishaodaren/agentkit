<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">icon 为 URL（自动转为 img）</div>
      <ak-welcome
        title="带图标的欢迎"
        description="icon 属性为 URL 时自动渲染为 img 标签。"
        icon="https://api.dicebear.com/7.x/bottts/svg?seed=agentkit"
      ></ak-welcome>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">icon 为 lucide 图标名</div>
      <ak-welcome
        title="表情图标"
        description="icon 属性为 lucide 图标名时，自动渲染为 SVG 图标。"
        icon="bot"
      ></ak-welcome>
    </div>
  </div>
</template>

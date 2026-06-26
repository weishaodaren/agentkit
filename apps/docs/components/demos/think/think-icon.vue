<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">默认图标 sparkles</p>
      <ak-think
        title="默认图标"
        content="未设置 icon 属性时，默认显示 sparkles 图标。"
      ></ak-think>
    </div>

    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">自定义图标 brain</p>
      <ak-think
        title="深度分析"
        icon="brain"
        content="使用 lucide brain 图标，适合展示分析类思考过程。"
      ></ak-think>
    </div>

    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">自定义图标 lightbulb</p>
      <ak-think
        title="灵感闪现"
        icon="lightbulb"
        content="使用 lucide lightbulb 图标，适合展示创意类思考过程。"
      ></ak-think>
    </div>

    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">自定义图标 search</p>
      <ak-think
        title="搜索中"
        icon="search"
        content="使用 lucide search 图标，适合展示检索类思考过程。"
      ></ak-think>
    </div>
  </div>
</template>

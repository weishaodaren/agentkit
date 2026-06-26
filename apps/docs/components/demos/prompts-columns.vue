<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: '写报告', description: '生成项目报告' },
  { key: '2', label: '翻译文本', description: '多语言互译' },
  { key: '3', label: '解释概念', description: '通俗易懂地讲解' },
  { key: '4', label: '总结内容', description: '快速提取要点' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <div>
      <div style="font-size: 12px; color: #999; margin-bottom: 8px;">columns="1"</div>
      <ak-prompts columns="1" :items="items"></ak-prompts>
    </div>
    <div>
      <div style="font-size: 12px; color: #999; margin-bottom: 8px;">columns="2"（默认）</div>
      <ak-prompts columns="2" :items="items"></ak-prompts>
    </div>
    <div>
      <div style="font-size: 12px; color: #999; margin-bottom: 8px;">columns="3"</div>
      <ak-prompts columns="3" :items="items"></ak-prompts>
    </div>
    <div>
      <div style="font-size: 12px; color: #999; margin-bottom: 8px;">columns="4"</div>
      <ak-prompts columns="4" :items="items"></ak-prompts>
    </div>
  </div>
</template>

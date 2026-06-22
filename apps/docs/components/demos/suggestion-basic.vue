<script setup>
import '@agentkit/ui'
const items = [
  { key: 'report', label: '写一份报告', value: 'report' },
  { key: 'translate', label: '翻译文本', value: 'translate' },
  { key: 'summarize', label: '总结内容', value: 'summarize' },
]
</script>

<template>
  <div style="position: relative; height: 200px;">
    <ak-suggestion :items="items" open></ak-suggestion>
  </div>
</template>

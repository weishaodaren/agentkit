<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: '代码分析', icon: 'code', description: '分析代码质量与潜在问题' },
  { key: '2', label: '数据分析', icon: 'bar-chart', description: '挖掘数据中的趋势' },
  { key: '3', label: '撰写文档', icon: 'file-text', description: '自动生成技术文档' },
  { key: '4', label: '图像处理', icon: 'image', description: '批量编辑图片' },
]
</script>

<template>
  <ak-prompts title="带图标的提示集" :items="items"></ak-prompts>
</template>

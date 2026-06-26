<script setup>
import '@agentkit/ui'

const items = [
  {
    key: 'knowledge',
    label: '查阅知识',
    children: [
      { key: 'react', label: '关于 React', value: 'react' },
      { key: 'vue', label: '关于 Vue', value: 'vue' },
      { key: 'angular', label: '关于 Angular', value: 'angular' },
    ],
  },
  {
    key: 'action',
    label: '执行操作',
    children: [
      { key: 'deploy', label: '部署应用', value: 'deploy' },
      { key: 'test', label: '运行测试', value: 'test' },
    ],
  },
  { key: 'translate', label: '翻译文本', value: 'translate' },
]
</script>

<template>
  <div style="position: relative; height: 280px;">
    <ak-suggestion :items="items" open></ak-suggestion>
  </div>
</template>

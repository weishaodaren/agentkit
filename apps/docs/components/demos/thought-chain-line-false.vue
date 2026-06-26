<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', title: '知识查询', description: '查询知识库', status: 'success' },
  { key: '2', title: 'Web 搜索', description: '工具调用', status: 'success' },
  { key: '3', title: '模型调用', description: '调用模型获取响应', status: 'success' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">line = true（默认，显示连接线）</div>
      <ak-thought-chain :line="true" :items="items"></ak-thought-chain>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">line = false（隐藏连接线）</div>
      <ak-thought-chain :line="false" :items="items"></ak-thought-chain>
    </div>
  </div>
</template>

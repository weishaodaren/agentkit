<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">maxRows = 2（超出后出现滚动条）</p>
      <ak-sender max-rows="2" placeholder="最多显示 2 行，继续输入会出现滚动条"></ak-sender>
    </div>

    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: rgba(0,0,0,0.65);">maxRows = 6（默认 8 行）</p>
      <ak-sender max-rows="6" placeholder="最多显示 6 行"></ak-sender>
    </div>
  </div>
</template>

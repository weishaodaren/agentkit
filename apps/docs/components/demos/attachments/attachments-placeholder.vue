<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">默认占位文本</div>
      <ak-attachments multiple></ak-attachments>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">自定义占位文本</div>
      <ak-attachments multiple placeholder="点击或拖拽图片到此处上传"></ak-attachments>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">带提示的占位文本</div>
      <ak-attachments multiple placeholder="支持 JPG、PNG、PDF，单文件不超过 10MB"></ak-attachments>
    </div>
  </div>
</template>

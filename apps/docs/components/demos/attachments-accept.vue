<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">accept = "image/*"（仅图片）</div>
      <ak-attachments accept="image/*" multiple placeholder="仅支持上传图片文件"></ak-attachments>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">accept = ".pdf,.doc,.docx"（文档类型）</div>
      <ak-attachments accept=".pdf,.doc,.docx" multiple placeholder="仅支持 PDF、Word 文档"></ak-attachments>
    </div>
  </div>
</template>

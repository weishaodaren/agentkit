<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 4px;">status = done（已完成）</div>
      <ak-file-card name="report.pdf" :size="1048576" status="done"></ak-file-card>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 4px;">status = pending（等待中）</div>
      <ak-file-card name="pending.docx" :size="512000" status="pending"></ak-file-card>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 4px;">status = error（上传失败）</div>
      <ak-file-card name="failed.zip" :size="2048000" status="error"></ak-file-card>
    </div>
  </div>
</template>

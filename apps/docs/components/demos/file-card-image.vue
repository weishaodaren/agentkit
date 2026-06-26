<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 4px;">type = image（图片缩略图）</div>
      <ak-file-card
        name="screenshot.png"
        :size="512000"
        status="done"
        type="image"
        thumb="https://placehold.co/80x80/1677ff/ffffff?text=PNG"
      ></ak-file-card>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 4px;">type = video（视频缩略图）</div>
      <ak-file-card
        name="demo.mp4"
        :size="10485760"
        status="done"
        type="video"
        thumb="https://placehold.co/80x80/52c41a/ffffff?text=MP4"
      ></ak-file-card>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 4px;">type = file（默认，显示文件图标）</div>
      <ak-file-card
        name="document.pdf"
        :size="102400"
        status="done"
        type="file"
      ></ak-file-card>
    </div>
  </div>
</template>

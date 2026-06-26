<script setup>
import '@agentkit/ui'
</script>

<template>
  <div>
    <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">
      mask = true，鼠标悬停时显示遮罩（将鼠标移到缩略图上查看效果）
    </div>
    <ak-file-card
      name="photo.jpg"
      :size="2048000"
      status="done"
      type="image"
      thumb="https://placehold.co/80x80/faad14/ffffff?text=JPG"
      mask
    ></ak-file-card>
  </div>
</template>

<script setup>
import '@agentkit/ui'

const files = [
  { name: '已完成文件.pdf', size: 102400, status: 'done' },
  { name: '上传中文件.png', size: 204800, status: 'uploading', progress: 65 },
  { name: '上传失败.docx', size: 51200, status: 'error' },
]
</script>

<template>
  <div>
    <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">
      files 属性设置已有文件列表，展示 done、uploading、error 三种状态
    </div>
    <ak-attachments :files="files" multiple></ak-attachments>
  </div>
</template>

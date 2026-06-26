<script setup>
import '@agentkit/ui'
import { ref } from 'vue'

const files = ref([
  { name: '文件1.pdf', size: 102400, status: 'done' },
  { name: '文件2.pdf', size: 204800, status: 'done' },
])

function onUpload(e) {
  const newFiles = e.detail.files.map((f) => ({ ...f, status: 'done' }))
  files.value = [...files.value, ...newFiles].slice(0, 3)
}

function onRemove(e) {
  files.value = files.value.filter((_, i) => i !== e.detail.index)
}
</script>

<template>
  <div>
    <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">
      maxCount = 3，达到上限后隐藏上传区域
    </div>
    <ak-attachments
      multiple
      :max-count="3"
      :files="files"
      placeholder="最多上传 3 个文件"
      @upload="onUpload"
      @remove="onRemove"
    ></ak-attachments>
  </div>
</template>

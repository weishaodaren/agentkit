<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="width: 100%;">
    <ak-sender placeholder="header 插槽放置可折叠面板">
      <ak-sender-header slot="header" title="附件上传" :open="false">
        <div style="padding: 12px 16px; display: flex; gap: 12px; align-items: center;">
          <button
            style="border: 1px dashed #d9d9d9; border-radius: 8px; padding: 12px 20px; background: #fafafa; cursor: pointer; font-size: 13px; color: rgba(0,0,0,0.65);"
          >点击上传文件</button>
          <span style="font-size: 12px; color: rgba(0,0,0,0.45);">支持 jpg, png, pdf 等格式</span>
        </div>
      </ak-sender-header>
    </ak-sender>
  </div>
</template>

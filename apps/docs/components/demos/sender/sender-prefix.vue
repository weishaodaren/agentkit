<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="width: 100%;">
    <ak-sender placeholder="prefix 插槽可放置附件、表情等按钮">
      <button
        slot="prefix"
        title="附件"
        style="border: none; background: transparent; cursor: pointer; padding: 4px; line-height: 1; color: rgba(0,0,0,0.65); display: inline-flex; align-items: center;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.93 8.8l-8.57 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
      </button>
      <button
        slot="prefix"
        title="表情"
        style="border: none; background: transparent; cursor: pointer; padding: 4px; line-height: 1; color: rgba(0,0,0,0.65); display: inline-flex; align-items: center;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
      </button>
    </ak-sender>
  </div>
</template>


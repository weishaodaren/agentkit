<script setup>
import '@agentkit/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <div>
      <div style="font-size: 12px; color: #999; margin-bottom: 8px;">outer-start（默认 for start）</div>
      <ak-bubble
        content="底部插槽位于气泡外部，左侧"
        footer-placement="outer-start"
        placement="start"
      >
        <div slot="footer" style="font-size: 12px; color: #999;">footer 内容</div>
      </ak-bubble>
    </div>
    <div>
      <div style="font-size: 12px; color: #999; margin-bottom: 8px;">inner-start</div>
      <ak-bubble
        content="底部插槽位于气泡内部，左侧"
        footer-placement="inner-start"
        placement="start"
      >
        <div slot="footer" style="font-size: 12px; color: #999;">footer 内容</div>
      </ak-bubble>
    </div>
    <div>
      <div style="font-size: 12px; color: #999; margin-bottom: 8px;">inner-end</div>
      <ak-bubble
        content="底部插槽位于气泡内部，右侧"
        footer-placement="inner-end"
        placement="start"
      >
        <div slot="footer" style="font-size: 12px; color: #999;">footer 内容</div>
      </ak-bubble>
    </div>
    <div>
      <div style="font-size: 12px; color: #999; margin-bottom: 8px;">outer-end（默认 for end）</div>
      <ak-bubble
        content="底部插槽位于气泡外部，右侧"
        footer-placement="outer-end"
        placement="start"
      >
        <div slot="footer" style="font-size: 12px; color: #999;">footer 内容</div>
      </ak-bubble>
    </div>
  </div>
</template>

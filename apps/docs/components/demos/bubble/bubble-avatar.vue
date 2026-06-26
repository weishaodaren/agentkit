<script setup>
import '@agentkit/ui'
const avatarUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=agentkit'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <ak-bubble
      content="带头像的气泡（placement=start）"
      :avatar="avatarUrl"
      placement="start"
    ></ak-bubble>
    <ak-bubble
      content="带头像的气泡（placement=end）"
      :avatar="avatarUrl"
      placement="end"
    ></ak-bubble>
  </div>
</template>

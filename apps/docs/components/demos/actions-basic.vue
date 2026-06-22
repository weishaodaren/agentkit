<script setup>
import '@agentkit/ui'
const items = [
  { key: 'reload', label: '', icon: 'refresh-cw' },
  { key: 'copy', label: '', icon: 'copy' },
  { key: 'like', label: '', icon: 'heart' },
  { key: 'dislike', label: '', icon: 'thumbs-down' },
]
</script>

<template>
  <ak-actions :items="items"></ak-actions>
</template>

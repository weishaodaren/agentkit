<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: 'Hot Topics', description: 'What are you interested in?' },
  { key: '2', label: "What's new in X?", description: 'Latest updates' },
  { key: '3', label: "What's AGI?", description: 'General intelligence' },
  { key: '4', label: 'Where is the doc?', description: 'Documentation link' },
  { key: '5', label: 'Design Guide', description: 'How to design a good product?' },
  { key: '6', label: 'Start Creating', description: 'How to start a new project?' },
]
</script>

<template>
  <ak-prompts title="Do you want?" wrap :items="items"></ak-prompts>
</template>

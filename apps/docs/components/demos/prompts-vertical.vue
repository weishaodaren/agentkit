<script setup>
import '@agentkit/ui'
const items = [
  { key: '1', label: ' Ignite Your Creativity', description: 'Got any sparks for a new project?' },
  { key: '2', label: 'Uncover Background Info', description: 'Help me understand the background of this topic.' },
  { key: '3', label: 'Efficiency Boost Battle', description: 'How can I work faster and better?' },
]
</script>

<template>
  <ak-prompts title="✨ Inspirational Sparks and Marvelous Tips" vertical :items="items"></ak-prompts>
</template>

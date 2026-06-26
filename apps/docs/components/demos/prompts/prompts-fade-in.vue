<script setup>
import '@agentkit/ui'
import { ref } from 'vue'

const items = [
  { key: '1', label: 'Ignite Your Creativity', description: 'Got any sparks for a new project?' },
  { key: '2', label: 'Uncover Background Info', description: 'Help me understand the background of this topic.' },
  { key: '3', label: 'Efficiency Boost Battle', description: 'How can I work faster and better?' },
  { key: '4', label: 'Tell me a Joke', description: 'Why do not ants get sick?' },
]

const useFadeInLeft = ref(true)
const visible = ref(true)

function reRender() {
  visible.value = false
  setTimeout(() => {
    visible.value = true
  }, 50)
}
</script>

<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
      <ak-button size="sm" @click="useFadeInLeft = true; reRender()">fadeInLeft</ak-button>
      <ak-button size="sm" @click="useFadeInLeft = false; reRender()">fadeIn</ak-button>
      <ak-button size="sm" variant="outline" @click="reRender">Re-Render</ak-button>
    </div>
    <ak-prompts
      v-if="visible"
      :key="useFadeInLeft + '-' + Date.now()"
      title="Fade In Effect"
      :fade-in="!useFadeInLeft"
      :fade-in-left="useFadeInLeft"
      :items="items"
    ></ak-prompts>
  </div>
</template>

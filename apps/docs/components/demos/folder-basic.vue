<script setup>
import '@agentkit/ui'
const items = [
  { key: 'src', label: 'src', children: [
    { key: 'index.ts', label: 'index.ts' },
    { key: 'app.tsx', label: 'App.tsx' },
    { key: 'utils', label: 'utils', children: [
      { key: 'helpers.ts', label: 'helpers.ts' },
    ]},
  ]},
  { key: 'package.json', label: 'package.json' },
  { key: 'tsconfig.json', label: 'tsconfig.json' },
]
</script>

<template>
  <ak-folder :items="items" active-key="index.ts" style="height: 300px;"></ak-folder>
</template>

<script setup>
import '@agentkit/ui'
const items = [
  { key: 'src', name: 'src', type: 'folder', children: [
    { key: 'index.ts', name: 'index.ts', type: 'file', content: 'export * from "./app";' },
    { key: 'app.tsx', name: 'App.tsx', type: 'file', content: 'export function App() { return null; }' },
  ]},
  { key: 'package.json', name: 'package.json', type: 'file', content: '{ "name": "demo" }' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">treeWidth = 160（较窄）</div>
      <ak-folder :items="items" :tree-width="160" style="height: 200px;"></ak-folder>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">treeWidth = 320（较宽）</div>
      <ak-folder :items="items" :tree-width="320" style="height: 200px;"></ak-folder>
    </div>
  </div>
</template>

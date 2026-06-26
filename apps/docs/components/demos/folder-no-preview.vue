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
  <div>
    <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">
      preview = false，仅显示文件树，不显示预览面板
    </div>
    <ak-folder :items="items" :preview="false" style="height: 200px;"></ak-folder>
  </div>
</template>

<script setup>
import '@agentkit/ui'
import { ref } from 'vue'

const filterValue = ref('')
const items = [
  { key: 'report', label: '写一份报告', value: 'report' },
  { key: 'review', label: '代码审查', value: 'review' },
  { key: 'translate', label: '翻译文本', value: 'translate' },
  { key: 'summarize', label: '总结内容', value: 'summarize' },
  { key: 'refactor', label: '重构代码', value: 'refactor' },
]

const selected = ref('')

function onInput(e) {
  filterValue.value = e.target.value
}

function onSelect(e) {
  selected.value = e.detail.value
  filterValue.value = ''
}
</script>

<template>
  <div style="position: relative;">
    <input
      :value="filterValue"
      @input="onInput"
      placeholder="输入关键词过滤建议项..."
      style="width: 100%; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;"
    />
    <div v-if="filterValue" style="margin-top: 4px;">
      <ak-suggestion
        :items="items"
        :open="true"
        :filter-value="filterValue"
        @select="onSelect"
      ></ak-suggestion>
    </div>
    <p v-if="selected" style="margin: 12px 0 0; font-size: 13px; color: #1677ff;">
      已选择：{{ selected }}
    </p>
  </div>
</template>

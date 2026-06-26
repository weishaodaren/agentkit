<script setup>
import '@agentkit/ui'
</script>

<template>
  <ak-think
    title="思考完成"
    content="这段思考内容默认是折叠的，点击标题可以展开查看。"
    :default-expanded="false"
  ></ak-think>
</template>

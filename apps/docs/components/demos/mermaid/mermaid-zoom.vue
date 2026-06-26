<script setup>
import '@agentkit/ui'

const code = `graph TD
  A[用户请求] --> B[网关路由]
  B --> C[认证服务]
  C --> D{权限校验}
  D -->|通过| E[业务逻辑]
  D -->|拒绝| F[返回 403]
  E --> G[数据持久化]
  G --> H[响应组装]
  H --> I[返回客户端]
  F --> I`
</script>

<template>
  <ak-mermaid :code="code"></ak-mermaid>
</template>

<script setup>
import '@agentkit/ui'
import '@agentkit/ui/code-highlighter'

const pythonCode = `def fibonacci(n):
    """Generate Fibonacci sequence up to n."""
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

print(fibonacci(100))`

const jsonCode = `{
  "name": "agentkit",
  "version": "1.0.0",
  "dependencies": {
    "lit": "^3.0.0",
    "highlight.js": "^11.0.0"
  },
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev"
  }
}`

const bashCode = `#!/bin/bash
# Build and deploy script
set -e

echo "Installing dependencies..."
pnpm install

echo "Building project..."
pnpm build

echo "Deploying to production..."
deploy --dist ./dist`
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">Python</div>
      <ak-code-highlighter language="python" :code="pythonCode"></ak-code-highlighter>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">JSON</div>
      <ak-code-highlighter language="json" :code="jsonCode"></ak-code-highlighter>
    </div>
    <div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.45); margin-bottom: 8px;">Bash</div>
      <ak-code-highlighter language="bash" :code="bashCode"></ak-code-highlighter>
    </div>
  </div>
</template>

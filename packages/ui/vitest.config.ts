import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  // 与 vite.config.ts 保持一致的路径别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    // 启用浏览器模式
    browser: {
      enabled: true,
      provider: playwright(), // vitest 4: 调用 factory 返回 provider 对象（含 serverFactory）
      instances: [
        {
          browser: "chromium", // 可选 'chromium' | 'firefox' | 'webkit'
        },
      ],
    },
    // 全局 API (describe, it, expect 等) 无需手动 import
    globals: true,
    // 测试文件匹配模式
    include: ["src/**/*.{test,spec}.{js,ts}"],
    // 测试前的 setup 文件
    setupFiles: ["./vitest.setup.ts"],
    // 覆盖率配置（可选）
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.{test,spec}.ts", "src/**/index.ts"],
    },
  },
});

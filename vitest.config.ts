import { defineConfig } from "vitest/config";

export default defineConfig({
  projects: ["apps/*", "packages/*"],
  test: {
    // 根级 test:watch 用：扫描所有包的测试文件
    include: ["packages/**/test/**/*.test.ts", "apps/**/test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**", "apps/*/src/**"],
      exclude: ["**/dist/**", "**/node_modules/**", "**/*.d.ts"],
      reporter: ["text", "json", "html"],
    },
  },
});

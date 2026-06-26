import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // vitest 4 multi-project：聚合 apps/* 与 packages/* 下各自的 vitest.config.ts
    // 各子项目用自己的 include（utils 用 test/**，ui 用 src/** co-located）
    projects: ["apps/*", "packages/*"],
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**", "apps/*/src/**"],
      exclude: ["**/dist/**", "**/node_modules/**", "**/*.d.ts"],
      reporter: ["text", "json", "html"],
    },
  },
});

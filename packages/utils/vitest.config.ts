import { defineConfig } from "vitest/config";

// 包级 Vitest 配置：turbo run test 在本包执行 `vitest run` 时读取
// include 限定到本包 test/ 目录，避免与根配置的 glob 冲突
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: ["**/dist/**", "**/node_modules/**", "**/*.d.ts"],
      reporter: ["text", "json", "html"],
    },
  },
});

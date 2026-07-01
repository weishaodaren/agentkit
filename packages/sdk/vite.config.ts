import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "unplugin-dts/vite";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: ["@agentkit/shared", "@mastra/client-js"],
      output: {
        preserveModules: true,
      },
    },
  },
});

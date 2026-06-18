import { defineConfig } from "vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import dts from "unplugin-dts/vite";

export default defineConfig({
  plugins: [tailwindcss(), dts()],
  css: {
    transformer: "lightningcss",
  },
  oxc: {},
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "adaptor/react": resolve(__dirname, "src/adaptor/react.ts"),
        "adaptor/vue": resolve(__dirname, "src/adaptor/vue.ts"),
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: [/^lit/, /^@lit/, /^react/, /^vue/],
    },
  },
});

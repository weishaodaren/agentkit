import { defineConfig } from "vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import dts from "unplugin-dts/vite";

export default defineConfig({
  plugins: [tailwindcss(), dts()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  css: {
    transformer: "lightningcss",
  },
  oxc: {},
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "adaptor/react": resolve(__dirname, "src/adaptor/react.ts"),
        "adaptor/react-plugins": resolve(
          __dirname,
          "src/adaptor/react-plugins.ts",
        ),
        "adaptor/vue": resolve(__dirname, "src/adaptor/vue.ts"),
        markdown: resolve(__dirname, "src/markdown.ts"),
        "code-highlighter": resolve(__dirname, "src/code-highlighter.ts"),
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        /^lit/,
        /^@lit/,
        /^react/,
        /^vue/,
        /^marked/,
        /^highlight\.js/,
      ],
    },
  },
});

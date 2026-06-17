import { defineConfig } from "vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import dts from "unplugin-dts/vite";

export default defineConfig({
  plugins: [tailwindcss(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AgentKitUI",
      fileName: "index",
      formats: ["es"],
    },
    rolldownOptions: {
      external: [/^lit/, /^@lit/],
    },
  },
});

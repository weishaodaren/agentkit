import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import dts from "unplugin-dts/vite";

export default defineConfig({
  plugins: [tailwindcss(), dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rolldownOptions: {
      external: [/^lit/, /^@lit/],
    },
  },
});

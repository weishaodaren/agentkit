import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  errorHandler: "./error.ts",
  routeRules: {
    "/api/**": { cors: true },
    "**": {
      headers: {
        "x-powered-by": "Nitro",
      },
    },
  },
  experimental: {
    envExpansion: true,
  },
  runtimeConfig: {
    nitro: {
      envPrefix: "APP_",
    },
    url: "https://{{APP_DOMAIN}}/api",
    logLevel: "info",
  },
});

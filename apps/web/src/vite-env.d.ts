/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Server API 基础 URL，留空则走 Vite proxy */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

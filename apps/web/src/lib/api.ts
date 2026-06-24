import { ofetch } from "ofetch";
import { REQUEST_TIMEOUT } from "@agentkit/shared";

/**
 * API 客户端实例
 * - 开发环境：通过 Vite proxy 转发到 server（port 4000）
 * - 生产环境：通过 VITE_API_BASE_URL 直连 server
 */
export const api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export { ofetch };

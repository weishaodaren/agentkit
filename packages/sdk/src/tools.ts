/**
 * @agentkit/sdk - 工具 API
 */

import type { SdkClientInstance } from "./client";

export interface ToolsApiInstance {
  /** 列出所有已注册的工具 */
  listTools(): Promise<Record<string, unknown>>;
  /** 获取工具详情 */
  getTool(toolId: string): Promise<unknown>;
}

/**
 * 创建工具 API 实例。
 */
export function createToolsApi(sdkClient: SdkClientInstance): ToolsApiInstance {
  return {
    async listTools() {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listTools();
      });
    },

    async getTool(toolId: string) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().getTool(toolId);
      });
    },
  };
}

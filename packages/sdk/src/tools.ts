/**
 * @agentkit/sdk - 工具 API
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface ToolsApiInstance {
  /** 列出所有已注册的工具 */
  listTools: (
    requestContext?: Parameters<MastraClient["listTools"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listTools"]>>>;
  /** 获取工具实例（返回 Tool 实例，可调用 details() / execute()） */
  getTool: (toolId: string) => ReturnType<MastraClient["getTool"]>;
  /** 列出工具提供者 */
  listToolProviders: () => Promise<
    Awaited<ReturnType<MastraClient["listToolProviders"]>>
  >;
  /** 获取工具提供者实例 */
  getToolProvider: (
    providerId: string,
  ) => ReturnType<MastraClient["getToolProvider"]>;
}

/**
 * 创建工具 API 实例。
 */
export const createToolsApi = (
  sdkClient: SdkClientInstance,
): ToolsApiInstance => {
  const client = sdkClient.getClient();

  return {
    listTools: (requestContext) =>
      sdkClient.call(() => client.listTools(requestContext)),

    getTool: (toolId) => client.getTool(toolId),

    listToolProviders: () => sdkClient.call(() => client.listToolProviders()),

    getToolProvider: (providerId) => client.getToolProvider(providerId),
  };
};

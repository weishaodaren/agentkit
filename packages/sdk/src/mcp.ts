/**
 * @agentkit/sdk - MCP 服务 API
 */

import type { SdkClientInstance } from "./client";

export interface McpApiInstance {
  /** 列出 MCP 服务器 */
  listServers(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取 MCP 服务器详情 */
  getServerDetails(
    serverId: string,
    params?: Record<string, unknown>,
  ): Promise<unknown>;
  /** 获取 MCP 服务器工具列表 */
  getServerTools(serverId: string): Promise<unknown>;
  /** 获取 MCP 服务器工具实例 */
  getServerTool(serverId: string, toolId: string): any;
  /** 列出 MCP 服务器资源 */
  getServerResources(serverId: string): Promise<unknown>;
  /** 读取 MCP 服务器资源内容 */
  readServerResource(serverId: string, uri: string): Promise<unknown>;
}

/**
 * 创建 MCP API 实例。
 */
export function createMcpApi(sdkClient: SdkClientInstance): McpApiInstance {
  const client = sdkClient.getClient();

  return {
    async listServers(params) {
      return sdkClient.call(async () => {
        return client.getMcpServers(params);
      });
    },

    async getServerDetails(serverId, params) {
      return sdkClient.call(async () => {
        return client.getMcpServerDetails(serverId, params);
      });
    },

    async getServerTools(serverId) {
      return sdkClient.call(async () => {
        return client.getMcpServerTools(serverId);
      });
    },

    getServerTool(serverId, toolId) {
      return client.getMcpServerTool(serverId, toolId);
    },

    async getServerResources(serverId) {
      return sdkClient.call(async () => {
        return client.getMcpServerResources(serverId);
      });
    },

    async readServerResource(serverId, uri) {
      return sdkClient.call(async () => {
        return client.readMcpServerResource(serverId, uri);
      });
    },
  };
}

/**
 * @agentkit/sdk - MCP API
 *
 * 对应 Mastra Client SDK 1.28.0 的 MCP Server 管理 API。
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface McpApiInstance {
  /** 列出 MCP 服务器 */
  listServers: (
    params?: Parameters<MastraClient["getMcpServers"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getMcpServers"]>>>;
  /** 获取 MCP 服务器详情 */
  getServerDetails: (
    serverId: string,
    params?: Parameters<MastraClient["getMcpServerDetails"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["getMcpServerDetails"]>>>;
  /** 获取 MCP 服务器工具列表 */
  getServerTools: (
    serverId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getMcpServerTools"]>>>;
  /** 获取 MCP 服务器工具实例 */
  getServerTool: (
    serverId: string,
    toolId: string,
  ) => ReturnType<MastraClient["getMcpServerTool"]>;
  /** 列出 MCP 服务器资源 */
  getServerResources: (
    serverId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getMcpServerResources"]>>>;
  /** 读取 MCP 服务器资源内容 */
  readServerResource: (
    serverId: string,
    uri: string,
  ) => Promise<Awaited<ReturnType<MastraClient["readMcpServerResource"]>>>;
}

/**
 * 创建 MCP API 实例
 */
export const createMcpApi = (sdkClient: SdkClientInstance): McpApiInstance => {
  const client = sdkClient.getClient();

  return {
    listServers: (params) => sdkClient.call(() => client.getMcpServers(params)),

    getServerDetails: (serverId, params) =>
      sdkClient.call(() => client.getMcpServerDetails(serverId, params)),

    getServerTools: (serverId) =>
      sdkClient.call(() => client.getMcpServerTools(serverId)),

    getServerTool: (serverId, toolId) =>
      client.getMcpServerTool(serverId, toolId),

    getServerResources: (serverId) =>
      sdkClient.call(() => client.getMcpServerResources(serverId)),

    readServerResource: (serverId, uri) =>
      sdkClient.call(() => client.readMcpServerResource(serverId, uri)),
  };
};

/**
 * @agentkit/sdk - Agents API
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

/** Agent 版本标识符 */
export type AgentVersionIdentifier =
  | Parameters<MastraClient["getAgent"]>[1]
  | undefined;

export interface AgentsApiInstance {
  /** 列出所有已注册的 Agent */
  listAgents: (
    requestContext?: Parameters<MastraClient["listAgents"]>[0],
    partial?: Parameters<MastraClient["listAgents"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["listAgents"]>>>;
  /** 列出 Agent 模型提供者 */
  listModelProviders: () => Promise<
    Awaited<ReturnType<MastraClient["listAgentsModelProviders"]>>
  >;
  /** 获取 Agent 实例（用于流式调用等） */
  getAgent: (
    agentId: Parameters<MastraClient["getAgent"]>[0],
    version?: AgentVersionIdentifier,
  ) => ReturnType<MastraClient["getAgent"]>;
  /** 获取 A2A 客户端 */
  getA2A: (agentId: string) => ReturnType<MastraClient["getA2A"]>;
}

/**
 * 创建 Agent API 实例
 */
export const createAgentsApi = (
  sdkClient: SdkClientInstance,
): AgentsApiInstance => {
  const client = sdkClient.getClient();

  return {
    listAgents: (requestContext, partial) =>
      sdkClient.call(() => client.listAgents(requestContext, partial)),

    listModelProviders: () =>
      sdkClient.call(() => client.listAgentsModelProviders()),

    getAgent: (agentId, version) => client.getAgent(agentId, version),

    getA2A: (agentId) => client.getA2A(agentId),
  };
};

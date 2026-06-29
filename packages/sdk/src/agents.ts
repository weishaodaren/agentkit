/**
 * @agentkit/sdk - Agent 发现 API
 */

import type { SdkClientInstance } from "./client";

export interface AgentsApiInstance {
  /** 列出所有已注册的 Agent */
  listAgents(): Promise<Record<string, unknown>>;
  /** 获取 Agent 实例（用于流式调用等） */
  getAgent(agentId: string): any;
  /** 获取 Agent 详细信息 */
  getAgentDetails(agentId: string): Promise<unknown>;
}

/**
 * 创建 Agent API 实例。
 */
export function createAgentsApi(sdkClient: SdkClientInstance): AgentsApiInstance {
  return {
    async listAgents() {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listAgents();
      });
    },

    getAgent(agentId: string) {
      return sdkClient.getClient().getAgent(agentId);
    },

    async getAgentDetails(agentId: string) {
      return sdkClient.call(async () => {
        const agent = sdkClient.getClient().getAgent(agentId);
        return agent.details();
      });
    },
  };
}

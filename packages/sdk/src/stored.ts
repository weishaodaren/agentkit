/**
 * @agentkit/sdk - 存储资源 API
 */

import type { SdkClientInstance } from "./client";

export interface StoredApiInstance {
  // Stored Agents
  listAgents(params?: Record<string, unknown>): Promise<unknown>;
  createAgent(params: Record<string, unknown>): Promise<unknown>;
  getAgent(id: string): any;

  // Stored Prompt Blocks
  listPromptBlocks(params?: Record<string, unknown>): Promise<unknown>;
  createPromptBlock(params: Record<string, unknown>): Promise<unknown>;
  getPromptBlock(id: string): any;

  // Stored Scorers
  listScorers(params?: Record<string, unknown>): Promise<unknown>;
  createScorer(params: Record<string, unknown>): Promise<unknown>;
  getScorer(id: string): Promise<unknown>;

  // Stored MCP Clients
  listMcpClients(params?: Record<string, unknown>): Promise<unknown>;
  createMcpClient(params: Record<string, unknown>): Promise<unknown>;
  getMcpClient(id: string): any;

  // Stored Skills
  listSkills(params?: Record<string, unknown>): Promise<unknown>;
  createSkill(params: Record<string, unknown>): Promise<unknown>;
  getSkill(id: string): any;

  // Tool Providers
  listToolProviders(): Promise<unknown>;
  getToolProvider(id: string): any;
}

/**
 * 创建存储资源 API 实例。
 */
export function createStoredApi(
  sdkClient: SdkClientInstance,
): StoredApiInstance {
  const client = sdkClient.getClient();

  return {
    // Stored Agents
    async listAgents(params) {
      return sdkClient.call(async () => client.listStoredAgents(params));
    },
    async createAgent(params) {
      return sdkClient.call(async () =>
        client.createStoredAgent(params as any),
      );
    },
    getAgent(id: string) {
      return client.getStoredAgent(id);
    },

    // Stored Prompt Blocks
    async listPromptBlocks(params) {
      return sdkClient.call(async () => client.listStoredPromptBlocks(params));
    },
    async createPromptBlock(params) {
      return sdkClient.call(async () =>
        client.createStoredPromptBlock(params as any),
      );
    },
    getPromptBlock(id: string) {
      return client.getStoredPromptBlock(id);
    },

    // Stored Scorers
    async listScorers(params) {
      return sdkClient.call(async () => client.listStoredScorers(params));
    },
    async createScorer(params) {
      return sdkClient.call(async () =>
        client.createStoredScorer(params as any),
      );
    },
    async getScorer(id) {
      return sdkClient.call(async () => client.getStoredScorer(id));
    },

    // Stored MCP Clients
    async listMcpClients(params) {
      return sdkClient.call(async () => client.listStoredMCPClients(params));
    },
    async createMcpClient(params) {
      return sdkClient.call(async () =>
        client.createStoredMCPClient(params as any),
      );
    },
    getMcpClient(id: string) {
      return client.getStoredMCPClient(id);
    },

    // Stored Skills
    async listSkills(params) {
      return sdkClient.call(async () => client.listStoredSkills(params));
    },
    async createSkill(params) {
      return sdkClient.call(async () =>
        client.createStoredSkill(params as any),
      );
    },
    getSkill(id: string) {
      return client.getStoredSkill(id);
    },

    // Tool Providers
    async listToolProviders() {
      return sdkClient.call(async () => client.listToolProviders());
    },
    getToolProvider(id: string) {
      return client.getToolProvider(id);
    },
  };
}

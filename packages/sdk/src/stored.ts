/**
 * @agentkit/sdk - Stored Resources API
 *
 * 对应 Mastra Client SDK 1.28.0 的 Stored Agents/PromptBlocks/Scorers/MCP Clients/Skills API。
 * 这些是持久化到数据库的可管理资源，支持 CRUD 操作。
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface StoredApiInstance {
  // ── Stored Agents ──────────────────────────────────────────────
  /** 列出存储的 Agent */
  listAgents: (
    params?: Parameters<MastraClient["listStoredAgents"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listStoredAgents"]>>>;
  /** 创建存储的 Agent */
  createAgent: (
    params: Parameters<MastraClient["createStoredAgent"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["createStoredAgent"]>>>;
  /** 获取存储的 Agent 实例 */
  getAgent: (
    storedAgentId: string,
  ) => ReturnType<MastraClient["getStoredAgent"]>;

  // ── Stored Prompt Blocks ───────────────────────────────────────
  /** 列出存储的提示词块 */
  listPromptBlocks: (
    params?: Parameters<MastraClient["listStoredPromptBlocks"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listStoredPromptBlocks"]>>>;
  /** 创建存储的提示词块 */
  createPromptBlock: (
    params: Parameters<MastraClient["createStoredPromptBlock"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["createStoredPromptBlock"]>>>;
  /** 获取存储的提示词块实例 */
  getPromptBlock: (
    storedPromptBlockId: string,
  ) => ReturnType<MastraClient["getStoredPromptBlock"]>;

  // ── Stored Scorers ─────────────────────────────────────────────
  /** 列出存储的评分器 */
  listScorers: (
    params?: Parameters<MastraClient["listStoredScorers"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listStoredScorers"]>>>;
  /** 创建存储的评分器 */
  createScorer: (
    params: Parameters<MastraClient["createStoredScorer"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["createStoredScorer"]>>>;
  /** 获取存储的评分器实例 */
  getScorer: (
    storedScorerId: string,
  ) => ReturnType<MastraClient["getStoredScorer"]>;

  // ── Stored MCP Clients ─────────────────────────────────────────
  /** 列出存储的 MCP 客户端 */
  listMcpClients: (
    params?: Parameters<MastraClient["listStoredMCPClients"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listStoredMCPClients"]>>>;
  /** 创建存储的 MCP 客户端 */
  createMcpClient: (
    params: Parameters<MastraClient["createStoredMCPClient"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["createStoredMCPClient"]>>>;
  /** 获取存储的 MCP 客户端实例 */
  getMcpClient: (
    storedMCPClientId: string,
  ) => ReturnType<MastraClient["getStoredMCPClient"]>;

  // ── Stored Skills ──────────────────────────────────────────────
  /** 列出存储的技能 */
  listSkills: (
    params?: Parameters<MastraClient["listStoredSkills"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listStoredSkills"]>>>;
  /** 创建存储的技能 */
  createSkill: (
    params: Parameters<MastraClient["createStoredSkill"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["createStoredSkill"]>>>;
  /** 获取存储的技能实例 */
  getSkill: (
    storedSkillId: string,
  ) => ReturnType<MastraClient["getStoredSkill"]>;
}

/**
 * 创建 Stored Resources API 实例
 */
export const createStoredApi = (
  sdkClient: SdkClientInstance,
): StoredApiInstance => {
  const client = sdkClient.getClient();

  return {
    // ── Stored Agents ──────────────────────────────────────────
    listAgents: (params) =>
      sdkClient.call(() => client.listStoredAgents(params)),

    createAgent: (params) =>
      sdkClient.call(() => client.createStoredAgent(params)),

    getAgent: (storedAgentId) => client.getStoredAgent(storedAgentId),

    // ── Stored Prompt Blocks ───────────────────────────────────
    listPromptBlocks: (params) =>
      sdkClient.call(() => client.listStoredPromptBlocks(params)),

    createPromptBlock: (params) =>
      sdkClient.call(() => client.createStoredPromptBlock(params)),

    getPromptBlock: (storedPromptBlockId) =>
      client.getStoredPromptBlock(storedPromptBlockId),

    // ── Stored Scorers ─────────────────────────────────────────
    listScorers: (params) =>
      sdkClient.call(() => client.listStoredScorers(params)),

    createScorer: (params) =>
      sdkClient.call(() => client.createStoredScorer(params)),

    getScorer: (storedScorerId) => client.getStoredScorer(storedScorerId),

    // ── Stored MCP Clients ─────────────────────────────────────
    listMcpClients: (params) =>
      sdkClient.call(() => client.listStoredMCPClients(params)),

    createMcpClient: (params) =>
      sdkClient.call(() => client.createStoredMCPClient(params)),

    getMcpClient: (storedMCPClientId) =>
      client.getStoredMCPClient(storedMCPClientId),

    // ── Stored Skills ──────────────────────────────────────────
    listSkills: (params) =>
      sdkClient.call(() => client.listStoredSkills(params)),

    createSkill: (params) =>
      sdkClient.call(() => client.createStoredSkill(params)),

    getSkill: (storedSkillId) => client.getStoredSkill(storedSkillId),
  };
};

/**
 * @agentkit/sdk - Builder & System API
 *
 * 对应 Mastra Client SDK 1.28.0 的：
 * - Agent Builder API（agent-builder 工作流）
 * - Agent Controllers API
 * - System API（系统包信息）
 * - Editor/Builder API（构建器设置、模型、权限、注册表）
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface BuilderApiInstance {
  // ── Agent Builder ──────────────────────────────────────────────
  /** 获取所有 Agent Builder 动作 */
  getAgentBuilderActions: () => Promise<
    Awaited<ReturnType<MastraClient["getAgentBuilderActions"]>>
  >;
  /** 获取 Agent Builder 动作实例 */
  getAgentBuilderAction: (
    actionId: string,
  ) => ReturnType<MastraClient["getAgentBuilderAction"]>;

  // ── Agent Controllers ──────────────────────────────────────────
  /** 列出 Agent 控制器 */
  listAgentControllers: () => Promise<
    Awaited<ReturnType<MastraClient["listAgentControllers"]>>
  >;
  /** 获取 Agent 控制器实例 */
  getAgentController: (
    controllerId: string,
  ) => ReturnType<MastraClient["getAgentController"]>;

  // ── System ─────────────────────────────────────────────────────
  /** 获取已安装的 Mastra 包及版本 */
  getSystemPackages: () => Promise<
    Awaited<ReturnType<MastraClient["getSystemPackages"]>>
  >;

  // ── Editor / Builder ───────────────────────────────────────────
  /** 获取构建器设置（功能开关） */
  getSettings: () => Promise<
    Awaited<ReturnType<MastraClient["getBuilderSettings"]>>
  >;
  /** 获取可用模型（受策略过滤） */
  getAvailableModels: () => Promise<
    Awaited<ReturnType<MastraClient["getBuilderAvailableModels"]>>
  >;
  /** 获取权限模式列表 */
  getPermissionPatterns: () => Promise<
    Awaited<ReturnType<MastraClient["getPermissionPatterns"]>>
  >;
  /** 获取基础设施状态 */
  getInfrastructureStatus: () => Promise<
    Awaited<ReturnType<MastraClient["getInfrastructureStatus"]>>
  >;
  /** 列出技能注册表 */
  listRegistries: () => Promise<
    Awaited<ReturnType<MastraClient["listBuilderRegistries"]>>
  >;
  /** 搜索技能注册表 */
  searchRegistry: (
    registryId: string,
    params: Parameters<MastraClient["searchBuilderRegistry"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["searchBuilderRegistry"]>>>;
  /** 获取热门技能 */
  getPopular: (
    registryId: string,
    params?: Parameters<MastraClient["getBuilderRegistryPopular"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["getBuilderRegistryPopular"]>>>;
  /** 获取技能预览 */
  getPreview: (
    registryId: string,
    params: Parameters<MastraClient["getBuilderRegistryPreview"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["getBuilderRegistryPreview"]>>>;
  /** 安装注册表技能 */
  installSkill: (
    registryId: string,
    body: Parameters<MastraClient["installBuilderRegistrySkill"]>[1],
  ) => Promise<
    Awaited<ReturnType<MastraClient["installBuilderRegistrySkill"]>>
  >;
}

/**
 * 创建 Builder & System API 实例
 */
export const createBuilderApi = (
  sdkClient: SdkClientInstance,
): BuilderApiInstance => {
  const client = sdkClient.getClient();

  return {
    // ── Agent Builder ──────────────────────────────────────────
    getAgentBuilderActions: () =>
      sdkClient.call(() => client.getAgentBuilderActions()),

    getAgentBuilderAction: (actionId) => client.getAgentBuilderAction(actionId),

    // ── Agent Controllers ──────────────────────────────────────
    listAgentControllers: () =>
      sdkClient.call(() => client.listAgentControllers()),

    getAgentController: (controllerId) =>
      client.getAgentController(controllerId),

    // ── System ─────────────────────────────────────────────────
    getSystemPackages: () => sdkClient.call(() => client.getSystemPackages()),

    // ── Editor / Builder ───────────────────────────────────────
    getSettings: () => sdkClient.call(() => client.getBuilderSettings()),

    getAvailableModels: () =>
      sdkClient.call(() => client.getBuilderAvailableModels()),

    getPermissionPatterns: () =>
      sdkClient.call(() => client.getPermissionPatterns()),

    getInfrastructureStatus: () =>
      sdkClient.call(() => client.getInfrastructureStatus()),

    listRegistries: () => sdkClient.call(() => client.listBuilderRegistries()),

    searchRegistry: (registryId, params) =>
      sdkClient.call(() => client.searchBuilderRegistry(registryId, params)),

    getPopular: (registryId, params) =>
      sdkClient.call(() =>
        client.getBuilderRegistryPopular(registryId, params),
      ),

    getPreview: (registryId, params) =>
      sdkClient.call(() =>
        client.getBuilderRegistryPreview(registryId, params),
      ),

    installSkill: (registryId, body) =>
      sdkClient.call(() =>
        client.installBuilderRegistrySkill(registryId, body),
      ),
  };
};

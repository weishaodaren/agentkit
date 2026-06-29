/**
 * @agentkit/sdk - Agent Builder API
 */

import type { SdkClientInstance } from "./client";

export interface BuilderApiInstance {
  /** 获取构建器设置 */
  getSettings(): Promise<unknown>;
  /** 获取可用模型 */
  getAvailableModels(): Promise<unknown>;
  /** 获取权限模式 */
  getPermissionPatterns(): Promise<unknown>;
  /** 获取基础设施状态 */
  getInfrastructureStatus(): Promise<unknown>;
  /** 列出技能注册表 */
  listRegistries(): Promise<unknown>;
  /** 搜索技能注册表 */
  searchRegistry(
    registryId: string,
    params: { q: string; limit?: number },
  ): Promise<unknown>;
  /** 获取热门技能 */
  getPopular(
    registryId: string,
    params?: Record<string, unknown>,
  ): Promise<unknown>;
  /** 获取技能预览 */
  getPreview(
    registryId: string,
    params: { owner: string; repo: string; path: string },
  ): Promise<unknown>;
  /** 安装技能 */
  installSkill(
    registryId: string,
    body: { owner: string; repo: string; skillName: string },
  ): Promise<unknown>;
}

/**
 * 创建 Agent Builder API 实例。
 */
export function createBuilderApi(
  sdkClient: SdkClientInstance,
): BuilderApiInstance {
  const client = sdkClient.getClient();

  return {
    async getSettings() {
      return sdkClient.call(async () => client.getBuilderSettings());
    },
    async getAvailableModels() {
      return sdkClient.call(async () => client.getBuilderAvailableModels());
    },
    async getPermissionPatterns() {
      return sdkClient.call(async () => client.getPermissionPatterns());
    },
    async getInfrastructureStatus() {
      return sdkClient.call(async () => client.getInfrastructureStatus());
    },
    async listRegistries() {
      return sdkClient.call(async () => client.listBuilderRegistries());
    },
    async searchRegistry(registryId, params) {
      return sdkClient.call(async () =>
        client.searchBuilderRegistry(registryId, params),
      );
    },
    async getPopular(registryId, params) {
      return sdkClient.call(async () =>
        client.getBuilderRegistryPopular(registryId, params as any),
      );
    },
    async getPreview(registryId, params) {
      return sdkClient.call(async () =>
        client.getBuilderRegistryPreview(registryId, params),
      );
    },
    async installSkill(registryId, body) {
      return sdkClient.call(async () =>
        client.installBuilderRegistrySkill(registryId, body as any),
      );
    },
  };
}

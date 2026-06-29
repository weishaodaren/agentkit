/**
 * @agentkit/sdk - 工作空间 API
 */

import type { SdkClientInstance } from "./client";

export interface WorkspaceApiInstance {
  /** 列出所有工作空间 */
  listWorkspaces(): Promise<unknown>;
  /** 获取工作空间实例 */
  getWorkspace(workspaceId: string): any;
  /** 列出存储的工作空间 */
  listStoredWorkspaces(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取存储的工作空间 */
  getStoredWorkspace(id: string): Promise<unknown>;
}

/**
 * 创建工作空间 API 实例。
 */
export function createWorkspaceApi(
  sdkClient: SdkClientInstance,
): WorkspaceApiInstance {
  const client = sdkClient.getClient();

  return {
    async listWorkspaces() {
      return sdkClient.call(async () => client.listWorkspaces());
    },

    getWorkspace(workspaceId: string) {
      return client.getWorkspace(workspaceId);
    },

    async listStoredWorkspaces(params) {
      return sdkClient.call(async () => client.listStoredWorkspaces(params));
    },

    async getStoredWorkspace(id) {
      return sdkClient.call(async () => client.getStoredWorkspace(id));
    },
  };
}

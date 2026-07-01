/**
 * @agentkit/sdk - Workspace API
 *
 * 对应 Mastra Client SDK 1.28.0 的 Workspaces + Stored Workspaces API
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface WorkspaceApiInstance {
  /** 列出所有工作空间 */
  listWorkspaces: () => Promise<
    Awaited<ReturnType<MastraClient["listWorkspaces"]>>
  >;
  /** 获取工作空间实例（用于文件系统、搜索、技能操作） */
  getWorkspace: (
    workspaceId: string,
  ) => ReturnType<MastraClient["getWorkspace"]>;
  /** 列出存储的工作空间配置 */
  listStoredWorkspaces: (
    params?: Parameters<MastraClient["listStoredWorkspaces"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listStoredWorkspaces"]>>>;
  /** 获取存储的工作空间 */
  getStoredWorkspace: (
    id: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getStoredWorkspace"]>>>;
}

/**
 * 创建 Workspace API 实例
 */
export const createWorkspaceApi = (
  sdkClient: SdkClientInstance,
): WorkspaceApiInstance => {
  const client = sdkClient.getClient();

  return {
    listWorkspaces: () => sdkClient.call(() => client.listWorkspaces()),

    getWorkspace: (workspaceId) => client.getWorkspace(workspaceId),

    listStoredWorkspaces: (params) =>
      sdkClient.call(() => client.listStoredWorkspaces(params)),

    getStoredWorkspace: (id) =>
      sdkClient.call(() => client.getStoredWorkspace(id)),
  };
};

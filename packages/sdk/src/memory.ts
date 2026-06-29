/**
 * @agentkit/sdk - 记忆/线程 API
 */

import type { SdkClientInstance } from "./client";

export interface MemoryApiInstance {
  /** 列出记忆线程 */
  listThreads(params?: Record<string, unknown>): Promise<unknown>;
  /** 创建新线程 */
  createThread(params: Record<string, unknown>): Promise<unknown>;
  /** 获取线程实例 */
  getThread(threadId: string, agentId?: string): any;
  /** 获取线程消息 */
  getThreadMessages(threadId: string, opts?: Record<string, unknown>): Promise<unknown>;
  /** 删除线程 */
  deleteThread(threadId: string, agentId: string): Promise<unknown>;
  /** 保存消息到记忆 */
  saveMessages(params: Record<string, unknown>): Promise<unknown>;
}

/**
 * 创建记忆 API 实例。
 */
export function createMemoryApi(
  sdkClient: SdkClientInstance,
): MemoryApiInstance {
  return {
    async listThreads(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listMemoryThreads(params);
      });
    },

    async createThread(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().createMemoryThread(params as any);
      });
    },

    getThread(threadId: string, agentId?: string) {
      return sdkClient
        .getClient()
        .getMemoryThread({ threadId, agentId } as any);
    },

    async getThreadMessages(threadId, opts) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listThreadMessages(threadId, opts);
      });
    },

    async deleteThread(threadId, agentId) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().deleteThread(threadId, { agentId });
      });
    },

    async saveMessages(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().saveMessageToMemory(params as any);
      });
    },
  };
}

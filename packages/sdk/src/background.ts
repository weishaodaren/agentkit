/**
 * @agentkit/sdk - 后台任务 API
 */

import type { SdkClientInstance } from "./client";

export interface BackgroundApiInstance {
  /** 列出后台任务 */
  listTasks(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取后台任务 */
  getTask(taskId: string): Promise<unknown>;
  /** 流式监听后台任务事件 */
  streamTasks(params?: Record<string, unknown>): Promise<unknown>;
}

/**
 * 创建后台任务 API 实例。
 */
export function createBackgroundApi(
  sdkClient: SdkClientInstance,
): BackgroundApiInstance {
  const client = sdkClient.getClient();

  return {
    async listTasks(params) {
      return sdkClient.call(async () => client.listBackgroundTasks(params));
    },

    async getTask(taskId) {
      return sdkClient.call(async () => client.getBackgroundTask(taskId));
    },

    async streamTasks(params) {
      return sdkClient.call(async () => client.streamBackgroundTasks(params));
    },
  };
}

/**
 * @agentkit/sdk - Logs API
 *
 * 对应 Mastra Client SDK 文档中的 Logs API。
 */

import type { SdkClientInstance } from "./client";

export interface LogsApiInstance {
  /** 列出日志（旧版） */
  listLogs(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取日志（按 runId） */
  getLogForRun(params: Record<string, unknown>): Promise<unknown>;
  /** 列出日志（新版） */
  listLogsVNext(params?: Record<string, unknown>): Promise<unknown>;
}

/**
 * 创建 Logs API 实例。
 */
export function createLogsApi(
  sdkClient: SdkClientInstance,
): LogsApiInstance {
  const client = sdkClient.getClient();

  return {
    async listLogs(params) {
      return sdkClient.call(async () => client.listLogs(params as any));
    },

    async getLogForRun(params) {
      return sdkClient.call(async () => client.getLogForRun(params as any));
    },

    async listLogsVNext(params) {
      return sdkClient.call(async () => client.listLogsVNext(params as any));
    },
  };
}

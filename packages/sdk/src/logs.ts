/**
 * @agentkit/sdk - Logs API
 *
 * 对应 Mastra Client SDK 文档中的 Logs API
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface LogsApiInstance {
  /** 列出日志（旧版） */
  listLogs: (
    params: Parameters<MastraClient["listLogs"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listLogs"]>>>;
  /** 获取日志（按 runId） */
  getLogForRun: (
    params: Parameters<MastraClient["getLogForRun"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getLogForRun"]>>>;
  /** 列出日志（新版） */
  listLogsVNext: (
    params?: Parameters<MastraClient["listLogsVNext"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listLogsVNext"]>>>;
  /** 列出日志传输 */
  listLogTransports: () => Promise<
    Awaited<ReturnType<MastraClient["listLogTransports"]>>
  >;
}

/**
 * 创建 Logs API 实例。
 */
export const createLogsApi = (
  sdkClient: SdkClientInstance,
): LogsApiInstance => {
  const client = sdkClient.getClient();

  return {
    listLogs: (params) => sdkClient.call(() => client.listLogs(params)),

    getLogForRun: (params) => sdkClient.call(() => client.getLogForRun(params)),

    listLogsVNext: (params) =>
      sdkClient.call(() => client.listLogsVNext(params)),

    listLogTransports: () => sdkClient.call(() => client.listLogTransports()),
  };
};

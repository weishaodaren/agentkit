/**
 * @agentkit/sdk - 可观测性 API
 */

import type { SdkClientInstance } from "./client";

export interface ObservabilityApiInstance {
  /** 列出日志 */
  listLogs(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取日志 */
  getLog(params: Record<string, unknown>): Promise<unknown>;
  /** 列出追踪 */
  listTraces(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取单个追踪 */
  getTrace(traceId: string): Promise<unknown>;
  /** 列出评分 */
  listScores(params?: Record<string, unknown>): Promise<unknown>;
}

/**
 * 创建可观测性 API 实例。
 */
export function createObservabilityApi(
  sdkClient: SdkClientInstance,
): ObservabilityApiInstance {
  return {
    async listLogs(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listLogs(params as any);
      });
    },

    async getLog(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().getLogForRun(params as any);
      });
    },

    async listTraces(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listTraces(params as any);
      });
    },

    async getTrace(traceId) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().getTrace(traceId);
      });
    },

    async listScores(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listScores(params as any);
      });
    },
  };
}

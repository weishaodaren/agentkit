/**
 * @agentkit/sdk - 处理器 API
 */

import type { SdkClientInstance } from "./client";

export interface ProcessorsApiInstance {
  /** 列出处理器 */
  listProcessors(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取处理器实例 */
  getProcessor(processorId: string): any;
  /** 列出处理器提供者 */
  listProviders(): Promise<unknown>;
  /** 获取处理器提供者实例 */
  getProvider(providerId: string): any;
}

/**
 * 创建处理器 API 实例。
 */
export function createProcessorsApi(
  sdkClient: SdkClientInstance,
): ProcessorsApiInstance {
  const client = sdkClient.getClient();

  return {
    async listProcessors(params) {
      return sdkClient.call(async () => client.listProcessors(params));
    },

    getProcessor(processorId: string) {
      return client.getProcessor(processorId);
    },

    async listProviders() {
      return sdkClient.call(async () => client.getProcessorProviders());
    },

    getProvider(providerId: string) {
      return client.getProcessorProvider(providerId);
    },
  };
}

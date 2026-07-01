/**
 * @agentkit/sdk - Processors API
 *
 * 对应 Mastra Client SDK 1.28.0 的 Processors + Processor Providers API。
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface ProcessorsApiInstance {
  /** 列出所有处理器 */
  listProcessors: (
    requestContext?: Parameters<MastraClient["listProcessors"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listProcessors"]>>>;
  /** 获取处理器实例 */
  getProcessor: (
    processorId: string,
  ) => ReturnType<MastraClient["getProcessor"]>;
  /** 列出处理器提供者 */
  listProviders: () => Promise<
    Awaited<ReturnType<MastraClient["getProcessorProviders"]>>
  >;
  /** 获取处理器提供者实例 */
  getProvider: (
    providerId: string,
  ) => ReturnType<MastraClient["getProcessorProvider"]>;
}

/**
 * 创建 Processors API 实例
 */
export const createProcessorsApi = (
  sdkClient: SdkClientInstance,
): ProcessorsApiInstance => {
  const client = sdkClient.getClient();

  return {
    listProcessors: (requestContext) =>
      sdkClient.call(() => client.listProcessors(requestContext)),

    getProcessor: (processorId) => client.getProcessor(processorId),

    listProviders: () => sdkClient.call(() => client.getProcessorProviders()),

    getProvider: (providerId) => client.getProcessorProvider(providerId),
  };
};

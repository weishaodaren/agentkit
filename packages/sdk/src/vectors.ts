/**
 * @agentkit/sdk - Vectors API
 * 提供向量嵌入和语义搜索能力
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface VectorsApiInstance {
  /** 列出所有向量存储 */
  listVectors: () => Promise<Awaited<ReturnType<MastraClient["listVectors"]>>>;
  /** 获取向量实例 */
  getVector: (vectorName: string) => ReturnType<MastraClient["getVector"]>;
  /** 列出所有嵌入模型 */
  listEmbedders: () => Promise<
    Awaited<ReturnType<MastraClient["listEmbedders"]>>
  >;
}

/**
 * 创建 Vectors API 实例
 */
export const createVectorsApi = (
  sdkClient: SdkClientInstance,
): VectorsApiInstance => {
  const client = sdkClient.getClient();

  return {
    listVectors: () => sdkClient.call(() => client.listVectors()),

    getVector: (vectorName) => client.getVector(vectorName),

    listEmbedders: () => sdkClient.call(() => client.listEmbedders()),
  };
};

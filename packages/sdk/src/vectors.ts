/**
 * @agentkit/sdk - Vectors API
 *
 * 对应 Mastra Client SDK 文档中的 Vectors API。
 * 提供向量嵌入和语义搜索能力。
 */

import type { SdkClientInstance } from "./client";

export interface VectorsApiInstance {
  /** 列出所有向量存储 */
  listVectors(): Promise<unknown>;
  /** 获取向量实例 */
  getVector(vectorName: string): any;
  /** 列出所有嵌入模型 */
  listEmbedders(): Promise<unknown>;
}

/**
 * 创建 Vectors API 实例。
 */
export function createVectorsApi(
  sdkClient: SdkClientInstance,
): VectorsApiInstance {
  const client = sdkClient.getClient();

  return {
    async listVectors() {
      return sdkClient.call(async () => client.listVectors());
    },

    getVector(vectorName: string) {
      return client.getVector(vectorName);
    },

    async listEmbedders() {
      return sdkClient.call(async () => client.listEmbedders());
    },
  };
}

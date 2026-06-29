/**
 * @agentkit/sdk - 向量/嵌入 API
 */

import type { SdkClientInstance } from "./client";

export interface StorageApiInstance {
  /** 获取向量实例 */
  getVector(vectorName: string): any;
  /** 列出所有向量存储 */
  listVectors(): Promise<unknown>;
  /** 列出所有嵌入模型 */
  listEmbedders(): Promise<unknown>;
}

/**
 * 创建存储 API 实例。
 */
export function createStorageApi(
  sdkClient: SdkClientInstance,
): StorageApiInstance {
  const client = sdkClient.getClient();

  return {
    getVector(vectorName: string) {
      return client.getVector(vectorName);
    },

    async listVectors() {
      return sdkClient.call(async () => {
        return client.listVectors();
      });
    },

    async listEmbedders() {
      return sdkClient.call(async () => {
        return client.listEmbedders();
      });
    },
  };
}

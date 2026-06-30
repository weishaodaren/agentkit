/**
 * @agentkit/sdk - Responses API (Experimental)
 *
 * 对应 Mastra Client SDK 文档中的 Responses API。
 * 使用 Mastra Agent 作为 OpenAI 兼容的 agent-backed Responses API。
 */

import type { SdkClientInstance } from "./client";

export interface ResponsesApiInstance {
  /** 创建响应 */
  create(params: Record<string, unknown>): Promise<unknown>;
  /** 流式创建响应 */
  stream(params: Record<string, unknown>): Promise<unknown>;
  /** 获取响应 */
  retrieve(responseId: string): Promise<unknown>;
  /** 删除响应 */
  delete(responseId: string): Promise<unknown>;
}

/**
 * 创建 Responses API 实例。
 */
export function createResponsesApi(
  sdkClient: SdkClientInstance,
): ResponsesApiInstance {
  const client = sdkClient.getClient();

  return {
    async create(params) {
      return sdkClient.call(async () => client.responses.create(params as any));
    },

    async stream(params) {
      return sdkClient.call(async () => client.responses.stream(params as any));
    },

    async retrieve(responseId) {
      return sdkClient.call(async () => client.responses.retrieve(responseId));
    },

    async delete(responseId) {
      return sdkClient.call(async () => client.responses.delete(responseId));
    },
  };
}

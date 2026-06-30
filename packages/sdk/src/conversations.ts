/**
 * @agentkit/sdk - Conversations API (Experimental)
 *
 * 对应 Mastra Client SDK 文档中的 Conversations API。
 * 用于管理和检查存储的对话线程及对话项。
 */

import type { SdkClientInstance } from "./client";

export interface ConversationsApiInstance {
  /** 创建对话 */
  create(params: Record<string, unknown>): Promise<unknown>;
  /** 获取对话 */
  retrieve(conversationId: string): Promise<unknown>;
  /** 列出对话项 */
  listItems(
    conversationId: string,
    params?: Record<string, unknown>,
  ): Promise<unknown>;
}

/**
 * 创建 Conversations API 实例。
 */
export function createConversationsApi(
  sdkClient: SdkClientInstance,
): ConversationsApiInstance {
  const client = sdkClient.getClient();

  return {
    async create(params) {
      return sdkClient.call(async () =>
        client.conversations.create(params as any),
      );
    },

    async retrieve(conversationId) {
      return sdkClient.call(async () =>
        client.conversations.retrieve(conversationId),
      );
    },

    async listItems(conversationId, params) {
      return sdkClient.call(async () =>
        client.conversations.items.list(conversationId, params as any),
      );
    },
  };
}

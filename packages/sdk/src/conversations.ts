/**
 * @agentkit/sdk - Conversations API (Experimental)
 *
 * 对应 Mastra Client SDK 文档中的 Conversations API。
 * 用于管理和检查存储的对话线程及对话项。
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

type ConversationsResource = MastraClient["conversations"];

export interface ConversationsApiInstance {
  /** 创建对话 */
  create: (
    params: Parameters<ConversationsResource["create"]>[0],
  ) => Promise<Awaited<ReturnType<ConversationsResource["create"]>>>;
  /** 获取对话 */
  retrieve: (
    conversationId: string,
  ) => Promise<Awaited<ReturnType<ConversationsResource["retrieve"]>>>;
  /** 列出对话项 */
  listItems: (
    conversationId: string,
    params?: Parameters<ConversationsResource["items"]["list"]>[1],
  ) => Promise<Awaited<ReturnType<ConversationsResource["items"]["list"]>>>;
}

/**
 * 创建 Conversations API 实例。
 */
export const createConversationsApi = (
  sdkClient: SdkClientInstance,
): ConversationsApiInstance => {
  const client = sdkClient.getClient();

  return {
    create: (params) =>
      sdkClient.call(() => client.conversations.create(params)),

    retrieve: (conversationId) =>
      sdkClient.call(() => client.conversations.retrieve(conversationId)),

    listItems: (conversationId, params) =>
      sdkClient.call(() =>
        client.conversations.items.list(conversationId, params),
      ),
  };
};

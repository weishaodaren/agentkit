/**
 * @agentkit/sdk - Responses API (Experimental)
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

type ResponsesResource = MastraClient["responses"];

export interface ResponsesApiInstance {
  /** 创建响应 */
  create: (
    params: Parameters<ResponsesResource["create"]>[0],
  ) => Promise<Awaited<ReturnType<ResponsesResource["create"]>>>;
  /** 流式创建响应 */
  stream: (
    params: Parameters<ResponsesResource["stream"]>[0],
  ) => Promise<Awaited<ReturnType<ResponsesResource["stream"]>>>;
  /** 获取响应 */
  retrieve: (
    responseId: string,
  ) => Promise<Awaited<ReturnType<ResponsesResource["retrieve"]>>>;
  /** 删除响应 */
  delete: (
    responseId: string,
  ) => Promise<Awaited<ReturnType<ResponsesResource["delete"]>>>;
}

/**
 * 创建 Responses API 实例
 */
export const createResponsesApi = (
  sdkClient: SdkClientInstance,
): ResponsesApiInstance => {
  const client = sdkClient.getClient();

  return {
    create: (params) => sdkClient.call(() => client.responses.create(params)),

    stream: (params) => sdkClient.call(() => client.responses.stream(params)),

    retrieve: (responseId) =>
      sdkClient.call(() => client.responses.retrieve(responseId)),

    delete: (responseId) =>
      sdkClient.call(() => client.responses.delete(responseId)),
  };
};

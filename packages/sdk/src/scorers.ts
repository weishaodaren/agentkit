/**
 * @agentkit/sdk - Scorers Legacy API
 *
 * 对应 Mastra Client SDK 1.28.0 的旧版 Scorers API。
 * 包含评分器查询和评分操作。
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface ScorersApiInstance {
  /** 列出所有评分器 */
  listScorers: (
    requestContext?: Parameters<MastraClient["listScorers"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listScorers"]>>>;
  /** 获取评分器 */
  getScorer: (
    scorerId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getScorer"]>>>;
  /** 按评分器 ID 列出评分 */
  listScoresByScorerId: (
    params: Parameters<MastraClient["listScoresByScorerId"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listScoresByScorerId"]>>>;
  /** 按 run ID 列出评分 */
  listScoresByRunId: (
    params: Parameters<MastraClient["listScoresByRunId"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listScoresByRunId"]>>>;
  /** 按实体 ID 列出评分 */
  listScoresByEntityId: (
    params: Parameters<MastraClient["listScoresByEntityId"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listScoresByEntityId"]>>>;
  /** 保存评分 */
  saveScore: (
    params: Parameters<MastraClient["saveScore"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["saveScore"]>>>;
}

/**
 * 创建 Scorers Legacy API 实例
 */
export const createScorersApi = (
  sdkClient: SdkClientInstance,
): ScorersApiInstance => {
  const client = sdkClient.getClient();

  return {
    listScorers: (requestContext) =>
      sdkClient.call(() => client.listScorers(requestContext)),

    getScorer: (scorerId) => sdkClient.call(() => client.getScorer(scorerId)),

    listScoresByScorerId: (params) =>
      sdkClient.call(() => client.listScoresByScorerId(params)),

    listScoresByRunId: (params) =>
      sdkClient.call(() => client.listScoresByRunId(params)),

    listScoresByEntityId: (params) =>
      sdkClient.call(() => client.listScoresByEntityId(params)),

    saveScore: (params) => sdkClient.call(() => client.saveScore(params)),
  };
};

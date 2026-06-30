/**
 * @agentkit/sdk - Telemetry & Observability API
 *
 * 对应 Mastra Client SDK 文档中的：
 * - Telemetry API: 追踪/span/分支/评分
 * - Observability API: 评分/反馈/指标/实体
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface TelemetryApiInstance {
  // ── Telemetry API ──────────────────────────────────────────────
  /** 列出追踪 */
  listTraces: (
    params?: Parameters<MastraClient["listTraces"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listTraces"]>>>;
  /** 获取单个追踪 */
  getTrace: (
    traceId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getTrace"]>>>;
  /** 获取轻量追踪（仅 timeline 字段） */
  getTraceLight: (
    traceId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getTraceLight"]>>>;
  /** 获取 span 详情 */
  getSpan: (
    traceId: string,
    spanId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getSpan"]>>>;
  /** 提取轨迹 */
  getTraceTrajectory: (
    traceId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getTraceTrajectory"]>>>;
  /** 列出分支 */
  listBranches: (
    params?: Parameters<MastraClient["listBranches"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listBranches"]>>>;
  /** 获取分支子树 */
  getBranch: (
    params: Parameters<MastraClient["getBranch"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getBranch"]>>>;
  /** 按 span 列出评分 */
  listScoresBySpan: (
    params: Parameters<MastraClient["listScoresBySpan"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listScoresBySpan"]>>>;
  /** 打分 */
  score: (
    params: Parameters<MastraClient["score"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["score"]>>>;

  // ── Observability API ──────────────────────────────────────────
  /** 列出评分 */
  listScores: (
    params?: Parameters<MastraClient["listScores"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listScores"]>>>;
  /** 创建评分 */
  createScore: (
    params: Parameters<MastraClient["createScore"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["createScore"]>>>;
  /** 评分聚合 */
  getScoreAggregate: (
    params: Parameters<MastraClient["getScoreAggregate"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getScoreAggregate"]>>>;
  /** 评分细分 */
  getScoreBreakdown: (
    params: Parameters<MastraClient["getScoreBreakdown"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getScoreBreakdown"]>>>;
  /** 评分时间序列 */
  getScoreTimeSeries: (
    params: Parameters<MastraClient["getScoreTimeSeries"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getScoreTimeSeries"]>>>;
  /** 评分百分位 */
  getScorePercentiles: (
    params: Parameters<MastraClient["getScorePercentiles"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getScorePercentiles"]>>>;

  /** 列出反馈 */
  listFeedback: (
    params?: Parameters<MastraClient["listFeedback"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listFeedback"]>>>;
  /** 创建反馈 */
  createFeedback: (
    params: Parameters<MastraClient["createFeedback"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["createFeedback"]>>>;
  /** 反馈聚合 */
  getFeedbackAggregate: (
    params: Parameters<MastraClient["getFeedbackAggregate"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getFeedbackAggregate"]>>>;
  /** 反馈细分 */
  getFeedbackBreakdown: (
    params: Parameters<MastraClient["getFeedbackBreakdown"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getFeedbackBreakdown"]>>>;
  /** 反馈时间序列 */
  getFeedbackTimeSeries: (
    params: Parameters<MastraClient["getFeedbackTimeSeries"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getFeedbackTimeSeries"]>>>;
  /** 反馈百分位 */
  getFeedbackPercentiles: (
    params: Parameters<MastraClient["getFeedbackPercentiles"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getFeedbackPercentiles"]>>>;

  /** 指标聚合 */
  getMetricAggregate: (
    params: Parameters<MastraClient["getMetricAggregate"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getMetricAggregate"]>>>;
  /** 指标细分 */
  getMetricBreakdown: (
    params: Parameters<MastraClient["getMetricBreakdown"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getMetricBreakdown"]>>>;
  /** 指标时间序列 */
  getMetricTimeSeries: (
    params: Parameters<MastraClient["getMetricTimeSeries"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getMetricTimeSeries"]>>>;
  /** 指标百分位 */
  getMetricPercentiles: (
    params: Parameters<MastraClient["getMetricPercentiles"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getMetricPercentiles"]>>>;
  /** 指标名称 */
  getMetricNames: (
    params: Parameters<MastraClient["getMetricNames"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getMetricNames"]>>>;
  /** 指标标签键 */
  getMetricLabelKeys: (
    params: Parameters<MastraClient["getMetricLabelKeys"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getMetricLabelKeys"]>>>;
  /** 指标标签值 */
  getMetricLabelValues: (
    params: Parameters<MastraClient["getMetricLabelValues"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getMetricLabelValues"]>>>;

  /** 实体类型 */
  getEntityTypes: () => Promise<
    Awaited<ReturnType<MastraClient["getEntityTypes"]>>
  >;
  /** 实体名称 */
  getEntityNames: (
    params?: Parameters<MastraClient["getEntityNames"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getEntityNames"]>>>;
  /** 服务名称 */
  getServiceNames: () => Promise<
    Awaited<ReturnType<MastraClient["getServiceNames"]>>
  >;
  /** 环境 */
  getEnvironments: () => Promise<
    Awaited<ReturnType<MastraClient["getEnvironments"]>>
  >;
  /** 标签 */
  getTags: (
    params?: Parameters<MastraClient["getTags"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getTags"]>>>;
}

/**
 * 创建 Telemetry & Observability API 实例
 */
export const createTelemetryApi = (
  sdkClient: SdkClientInstance,
): TelemetryApiInstance => {
  const client = sdkClient.getClient();

  return {
    // ── Telemetry ──────────────────────────────────────────────
    listTraces: (params) => sdkClient.call(() => client.listTraces(params)),

    getTrace: (traceId) => sdkClient.call(() => client.getTrace(traceId)),

    getTraceLight: (traceId) =>
      sdkClient.call(() => client.getTraceLight(traceId)),

    getSpan: (traceId, spanId) =>
      sdkClient.call(() => client.getSpan(traceId, spanId)),

    getTraceTrajectory: (traceId) =>
      sdkClient.call(() => client.getTraceTrajectory(traceId)),

    listBranches: (params) => sdkClient.call(() => client.listBranches(params)),

    getBranch: (params) => sdkClient.call(() => client.getBranch(params)),

    listScoresBySpan: (params) =>
      sdkClient.call(() => client.listScoresBySpan(params)),

    score: (params) => sdkClient.call(() => client.score(params)),

    // ── Observability ────────────────────────────────────────
    listScores: (params) => sdkClient.call(() => client.listScores(params)),

    createScore: (params) => sdkClient.call(() => client.createScore(params)),

    getScoreAggregate: (params) =>
      sdkClient.call(() => client.getScoreAggregate(params)),

    getScoreBreakdown: (params) =>
      sdkClient.call(() => client.getScoreBreakdown(params)),

    getScoreTimeSeries: (params) =>
      sdkClient.call(() => client.getScoreTimeSeries(params)),

    getScorePercentiles: (params) =>
      sdkClient.call(() => client.getScorePercentiles(params)),

    listFeedback: (params) => sdkClient.call(() => client.listFeedback(params)),

    createFeedback: (params) =>
      sdkClient.call(() => client.createFeedback(params)),

    getFeedbackAggregate: (params) =>
      sdkClient.call(() => client.getFeedbackAggregate(params)),

    getFeedbackBreakdown: (params) =>
      sdkClient.call(() => client.getFeedbackBreakdown(params)),

    getFeedbackTimeSeries: (params) =>
      sdkClient.call(() => client.getFeedbackTimeSeries(params)),

    getFeedbackPercentiles: (params) =>
      sdkClient.call(() => client.getFeedbackPercentiles(params)),

    getMetricAggregate: (params) =>
      sdkClient.call(() => client.getMetricAggregate(params)),

    getMetricBreakdown: (params) =>
      sdkClient.call(() => client.getMetricBreakdown(params)),

    getMetricTimeSeries: (params) =>
      sdkClient.call(() => client.getMetricTimeSeries(params)),

    getMetricPercentiles: (params) =>
      sdkClient.call(() => client.getMetricPercentiles(params)),

    getMetricNames: (params) =>
      sdkClient.call(() => client.getMetricNames(params)),

    getMetricLabelKeys: (params) =>
      sdkClient.call(() => client.getMetricLabelKeys(params)),

    getMetricLabelValues: (params) =>
      sdkClient.call(() => client.getMetricLabelValues(params)),

    getEntityTypes: () => sdkClient.call(() => client.getEntityTypes()),

    getEntityNames: (params) =>
      sdkClient.call(() => client.getEntityNames(params)),

    getServiceNames: () => sdkClient.call(() => client.getServiceNames()),

    getEnvironments: () => sdkClient.call(() => client.getEnvironments()),

    getTags: (params) => sdkClient.call(() => client.getTags(params)),
  };
};

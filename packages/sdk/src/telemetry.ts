/**
 * @agentkit/sdk - Telemetry & Observability API
 *
 * 对应 Mastra Client SDK 文档中的：
 * - Telemetry API: 追踪/span/分支/评分
 * - Observability API: 评分/反馈/指标/实体
 */

import type { SdkClientInstance } from "./client";

export interface TelemetryApiInstance {
  // ── Telemetry API ──────────────────────────────────────────────
  /** 列出追踪 */
  listTraces(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取单个追踪 */
  getTrace(traceId: string): Promise<unknown>;
  /** 获取轻量追踪（仅 timeline 字段） */
  getTraceLight(traceId: string): Promise<unknown>;
  /** 获取 span 详情 */
  getSpan(traceId: string, spanId: string): Promise<unknown>;
  /** 提取轨迹 */
  getTraceTrajectory(traceId: string): Promise<unknown>;
  /** 列出分支 */
  listBranches(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取分支子树 */
  getBranch(params: Record<string, unknown>): Promise<unknown>;
  /** 按 span 列出评分 */
  listScoresBySpan(params: Record<string, unknown>): Promise<unknown>;
  /** 打分 */
  score(params: Record<string, unknown>): Promise<unknown>;

  // ── Observability API ──────────────────────────────────────────
  /** 列出评分 */
  listScores(params?: Record<string, unknown>): Promise<unknown>;
  /** 创建评分 */
  createScore(params: Record<string, unknown>): Promise<unknown>;
  /** 评分聚合 */
  getScoreAggregate(params: Record<string, unknown>): Promise<unknown>;
  /** 评分细分 */
  getScoreBreakdown(params: Record<string, unknown>): Promise<unknown>;
  /** 评分时间序列 */
  getScoreTimeSeries(params: Record<string, unknown>): Promise<unknown>;
  /** 评分百分位 */
  getScorePercentiles(params: Record<string, unknown>): Promise<unknown>;

  /** 列出反馈 */
  listFeedback(params?: Record<string, unknown>): Promise<unknown>;
  /** 创建反馈 */
  createFeedback(params: Record<string, unknown>): Promise<unknown>;
  /** 反馈聚合 */
  getFeedbackAggregate(params: Record<string, unknown>): Promise<unknown>;
  /** 反馈细分 */
  getFeedbackBreakdown(params: Record<string, unknown>): Promise<unknown>;
  /** 反馈时间序列 */
  getFeedbackTimeSeries(params: Record<string, unknown>): Promise<unknown>;
  /** 反馈百分位 */
  getFeedbackPercentiles(params: Record<string, unknown>): Promise<unknown>;

  /** 指标聚合 */
  getMetricAggregate(params: Record<string, unknown>): Promise<unknown>;
  /** 指标细分 */
  getMetricBreakdown(params: Record<string, unknown>): Promise<unknown>;
  /** 指标时间序列 */
  getMetricTimeSeries(params: Record<string, unknown>): Promise<unknown>;
  /** 指标百分位 */
  getMetricPercentiles(params: Record<string, unknown>): Promise<unknown>;
  /** 指标名称 */
  getMetricNames(params?: Record<string, unknown>): Promise<unknown>;
  /** 指标标签键 */
  getMetricLabelKeys(params: Record<string, unknown>): Promise<unknown>;
  /** 指标标签值 */
  getMetricLabelValues(params: Record<string, unknown>): Promise<unknown>;

  /** 实体类型 */
  getEntityTypes(): Promise<unknown>;
  /** 实体名称 */
  getEntityNames(params?: Record<string, unknown>): Promise<unknown>;
  /** 服务名称 */
  getServiceNames(): Promise<unknown>;
  /** 环境 */
  getEnvironments(): Promise<unknown>;
  /** 标签 */
  getTags(params?: Record<string, unknown>): Promise<unknown>;
}

/**
 * 创建 Telemetry & Observability API 实例。
 */
export function createTelemetryApi(
  sdkClient: SdkClientInstance,
): TelemetryApiInstance {
  const client = sdkClient.getClient();

  return {
    // ── Telemetry ──────────────────────────────────────────────
    async listTraces(params) {
      return sdkClient.call(async () => client.listTraces(params as any));
    },
    async getTrace(traceId) {
      return sdkClient.call(async () => client.getTrace(traceId));
    },
    async getTraceLight(traceId) {
      return sdkClient.call(async () => client.getTraceLight(traceId));
    },
    async getSpan(traceId, spanId) {
      return sdkClient.call(async () => client.getSpan(traceId, spanId));
    },
    async getTraceTrajectory(traceId) {
      return sdkClient.call(async () => client.getTraceTrajectory(traceId));
    },
    async listBranches(params) {
      return sdkClient.call(async () => client.listBranches(params as any));
    },
    async getBranch(params) {
      return sdkClient.call(async () => client.getBranch(params as any));
    },
    async listScoresBySpan(params) {
      return sdkClient.call(async () => client.listScoresBySpan(params as any));
    },
    async score(params) {
      return sdkClient.call(async () => client.score(params as any));
    },

    // ── Observability ────────────────────────────────────────
    async listScores(params) {
      return sdkClient.call(async () => client.listScores(params as any));
    },
    async createScore(params) {
      return sdkClient.call(async () => client.createScore(params as any));
    },
    async getScoreAggregate(params) {
      return sdkClient.call(async () =>
        client.getScoreAggregate(params as any),
      );
    },
    async getScoreBreakdown(params) {
      return sdkClient.call(async () =>
        client.getScoreBreakdown(params as any),
      );
    },
    async getScoreTimeSeries(params) {
      return sdkClient.call(async () =>
        client.getScoreTimeSeries(params as any),
      );
    },
    async getScorePercentiles(params) {
      return sdkClient.call(async () =>
        client.getScorePercentiles(params as any),
      );
    },
    async listFeedback(params) {
      return sdkClient.call(async () => client.listFeedback(params as any));
    },
    async createFeedback(params) {
      return sdkClient.call(async () => client.createFeedback(params as any));
    },
    async getFeedbackAggregate(params) {
      return sdkClient.call(async () =>
        client.getFeedbackAggregate(params as any),
      );
    },
    async getFeedbackBreakdown(params) {
      return sdkClient.call(async () =>
        client.getFeedbackBreakdown(params as any),
      );
    },
    async getFeedbackTimeSeries(params) {
      return sdkClient.call(async () =>
        client.getFeedbackTimeSeries(params as any),
      );
    },
    async getFeedbackPercentiles(params) {
      return sdkClient.call(async () =>
        client.getFeedbackPercentiles(params as any),
      );
    },
    async getMetricAggregate(params) {
      return sdkClient.call(async () =>
        client.getMetricAggregate(params as any),
      );
    },
    async getMetricBreakdown(params) {
      return sdkClient.call(async () =>
        client.getMetricBreakdown(params as any),
      );
    },
    async getMetricTimeSeries(params) {
      return sdkClient.call(async () =>
        client.getMetricTimeSeries(params as any),
      );
    },
    async getMetricPercentiles(params) {
      return sdkClient.call(async () =>
        client.getMetricPercentiles(params as any),
      );
    },
    async getMetricNames(params) {
      return sdkClient.call(async () => client.getMetricNames(params));
    },
    async getMetricLabelKeys(params) {
      return sdkClient.call(async () =>
        client.getMetricLabelKeys(params as any),
      );
    },
    async getMetricLabelValues(params) {
      return sdkClient.call(async () =>
        client.getMetricLabelValues(params as any),
      );
    },
    async getEntityTypes() {
      return sdkClient.call(async () => client.getEntityTypes());
    },
    async getEntityNames(params) {
      return sdkClient.call(async () => client.getEntityNames(params));
    },
    async getServiceNames() {
      return sdkClient.call(async () => client.getServiceNames());
    },
    async getEnvironments() {
      return sdkClient.call(async () => client.getEnvironments());
    },
    async getTags(params) {
      return sdkClient.call(async () => client.getTags(params));
    },
  };
}

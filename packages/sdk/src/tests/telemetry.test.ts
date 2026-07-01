/**
 * @agentkit/sdk - telemetry 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTelemetryApi } from "../telemetry";
import type { SdkClientInstance } from "../client";

describe("createTelemetryApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(() => {
    mockClient = {
      // Telemetry
      listTraces: vi.fn().mockResolvedValue({ traces: [] }),
      getTrace: vi.fn().mockResolvedValue({ id: "trace-1" }),
      getTraceLight: vi.fn().mockResolvedValue({ id: "trace-1" }),
      getSpan: vi.fn().mockResolvedValue({}),
      getTraceTrajectory: vi.fn().mockResolvedValue({}),
      listBranches: vi.fn().mockResolvedValue({ branches: [] }),
      getBranch: vi.fn().mockResolvedValue({}),
      listScoresBySpan: vi.fn().mockResolvedValue({ scores: [] }),
      score: vi.fn().mockResolvedValue({}),
      // Observability
      listScores: vi.fn().mockResolvedValue({ scores: [] }),
      createScore: vi.fn().mockResolvedValue({}),
      getScoreAggregate: vi.fn().mockResolvedValue({}),
      getScoreBreakdown: vi.fn().mockResolvedValue({}),
      getScoreTimeSeries: vi.fn().mockResolvedValue({}),
      getScorePercentiles: vi.fn().mockResolvedValue({}),
      listFeedback: vi.fn().mockResolvedValue({ feedback: [] }),
      createFeedback: vi.fn().mockResolvedValue({}),
      getFeedbackAggregate: vi.fn().mockResolvedValue({}),
      getFeedbackBreakdown: vi.fn().mockResolvedValue({}),
      getFeedbackTimeSeries: vi.fn().mockResolvedValue({}),
      getFeedbackPercentiles: vi.fn().mockResolvedValue({}),
      getMetricAggregate: vi.fn().mockResolvedValue({}),
      getMetricBreakdown: vi.fn().mockResolvedValue({}),
      getMetricTimeSeries: vi.fn().mockResolvedValue({}),
      getMetricPercentiles: vi.fn().mockResolvedValue({}),
      getMetricNames: vi.fn().mockResolvedValue({ names: [] }),
      getMetricLabelKeys: vi.fn().mockResolvedValue({ keys: [] }),
      getMetricLabelValues: vi.fn().mockResolvedValue({ values: [] }),
      getEntityTypes: vi.fn().mockResolvedValue({ types: [] }),
      getEntityNames: vi.fn().mockResolvedValue({ names: [] }),
      getServiceNames: vi.fn().mockResolvedValue({ names: [] }),
      getEnvironments: vi.fn().mockResolvedValue({ environments: [] }),
      getTags: vi.fn().mockResolvedValue({ tags: [] }),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    } as unknown as SdkClientInstance;
  });

  it("should have all methods", () => {
    const api = createTelemetryApi(mockSdkClient);
    const methods = [
      // Telemetry
      "listTraces",
      "getTrace",
      "getTraceLight",
      "getSpan",
      "getTraceTrajectory",
      "listBranches",
      "getBranch",
      "listScoresBySpan",
      "score",
      // Observability
      "listScores",
      "createScore",
      "getScoreAggregate",
      "getScoreBreakdown",
      "getScoreTimeSeries",
      "getScorePercentiles",
      "listFeedback",
      "createFeedback",
      "getFeedbackAggregate",
      "getFeedbackBreakdown",
      "getFeedbackTimeSeries",
      "getFeedbackPercentiles",
      "getMetricAggregate",
      "getMetricBreakdown",
      "getMetricTimeSeries",
      "getMetricPercentiles",
      "getMetricNames",
      "getMetricLabelKeys",
      "getMetricLabelValues",
      "getEntityTypes",
      "getEntityNames",
      "getServiceNames",
      "getEnvironments",
      "getTags",
    ];
    for (const method of methods) {
      expect(typeof api[method as keyof typeof api]).toBe("function");
    }
  });

  it("should call telemetry methods", async () => {
    const api = createTelemetryApi(mockSdkClient);
    await api.listTraces();
    expect(mockClient.listTraces).toHaveBeenCalled();

    await api.getTrace("trace-1");
    expect(mockClient.getTrace).toHaveBeenCalledWith("trace-1");

    await api.getTraceLight("trace-1");
    expect(mockClient.getTraceLight).toHaveBeenCalledWith("trace-1");

    await api.getSpan("trace-1", "span-1");
    expect(mockClient.getSpan).toHaveBeenCalledWith("trace-1", "span-1");

    await api.getTraceTrajectory("trace-1");
    expect(mockClient.getTraceTrajectory).toHaveBeenCalledWith("trace-1");

    await api.listBranches();
    expect(mockClient.listBranches).toHaveBeenCalled();

    await api.getBranch({ traceId: "trace-1", spanId: "span-1" } as never);
    expect(mockClient.getBranch).toHaveBeenCalled();

    await api.listScoresBySpan({ traceId: "trace-1", spanId: "span-1" } as never);
    expect(mockClient.listScoresBySpan).toHaveBeenCalled();

    await api.score({ scorerName: "scorer-1", targets: [] } as never);
    expect(mockClient.score).toHaveBeenCalled();
  });

  it("should call observability methods", async () => {
    const api = createTelemetryApi(mockSdkClient);
    await api.listScores();
    expect(mockClient.listScores).toHaveBeenCalled();

    await api.createScore({} as never);
    expect(mockClient.createScore).toHaveBeenCalled();

    await api.getScoreAggregate({} as never);
    expect(mockClient.getScoreAggregate).toHaveBeenCalled();

    await api.getScoreBreakdown({} as never);
    expect(mockClient.getScoreBreakdown).toHaveBeenCalled();

    await api.getScoreTimeSeries({} as never);
    expect(mockClient.getScoreTimeSeries).toHaveBeenCalled();

    await api.getScorePercentiles({} as never);
    expect(mockClient.getScorePercentiles).toHaveBeenCalled();

    await api.listFeedback();
    expect(mockClient.listFeedback).toHaveBeenCalled();

    await api.createFeedback({} as never);
    expect(mockClient.createFeedback).toHaveBeenCalled();

    await api.getFeedbackAggregate({} as never);
    expect(mockClient.getFeedbackAggregate).toHaveBeenCalled();

    await api.getFeedbackBreakdown({} as never);
    expect(mockClient.getFeedbackBreakdown).toHaveBeenCalled();

    await api.getFeedbackTimeSeries({} as never);
    expect(mockClient.getFeedbackTimeSeries).toHaveBeenCalled();

    await api.getFeedbackPercentiles({} as never);
    expect(mockClient.getFeedbackPercentiles).toHaveBeenCalled();

    await api.getMetricAggregate({} as never);
    expect(mockClient.getMetricAggregate).toHaveBeenCalled();

    await api.getMetricBreakdown({} as never);
    expect(mockClient.getMetricBreakdown).toHaveBeenCalled();

    await api.getMetricTimeSeries({} as never);
    expect(mockClient.getMetricTimeSeries).toHaveBeenCalled();

    await api.getMetricPercentiles({} as never);
    expect(mockClient.getMetricPercentiles).toHaveBeenCalled();

    await api.getMetricNames({} as never);
    expect(mockClient.getMetricNames).toHaveBeenCalled();

    await api.getMetricLabelKeys({} as never);
    expect(mockClient.getMetricLabelKeys).toHaveBeenCalled();

    await api.getMetricLabelValues({} as never);
    expect(mockClient.getMetricLabelValues).toHaveBeenCalled();

    await api.getEntityTypes();
    expect(mockClient.getEntityTypes).toHaveBeenCalled();

    await api.getEntityNames();
    expect(mockClient.getEntityNames).toHaveBeenCalled();

    await api.getServiceNames();
    expect(mockClient.getServiceNames).toHaveBeenCalled();

    await api.getEnvironments();
    expect(mockClient.getEnvironments).toHaveBeenCalled();

    await api.getTags();
    expect(mockClient.getTags).toHaveBeenCalled();
  });
});

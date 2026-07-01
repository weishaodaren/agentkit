/**
 * @agentkit/sdk - workflows 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWorkflowsApi } from "../workflows";
import type { SdkClientInstance } from "../client";

describe("createWorkflowsApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;
  let mockWorkflow: any;
  let mockRun: any;

  beforeEach(() => {
    mockRun = {
      startAsync: vi.fn().mockResolvedValue({ status: "completed" }),
    };

    mockWorkflow = {
      createRun: vi.fn().mockResolvedValue(mockRun),
    };

    mockClient = {
      listWorkflows: vi.fn().mockResolvedValue({}),
      getWorkflow: vi.fn().mockReturnValue(mockWorkflow),
      listSchedules: vi.fn().mockResolvedValue({ schedules: [] }),
      getSchedule: vi.fn().mockResolvedValue({ id: "sched-1" }),
      pauseSchedule: vi.fn().mockResolvedValue({ id: "sched-1" }),
      resumeSchedule: vi.fn().mockResolvedValue({ id: "sched-1" }),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createWorkflowsApi(mockSdkClient);
    expect(typeof api.listWorkflows).toBe("function");
    expect(typeof api.getWorkflow).toBe("function");
    expect(typeof api.runWorkflow).toBe("function");
    expect(typeof api.listSchedules).toBe("function");
    expect(typeof api.getSchedule).toBe("function");
    expect(typeof api.pauseSchedule).toBe("function");
    expect(typeof api.resumeSchedule).toBe("function");
  });

  it("should call listWorkflows", async () => {
    const api = createWorkflowsApi(mockSdkClient);
    await api.listWorkflows();
    expect(mockClient.listWorkflows).toHaveBeenCalled();
  });

  it("should return workflow instance directly", () => {
    const api = createWorkflowsApi(mockSdkClient);
    const wf = api.getWorkflow("wf-1");
    expect(mockClient.getWorkflow).toHaveBeenCalledWith("wf-1");
    expect(wf).toBe(mockWorkflow);
  });

  it("should run workflow via createRun + startAsync", async () => {
    const api = createWorkflowsApi(mockSdkClient);
    await api.runWorkflow("wf-1", { city: "Tokyo" });
    expect(mockClient.getWorkflow).toHaveBeenCalledWith("wf-1");
    expect(mockWorkflow.createRun).toHaveBeenCalled();
    expect(mockRun.startAsync).toHaveBeenCalledWith({
      inputData: { city: "Tokyo" },
    });
  });

  it("should call schedule methods", async () => {
    const api = createWorkflowsApi(mockSdkClient);
    await api.listSchedules();
    expect(mockClient.listSchedules).toHaveBeenCalled();

    await api.getSchedule("sched-1");
    expect(mockClient.getSchedule).toHaveBeenCalledWith("sched-1");

    await api.pauseSchedule("sched-1");
    expect(mockClient.pauseSchedule).toHaveBeenCalledWith("sched-1");

    await api.resumeSchedule("sched-1");
    expect(mockClient.resumeSchedule).toHaveBeenCalledWith("sched-1");
  });
});

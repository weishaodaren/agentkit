/**
 * @agentkit/sdk - logs 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLogsApi } from "../logs";
import type { SdkClientInstance } from "../client";

describe("createLogsApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      listLogs: vi.fn().mockResolvedValue({}),
      getLogForRun: vi.fn().mockResolvedValue({}),
      listLogsVNext: vi.fn().mockResolvedValue({}),
      listLogTransports: vi.fn().mockResolvedValue({ transports: [] }),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createLogsApi(mockSdkClient);
    expect(typeof api.listLogs).toBe("function");
    expect(typeof api.getLogForRun).toBe("function");
    expect(typeof api.listLogsVNext).toBe("function");
    expect(typeof api.listLogTransports).toBe("function");
  });

  it("should call listLogs", async () => {
    const api = createLogsApi(mockSdkClient);
    await api.listLogs({ transportId: "t1", filters: ["error"] });
    expect(mockClient.listLogs).toHaveBeenCalledWith({
      transportId: "t1",
      filters: ["error"],
    });
  });

  it("should call getLogForRun", async () => {
    const api = createLogsApi(mockSdkClient);
    await api.getLogForRun({ runId: "run-1", transportId: "t1" });
    expect(mockClient.getLogForRun).toHaveBeenCalledWith({
      runId: "run-1",
      transportId: "t1",
    });
  });

  it("should call listLogsVNext", async () => {
    const api = createLogsApi(mockSdkClient);
    await api.listLogsVNext({ filters: { level: "info" } });
    expect(mockClient.listLogsVNext).toHaveBeenCalledWith({
      filters: { level: "info" },
    });
  });

  it("should call listLogTransports", async () => {
    const api = createLogsApi(mockSdkClient);
    await api.listLogTransports();
    expect(mockClient.listLogTransports).toHaveBeenCalled();
  });
});

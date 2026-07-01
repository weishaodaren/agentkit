/**
 * @agentkit/sdk - agents 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAgentsApi } from "../agents";
import type { SdkClientInstance } from "../client";

describe("createAgentsApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockMastraClient: any;

  beforeEach(() => {
    mockMastraClient = {
      listAgents: vi.fn().mockResolvedValue({}),
      listAgentsModelProviders: vi.fn().mockResolvedValue({}),
      getAgent: vi.fn().mockReturnValue({ id: "test-agent" }),
      getA2A: vi.fn().mockReturnValue({}),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockMastraClient),
      getConfig: vi.fn().mockReturnValue({
        logger: null,
        retries: 0,
        retryDelay: 1000,
        retryBackoff: 2,
      }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockMastraClient),
    };
  });

  it("should return an api instance", () => {
    const api = createAgentsApi(mockSdkClient);
    expect(api).toBeDefined();
    expect(typeof api.listAgents).toBe("function");
    expect(typeof api.listModelProviders).toBe("function");
    expect(typeof api.getAgent).toBe("function");
    expect(typeof api.getA2A).toBe("function");
  });

  it("should call listAgents through call wrapper", async () => {
    const api = createAgentsApi(mockSdkClient);
    await api.listAgents();
    expect(mockSdkClient.call).toHaveBeenCalled();
    expect(mockMastraClient.listAgents).toHaveBeenCalled();
  });

  it("should call listModelProviders through call wrapper", async () => {
    const api = createAgentsApi(mockSdkClient);
    await api.listModelProviders();
    expect(mockSdkClient.call).toHaveBeenCalled();
    expect(mockMastraClient.listAgentsModelProviders).toHaveBeenCalled();
  });

  it("should return agent instance directly", () => {
    const api = createAgentsApi(mockSdkClient);
    const agent = api.getAgent("test-agent");
    expect(agent).toEqual({ id: "test-agent" });
    expect(mockMastraClient.getAgent).toHaveBeenCalledWith(
      "test-agent",
      undefined,
    );
  });

  it("should return agent instance with version", () => {
    const api = createAgentsApi(mockSdkClient);
    const agent = api.getAgent("test-agent", { status: "published" });
    expect(agent).toEqual({ id: "test-agent" });
    expect(mockMastraClient.getAgent).toHaveBeenCalledWith("test-agent", {
      status: "published",
    });
  });

  it("should return A2A client directly", () => {
    const api = createAgentsApi(mockSdkClient);
    const a2a = api.getA2A("test-agent");
    expect(a2a).toEqual({});
    expect(mockMastraClient.getA2A).toHaveBeenCalledWith("test-agent");
  });
});

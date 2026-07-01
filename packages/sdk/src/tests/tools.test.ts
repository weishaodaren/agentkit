/**
 * @agentkit/sdk - tools 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createToolsApi } from "../tools";
import type { SdkClientInstance } from "../client";

describe("createToolsApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      listTools: vi.fn().mockResolvedValue({}),
      getTool: vi.fn().mockReturnValue({ id: "tool-1" }),
      listToolProviders: vi.fn().mockResolvedValue({ providers: [] }),
      getToolProvider: vi.fn().mockReturnValue({ id: "provider-1" }),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createToolsApi(mockSdkClient);
    expect(typeof api.listTools).toBe("function");
    expect(typeof api.getTool).toBe("function");
    expect(typeof api.listToolProviders).toBe("function");
    expect(typeof api.getToolProvider).toBe("function");
  });

  it("should call listTools", async () => {
    const api = createToolsApi(mockSdkClient);
    await api.listTools();
    expect(mockClient.listTools).toHaveBeenCalled();
  });

  it("should return tool instance directly", () => {
    const api = createToolsApi(mockSdkClient);
    const tool = api.getTool("tool-1");
    expect(mockClient.getTool).toHaveBeenCalledWith("tool-1");
    expect(tool).toEqual({ id: "tool-1" });
  });

  it("should call listToolProviders", async () => {
    const api = createToolsApi(mockSdkClient);
    await api.listToolProviders();
    expect(mockClient.listToolProviders).toHaveBeenCalled();
  });

  it("should return tool provider instance directly", () => {
    const api = createToolsApi(mockSdkClient);
    const provider = api.getToolProvider("provider-1");
    expect(mockClient.getToolProvider).toHaveBeenCalledWith("provider-1");
    expect(provider).toEqual({ id: "provider-1" });
  });
});

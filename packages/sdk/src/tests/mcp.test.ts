/**
 * @agentkit/sdk - mcp 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMcpApi } from "../mcp";
import type { SdkClientInstance } from "../client";

describe("createMcpApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getMcpServers: vi.fn().mockResolvedValue({ servers: [] }),
      getMcpServerDetails: vi.fn().mockResolvedValue({}),
      getMcpServerTools: vi.fn().mockResolvedValue({ tools: [] }),
      getMcpServerTool: vi.fn().mockReturnValue({}),
      getMcpServerResources: vi.fn().mockResolvedValue({ resources: [] }),
      readMcpServerResource: vi.fn().mockResolvedValue({ contents: [] }),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createMcpApi(mockSdkClient);
    expect(typeof api.listServers).toBe("function");
    expect(typeof api.getServerDetails).toBe("function");
    expect(typeof api.getServerTools).toBe("function");
    expect(typeof api.getServerTool).toBe("function");
    expect(typeof api.getServerResources).toBe("function");
    expect(typeof api.readServerResource).toBe("function");
  });

  it("should call getMcpServers", async () => {
    const api = createMcpApi(mockSdkClient);
    await api.listServers({ page: 1, perPage: 10 });
    expect(mockClient.getMcpServers).toHaveBeenCalledWith({
      page: 1,
      perPage: 10,
    });
  });

  it("should call getMcpServerDetails", async () => {
    const api = createMcpApi(mockSdkClient);
    await api.getServerDetails("server-1");
    expect(mockClient.getMcpServerDetails).toHaveBeenCalledWith(
      "server-1",
      undefined,
    );
  });

  it("should call getMcpServerTools", async () => {
    const api = createMcpApi(mockSdkClient);
    await api.getServerTools("server-1");
    expect(mockClient.getMcpServerTools).toHaveBeenCalledWith("server-1");
  });

  it("should return MCPTool instance directly", () => {
    const api = createMcpApi(mockSdkClient);
    const tool = api.getServerTool("server-1", "tool-1");
    expect(mockClient.getMcpServerTool).toHaveBeenCalledWith(
      "server-1",
      "tool-1",
    );
    expect(tool).toEqual({});
  });

  it("should call getMcpServerResources", async () => {
    const api = createMcpApi(mockSdkClient);
    await api.getServerResources("server-1");
    expect(mockClient.getMcpServerResources).toHaveBeenCalledWith("server-1");
  });

  it("should call readMcpServerResource", async () => {
    const api = createMcpApi(mockSdkClient);
    await api.readServerResource("server-1", "resource://test");
    expect(mockClient.readMcpServerResource).toHaveBeenCalledWith(
      "server-1",
      "resource://test",
    );
  });
});

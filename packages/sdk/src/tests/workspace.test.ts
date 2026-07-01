/**
 * @agentkit/sdk - workspace 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWorkspaceApi } from "../workspace";
import type { SdkClientInstance } from "../client";

describe("createWorkspaceApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      listWorkspaces: vi.fn().mockResolvedValue({ workspaces: [] }),
      getWorkspace: vi.fn().mockReturnValue({}),
      listStoredWorkspaces: vi.fn().mockResolvedValue({}),
      getStoredWorkspace: vi.fn().mockResolvedValue({}),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createWorkspaceApi(mockSdkClient);
    expect(typeof api.listWorkspaces).toBe("function");
    expect(typeof api.getWorkspace).toBe("function");
    expect(typeof api.listStoredWorkspaces).toBe("function");
    expect(typeof api.getStoredWorkspace).toBe("function");
  });

  it("should call listWorkspaces", async () => {
    const api = createWorkspaceApi(mockSdkClient);
    await api.listWorkspaces();
    expect(mockClient.listWorkspaces).toHaveBeenCalled();
  });

  it("should return workspace instance directly", () => {
    const api = createWorkspaceApi(mockSdkClient);
    api.getWorkspace("ws-1");
    expect(mockClient.getWorkspace).toHaveBeenCalledWith("ws-1");
  });

  it("should call listStoredWorkspaces", async () => {
    const api = createWorkspaceApi(mockSdkClient);
    await api.listStoredWorkspaces();
    expect(mockClient.listStoredWorkspaces).toHaveBeenCalled();
  });

  it("should call getStoredWorkspace", async () => {
    const api = createWorkspaceApi(mockSdkClient);
    await api.getStoredWorkspace("ws-1");
    expect(mockClient.getStoredWorkspace).toHaveBeenCalledWith("ws-1");
  });
});

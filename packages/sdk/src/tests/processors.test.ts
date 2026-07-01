/**
 * @agentkit/sdk - processors 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createProcessorsApi } from "../processors";
import type { SdkClientInstance } from "../client";

describe("createProcessorsApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      listProcessors: vi.fn().mockResolvedValue({}),
      getProcessor: vi.fn().mockReturnValue({}),
      getProcessorProviders: vi.fn().mockResolvedValue({ providers: [] }),
      getProcessorProvider: vi.fn().mockReturnValue({}),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createProcessorsApi(mockSdkClient);
    expect(typeof api.listProcessors).toBe("function");
    expect(typeof api.getProcessor).toBe("function");
    expect(typeof api.listProviders).toBe("function");
    expect(typeof api.getProvider).toBe("function");
  });

  it("should call listProcessors", async () => {
    const api = createProcessorsApi(mockSdkClient);
    await api.listProcessors();
    expect(mockClient.listProcessors).toHaveBeenCalled();
  });

  it("should return processor instance directly", () => {
    const api = createProcessorsApi(mockSdkClient);
    api.getProcessor("proc-1");
    expect(mockClient.getProcessor).toHaveBeenCalledWith("proc-1");
  });

  it("should call listProviders", async () => {
    const api = createProcessorsApi(mockSdkClient);
    await api.listProviders();
    expect(mockClient.getProcessorProviders).toHaveBeenCalled();
  });

  it("should return provider instance directly", () => {
    const api = createProcessorsApi(mockSdkClient);
    api.getProvider("prov-1");
    expect(mockClient.getProcessorProvider).toHaveBeenCalledWith("prov-1");
  });
});

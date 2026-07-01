/**
 * @agentkit/sdk - builder 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBuilderApi } from "../builder";
import type { SdkClientInstance } from "../client";

describe("createBuilderApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getBuilderSettings: vi.fn().mockResolvedValue({}),
      getBuilderAvailableModels: vi.fn().mockResolvedValue({}),
      getPermissionPatterns: vi.fn().mockResolvedValue({}),
      getInfrastructureStatus: vi.fn().mockResolvedValue({}),
      listBuilderRegistries: vi.fn().mockResolvedValue({ registries: [] }),
      searchBuilderRegistry: vi.fn().mockResolvedValue({}),
      getBuilderRegistryPopular: vi.fn().mockResolvedValue({}),
      getBuilderRegistryPreview: vi.fn().mockResolvedValue({}),
      installBuilderRegistrySkill: vi.fn().mockResolvedValue({}),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createBuilderApi(mockSdkClient);
    const methods = [
      "getSettings",
      "getAvailableModels",
      "getPermissionPatterns",
      "getInfrastructureStatus",
      "listRegistries",
      "searchRegistry",
      "getPopular",
      "getPreview",
      "installSkill",
    ];
    for (const method of methods) {
      expect(typeof api[method as keyof typeof api]).toBe("function");
    }
  });

  it("should call getSettings", async () => {
    const api = createBuilderApi(mockSdkClient);
    await api.getSettings();
    expect(mockClient.getBuilderSettings).toHaveBeenCalled();
  });

  it("should call searchRegistry", async () => {
    const api = createBuilderApi(mockSdkClient);
    await api.searchRegistry("reg-1", { q: "test" });
    expect(mockClient.searchBuilderRegistry).toHaveBeenCalledWith("reg-1", {
      q: "test",
    });
  });

  it("should call installSkill", async () => {
    const api = createBuilderApi(mockSdkClient);
    await api.installSkill("reg-1", {
      owner: "test",
      repo: "test",
      skillName: "test",
    });
    expect(mockClient.installBuilderRegistrySkill).toHaveBeenCalledWith(
      "reg-1",
      { owner: "test", repo: "test", skillName: "test" },
    );
  });
});

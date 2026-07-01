/**
 * @agentkit/sdk - stored 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStoredApi } from "../stored";
import type { SdkClientInstance } from "../client";

describe("createStoredApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      listStoredAgents: vi.fn().mockResolvedValue({ agents: [] }),
      createStoredAgent: vi.fn().mockResolvedValue({}),
      getStoredAgent: vi.fn().mockReturnValue({}),
      listStoredPromptBlocks: vi.fn().mockResolvedValue({}),
      createStoredPromptBlock: vi.fn().mockResolvedValue({}),
      getStoredPromptBlock: vi.fn().mockReturnValue({}),
      listStoredScorers: vi.fn().mockResolvedValue({}),
      createStoredScorer: vi.fn().mockResolvedValue({}),
      getStoredScorer: vi.fn().mockResolvedValue({}),
      listStoredMCPClients: vi.fn().mockResolvedValue({}),
      createStoredMCPClient: vi.fn().mockResolvedValue({}),
      getStoredMCPClient: vi.fn().mockReturnValue({}),
      listStoredSkills: vi.fn().mockResolvedValue({}),
      createStoredSkill: vi.fn().mockResolvedValue({}),
      getStoredSkill: vi.fn().mockReturnValue({}),
      listToolProviders: vi.fn().mockResolvedValue({}),
      getToolProvider: vi.fn().mockReturnValue({}),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createStoredApi(mockSdkClient);
    const methods = [
      "listAgents",
      "createAgent",
      "getAgent",
      "listPromptBlocks",
      "createPromptBlock",
      "getPromptBlock",
      "listScorers",
      "createScorer",
      "getScorer",
      "listMcpClients",
      "createMcpClient",
      "getMcpClient",
      "listSkills",
      "createSkill",
      "getSkill",
    ];
    for (const method of methods) {
      expect(typeof api[method as keyof typeof api]).toBe("function");
    }
  });

  it("should call listAgents", async () => {
    const api = createStoredApi(mockSdkClient);
    await api.listAgents();
    expect(mockClient.listStoredAgents).toHaveBeenCalled();
  });

  it("should call createAgent", async () => {
    const api = createStoredApi(mockSdkClient);
    await api.createAgent({
      name: "test",
      instructions: "test instructions",
      model: "gpt-4",
    } as never);
    expect(mockClient.createStoredAgent).toHaveBeenCalled();
  });

  it("should return agent instance directly", () => {
    const api = createStoredApi(mockSdkClient);
    api.getAgent("agent-1");
    expect(mockClient.getStoredAgent).toHaveBeenCalledWith("agent-1");
  });
});

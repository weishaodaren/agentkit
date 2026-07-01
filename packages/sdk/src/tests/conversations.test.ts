/**
 * @agentkit/sdk - conversations 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createConversationsApi } from "../conversations";
import type { SdkClientInstance } from "../client";

describe("createConversationsApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockMastraClient: any;

  beforeEach(() => {
    mockMastraClient = {
      conversations: {
        create: vi.fn().mockResolvedValue({ id: "conv-1" }),
        retrieve: vi.fn().mockResolvedValue({ id: "conv-1" }),
        items: {
          list: vi.fn().mockResolvedValue([]),
        },
      },
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockMastraClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockMastraClient),
    };
  });

  it("should return an api instance", () => {
    const api = createConversationsApi(mockSdkClient);
    expect(typeof api.create).toBe("function");
    expect(typeof api.retrieve).toBe("function");
    expect(typeof api.listItems).toBe("function");
  });

  it("should call conversations.create", async () => {
    const api = createConversationsApi(mockSdkClient);
    await api.create({ agent_id: "test-agent" });
    expect(mockMastraClient.conversations.create).toHaveBeenCalledWith({
      agent_id: "test-agent",
    });
  });

  it("should call conversations.retrieve", async () => {
    const api = createConversationsApi(mockSdkClient);
    await api.retrieve("conv-1");
    expect(mockMastraClient.conversations.retrieve).toHaveBeenCalledWith(
      "conv-1",
    );
  });

  it("should call conversations.items.list", async () => {
    const api = createConversationsApi(mockSdkClient);
    await api.listItems("conv-1");
    expect(mockMastraClient.conversations.items.list).toHaveBeenCalledWith(
      "conv-1",
      undefined,
    );
  });
});

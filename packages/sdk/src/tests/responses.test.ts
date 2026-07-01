/**
 * @agentkit/sdk - responses 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createResponsesApi } from "../responses";
import type { SdkClientInstance } from "../client";

describe("createResponsesApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      responses: {
        create: vi.fn().mockResolvedValue({ id: "resp-1" }),
        stream: vi.fn().mockResolvedValue({}),
        retrieve: vi.fn().mockResolvedValue({ id: "resp-1" }),
        delete: vi.fn().mockResolvedValue({ id: "resp-1", deleted: true }),
      },
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createResponsesApi(mockSdkClient);
    expect(typeof api.create).toBe("function");
    expect(typeof api.stream).toBe("function");
    expect(typeof api.retrieve).toBe("function");
    expect(typeof api.delete).toBe("function");
  });

  it("should call responses.create", async () => {
    const api = createResponsesApi(mockSdkClient);
    await api.create({ agent_id: "test-agent", input: "hello" });
    expect(mockClient.responses.create).toHaveBeenCalledWith({
      agent_id: "test-agent",
      input: "hello",
    });
  });

  it("should call responses.stream", async () => {
    const api = createResponsesApi(mockSdkClient);
    await api.stream({ agent_id: "test-agent", input: "hello" });
    expect(mockClient.responses.stream).toHaveBeenCalledWith({
      agent_id: "test-agent",
      input: "hello",
    });
  });

  it("should call responses.retrieve", async () => {
    const api = createResponsesApi(mockSdkClient);
    await api.retrieve("resp-1");
    expect(mockClient.responses.retrieve).toHaveBeenCalledWith("resp-1");
  });

  it("should call responses.delete", async () => {
    const api = createResponsesApi(mockSdkClient);
    await api.delete("resp-1");
    expect(mockClient.responses.delete).toHaveBeenCalledWith("resp-1");
  });
});

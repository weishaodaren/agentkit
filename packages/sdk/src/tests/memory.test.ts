/**
 * @agentkit/sdk - memory 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMemoryApi } from "../memory";
import type { SdkClientInstance } from "../client";

describe("createMemoryApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;
  let mockThread: any;

  beforeEach(() => {
    mockThread = {
      id: "thread-1",
      get: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({ result: "deleted" }),
      listMessages: vi.fn().mockResolvedValue({ messages: [] }),
      deleteMessages: vi.fn().mockResolvedValue({ success: true }),
      clone: vi.fn().mockResolvedValue({}),
    };

    mockClient = {
      listMemoryThreads: vi.fn().mockResolvedValue({ threads: [] }),
      createMemoryThread: vi.fn().mockResolvedValue({ thread: {} }),
      getMemoryThread: vi.fn().mockReturnValue(mockThread),
      listThreadMessages: vi.fn().mockResolvedValue({ messages: [] }),
      deleteThread: vi.fn().mockResolvedValue({ success: true }),
      saveMessageToMemory: vi.fn().mockResolvedValue({}),
      getMemoryConfig: vi.fn().mockResolvedValue({}),
      getMemoryStatus: vi.fn().mockResolvedValue({}),
      getObservationalMemory: vi.fn().mockResolvedValue({}),
      awaitBufferStatus: vi.fn().mockResolvedValue({}),
      getWorkingMemory: vi.fn().mockResolvedValue({}),
      updateWorkingMemory: vi.fn().mockResolvedValue({}),
      searchMemory: vi.fn().mockResolvedValue({}),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createMemoryApi(mockSdkClient);
    const methods = [
      "listThreads",
      "createThread",
      "getThread",
      "listThreadMessages",
      "deleteThread",
      "saveMessages",
      "getMemoryConfig",
      "getMemoryStatus",
      "getObservationalMemory",
      "awaitBufferStatus",
      "getWorkingMemory",
      "updateWorkingMemory",
      "searchMemory",
    ];
    for (const method of methods) {
      expect(typeof api[method as keyof typeof api]).toBe("function");
    }
  });

  it("should call listThreads", async () => {
    const api = createMemoryApi(mockSdkClient);
    await api.listThreads({ agentId: "test-agent" });
    expect(mockClient.listMemoryThreads).toHaveBeenCalled();
  });

  it("should call createThread", async () => {
    const api = createMemoryApi(mockSdkClient);
    await api.createThread({
      resourceId: "r1",
      agentId: "test-agent",
      title: "Test",
    });
    expect(mockClient.createMemoryThread).toHaveBeenCalled();
  });

  it("should return thread instance directly", () => {
    const api = createMemoryApi(mockSdkClient);
    const thread = api.getThread("thread-1", "test-agent");
    expect(mockClient.getMemoryThread).toHaveBeenCalledWith({
      threadId: "thread-1",
      agentId: "test-agent",
    });
    expect(thread).toBe(mockThread);
  });

  it("should call listThreadMessages", async () => {
    const api = createMemoryApi(mockSdkClient);
    await api.listThreadMessages("thread-1");
    expect(mockClient.listThreadMessages).toHaveBeenCalledWith(
      "thread-1",
      undefined,
    );
  });

  it("should call deleteThread", async () => {
    const api = createMemoryApi(mockSdkClient);
    await api.deleteThread("thread-1", { agentId: "test-agent" });
    expect(mockClient.deleteThread).toHaveBeenCalledWith("thread-1", {
      agentId: "test-agent",
    });
  });

  it("should call saveMessages", async () => {
    const api = createMemoryApi(mockSdkClient);
    await api.saveMessages({ agentId: "test-agent", messages: [] });
    expect(mockClient.saveMessageToMemory).toHaveBeenCalled();
  });

  it("should call config/status/working memory methods", async () => {
    const api = createMemoryApi(mockSdkClient);
    await api.getMemoryConfig({ agentId: "test-agent" });
    expect(mockClient.getMemoryConfig).toHaveBeenCalled();

    await api.getMemoryStatus("test-agent");
    expect(mockClient.getMemoryStatus).toHaveBeenCalled();

    await api.getObservationalMemory({ agentId: "test-agent" });
    expect(mockClient.getObservationalMemory).toHaveBeenCalled();

    await api.awaitBufferStatus({ agentId: "test-agent" });
    expect(mockClient.awaitBufferStatus).toHaveBeenCalled();

    await api.getWorkingMemory({ agentId: "test-agent", threadId: "t1" });
    expect(mockClient.getWorkingMemory).toHaveBeenCalled();

    await api.updateWorkingMemory({
      agentId: "test-agent",
      threadId: "t1",
      workingMemory: "test",
    });
    expect(mockClient.updateWorkingMemory).toHaveBeenCalled();

    await api.searchMemory({
      agentId: "test-agent",
      resourceId: "r1",
      searchQuery: "test",
    });
    expect(mockClient.searchMemory).toHaveBeenCalled();
  });
});

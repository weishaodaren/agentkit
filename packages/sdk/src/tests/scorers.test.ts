/**
 * @agentkit/sdk - scorers 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createScorersApi } from "../scorers";
import type { SdkClientInstance } from "../client";

describe("createScorersApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      listScorers: vi.fn().mockResolvedValue({}),
      getScorer: vi.fn().mockResolvedValue({ id: "scorer-1" }),
      listScoresByScorerId: vi.fn().mockResolvedValue({ scores: [] }),
      listScoresByRunId: vi.fn().mockResolvedValue({ scores: [] }),
      listScoresByEntityId: vi.fn().mockResolvedValue({ scores: [] }),
      saveScore: vi.fn().mockResolvedValue({}),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createScorersApi(mockSdkClient);
    expect(typeof api.listScorers).toBe("function");
    expect(typeof api.getScorer).toBe("function");
    expect(typeof api.listScoresByScorerId).toBe("function");
    expect(typeof api.listScoresByRunId).toBe("function");
    expect(typeof api.listScoresByEntityId).toBe("function");
    expect(typeof api.saveScore).toBe("function");
  });

  it("should call listScorers", async () => {
    const api = createScorersApi(mockSdkClient);
    await api.listScorers();
    expect(mockClient.listScorers).toHaveBeenCalled();
  });

  it("should call getScorer", async () => {
    const api = createScorersApi(mockSdkClient);
    await api.getScorer("scorer-1");
    expect(mockClient.getScorer).toHaveBeenCalledWith("scorer-1");
  });

  it("should call saveScore", async () => {
    const api = createScorersApi(mockSdkClient);
    await api.saveScore({} as never);
    expect(mockClient.saveScore).toHaveBeenCalled();
  });
});

/**
 * @agentkit/sdk - vectors 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createVectorsApi } from "../vectors";
import type { SdkClientInstance } from "../client";

describe("createVectorsApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      listVectors: vi.fn().mockResolvedValue({ vectors: [] }),
      getVector: vi.fn().mockReturnValue({ name: "test-vector" }),
      listEmbedders: vi.fn().mockResolvedValue({ embedders: [] }),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should have all methods", () => {
    const api = createVectorsApi(mockSdkClient);
    expect(typeof api.listVectors).toBe("function");
    expect(typeof api.getVector).toBe("function");
    expect(typeof api.listEmbedders).toBe("function");
  });

  it("should call listVectors", async () => {
    const api = createVectorsApi(mockSdkClient);
    await api.listVectors();
    expect(mockClient.listVectors).toHaveBeenCalled();
  });

  it("should return vector instance directly", () => {
    const api = createVectorsApi(mockSdkClient);
    const vector = api.getVector("test-vector");
    expect(mockClient.getVector).toHaveBeenCalledWith("test-vector");
    expect(vector).toEqual({ name: "test-vector" });
  });

  it("should call listEmbedders", async () => {
    const api = createVectorsApi(mockSdkClient);
    await api.listEmbedders();
    expect(mockClient.listEmbedders).toHaveBeenCalled();
  });
});

/**
 * @agentkit/sdk - client 测试
 */

import { createSdkClient } from "../client";
import type { Logger } from "../types";

describe("createSdkClient", () => {
  it("should create client with default config", () => {
    const sdkClient = createSdkClient({
      baseUrl: "http://localhost:4000",
    });

    expect(sdkClient.getConfig().baseUrl).toBe("http://localhost:4000");
    expect(sdkClient.getConfig().apiPrefix).toBe("/api");
    expect(sdkClient.getConfig().retries).toBe(0);
    expect(sdkClient.getConfig().credentials).toBe("same-origin");
  });

  it("should create client with custom config", () => {
    const mockLogger: Logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const mockFetch = vi.fn() as typeof fetch;

    const sdkClient = createSdkClient({
      baseUrl: "http://example.com",
      apiPrefix: "/v2",
      timeout: 60000,
      headers: { Authorization: "Bearer token" },
      fetch: mockFetch,
      retries: 3,
      retryDelay: 500,
      retryBackoff: 3,
      logger: mockLogger,
      credentials: "include",
    });

    const config = sdkClient.getConfig();
    expect(config.baseUrl).toBe("http://example.com");
    expect(config.apiPrefix).toBe("/v2");
    expect(config.timeout).toBe(60000);
    expect(config.headers).toEqual({ Authorization: "Bearer token" });
    expect(config.fetch).toBe(mockFetch);
    expect(config.retries).toBe(3);
    expect(config.retryDelay).toBe(500);
    expect(config.retryBackoff).toBe(3);
    expect(config.logger).toBe(mockLogger);
    expect(config.credentials).toBe("include");
  });

  it("should return the MastraClient instance", () => {
    const sdkClient = createSdkClient({ baseUrl: "http://localhost:4000" });
    const client = sdkClient.getClient();
    // Should be a MastraClient instance
    expect(client).toBeDefined();
    expect(typeof client.listAgents).toBe("function");
  });

  it("should create scoped client with abort signal", () => {
    const sdkClient = createSdkClient({ baseUrl: "http://localhost:4000" });
    const controller = new AbortController();
    const scopedClient = sdkClient.createScopedClient(controller.signal);

    expect(scopedClient).toBeDefined();
    // Scoped client should be a different instance
    expect(scopedClient).not.toBe(sdkClient.getClient());
  });

  it("should call fn successfully", async () => {
    const sdkClient = createSdkClient({ baseUrl: "http://localhost:4000" });
    const result = await sdkClient.call(async () => "success");
    expect(result).toBe("success");
  });

  it("should wrap error in SdkError", async () => {
    const sdkClient = createSdkClient({ baseUrl: "http://localhost:4000" });

    await expect(
      sdkClient.call(async () => {
        throw new Error("test error");
      }),
    ).rejects.toThrow("test error");
  });

  it("should respect retry configuration", async () => {
    const sdkClient = createSdkClient({
      baseUrl: "http://localhost:4000",
      retries: 2,
      retryDelay: 10,
      retryBackoff: 1,
    });

    let callCount = 0;
    const result = await sdkClient.call(async () => {
      callCount++;
      if (callCount < 2) {
        throw new TypeError("network error");
      }
      return "recovered";
    });

    expect(result).toBe("recovered");
    expect(callCount).toBe(2);
  });
});

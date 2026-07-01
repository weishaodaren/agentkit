/**
 * @agentkit/sdk - 配置合并 测试
 */

import { resolveConfig } from "../config";
import { REQUEST_TIMEOUT } from "../types";

describe("resolveConfig", () => {
  it("should use all defaults when only baseUrl is provided", () => {
    const config = resolveConfig({ baseUrl: "http://localhost:4000" });
    expect(config.baseUrl).toBe("http://localhost:4000");
    expect(config.apiPrefix).toBe("/api");
    expect(config.timeout).toBe(REQUEST_TIMEOUT);
    expect(config.headers).toEqual({});
    expect(config.retries).toBe(0);
    expect(config.retryDelay).toBe(1000);
    expect(config.retryBackoff).toBe(2);
    expect(config.credentials).toBe("same-origin");
    expect(config.fetch).toBeUndefined();
    // createLogger returns noopLogger when null/undefined, never null
    expect(config.logger).not.toBeNull();
  });

  it("should override all configurable options", () => {
    const mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const mockFetch = vi.fn() as typeof fetch;
    const config = resolveConfig({
      baseUrl: "http://example.com",
      apiPrefix: "/v2",
      timeout: 60000,
      headers: { Authorization: "Bearer token" },
      fetch: mockFetch,
      retries: 5,
      retryDelay: 500,
      retryBackoff: 3,
      logger: mockLogger,
      credentials: "include",
    });

    expect(config.baseUrl).toBe("http://example.com");
    expect(config.apiPrefix).toBe("/v2");
    expect(config.timeout).toBe(60000);
    expect(config.headers).toEqual({ Authorization: "Bearer token" });
    expect(config.fetch).toBe(mockFetch);
    expect(config.retries).toBe(5);
    expect(config.retryDelay).toBe(500);
    expect(config.retryBackoff).toBe(3);
    expect(config.credentials).toBe("include");
    expect(config.logger).toBe(mockLogger);
  });

  it("should merge headers with defaults", () => {
    const config = resolveConfig({
      baseUrl: "http://localhost:4000",
      headers: { "X-Custom": "value" },
    });
    expect(config.headers).toEqual({ "X-Custom": "value" });
  });

  it("should return noop logger when logger is not provided", () => {
    const config = resolveConfig({ baseUrl: "http://localhost:4000" });
    // createLogger(undefined) returns noopLogger
    expect(config.logger).not.toBeNull();
    expect(typeof config.logger?.debug).toBe("function");
  });

  it("should return noop logger when logger is undefined", () => {
    const config = resolveConfig({ baseUrl: "http://localhost:4000" });
    expect(config.logger).not.toBeNull();
  });

  it("should not modify the original userConfig", () => {
    const userConfig = {
      baseUrl: "http://localhost:4000",
      headers: { "X-Test": "original" },
    };
    const config1 = resolveConfig(userConfig);
    const config2 = resolveConfig(userConfig);

    // Both should have the same headers (not mutated)
    expect(config1.headers).toEqual(config2.headers);
    expect(config1.headers).toEqual({ "X-Test": "original" });
  });
});

/**
 * @agentkit/sdk - index 测试
 */

import { describe, it, expect } from "vitest";
import * as index from "../index";

describe("index exports", () => {
  it("should export createAgentSdk", () => {
    expect(index.createAgentSdk).toBeDefined();
    expect(typeof index.createAgentSdk).toBe("function");
  });

  it("should export SdkError", () => {
    expect(index.SdkError).toBeDefined();
  });

  it("should export error utilities", () => {
    expect(index.isSdkError).toBeDefined();
    expect(index.normalizeError).toBeDefined();
    expect(index.createNetworkError).toBeDefined();
    expect(index.createStreamError).toBeDefined();
    expect(index.createParseError).toBeDefined();
    expect(index.createValidationError).toBeDefined();
    expect(index.createHttpError).toBeDefined();
    expect(index.logError).toBeDefined();
  });

  it("should export retry utilities", () => {
    expect(index.withRetry).toBeDefined();
    expect(index.getRetryDelay).toBeDefined();
    expect(index.shouldRetry).toBeDefined();
  });

  it("should export shared constants", () => {
    expect(index.API_BASE_PATH).toBe("/api/v1");
    expect(index.REQUEST_TIMEOUT).toBe(30000);
    expect(index.ERROR_CODE).toBeDefined();
    expect(index.SSE_EVENT).toBeDefined();
  });

  it("should export types", () => {
    // Types are compile-time only, but we can verify they exist
    expect(index).toHaveProperty("createAgentSdk");
  });
});

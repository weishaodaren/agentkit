/**
 * @agentkit/sdk - 重试策略 测试
 */

import {
  getRetryDelay,
  sleep,
  shouldRetry,
  withRetry,
  DEFAULT_RETRY_OPTIONS,
} from "../retry";
import type { Logger } from "../types";

describe("getRetryDelay", () => {
  it("should return base delay for attempt 0", () => {
    expect(getRetryDelay(0, DEFAULT_RETRY_OPTIONS)).toBe(1000);
  });

  it("should multiply by backoff for each attempt", () => {
    expect(getRetryDelay(0, DEFAULT_RETRY_OPTIONS)).toBe(1000); // 1000 * 2^0
    expect(getRetryDelay(1, DEFAULT_RETRY_OPTIONS)).toBe(2000); // 1000 * 2^1
    expect(getRetryDelay(2, DEFAULT_RETRY_OPTIONS)).toBe(4000); // 1000 * 2^2
    expect(getRetryDelay(3, DEFAULT_RETRY_OPTIONS)).toBe(8000); // 1000 * 2^3
  });

  it("should use custom backoff factor", () => {
    const opts = { ...DEFAULT_RETRY_OPTIONS, retryBackoff: 3 };
    expect(getRetryDelay(0, opts)).toBe(1000);
    expect(getRetryDelay(1, opts)).toBe(3000);
    expect(getRetryDelay(2, opts)).toBe(9000);
  });

  it("should use custom base delay", () => {
    const opts = { ...DEFAULT_RETRY_OPTIONS, retryDelay: 200 };
    expect(getRetryDelay(0, opts)).toBe(200);
    expect(getRetryDelay(1, opts)).toBe(400);
  });
});

describe("sleep", () => {
  it("should resolve after specified ms", async () => {
    const start = Date.now();
    await sleep(10);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(8);
    expect(elapsed).toBeLessThan(100);
  });
});

describe("shouldRetry", () => {
  it("should return false when maxRetries is 0", () => {
    expect(shouldRetry(new Error("test"), 0)).toBe(false);
  });

  it("should return false when maxRetries is negative", () => {
    expect(shouldRetry(new Error("test"), -1)).toBe(false);
  });

  it("should return true for TypeError (network error)", () => {
    expect(shouldRetry(new TypeError("network error"), 3)).toBe(true);
  });

  it("should return true for 5xx errors", () => {
    const err500 = { statusCode: 500 } as unknown;
    const err502 = { statusCode: 502 } as unknown;
    const err503 = { statusCode: 503 } as unknown;
    expect(shouldRetry(err500, 3)).toBe(true);
    expect(shouldRetry(err502, 3)).toBe(true);
    expect(shouldRetry(err503, 3)).toBe(true);
  });

  it("should return false for 4xx errors", () => {
    const err400 = { statusCode: 400 } as unknown;
    const err401 = { statusCode: 401 } as unknown;
    const err404 = { statusCode: 404 } as unknown;
    expect(shouldRetry(err400, 3)).toBe(false);
    expect(shouldRetry(err401, 3)).toBe(false);
    expect(shouldRetry(err404, 3)).toBe(false);
  });

  it("should return false for non-5xx errors", () => {
    expect(shouldRetry(new Error("generic"), 3)).toBe(false);
    expect(shouldRetry("string error", 3)).toBe(false);
    expect(shouldRetry(null, 3)).toBe(false);
  });
});

describe("withRetry", () => {
  it("should call fn once when it succeeds (0 retries)", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const result = await withRetry(fn, undefined, {
      maxRetries: 0,
      retryDelay: 100,
      retryBackoff: 2,
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe("ok");
  });

  it("should retry on retryable error", async () => {
    let callCount = 0;
    const fn = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount < 3) {
        throw new TypeError("network error");
      }
      return "success";
    });

    const result = await withRetry(fn, undefined, {
      maxRetries: 3,
      retryDelay: 10,
      retryBackoff: 1,
    });

    expect(callCount).toBe(3);
    expect(result).toBe("success");
  });

  it("should not retry on non-retryable error", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("permanent failure"));

    await expect(
      withRetry(fn, undefined, {
        maxRetries: 3,
        retryDelay: 10,
        retryBackoff: 1,
      }),
    ).rejects.toThrow("permanent failure");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should throw last error after exhausting retries", async () => {
    const fn = vi.fn().mockRejectedValue(new TypeError("transient error"));

    await expect(
      withRetry(fn, undefined, {
        maxRetries: 2,
        retryDelay: 10,
        retryBackoff: 1,
      }),
    ).rejects.toThrow("transient error");

    expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });

  it("should log retry attempts when logger is provided", async () => {
    const mockLogger: Logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    let callCount = 0;
    const fn = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount < 2) {
        throw new TypeError("retry me");
      }
      return "ok";
    });

    await withRetry(fn, mockLogger, {
      maxRetries: 3,
      retryDelay: 10,
      retryBackoff: 1,
    });

    expect(mockLogger.warn).toHaveBeenCalled();
    expect(callCount).toBe(2);
  });
});

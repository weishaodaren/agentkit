/**
 * @agentkit/sdk - 错误处理 测试
 */

import {
  SdkError,
  createNetworkError,
  createStreamError,
  createParseError,
  createValidationError,
  createHttpError,
  isSdkError,
  normalizeError,
  logError,
} from "../error";
import { ERROR_CODE } from "../types";

describe("SdkError", () => {
  it("should create error from string", () => {
    const err = new SdkError("simple error");
    expect(err.message).toBe("simple error");
    expect(err.name).toBe("SdkError");
    expect(err.code).toBe(ERROR_CODE.INTERNAL_ERROR);
    expect(err.statusCode).toBe(500);
    expect(err.phase).toBe("network");
    expect(err.details).toBeUndefined();
  });

  it("should create error from options object", () => {
    const cause = new Error("original cause");
    const err = new SdkError({
      message: "detailed error",
      code: 400,
      statusCode: 400,
      phase: "validation",
      details: { field: "email" },
      cause,
    });
    expect(err.message).toBe("detailed error");
    expect(err.code).toBe(400);
    expect(err.statusCode).toBe(400);
    expect(err.phase).toBe("validation");
    expect(err.details).toEqual({ field: "email" });
    expect(err.cause).toBe(cause);
  });

  it("should default statusCode to code when not provided", () => {
    const err = new SdkError({
      message: "test",
      code: 404,
      phase: "network",
    });
    expect(err.statusCode).toBe(404);
  });
});

describe("Error Factories", () => {
  it("createNetworkError creates network phase error", () => {
    const err = createNetworkError("connection refused");
    expect(err.phase).toBe("network");
    expect(err.message).toBe("connection refused");
  });

  it("createNetworkError with cause", () => {
    const cause = new TypeError("network error");
    const err = createNetworkError("timeout", cause);
    expect(err.cause).toBe(cause);
  });

  it("createStreamError creates stream phase error", () => {
    const err = createStreamError("stream interrupted", { chunk: 42 });
    expect(err.phase).toBe("stream");
    expect(err.details).toEqual({ chunk: 42 });
  });

  it("createParseError creates parse phase error", () => {
    const err = createParseError("invalid JSON", { raw: "{}" });
    expect(err.phase).toBe("parse");
    expect(err.details).toEqual({ raw: "{}" });
  });

  it("createValidationError creates validation phase error", () => {
    const err = createValidationError("missing field");
    expect(err.phase).toBe("validation");
    expect(err.code).toBe(ERROR_CODE.BAD_REQUEST);
  });

  it("createHttpError creates HTTP error with status", () => {
    const err = createHttpError(503, "service unavailable", { retry: true });
    expect(err.statusCode).toBe(503);
    expect(err.code).toBe(503);
    expect(err.details).toEqual({ retry: true });
  });

  it("createHttpError uses status as code when not in ERROR_CODE", () => {
    const err = createHttpError(999, "unknown");
    expect(err.code).toBe(999);
  });
});

describe("Error Utilities", () => {
  it("isSdkError returns true for SdkError", () => {
    const err = new SdkError("test");
    expect(isSdkError(err)).toBe(true);
  });

  it("isSdkError returns false for plain Error", () => {
    expect(isSdkError(new Error("test"))).toBe(false);
  });

  it("isSdkError returns false for non-errors", () => {
    expect(isSdkError("string")).toBe(false);
    expect(isSdkError(null)).toBe(false);
    expect(isSdkError({})).toBe(false);
  });

  it("normalizeError returns SdkError as-is", () => {
    const err = new SdkError("original");
    expect(normalizeError(err)).toBe(err);
  });

  it("normalizeError wraps plain Error", () => {
    const err = normalizeError(new Error("wrapped"));
    expect(err).toBeInstanceOf(SdkError);
    expect(err.message).toBe("wrapped");
  });

  it("normalizeError converts non-errors to string", () => {
    const err = normalizeError("string error");
    expect(err.message).toBe("string error");
  });

  it("normalizeError converts number to string", () => {
    const err = normalizeError(42);
    expect(err.message).toBe("42");
  });

  it("normalizeError converts null/undefined", () => {
    const errNull = normalizeError(null);
    expect(errNull.message).toBe("null");

    const errUndef = normalizeError(undefined);
    expect(errUndef.message).toBe("undefined");
  });

  it("logError calls logger.error with formatted message", () => {
    const mockLogger = {
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
    };
    const err = new SdkError({
      message: "test error",
      code: 500,
      statusCode: 500,
      phase: "network",
      details: { key: "value" },
    });
    logError(mockLogger, err);
    expect(mockLogger.error).toHaveBeenCalledWith(
      "[SdkError] code=500 status=500 phase=network message=test error",
      { key: "value" },
    );
  });
});

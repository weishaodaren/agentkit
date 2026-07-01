/**
 * @agentkit/sdk - 日志抽象 测试
 */

import { createLogger, hasLogger } from "../logger";
import type { Logger } from "../types";

describe("createLogger", () => {
  it("should return noop logger when no custom logger is provided", () => {
    const logger = createLogger();
    // No-op calls should not throw
    expect(() => logger.debug("test")).not.toThrow();
    expect(() => logger.info("test")).not.toThrow();
    expect(() => logger.warn("test")).not.toThrow();
    expect(() => logger.error("test")).not.toThrow();
  });

  it("should return noop logger when null is passed", () => {
    const logger = createLogger(null);
    expect(() => logger.debug("test")).not.toThrow();
  });

  it("should use custom logger when provided", () => {
    const mockLogger: Logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    const logger = createLogger(mockLogger);
    logger.debug("debug msg");
    logger.info("info msg");
    logger.warn("warn msg");
    logger.error("error msg");

    expect(mockLogger.debug).toHaveBeenCalledWith("debug msg");
    expect(mockLogger.info).toHaveBeenCalledWith("info msg");
    expect(mockLogger.warn).toHaveBeenCalledWith("warn msg");
    expect(mockLogger.error).toHaveBeenCalledWith("error msg");
  });
});

describe("hasLogger", () => {
  it("should return false for null", () => {
    expect(hasLogger(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(hasLogger(undefined)).toBe(false);
  });

  it("should return true for a valid logger", () => {
    const mockLogger: Logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    expect(hasLogger(mockLogger)).toBe(true);
  });
});

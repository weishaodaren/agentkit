/**
 * @agentkit/sdk - 重试策略
 *
 * 指数退避重试：delay * backoff^attempt
 * 仅对 5xx 和网络错误重试
 */

import type { Logger } from "./types";
import { createLogger } from "./logger";

export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  retryBackoff: number;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 0,
  retryDelay: 1000,
  retryBackoff: 2,
};

/** 计算重试延迟（指数退避） */
export function getRetryDelay(attempt: number, options: RetryOptions): number {
  return options.retryDelay * Math.pow(options.retryBackoff, attempt);
}

/** 等待指定毫秒数 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 判断是否应该重试
 * 5xx 错误和网络错误可重试。
 */
export function shouldRetry(error: unknown, maxRetries: number): boolean {
  if (maxRetries <= 0) return false;
  // 网络错误（TypeError）可重试
  if (error instanceof TypeError) return true;
  // HTTP 错误 — 5xx 可重试
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    const status = (error as Record<string, unknown>).statusCode as number;
    return status >= 500;
  }
  return false;
}

/**
 * 带重试的执行包装器。
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  logger: Logger | undefined,
  options: RetryOptions = DEFAULT_RETRY_OPTIONS,
): Promise<T> {
  const log = createLogger(logger);
  let lastError: unknown;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = getRetryDelay(attempt - 1, options);
        log.warn(`Retry ${attempt}/${options.maxRetries} after ${delay}ms`);
        await sleep(delay);
      }
      return await fn();
    } catch (error) {
      lastError = error;
      if (!shouldRetry(error, options.maxRetries - attempt)) {
        throw error;
      }
    }
  }

  throw lastError;
}

/**
 * @agentkit/sdk - MastraClient 封装
 *
 * 工厂函数封装 @mastra/client-js 的 MastraClient，
 * 提供配置注入、日志记录和错误处理。
 */

import { MastraClient } from "@mastra/client-js";
import type { SdkConfig, ResolvedConfig } from "./types";
import { resolveConfig } from "./config";
import { normalizeError } from "./error";
import { hasLogger, createLogger } from "./logger";
import { withRetry } from "./retry";

/** SdkClient 返回类型 */
export interface SdkClientInstance {
  /** 获取内部 MastraClient 实例（高级用法） */
  getClient(): MastraClient;
  /** 获取当前配置 */
  getConfig(): ResolvedConfig;
  /** 安全的异步调用包装器（自动错误归一化 + 重试） */
  call<T>(fn: () => Promise<T>): Promise<T>;
  /** 创建带中止信号的临时客户端 */
  createScopedClient(signal?: AbortSignal): MastraClient;
}

/**
 * 创建 SDK 客户端实例。
 */
export function createSdkClient(config: SdkConfig): SdkClientInstance {
  const resolved = resolveConfig(config);
  const client = new MastraClient({
    baseUrl: resolved.baseUrl,
    apiPrefix: resolved.apiPrefix,
    headers: resolved.headers,
    fetch: resolved.fetch,
    credentials: resolved.credentials,
  });
  const log = createLogger(resolved.logger);

  return {
    getClient: () => client,
    getConfig: () => resolved,

    call<T>(fn: () => Promise<T>): Promise<T> {
      return withRetry(
        fn,
        resolved.logger ?? undefined,
        {
          maxRetries: resolved.retries ?? 0,
          retryDelay: resolved.retryDelay ?? 1000,
          retryBackoff: resolved.retryBackoff ?? 2,
        },
      ).catch((err) => {
        const sdkError = normalizeError(err);
        if (hasLogger(resolved.logger)) {
          resolved.logger.error("[SdkClient.call]", sdkError.message, sdkError);
        }
        throw sdkError;
      });
    },

    createScopedClient(signal?: AbortSignal): MastraClient {
      return new MastraClient({
        baseUrl: resolved.baseUrl,
        apiPrefix: resolved.apiPrefix,
        headers: resolved.headers,
        abortSignal: signal as any,
        credentials: resolved.credentials,
      });
    },
  };
}

export type { SdkConfig } from "./types";

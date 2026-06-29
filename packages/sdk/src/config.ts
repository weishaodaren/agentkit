/**
 * @agentkit/sdk - 配置合并
 *
 * 将用户配置的 SdkConfig 与默认值合并为 ResolvedConfig。
 */

import type { SdkConfig, ResolvedConfig } from "./types";
import { REQUEST_TIMEOUT } from "./types";
import { createLogger } from "./logger";

/** 默认配置 */
const DEFAULTS: Omit<ResolvedConfig, "baseUrl"> = {
  apiPrefix: "/api",
  timeout: REQUEST_TIMEOUT,
  headers: {},
  retries: 0,
  retryDelay: 1000,
  retryBackoff: 2,
  logger: null,
  credentials: "same-origin",
};

/**
 * 解析并合并配置
 */
export function resolveConfig(userConfig: SdkConfig): ResolvedConfig {
  return {
    baseUrl: userConfig.baseUrl,
    apiPrefix: userConfig.apiPrefix ?? DEFAULTS.apiPrefix,
    timeout: userConfig.timeout ?? DEFAULTS.timeout,
    headers: { ...DEFAULTS.headers, ...userConfig.headers },
    fetch: userConfig.fetch,
    retries: userConfig.retries ?? DEFAULTS.retries,
    retryDelay: userConfig.retryDelay ?? DEFAULTS.retryDelay,
    retryBackoff: userConfig.retryBackoff ?? DEFAULTS.retryBackoff,
    logger: createLogger(userConfig.logger),
    credentials: userConfig.credentials ?? DEFAULTS.credentials,
  };
}

/**
 * @agentkit/sdk - 日志抽象
 *
 * 提供统一的日志接口，支持无日志模式
 */

import type { Logger } from "./types";

/** 空日志记录器（默认） */
const noopLogger: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

function noop(): void {
  /* no-op */
}

/** 创建日志记录器 */
export function createLogger(custom?: Logger | null): Logger {
  return custom ?? noopLogger;
}

/** 判断是否有活跃日志 */
export function hasLogger(custom?: Logger | null): custom is Logger {
  return !!custom;
}

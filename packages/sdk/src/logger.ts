/**
 * @agentkit/sdk - 日志抽象
 *
 * 提供统一的日志接口，支持无日志模式
 */

import type { Logger } from "./types";

/** 空操作 */
const noop = (): void => {
  /* no-op */
};

/** 空日志记录器（默认） */
const noopLogger: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

/** 创建日志记录器 */
export const createLogger = (custom?: Logger | null): Logger =>
  custom ?? noopLogger;

/** 判断是否有活跃日志 */
export const hasLogger = (custom?: Logger | null): custom is Logger => !!custom;

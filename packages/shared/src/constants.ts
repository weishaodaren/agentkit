/**
 * @agentkit/shared - 共享常量
 */

/** API 版本 */
export const API_VERSION = "v1" as const;

/** API 基础路径 */
export const API_BASE_PATH = `/api/${API_VERSION}` as const;

/** 默认分页大小 */
export const DEFAULT_PAGE_SIZE = 20 as const;

/** 最大分页大小 */
export const MAX_PAGE_SIZE = 100 as const;

/** 请求超时（毫秒） */
export const REQUEST_TIMEOUT = 30_000 as const;

/** 流式请求的 SSE 事件名 */
export const SSE_EVENT = {
  MESSAGE: "message",
  ERROR: "error",
  DONE: "done",
} as const;

/** 通用错误码 */
export const ERROR_CODE = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

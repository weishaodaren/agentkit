/**
 * @agentkit/types - 共享类型定义
 */

/** 通用 ID 类型 */
export type ID = string;

/** 时间戳（ISO 8601） */
export type Timestamp = string;

/** API 响应包装 */
export interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

/** 分页参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

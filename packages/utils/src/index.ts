/**
 * @agentkit/utils - 工具函数
 */

import type { ID } from "@agentkit/shared";

/** 生成唯一 ID */
export function generateId(): ID {
  return crypto.randomUUID();
}

/** 延迟执行 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 类型安全的对象属性检查 */
export function hasKey<T extends object>(
  obj: T,
  key: PropertyKey,
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/** 去除对象中的 null/undefined 值 */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined),
  ) as Partial<T>;
}

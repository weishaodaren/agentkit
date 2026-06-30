/**
 * @agentkit/sdk - 错误处理
 *
 * 统一的 SdkError 类型，包装所有异常并提供结构化信息
 */

import { ERROR_CODE } from "./types";
import type { Logger } from "./types";

// ─── SdkError ──────────────────────────────────────────────────────

/** 错误阶段分类 */
export type ErrorPhase = "network" | "stream" | "parse" | "validation";

export interface SdkErrorOptions {
  message: string;
  code: number;
  statusCode?: number;
  phase?: ErrorPhase;
  details?: unknown;
  cause?: Error;
}

export class SdkError extends Error {
  readonly name = "SdkError" as const;
  readonly code: number;
  readonly statusCode: number;
  readonly phase: ErrorPhase;
  readonly details?: unknown;

  constructor(options: string | SdkErrorOptions) {
    if (typeof options === "string") {
      super(options);
      this.code = ERROR_CODE.INTERNAL_ERROR;
      this.statusCode = 500;
      this.phase = "network";
      this.details = undefined;
    } else {
      super(options.message);
      this.code = options.code;
      this.statusCode = options.statusCode ?? options.code;
      this.phase = options.phase ?? "network";
      this.details = options.details;
      if (options.cause) {
        (this as Error).cause = options.cause;
      }
    }
  }
}

// ─── Error Factories ───────────────────────────────────────────────

export const createNetworkError = (message: string, cause?: Error): SdkError =>
  new SdkError({
    message,
    code: ERROR_CODE.INTERNAL_ERROR,
    phase: "network",
    cause,
  });

export const createStreamError = (
  message: string,
  details?: unknown,
): SdkError =>
  new SdkError({
    message,
    code: ERROR_CODE.INTERNAL_ERROR,
    phase: "stream",
    details,
  });

export const createParseError = (
  message: string,
  details?: unknown,
): SdkError =>
  new SdkError({
    message,
    code: ERROR_CODE.INTERNAL_ERROR,
    phase: "parse",
    details,
  });

export const createValidationError = (
  message: string,
  details?: unknown,
): SdkError =>
  new SdkError({
    message,
    code: ERROR_CODE.BAD_REQUEST,
    phase: "validation",
    details,
  });

export const createHttpError = (
  status: number,
  message: string,
  body?: unknown,
): SdkError => {
  const code =
    (ERROR_CODE as Record<number, number>)[status] ?? ERROR_CODE.INTERNAL_ERROR;
  return new SdkError({
    message,
    code,
    statusCode: status,
    phase: "network",
    details: body,
  });
};

// ─── Error Utilities ───────────────────────────────────────────────

export const isSdkError = (err: unknown): err is SdkError =>
  err instanceof SdkError;

export const normalizeError = (err: unknown): SdkError => {
  if (isSdkError(err)) return err;
  if (err instanceof Error) {
    return createNetworkError(err.message, err);
  }
  return createNetworkError(String(err));
};

export const logError = (logger: Logger, err: SdkError): void => {
  logger.error(
    `[SdkError] code=${err.code} status=${err.statusCode} phase=${err.phase} message=${err.message}`,
    err.details,
  );
};

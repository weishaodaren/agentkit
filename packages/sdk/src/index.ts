/**
 * @agentkit/sdk - 主入口
 *
 * 统一的 Agent 开发 SDK，封装 @mastra/client-js 提供：
 * - 统一配置管理（baseUrl、headers、重试、超时）
 * - 简化的聊天 API（sendMessage）
 * - 完整的 Agent/Workflow/Tool/Memory/Dataset 操作
 * - 统一的错误处理和日志
 */

export { createAgentSdk } from "./sdk";
export type { AgentSdk, SdkConfig } from "./sdk";

// ─── 类型导出 ──────────────────────────────────────────────────────

export type {
  ChatCallbacks,
  ChatMessage,
  ChatRole,
  SendMessageParams,
  ToolCallEvent,
  ToolResultEvent,
  StepStartEvent,
  StepFinishEvent,
  AgentInfo,
  ThreadInfo,
  CreateThreadParams,
  SaveMessageParams,
  LogEntry,
  DatasetRecord,
  DatasetItemRecord,
} from "./types";

// ─── 错误导出 ──────────────────────────────────────────────────────

export {
  SdkError,
  isSdkError,
  normalizeError,
  createNetworkError,
  createStreamError,
  createParseError,
  createValidationError,
  createHttpError,
  logError,
} from "./error";

export type { SdkErrorOptions, ErrorPhase } from "./error";

// ─── 重试导出 ──────────────────────────────────────────────────────

export { withRetry, getRetryDelay, shouldRetry } from "./retry";
export type { RetryOptions } from "./retry";

// ─── 共享类型和常量（从 @agentkit/shared 重新导出）──────────────────

export { API_BASE_PATH, REQUEST_TIMEOUT, ERROR_CODE, SSE_EVENT } from "./types";

export type {
  ID,
  Timestamp,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
} from "./types";

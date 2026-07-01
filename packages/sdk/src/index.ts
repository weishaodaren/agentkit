/**
 * @agentkit/sdk - 主入口
 *
 * 统一的 Agent 开发 SDK，封装 @mastra/client-js 提供：
 * - 统一配置管理（baseUrl、headers、重试、超时）
 * - 简化的聊天 API（sendMessage）
 * - 完整的 Agent/Workflow/Tool/Memory/Dataset 操作
 * - 统一的错误处理和日志
 *
 * 模块严格对齐 Mastra Client SDK 官方文档侧边栏：
 * Agents, Memory, Workflows, Tools, Vectors, Logs, Telemetry,
 * Observability, Datasets, Responses, Conversations, Error Handling
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

// ─── 新增模块 API 实例类型导出 ─────────────────────────────────────

export type { McpApiInstance } from "./mcp";
export type { ProcessorsApiInstance } from "./processors";
export type { StoredApiInstance } from "./stored";
export type { WorkspaceApiInstance } from "./workspace";
export type { ScorersApiInstance } from "./scorers";
export type { BuilderApiInstance } from "./builder";

// ─── 补全导出的 API 类型 ─────────────────────────────────────────────

export type { AgentsApiInstance, AgentVersionIdentifier } from "./agents";
export type { WorkflowsApiInstance } from "./workflows";
export type { ToolsApiInstance } from "./tools";
export type { MemoryApiInstance } from "./memory";
export type { TelemetryApiInstance } from "./telemetry";
export type { LogsApiInstance } from "./logs";
export type { VectorsApiInstance } from "./vectors";
export type { DatasetsApiInstance } from "./datasets";
export type { ResponsesApiInstance } from "./responses";
export type { ConversationsApiInstance } from "./conversations";
export type { ChatApiInstance } from "./chat";
